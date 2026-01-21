const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('./db');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

const requireLogin = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login');
    next();
};

app.get('/login', (req, res) => res.render('login', { error: null }));
app.get('/register', (req, res) => res.render('register', { error: null }));
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

app.post('/register', async (req, res) => {
    const friendCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        db.run("INSERT INTO users (username, password, friend_code) VALUES (?, ?, ?)",
            [req.body.username, hashedPassword, friendCode],
            (err) => res.redirect(err ? '/register' : '/login'));
    } catch (e) { res.redirect('/register'); }
});

app.post('/login', (req, res) => {
    db.get("SELECT * FROM users WHERE username = ?", [req.body.username], async (err, user) => {
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.render('login', { error: "Неверный логин или пароль" });
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.friendCode = user.friend_code; // Сохраняем код в сессии
        res.redirect('/');
    });
});

app.get('/', requireLogin, (req, res) => {
    const userId = req.session.userId;

    const sort = req.query.sort || 'date_asc';
    let orderBy = 't.start_date ASC';

    switch(sort) {
        case 'date_desc': orderBy = 't.start_date DESC'; break;
        case 'name_asc':  orderBy = 't.destination ASC'; break; // По названию А-Я
        case 'name_desc': orderBy = 't.destination DESC'; break; // По названию Я-А
        case 'budget_asc': orderBy = 't.budget ASC'; break;
        case 'budget_desc': orderBy = 't.budget DESC'; break;
    }

    const tripsSql = `
        SELECT t.*, u.username as creator_name,
               GROUP_CONCAT(p.username, ', ') as participant_names
        FROM trips t
        JOIN trip_participants tp_main ON t.id = tp_main.trip_id
        JOIN users u ON t.creator_id = u.id
        LEFT JOIN trip_participants tp_list ON t.id = tp_list.trip_id
        LEFT JOIN users p ON tp_list.user_id = p.id
        WHERE tp_main.user_id = ?
        GROUP BY t.id
        ORDER BY ${orderBy}
    `;

    const friendsSql = `SELECT u.id, u.username FROM users u JOIN friends f ON u.id = f.friend_id WHERE f.user_id = ?`;

    db.all(tripsSql, [userId], (err, trips) => {
        if(err) console.error(err);

        db.all(friendsSql, [userId], (err, friends) => {
            // Передаем также текущий параметр сортировки, чтобы сохранить выбор в select
            res.render('dashboard', { trips, friends, user: req.session, currentSort: sort });
        });
    });
});
app.post('/add', requireLogin, (req, res) => {
    const { destination, start_date, end_date, budget, description, participants } = req.body;
    const creatorId = req.session.userId;

    db.run(`INSERT INTO trips (creator_id, destination, start_date, end_date, budget, description) VALUES (?, ?, ?, ?, ?, ?)`,
        [creatorId, destination, start_date, end_date, budget, description],
        function(err) {
            if (err) return console.error(err);
            const tripId = this.lastID;
            const stmt = db.prepare("INSERT INTO trip_participants (trip_id, user_id) VALUES (?, ?)");
            stmt.run(tripId, creatorId);
            if (participants) {
                const friendsIds = Array.isArray(participants) ? participants : [participants];
                friendsIds.forEach(id => stmt.run(tripId, id));
            }
            stmt.finalize();
            res.redirect('/');
        });
});

// --- УДАЛЕНИЕ ПОЕЗДКИ (Обновлено) ---
app.post('/delete-trip/:id', requireLogin, (req, res) => {
    const tripId = req.params.id;
    const userId = req.session.userId;

    // Проверяем, создатель ли это
    db.get("SELECT creator_id FROM trips WHERE id = ?", [tripId], (err, trip) => {
        if(trip && trip.creator_id === userId) {
            // Удаляем всё, связанное с поездкой
            db.serialize(() => {
                db.run("DELETE FROM trip_notes WHERE trip_id = ?", [tripId]);
                db.run("DELETE FROM trip_participants WHERE trip_id = ?", [tripId]);
                db.run("DELETE FROM trips WHERE id = ?", [tripId]);
            });
        }
        res.redirect('/');
    });
});

// --- УДАЛЕНИЕ АККАУНТА (Новое) ---
app.post('/delete-account', requireLogin, (req, res) => {
    const userId = req.session.userId;

    // Сначала находим все поездки, где юзер - создатель, чтобы удалить их
    db.all("SELECT id FROM trips WHERE creator_id = ?", [userId], (err, trips) => {
        const tripIds = trips.map(t => t.id);

        db.serialize(() => {
            if (tripIds.length > 0) {
                // Удаляем данные поездок, созданных пользователем
                const placeholders = tripIds.map(() => '?').join(',');
                db.run(`DELETE FROM trip_notes WHERE trip_id IN (${placeholders})`, tripIds);
                db.run(`DELETE FROM trip_participants WHERE trip_id IN (${placeholders})`, tripIds);
                db.run(`DELETE FROM trips WHERE id IN (${placeholders})`, tripIds);
            }

            // Удаляем следы пользователя в чужих поездках и дружбу
            db.run("DELETE FROM trip_notes WHERE user_id = ?", [userId]);
            db.run("DELETE FROM trip_participants WHERE user_id = ?", [userId]);
            db.run("DELETE FROM friends WHERE user_id = ? OR friend_id = ?", [userId, userId]);

            // Удаляем самого пользователя
            db.run("DELETE FROM users WHERE id = ?", [userId], (err) => {
                req.session.destroy(); // Выход из системы
                res.redirect('/login');
            });
        });
    });
});

// --- ДЕТАЛИ И ПРОФИЛЬ ---
app.get('/trip/:id', requireLogin, (req, res) => {
    const tripId = req.params.id;
    const userId = req.session.userId;

    db.get("SELECT * FROM trip_participants WHERE trip_id = ? AND user_id = ?", [tripId, userId], (err, row) => {
        if (!row) return res.redirect('/');
        db.get("SELECT * FROM trips WHERE id = ?", [tripId], (err, trip) => {
            const notesSql = `SELECT n.*, u.username FROM trip_notes n JOIN users u ON n.user_id = u.id WHERE n.trip_id = ? ORDER BY n.created_at`;
            const partSql = `SELECT u.username FROM trip_participants tp JOIN users u ON tp.user_id = u.id WHERE tp.trip_id = ?`;
            db.all(notesSql, [tripId], (err, notes) => {
                db.all(partSql, [tripId], (err, participants) => {
                    res.render('trip_details', { trip, notes, participants, user: req.session, isCreator: trip.creator_id === userId });
                });
            });
        });
    });
});

app.post('/trip/:id/edit', requireLogin, (req, res) => {
    const { destination, start_date, end_date, budget, description } = req.body;
    db.run(`UPDATE trips SET destination=?, start_date=?, end_date=?, budget=?, description=? WHERE id=? AND creator_id=?`,
        [destination, start_date, end_date, budget, description, req.params.id, req.session.userId],
        () => res.redirect(`/trip/${req.params.id}`));
});

app.post('/trip/:id/note', requireLogin, (req, res) => {
    db.run("INSERT INTO trip_notes (trip_id, user_id, content) VALUES (?, ?, ?)",
        [req.params.id, req.session.userId, req.body.content],
        () => res.redirect(`/trip/${req.params.id}`));
});

app.get('/profile', requireLogin, (req, res) => {
    const friendsSql = "SELECT u.username, u.friend_code FROM users u JOIN friends f ON u.id = f.friend_id WHERE f.user_id = ?";
    db.all(friendsSql, [req.session.userId], (err, friends) => {
        // Обновляем данные пользователя из БД на случай изменений
        db.get("SELECT * FROM users WHERE id = ?", [req.session.userId], (err, user) => {
            res.render('profile', { user: user, friends: friends, error: null, success: null });
        });
    });
});

app.post('/add-friend', requireLogin, (req, res) => {
    const myId = req.session.userId;
    const targetCode = req.body.friend_code.trim();
    db.get("SELECT id FROM users WHERE friend_code = ?", [targetCode], (err, friend) => {
        if (!friend || friend.id === myId) return res.redirect('/profile'); // Упрощено для краткости
        db.run("INSERT OR IGNORE INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)", [myId, friend.id, friend.id, myId], () => {
            res.redirect('/profile');
        });
    });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
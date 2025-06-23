const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('./config/config');
const User = require('./models/User');
const Tourism = require('./models/Tourism');

const dropCollection = async (db, collectionName) => {
    try {
        await db.dropCollection(collectionName);
    } catch (e) {
        console.log(`Collection ${collectionName} was missing, skipping drop...`);
    }
};

const run = async () => {
    await mongoose.connect(config.mongoose.db);
    const db = mongoose.connection;

    const collections = ['users', 'tourisms'];

    for (const collectionName of collections) {
        await dropCollection(db, collectionName);
    }

    await User.create({
        email: 'admin@tourism.local',
        password: 'football',
        token: crypto.randomUUID(),
    });

    const tours = [
        {
            title: 'Горный поход в Ала-Арчу',
            description: 'Пеший тур по горам Ала-Арчи с ночёвкой в палатке.',
            duration: '3 дня',
            price: '150 $',
            route: ['Бишкек', 'Ала-Арча', 'Возвращение'],
            includes: ['Гид', 'Питание', 'Проживание'],
            region: 'Чуй',
            category: 'Горы',
            image: 'https://cdn-1.aki.kg/cdn-st-0/qgM/3/3218278.f6eee82983ae833197b042025a97f667.jpg',
            contactPhone: '+996 700 111 111',
            contactEmail: 'info@mountains.kg',
        },
        {
            title: 'Экспедиция на озеро Сон-Куль',
            description: 'Юрты, кумыс и традиции кыргызов.',
            duration: '5 дней',
            price: '300 $',
            route: ['Нарын', 'озеро Сон-Куль', 'Нарын'],
            includes: ['Юрты', 'Питание', 'Гид'],
            region: 'Нарын',
            category: 'Юрты и этнотуризм',
            image: 'https://yurt.tours/storage/tour/cover/6/c/5e7f8bbe2cf86-cover_middle.jpg',
            contactPhone: '+996 700 222 222',
            contactEmail: 'sonkul@ethno.kg',
        },
        {
            title: 'Иссык-Куль: отдых на пляже',
            description: 'Классический летний отдых на южном берегу озера.',
            duration: '7 дней',
            price: '400 $',
            route: ['Бишкек', 'Чолпон-Ата', 'Каракол'],
            includes: ['Отель', 'Питание', 'Трансфер'],
            region: 'Иссык-Куль',
            category: 'Озёра',
            image: 'https://issyk-kul-rest.narod.ru/img/cholpon-ata-01.jpg',
            contactPhone: '+996 700 333 333',
            contactEmail: 'lake@kgtravel.kg',
        },
        {
            title: 'Экстрим в горах: Параглайдинг',
            description: 'Полетай над Чуйской долиной с опытным инструктором!',
            duration: '1 день',
            price: '120 $',
            route: ['Бишкек', 'Прыжок', 'Бишкек'],
            includes: ['Инструктор', 'Экипировка'],
            region: 'Чуй',
            category: 'Экстрим',
            image: 'https://derbent-news.ru/media/resized/k7mD8_OQFtm62ZsnQ8E1y0lIxb9mZRy7IDP9KEBKcsY/rs:fit:1024:768/aHR0cHM6Ly9kZXJi/ZW50LW5ld3MucnUv/bWVkaWEvcHJvamVj/dF9zbWkzXzY1OS8z/YS9kZC9iNi8xZi9i/MS8zZi9la3N0bmlt/b2suanBn.jpg',
            contactPhone: '+996 700 444 444',
            contactEmail: 'extreme@fly.kg',
        },
        {
            title: 'Зимний отдых в Караколе',
            description: 'Горнолыжный курорт, прокат, инструкторы, спа.',
            duration: '6 дней',
            price: '500 $',
            route: ['Бишкек', 'Каракол'],
            includes: ['Отель', 'Ски-пасс', 'Прокат'],
            region: 'Иссык-Куль',
            category: 'Зимние туры',
            image: 'https://destinationkarakol.com/wp-content/uploads/2017/10/Karakol_Snowboard-1024x682.jpg.webp',
            contactPhone: '+996 700 555 555',
            contactEmail: 'ski@karakol.kg',
        },
    ];

    await Tourism.insertMany(tours);

    await db.close();
    console.log('Seed completed!');
};

run().catch(console.error);

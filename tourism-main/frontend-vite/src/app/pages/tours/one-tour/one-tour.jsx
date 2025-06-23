import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './one-tour.module.css';

const mockTour = {
	id: 1,
	title: 'Приключение в горах Кыргызстана',
	description:
		'Незабываемый тур по живописным ущельям и вершинам Кыргызстана. Вас ждут красивые пейзажи, активный отдых и культурное погружение.',
	duration: '7 дней',
	price: '350 $',
	route: [
		'Бишкек — Каракол',
		'Каньон Сказка',
		'Озеро Сон-Куль',
		'Пик Ленин',
		'Возвращение в Бишкек',
	],
	includes: [
		'Проживание в гостевых домах',
		'Питание: завтрак и ужин',
		'Трансфер и гид',
		'Страховка',
	],
	region: 'Нарын',
	category: 'some category',
	image:
		'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
	contactPhone: '+996 700 123 456',
	contactEmail: 'info@kgtravel.kg',
};

const OneTour = () => {
	const { id } = useParams();

	useEffect(() => {
		console.log('Tour id:', id);
	}, [id]);

	const [modalOpen, setModalOpen] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		peopleCount: 1,
	});

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = e => {
		e.preventDefault();

		if (!formData.name.trim() || !formData.phone.trim()) {
			alert('Пожалуйста, заполните все поля');
			return;
		}

		console.log({ ...formData, tour_id: id });
		setModalOpen(false);
		setFormData({ name: '', phone: '', peopleCount: 1 });
	};

	return (
		<div className="container">
			<div style={{ marginTop: '60px' }}>
				<div className={styles.card}>
					<h1 className={styles.title}>{mockTour.title}</h1>
					<img
						src={mockTour.image}
						alt={mockTour.title}
						className={styles.image}
					/>
					<p className={styles.description}>{mockTour.description}</p>

					<div>
						<h3 className={styles.sectionTitle}>Длительность:</h3>
						<p>{mockTour.duration}</p>

						<h3 className={styles.sectionTitle}>Цена:</h3>
						<p>{mockTour.price}</p>

						<h3 className={styles.sectionTitle}>Регион</h3>
						<p>{mockTour.region}</p>

						<h3 className={styles.sectionTitle}>Маршрут:</h3>
						<ul className={styles.list}>
							{mockTour.route.map((stop, i) => (
								<li key={i}>{stop}</li>
							))}
						</ul>

						<h3 className={styles.sectionTitle}>Что включено:</h3>
						<ul className={styles.list}>
							{mockTour.includes.map((item, i) => (
								<li key={i}>{item}</li>
							))}
						</ul>

						<h3 className={styles.sectionTitle}>Контакты для бронирования:</h3>
						<p>
							Телефон:{' '}
							<a
								href={`tel:${mockTour.contactPhone}`}
								className={styles.contactLink}
							>
								+996 700 123 456
							</a>
						</p>
						<p>
							Email:{' '}
							<a
								href={`mailto:${mockTour.contactEmail}`}
								className={styles.contactLink}
							>
								info@kgtravel.kg
							</a>
						</p>

						<button
							className={styles.button}
							onClick={() => setModalOpen(true)}
						>
							Забронировать тур
						</button>
					</div>
				</div>
			</div>

			{modalOpen && (
				<div className={styles.modalOverlay}>
					<div className={styles.modalContent}>
						<button
							className={styles.closeBtn}
							onClick={() => setModalOpen(false)}
							aria-label="Закрыть окно"
						>
							&times;
						</button>
						<h2 className={{ marginBottom: 20, color: '#1a2732' }}>
							Бронирование тура
						</h2>
						<form onSubmit={handleSubmit}>
							<div className={styles.formGroup}>
								<label htmlFor="name" className={styles.label}>
									Имя
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									className={styles.input}
									required
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor="phone" className={styles.label}>
									Телефон
								</label>
								<input
									type="tel"
									id="phone"
									name="phone"
									value={formData.phone}
									onChange={handleInputChange}
									className={styles.input}
									required
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor="peopleCount" className={styles.label}>
									Количество человек
								</label>
								<input
									type="number"
									id="peopleCount"
									name="peopleCount"
									value={formData.peopleCount}
									onChange={handleInputChange}
									min={1}
									className={styles.input}
									required
								/>
							</div>
							<button type="submit" className={styles.submitBtn}>
								Отправить заявку
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default OneTour;

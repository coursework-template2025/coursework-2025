import React from 'react';

import styles from './about.module.css';

const About = () => {
	return (
		<div className={styles.about}>
			<div className={styles.container}>
				<h1 className={styles.title}>Исследуй Кыргызстан с KG-TRAVEL</h1>
				<div className={styles.divider}></div>
				<p className={styles.subtitle}>
					Незабываемые приключения по самым красивым местам страны
				</p>

				<p className={styles.paragraph}>
					Добро пожаловать в <strong>KG-TRAVEL</strong> — ваш проводник в мир
					незабываемых путешествий по Кыргызстану. Мы создаём туры, наполненные
					духом приключений, культурой и красотой нашей удивительной страны.
				</p>

				<p className={styles.paragraph}>
					Наша команда — это энтузиасты, которые любят Кыргызстан и стремятся
					показать его во всей красе: от снежных вершин Тянь-Шаня до кристально
					чистых озёр и древних караванных путей Шёлкового пути.
				</p>

				<p className={styles.paragraph}>
					Мы предлагаем уникальные маршруты для любого вкуса: пешие походы,
					конные туры, этнографические экспедиции, джип-туры и фототуры. Наши
					гиды — местные жители, которые знают все тайные уголки и легенды
					каждого региона.
				</p>

				<p className={styles.paragraph}>
					С <strong>KG-TRAVEL</strong> вы не просто путешествуете — вы
					проживаете каждое мгновение, открываете новые горизонты и создаёте
					воспоминания на всю жизнь. Исследуй Кыргызстан с нами!
				</p>
			</div>
		</div>
	);
};

export default About;

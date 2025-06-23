import TourCard from '../tours/tour-card/tour-card.jsx';

import styles from './tours.module.css';

const tours = [
	{
		id: 1,
		title: 'Иссык-Куль и Чолпон-Ата',
		description: 'Теплое озеро, горы и музеи в одном туре!',
		imageUrl:
			'https://goldenglobeint.com/wp-content/uploads/2024/10/Cho3-1024x926.jpeg',
	},
	{
		id: 2,
		title: 'Поход в Ала-Арчу',
		description: 'Однодневный тур в одно из красивейших ущелий страны.',
		imageUrl:
			'https://cdn-1.aki.kg/cdn-st-0/qgM/3/3218278.f6eee82983ae833197b042025a97f667.jpg',
	},
	{
		id: 3,
		title: 'Сон-Куль',
		description:
			'Юрты, кони и закат над озером — почувствуй кочевую романтику.',
		imageUrl:
			'https://dwc.kg/wp-content/uploads/2023/05/1647363955_34-vsegda-pomnim-com-p-ozero-chatir-kul-foto-38.jpg',
	},
];

const TourSection = () => {
	return (
		<section className={styles.tours}>
			<div className="container">
				<h2>Популярные туры</h2>
				<div className={styles.cards}>
					{tours.map(tour => (
						<TourCard key={`${tour.id}-tour`} tour={tour} />
					))}
				</div>
			</div>
		</section>
	);
};

export default TourSection;

import { useNavigate } from 'react-router-dom';

import styles from './tour-card.module.css';

const TourCard = ({ tour }) => {
	const navigate = useNavigate();

	return (
		<div className={styles.card} onClick={() => navigate(`tours/${tour.id}`)}>
			<img src={tour.image} alt={tour.title} className={styles.image} />
			<h3 className={styles.title}>{tour.title}</h3>
			<p className={styles.description}>{tour.description}</p>
		</div>
	);
};

export default TourCard;

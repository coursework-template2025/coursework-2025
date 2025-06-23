import { Link } from 'react-router-dom';

import styles from './start.module.css';

const StartScreen = () => {
	return (
		<div>
			<div className={styles.main_page}>
				<div className="container">
					<div className={styles.container}>
						<div className={styles.heroContent}>
							<h1>Исследуй Кыргызстан с KG-TRAVEL</h1>
							<p>Незабываемые приключения по самым красивым местам страны</p>
							<Link to="/tours" className={styles.heroBtn}>
								Посмотреть туры
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StartScreen;

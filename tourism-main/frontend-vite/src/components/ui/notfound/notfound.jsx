import { Link } from 'react-router-dom';

import styles from './notfound.module.css';

const NotFound = () => {
	return (
		<div className={`${styles.wrapper} container`}>
			<h1 className={styles.code}>404</h1>
			<h2 className={styles.title}>Страница не найдена</h2>
			<p className={styles.description}>
				К сожалению, запрашиваемая страница не существует или была удалена.
			</p>
			<Link to="/" className={styles.homeLink}>
				Вернуться на главную
			</Link>
		</div>
	);
};

export default NotFound;

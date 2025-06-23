import { Link, useNavigate } from 'react-router-dom';

import {
	NAVIGATION,
	NAVIGATION_HEADER_FOOTER,
} from '../../../shared/constants/constants.js';

import styles from './footer.module.css';

const Footer = () => {
	const navigate = useNavigate();

	return (
		<footer className={styles.footer}>
			<div className="container">
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<div
						className={styles.logo}
						onClick={() => navigate(NAVIGATION.HOME)}
					>
						KG-TRAVEL
					</div>

					<nav className={styles.nav}>
						{NAVIGATION_HEADER_FOOTER.map((item, i) => (
							<Link key={`${i}-footer`} to={item.path} className={styles.link}>
								{item.name}
							</Link>
						))}
					</nav>

					<div className={styles.copy}>
						&copy; {new Date().getFullYear()} KG-TRAVEL.
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
	NAVIGATION,
	NAVIGATION_HEADER_FOOTER,
} from '../../../shared/constants/constants.js';

import styles from './header.module.css';

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<header className={styles.header}>
			<div className="container">
				<div className={styles.inner_header}>
					<div
						className={styles.logo}
						onClick={() => navigate(NAVIGATION.HOME)}
					>
						KG-TRAVEL
					</div>

					<nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
						{NAVIGATION_HEADER_FOOTER.map(link => (
							<Link
								key={link.name}
								to={link.path}
								className={styles.navLink}
								onClick={() => setMenuOpen(false)}
							>
								{link.name}
							</Link>
						))}
					</nav>

					<div className={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
						☰
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;

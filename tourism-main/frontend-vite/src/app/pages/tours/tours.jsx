import React, { useEffect, useRef, useState } from 'react';

import TourCard from '../../../components/tours/tour-card/tour-card.jsx';

import styles from './tours.module.css';

const categoriesList = [
	'Горы',
	'Озёра',
	'Заповедники',
	'Достопримечательности',
	'Регионы',
	'Культурные туры',
	'Экстрим',
	'Юрты и этнотуризм',
	'Зимние туры',
	'Санаторные',
];

// Регионы для выбора
const regionsList = [
	'Иссык-Куль',
	'Нарын',
	'Талас',
	'Чуй',
	'Ош',
	'Джалал-Абад',
	'Баткен',
];

const Tours = () => {
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedRegion, setSelectedRegion] = useState('');
	const [showMobileFilters, setShowMobileFilters] = useState(false);
	const tourListRef = useRef(null);

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	console.log(data);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('http://localhost:8080/api/tourism');
				if (!response.ok) {
					throw new Error('Ошибка при загрузке данных');
				}
				const result = await response.json();
				setData(result);
			} catch (err) {
				console.error('Fetch error:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleCategoryChange = category => {
		setSelectedCategories(prev =>
			prev.includes(category)
				? prev.filter(c => c !== category)
				: [...prev, category],
		);
	};

	const handleRegionChange = e => {
		setSelectedRegion(e.target.value);
	};

	const handleSearch = () => {
		setShowMobileFilters(false);
		setTimeout(() => {
			tourListRef.current?.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	};

	const filteredTours =
		data?.filter(tour => {
			const categoryMatch =
				selectedCategories.length === 0 ||
				selectedCategories.includes(tour.category);

			const regionMatch =
				selectedRegion === '' || tour.region === selectedRegion;

			return categoryMatch && regionMatch;
		}) || [];

	useEffect(() => {
		const catParam =
			selectedCategories.length > 0 ? selectedCategories.join(',') : '';
		const regionParam = selectedRegion || '';

		const query = `tours?${catParam ? `category=${catParam}` : ''}${
			catParam && regionParam ? '&' : ''
		}${regionParam ? `region=${regionParam}` : ''}`;

		console.log(query);
	}, [selectedCategories, selectedRegion]);

	return (
		<div style={{ marginTop: '60px' }}>
			<div className={styles.tours}>
				<div className={styles.filterToggle}>
					<button
						className={styles.filterButton}
						onClick={() => setShowMobileFilters(!showMobileFilters)}
					>
						{showMobileFilters ? 'Закрыть фильтр' : 'Фильтр'}
					</button>
				</div>

				<div className={styles.container}>
					<div
						className={`${styles.sidebar} ${
							showMobileFilters ? styles.open : ''
						}`}
					>
						<div className={styles.filterGroup}>
							<h3>Категории</h3>
							{categoriesList.map(cat => (
								<label key={cat} className={styles.checkboxLabel}>
									<input
										type="checkbox"
										value={cat}
										checked={selectedCategories.includes(cat)}
										onChange={() => handleCategoryChange(cat)}
									/>
									{cat}
								</label>
							))}
						</div>

						<div className={styles.filterGroup}>
							<h3>Регион</h3>
							<select value={selectedRegion} onChange={handleRegionChange}>
								<option value="">Все регионы</option>
								{regionsList.map(region => (
									<option key={region} value={region}>
										{region}
									</option>
								))}
							</select>
						</div>

						<button className={styles.searchButton} onClick={handleSearch}>
							Поиск
						</button>
					</div>

					<div className={styles.mainContent}>
						<div ref={tourListRef}></div>
						<h2>Туры</h2>
						<div className={styles.tourList}>
							{loading ? (
								<p>Загрузка...</p>
							) : filteredTours.length === 0 ? (
								<p>Туры не найдены</p>
							) : (
								filteredTours.map(tour => (
									<TourCard key={tour._id} tour={tour} />
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Tours;

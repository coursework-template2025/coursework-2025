import React from 'react';

import styles from './contacts.module.css';

const Contacts = () => {
	const handleSubmit = event => {
		event.preventDefault();

		const formData = new FormData(event.target);

		const data = {
			name: formData.get('name'),
			phone: formData.get('phone'),
			message: formData.get('message'),
		};

		console.log('Форма отправлена:', data);

		// Можно очистить форму после отправки, если нужно:
		event.target.reset();
	};

	return (
		<div style={{ marginTop: '60px' }}>
			<div>
				<div className={styles.infoSection}>
					<div className="container">
						<div className={styles.info_inner}>
							<h1 className={styles.title}>Контакты</h1>
							<h3 className={styles.company}>KG-TRAVEL</h3>
							<p>
								<strong>Адрес:</strong> г. Бишкек, пр. Чуй 123
							</p>
							<p>
								<strong>Телефон:</strong>{' '}
								<a href="tel:+996700123456">+996 700 123 456</a>
							</p>
							<p>
								<strong>Telegram:</strong>{' '}
								<a
									href="https://t.me/kesmeeee"
									target="_blank"
									rel="noopener noreferrer"
								>
									@kesmeeee
								</a>
							</p>
							<p>
								<strong>Email:</strong>{' '}
								<a href="mailto:info@kgtravel.kg">info@kgtravel.kg</a>
							</p>
						</div>
					</div>
				</div>

				<div className={styles.formSection}>
					<div className="container">
						<h2 className={styles.formTitle}>Свяжитесь с нами</h2>
						<p className={styles.subtitle}>
							Оставьте ваши данные, и мы ответим на все вопросы!
						</p>
						<form className={styles.form} onSubmit={handleSubmit}>
							<input
								type="text"
								name="name"
								placeholder="Ваше имя"
								required
								className={styles.input}
							/>
							<input
								type="tel"
								name="phone"
								placeholder="Номер телефона"
								required
								className={styles.input}
							/>
							<textarea
								name="message"
								placeholder="Ваш вопрос"
								required
								className={styles.textarea}
							></textarea>
							<button type="submit" className={styles.button}>
								Отправить
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contacts;

import Footer from '../../components/ui/footer/footer.jsx';
import Header from '../../components/ui/header/header.jsx';

export function Layout({ children }) {
	return (
		<div
			style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
		>
			<Header />
			<main style={{ flexGrow: 1 }}>{children}</main>
			<Footer />
		</div>
	);
}

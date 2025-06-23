import { Route, Routes } from 'react-router-dom';

import { Layout } from './app/layout/layout.jsx';
import About from './app/pages/about/about.jsx';
import Contacts from './app/pages/contacts/contacts.jsx';
import Home from './app/pages/home/home.jsx';
import OneTour from './app/pages/tours/one-tour/one-tour.jsx';
import Tours from './app/pages/tours/tours.jsx';
import NotFound from './components/ui/notfound/notfound.jsx';
import ProtectedRoute from './components/ui/protect/protect.jsx';
import { NAVIGATION } from './shared/constants/constants.js';

const App = () => {
	return (
		<>
			<Layout>
				<Routes>
					<Route path={NAVIGATION.HOME} element={<Home />} />
					<Route path={NAVIGATION.TOURS} element={<Tours />} />
					<Route path={`${NAVIGATION.TOURS}/:id`} element={<OneTour />} />
					<Route path={NAVIGATION.ABOUT} element={<About />} />
					<Route path={NAVIGATION.CONTACT} element={<Contacts />} />

					<Route
						path="/admin/test"
						element={
							<ProtectedRoute isAllowed={user}>
								<About />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Layout>
		</>
	);
};

export default App;

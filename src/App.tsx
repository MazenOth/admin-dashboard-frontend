import { Routes, Route } from 'react-router-dom';
import Layout from './components/Dashboard/Layout';
import Users from './pages/Users';
import Matching from './pages/Matching';

const App = () => (
  <Layout>
    <Routes>
      <Route
        path='/clients'
        element={<Users roleName='Client' heading='Clients Management' />}
      />
      <Route
        path='/helpers'
        element={<Users roleName='Helper' heading='Helpers Management' />}
      />
      <Route path='/matching' element={<Matching />} />
    </Routes>
  </Layout>
);

export default App;

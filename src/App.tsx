import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Detect from './pages/Detect';
import Tips from './pages/Tips';
import About from './pages/About';
import History from './pages/History';
import BatchScan from './pages/BatchScan';
import Report from './pages/Report';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/detect" element={<Detect />} />
        <Route path="/batch" element={<BatchScan />} />
        <Route path="/history" element={<History />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/about" element={<About />} />
        <Route path="/report/:id" element={<Report />} />
      </Route>
    </Routes>
  );
}

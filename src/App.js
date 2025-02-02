import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlackWallStreetCoin from './components/BlackWallStreetCoin';
import DexChart from './components/DexChart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlackWallStreetCoin />} />
        <Route path="/chart" element={<DexChart />} />
      </Routes>
    </Router>
  );
}

export default App;

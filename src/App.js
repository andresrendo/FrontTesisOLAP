import React, { useState } from 'react';
import Header from './components/Header';
import RevenueByCountry from './components/RevenueByCountry';
import ComparisonChart from './components/ComparisonChart';
import TopRoutesTables from './components/TopRoutesTables';
import DockerStatsTable from './components/DockerStatsTable';
import Footer from './components/Footer';

function App() {
  const [selectedQuery, setSelectedQuery] = useState('toproutes');
  return (
    <div>
      <Header />
      <main>
        <div className="container my-4">
          <label htmlFor="queryDropdown" className="form-label fw-bold">Selecciona consulta:</label>
          <select
            id="queryDropdown"
            className="form-select mb-4"
            value={selectedQuery}
            onChange={e => setSelectedQuery(e.target.value)}
          >
            <option value="toproutes">Top Routes</option>
            <option value="revenue">Revenue by Country</option>
          </select>
          {selectedQuery === 'toproutes' ? <TopRoutesTables /> : <RevenueByCountry />}
        </div>
        <DockerStatsTable />
      </main>
      <Footer />
    </div>
  );
}

export default App;

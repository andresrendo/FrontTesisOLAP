import React, { useState } from 'react';
import Header from './components/Header';
import RevenueByCountry from './components/RevenueByCountry';
import ComparisonChart from './components/ComparisonChart';
import TopRoutesTables from './components/TopRoutesTables';
import DockerStatsTable from './components/DockerStatsTable';
import TicketsByWeekdayTable from './components/TicketsByWeekdayTable';
import LeastTravelledNationalityTable from './components/LeastTravelledNationality';
import RevenueBySeatClassAndMonthTable from './components/RevenueBySeat';
import RevenueAccumulated from './components/RevenueAccumulated';
import DelayedAverage from './components/DelayedAverage';
import PassengersByAircraft from './components/PassengersByAircraft';
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
            <option value="ticketsByWeekday">Tickets por Día de la Semana</option>
            <option value="leastTravelledNationality">Nacionalidades con Menos Viajes</option>
            <option value="revenueBySeatClassAndMonth">Revenue por Clase y Mes</option>
            <option value="revenueAccumulated">Revenue Acumulado por Clase y Mes</option>
            <option value="delayedAverage">Retraso promedio por aeropuerto y mes</option>
            <option value="passengersByAircraft">Pasajeros por Aeronave</option>

          </select>
          {selectedQuery === 'toproutes' ? <TopRoutesTables /> : selectedQuery === 'revenue' ? <RevenueByCountry /> : selectedQuery === 'leastTravelledNationality' ? <LeastTravelledNationalityTable /> : selectedQuery === 'revenueBySeatClassAndMonth' ? <RevenueBySeatClassAndMonthTable /> : selectedQuery === 'revenueAccumulated' ? <RevenueAccumulated /> : selectedQuery === 'delayedAverage' ? <DelayedAverage /> : selectedQuery === 'passengersByAircraft' ? <PassengersByAircraft /> : <TicketsByWeekdayTable />}
        </div>
        <DockerStatsTable />
      </main>
      <Footer />
    </div>
  );
}

export default App;

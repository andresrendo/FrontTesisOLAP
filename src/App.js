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
import AdjustedProfitRoutes from './components/AdjustedProfitRoutes';
import FrequentPassengerRevenue from './components/FrequentPassengerRevenue';
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
          <option value="toproutes">Top Routes - Complejidad Baja</option>
          <option value="revenue">Revenue by Country - Complejidad Baja</option>
          <option value="ticketsByWeekday">Tickets por Día de la Semana - Complejidad Media</option>
          <option value="leastTravelledNationality">Nacionalidades con Menos Viajes - Complejidad Media</option>
          <option value="passengersByAircraft">Pasajeros por Aeronave - Complejidad Media</option>
          <option value="revenueBySeatClassAndMonth">Revenue por Clase y Mes - Complejidad Media</option>
          <option value="revenueAccumulated">Revenue Acumulado por Clase y Mes - Complejidad Alta</option>
          <option value="delayedAverage">Retraso promedio por aeropuerto y mes - Complejidad Alta</option>
          <option value="adjustedProfitRoutes">Rutas más rentables (ajustado) - Complejidad Alta</option>
          <option value="frequentPassengerRevenue">Ingresos por Pasajeros Frecuentes - Complejidad Alta</option>



          </select>
          {selectedQuery === 'toproutes' ? <TopRoutesTables /> : selectedQuery === 'revenue' ? <RevenueByCountry /> : selectedQuery === 'leastTravelledNationality' ? <LeastTravelledNationalityTable /> : selectedQuery === 'revenueBySeatClassAndMonth' ? <RevenueBySeatClassAndMonthTable /> : selectedQuery === 'revenueAccumulated' ? <RevenueAccumulated /> : selectedQuery === 'delayedAverage' ? <DelayedAverage /> : selectedQuery === 'passengersByAircraft' ? <PassengersByAircraft /> : selectedQuery === 'adjustedProfitRoutes' ? <AdjustedProfitRoutes /> : selectedQuery === 'frequentPassengerRevenue' ? <FrequentPassengerRevenue /> : <TicketsByWeekdayTable />}
        </div>
        <DockerStatsTable />
      </main>
      <Footer />
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import DeviceList from './components/DeviceList';
import MetricGenerator from './components/MetricGenerator';
import MetricsChart from './components/MetricsChart';
import { getDevices } from './services/api';
import { Calendar } from 'primereact/calendar';


const allMetricTypes = [
  'temperature', 'humidity', 'light', 'pressure', 'air_quality',
  'co2', 'wind_speed', 'noise_level', 'battery'
];



export default function App() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [dateRange, setDateRange] = useState(null); 
  const [selectedMetrics, setSelectedMetrics] = useState(allMetricTypes);
  const [refreshFlag, setRefreshFlag] = useState(false);

useEffect(() => {
  getDevices()
    .then(devices => {
      setSelectedDevice(devices[0] || null);
    })
    .catch(error => console.error('Помилка завантаження пристроїв:', error));
}, []);

  const handleGenerated = () => {
    setRefreshFlag(prev => !prev);
  };

  return (
    <div className="grid p-4">
      <div className="col-12 md:col-3">
        <DeviceList selectedDevice={selectedDevice} onSelect={setSelectedDevice} />
      </div>

      <div className="col-12 md:col-9">
        <MetricGenerator onGenerated={handleGenerated} />

        <div className="card" style={{ margin: '1rem 0' }}>
          <h3>Фільтрація метрик</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ minWidth: '250px' }}>
              <label>Період (початок - кінець)</label>
              <Calendar
                value={dateRange}
                onChange={e => setDateRange(e.value)}
                selectionMode="range"
                showTime
                dateFormat="yy-mm-dd"
                placeholder="Виберіть період"
                className="w-full"
              />
            </div>


          </div>
        </div>

        {selectedDevice ? (
<MetricsChart
  key={`${selectedDevice.id}-${refreshFlag}-${dateRange?.toString()}-${selectedMetrics.join(',')}`}
  deviceId={selectedDevice.id}
  dateRange={dateRange}
  metricTypes={selectedMetrics}
  refreshFlag={refreshFlag} 
/>
        ) : (
          <div>Оберіть пристрій для відображення метрик...</div>
        )}
      </div>
    </div>
  );
}

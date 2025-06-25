import { useState, useEffect } from 'react';
import DeviceList from './components/DeviceList';
import MetricGenerator from './components/MetricGenerator';
import MetricsChart from './components/MetricsChart';
import { getDevices } from './services/api';

export default function App() {
  const [selectedDevice, setSelectedDevice] = useState(null);


  useEffect(() => {
    getDevices()
      .then(setSelectedDevice)
      .catch(error => console.error('Помилка завантаження пристроїв:', error));
  }, []);

  const handleGenerated = () => {

    setSelectedDevice(null);
    getDevices()
      .then(setSelectedDevice)
      .catch(error => console.error('Помилка оновлення пристроїв:', error));
  };

  return (
    <div className="grid p-4">
      <div className="col-12 md:col-3">
        <DeviceList selectedDevice={selectedDevice} onSelect={setSelectedDevice} />
      </div>
      <div className="col-12 md:col-9">
        <MetricGenerator onGenerated={handleGenerated} />
        {selectedDevice ? (
          <MetricsChart deviceId={selectedDevice.id} />
        ) : (
          <div>Оберіть пристрій для відображення метрик...</div>
        )}
      </div>
    </div>
  );
}
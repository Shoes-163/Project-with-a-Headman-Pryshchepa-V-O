import { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { getMetrics } from '../services/api';


const metricLabels = {
  temperature: 'Температура (°C)',
  humidity: 'Вологість (%)',
  light: 'Освітлення (lx)',
  pressure: 'Тиск (гПа)',
  air_quality: 'Якість повітря (PM2.5, мкг/м³)',
  co2: 'CO₂ (ppm)',
  wind_speed: 'Швидкість вітру (м/с)',
  noise_level: 'Рівень шуму (дБ)',
  battery: 'Заряд батареї (%)'
};

export default function MetricsChart({ deviceId }) {
  const [metricsByType, setMetricsByType] = useState({});

  useEffect(() => {
    if (!deviceId) return;

    getMetrics({ deviceId }).then((metrics) => {
      const grouped = {};

      for (const metric of metrics) {
        const { type, value, timestamp } = metric;
        if (!grouped[type]) grouped[type] = { labels: [], data: [] };

        grouped[type].labels.push(new Date(timestamp).toLocaleTimeString());
        grouped[type].data.push(value);
      }

      setMetricsByType(grouped);
    });
  }, [deviceId]);

  if (!deviceId) {
    return <div className="card">Виберіть пристрій для перегляду метрик</div>;
  }

  return (
    <div className="grid">
      {Object.entries(metricsByType).map(([type, { labels, data }]) => (
        <div className="col-12 md:col-6" key={type}>
          <div className="card">
            <h4>{metricLabels[type] || type}</h4>
            <Chart
              type="line"
              data={{
                labels,
                datasets: [{
                  label: metricLabels[type] || type,
                  data,
                  borderColor: '#42A5F5',
                  fill: false,
                }],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                },
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

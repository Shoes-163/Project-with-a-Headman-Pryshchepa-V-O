import { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { getMetrics } from '../services/api';

const metricLabels = {
  temperature: 'Температура (°C)',
  humidity: 'Вологість (%)',
  illumination: 'Освітлення (lx)',
  pressure: 'Тиск (гПа)',
  air_quality: 'Якість повітря (PM2.5, мкг/м³)',
  carbon_dioxide_level: 'CO₂ (ppm)',
  wind_velocity: 'Швидкість вітру (м/с)',
  noise_level: 'Рівень шуму (дБ)',
  battery: 'Заряд батареї (%)',
};

const formatLocalDateTime = (date) => {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export default function MetricsChart({ deviceId, dateRange, metricTypes }) {
  const [metricsByType, setMetricsByType] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!deviceId || !metricTypes?.length || !dateRange?.[0] || !dateRange?.[1]) {
      setMetricsByType({});
      return;
    }

    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          device: deviceId,
          stime: formatLocalDateTime(dateRange[0]),
          etime: formatLocalDateTime(dateRange[1]),
          types: metricTypes.join(','),
        };

        const metrics = await getMetrics(params);
        const grouped = {};

for (const metric of metrics) {
  const { type: type, value: value, time } = metric;

  if (!grouped[type]) {
    grouped[type] = { labels: [], data: [] };
  }

grouped[type].labels.push(
  new Date(time).toLocaleString('uk-UA', {
    timeZone: 'Europe/Kyiv',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
);
  grouped[type].data.push(parseFloat(value));
}

        setMetricsByType(grouped);
      } catch (err) {
        setError('Помилка завантаження метрик');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [
    deviceId,
    dateRange?.[0]?.getTime(),
    dateRange?.[1]?.getTime(),
    metricTypes?.join(','),
  ]);

  if (loading) {
    return <div className="card">Завантаження...</div>;
  }

  if (error) {
    return <div className="card">{error}</div>;
  }

  if (!deviceId) {
    return <div className="card">Виберіть пристрій для перегляду метрик</div>;
  }

  if (!Object.keys(metricsByType).length) {
    return <div className="card">Немає даних для відображення</div>;
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
                datasets: [
                  {
                    label: metricLabels[type] || type,
                    data,
                    borderColor: '#42A5F5',
                    fill: false,
                  },
                ],
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
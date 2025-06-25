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
  battery: 'Заряд батареї (%)',
};

export default function MetricsChart({ deviceId, dateRange, metricTypes }) {
  const [metricsByType, setMetricsByType] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!deviceId || !metricTypes?.length) {
      setMetricsByType({});
      return;
    }

    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = { deviceId };

        if (dateRange?.[0] && dateRange?.[1]) {
          params.stime = dateRange[0].toISOString().slice(0, -1);
          params.etime = dateRange[1].toISOString().slice(0, -1);
        }

        if (metricTypes?.length) {
          params.types = metricTypes.join(',');
        }

        const metrics = await getMetrics(params);
        const grouped = {};

        for (const metric of metrics) {
          const { type_of_metrics: type, value_of_metrics: value, time } = metric;
          if (!grouped[type]) {
            grouped[type] = { labels: [], data: [] };
          }
          grouped[type].labels.push(new Date(time).toLocaleString());
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
  }, [deviceId, dateRange?.[0]?.toISOString(), dateRange?.[1]?.toISOString(), metricTypes?.join()]);

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
                    label: metricLabels[ type ] || type,
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
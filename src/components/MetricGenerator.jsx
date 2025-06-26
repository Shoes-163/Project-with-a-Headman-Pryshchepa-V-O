import { Button } from 'primereact/button';
import { generateMetrics } from '../services/api';
import { useState } from 'react';

export default function MetricGenerator({ onGenerated }) {
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [error, setError] = useState(null);
  const [generatedStats, setGeneratedStats] = useState({ devicesNumber: 0, metricsNumber: 0 });

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateMetrics(); 
      setGeneratedStats({ devicesNumber: data.devicesNumber, metricsNumber: data.metricsNumber });
      const now = new Date();
      setLastGenerated(now);
      onGenerated?.();
    } catch (err) {
      setError('Помилка генерації метрик. Спробуйте пізніше.');
      console.error('Помилка генерації метрик:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Генерація метрик</h3>
      <p>Натисніть кнопку, щоб згенерувати нові випадкові метрики для активних пристроїв.</p>
      <Button
        label="Generate"
        icon="pi pi-cog"
        onClick={handleGenerate}
        loading={loading}
      />
      {lastGenerated && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ color: 'green' }}>
            Остання генерація: {lastGenerated.toLocaleString('uk-UA')}
          </p>
          <p>Пристрої: {generatedStats.devicesNumber}</p>
          <p>Згенеровано метрик: {generatedStats.metricsNumber}</p>
        </div>
      )}
      {error && (
        <p style={{ marginTop: '1rem', color: 'red' }}>
          {error}
        </p>
      )}
    </div>
  );
}
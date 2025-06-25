import { Button } from 'primereact/button';
import { generateMetrics } from '../services/api';

export default function MetricGenerator({ onGenerated }) {
  const handleGenerate = async () => {
    await generateMetrics();
    onGenerated?.();
  };

  return (
    <div className="card">
      <h3>Generate Metrics</h3>
      <Button label="Generate" icon="pi pi-cog" onClick={handleGenerate} />
    </div>
  );
}

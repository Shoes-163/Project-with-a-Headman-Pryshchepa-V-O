import { useEffect, useState } from 'react';
import { ListBox } from 'primereact/listbox';
import { getDevices } from '../services/api';

export default function DeviceList({ selectedDevice, onSelect }) {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    getDevices().then(setDevices);
  }, []);

  return (
    <div className="card">
      <h3>Devices</h3>
      <ListBox 
        value={selectedDevice} 
        options={devices} 
        onChange={(e) => onSelect(e.value)} 
        optionLabel="name"
        className="w-full"
      />
    </div>
  );
}

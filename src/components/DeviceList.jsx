import { useEffect, useState } from 'react';
import { ListBox } from 'primereact/listbox';
import { InputSwitch } from 'primereact/inputswitch';
import { getDevices, updateDevice } from '../services/api';

export default function DeviceList({ selectedDevice, onSelect }) {
  const [devices, setDevices] = useState([]);

  const loadDevices = async () => {
    const data = await getDevices();
    setDevices(data);
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const toggleDeviceStatus = async (device) => {
    const updated = { ...device, is_working: !device.is_working };
    try {
      await updateDevice(device.id, { is_working: updated.is_working });
      setDevices((prev) =>
        prev.map((d) => (d.id === device.id ? updated : d))
      );
    } catch (err) {
      console.error('Помилка оновлення статусу пристрою:', err);
    }
  };

  const itemTemplate = (device) => (
    <div className="flex justify-content-between align-items-center w-full px-2">
      <span>{device.name}</span>
      <InputSwitch
        checked={device.is_working}
        onChange={() => toggleDeviceStatus(device)}
        tooltip={device.is_working ? 'Працює' : 'Не працює'}
      />
    </div>
  );

  return (
    <div className="card">
      <h3>Devices</h3>
      <ListBox
        value={selectedDevice}
        options={devices}
        onChange={(e) => onSelect(e.value)}
        optionLabel="name"
        itemTemplate={itemTemplate}
        className="w-full"
      />
    </div>
  );
}

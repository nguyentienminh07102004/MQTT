import { Switch } from 'antd';
import Card from './ui/Card';
import React from 'react';

interface DeviceControlProps {
  deviceName: string;
  status: boolean;
  onToggle: (setLoading: () => void) => void;
  count?: number;
}

const DeviceControl: React.FC<DeviceControlProps> = ({ deviceName, status, onToggle, count = 0 }) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <Card className="w-64">
      <div className="flex flex-col p-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{deviceName}</h3>
          <Switch checked={status} loading={loading} onChange={() => onToggle(() => setLoading(prev => !prev))} />
        </div>

        <p className="text-sm text-gray-500">Trạng thái: {status ? 'On' : 'Off'}</p>
        <p className="text-sm text-gray-500">Số lần bật tắt: {count}</p>
      </div>
    </Card>
  )
}

export default DeviceControl;

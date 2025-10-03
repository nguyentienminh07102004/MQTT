import { Switch } from 'antd';
import Card from './ui/Card';

interface DeviceControlProps {
  deviceName: string;
  status: boolean;
  onToggle: () => void;
}

const DeviceControl: React.FC<DeviceControlProps> = ({ deviceName, status, onToggle }) => {
  return (
    <Card className="w-64">
      <div className="flex flex-col p-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{deviceName}</h3>
          <Switch checked={status} onChange={onToggle} />
        </div>

        <p className="text-sm text-gray-500">Trạng thái: {status ? 'On' : 'Off'}</p>
      </div>
    </Card>
  )
}

export default DeviceControl;

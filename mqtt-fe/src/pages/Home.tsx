import { Droplet, Lightbulb, Snowflake } from "lucide-react";
import React from "react";
import DeviceControl from "../components/DeviceControl";
import LineMultiChart, { type SensorData } from "../components/LineMultiChart";
import SensorCard from "../components/SensorCard";
import SocketIOConfiguration from "../configuration/SocketIOConfiguration";

const toggleDevice = async (device: string, status: boolean, onToggle: () => void) => {
	try {
		await fetch(`http://localhost:8080/api/v1/${device}/${status ? "OFF" : "ON"}`, { method: "POST" });
		onToggle();
	} catch (error) {
		console.error("Error toggling LED:", error);
	}
};

const Home = () => {
	const [ledStatus, setLedStatus] = React.useState<boolean>(false);
	const [fanStatus, setFanStatus] = React.useState<boolean>(false);
	const [acStatus, setAcStatus] = React.useState<boolean>(false);
	const [data, setData] = React.useState<SensorData[]>([]);
	const [brightnessNow, setBrightnessNow] = React.useState<{ createdDate: number[]; value: number }>({ createdDate: [], value: 0 });
	const [temperatureNow, setTemperatureNow] = React.useState<{ createdDate: number[]; value: number }>({ createdDate: [], value: 0 });
	const [humidityNow, setHumidityNow] = React.useState<{ createdDate: number[]; value: number }>({ createdDate: [], value: 0 });
	const socket = SocketIOConfiguration;
	const handleData = (value: SensorData) => {
		setBrightnessNow({ createdDate: value.createdDate, value: value.brightness });
		setTemperatureNow({ createdDate: value.createdDate, value: value.temperature });
		setHumidityNow({ createdDate: value.createdDate, value: value.humidity });
		setData((prev) => [...prev.slice(-19), value]);
	};
	React.useEffect(() => {
		socket.on("topic/sendData", handleData);
		return () => {
			socket.off("topic/sendData", handleData);
		};
	}, []);
	React.useEffect(() => {
		Promise.all([
			fetch("http://localhost:8080/api/v1/last/led").then((res) => res.json()),
			fetch("http://localhost:8080/api/v1/last/fan").then((res) => res.json()),
			fetch("http://localhost:8080/api/v1/last/air_conditioner").then((res) => res.json()),
		]).then(([ledRes, fanRes, acRes]) => {
			setLedStatus(ledRes.status === "ON");
			setFanStatus(fanRes.status === "ON");
			setAcStatus(acRes.status === "ON");
		});
	}, []);
	return (
		<div className="p-6 overflow-hidden">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-3">
				<SensorCard
					title="Nhiệt độ"
					value={String(temperatureNow?.value.toFixed(1) || 0)}
					unit="°C"
					icon={<Snowflake />}
					updatedAt={temperatureNow?.createdDate}
				/>
				<SensorCard
					title="Độ ẩm"
					value={String(humidityNow?.value.toFixed(1) || 0)}
					unit="%"
					icon={<Droplet />}
					updatedAt={humidityNow?.createdDate}
				/>
				<SensorCard
					title="Ánh sáng"
					value={String(brightnessNow?.value.toFixed(1) || 0)}
					unit="lux"
					icon={<Lightbulb />}
					updatedAt={brightnessNow?.createdDate}
				/>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<DeviceControl
					deviceName="Đèn"
					status={ledStatus}
					onToggle={() => toggleDevice("led", ledStatus, () => setLedStatus(!ledStatus))}
				/>
				<DeviceControl
					deviceName="Quạt"
					status={fanStatus}
					onToggle={() => toggleDevice("fan", fanStatus, () => setFanStatus(!fanStatus))}
				/>
				<DeviceControl
					deviceName="Điều hoà"
					status={acStatus}
					onToggle={() => toggleDevice("air_conditioner", acStatus, () => setAcStatus(!acStatus))}
				/>
			</div>

			<h2 className="text-xl font-bold mt-8 mb-4">Biểu đồ cảm biến theo thời gian</h2>
			<div className="bg-white border border-gray-200 rounded-lg p-4">
				<LineMultiChart data={data || []} />
			</div>
		</div>
	);
};

export default Home;

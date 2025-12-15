import { Droplet, Lightbulb, Snowflake } from "lucide-react";
import React from "react";
import DeviceControl from "../components/DeviceControl";
import LineMultiChart, { type SensorData } from "../components/LineMultiChart";
import SensorCard from "../components/SensorCard";
import { API_BASE_URL } from "../configuration/App.constant";
import SocketIOConfiguration from "../configuration/SocketIOConfiguration";

const Home = () => {
	const [ledStatus, setLedStatus] = React.useState<boolean>(false);
	const [fanStatus, setFanStatus] = React.useState<boolean>(false);
	const [acStatus, setAcStatus] = React.useState<boolean>(false);
	const [ringStatus, setRingStatus] = React.useState<boolean>(false);
	const [doorStatus, setDoorStatus] = React.useState<boolean>(false);
	const [data, setData] = React.useState<SensorData[]>([]);
	const [brightnessNow, setBrightnessNow] = React.useState<{ createdDate: number[]; value: number }>({ createdDate: [], value: 0 });
	const [temperatureNow, setTemperatureNow] = React.useState<{ createdDate: number[]; value: number }>({ createdDate: [], value: 0 });
	const [humidityNow, setHumidityNow] = React.useState<{ createdDate: number[]; value: number }>({ createdDate: [], value: 0 });
	const [ringCount, setRingCount] = React.useState<number>(0);
	const [doorCount, setDoorCount] = React.useState<number>(0);
	const [fanCount, setFanCount] = React.useState<number>(0);
	const [acCount, setAcCount] = React.useState<number>(0);
	const [ledCount, setLedCount] = React.useState<number>(0);
	const socket = SocketIOConfiguration;
	const handleData = (value: SensorData) => {
		setBrightnessNow({ createdDate: value.createdDate, value: value.brightness });
		setTemperatureNow({ createdDate: value.createdDate, value: value.temperature });
		setHumidityNow({ createdDate: value.createdDate, value: value.humidity });
		setData((prev) => [...prev.slice(-19), value]);
	};
	const toggleDevice = (device: string, status: boolean, onToggle: () => void, setLoading: () => void) => {
	setLoading();
	fetch(`${API_BASE_URL}/${device}/${status ? "OFF" : "ON"}`, { method: "POST" })
		.then((res) => {
			if (!res.ok) throw new Error("Failed to toggle device");
			console.log("Toggled", device, status ? "OFF" : "ON");
			onToggle();
			setLoading();
			if (device === "ring") setRingCount((prev) => prev + 1);
			if (device === "door") setDoorCount((prev) => prev + 1);
			if (device === "fan") setFanCount((prev) => prev + 1);
			if (device === "air_conditioner") setAcCount((prev) => prev + 1);
			if (device === "led") setLedCount((prev) => prev + 1);
		})
		.catch(() => {
			setLoading();
		});
};
	React.useEffect(() => {
		socket.on("topic/sendData", handleData);
	}, []);
	React.useEffect(() => {
		Promise.all([
			fetch(`${API_BASE_URL}/last/led`).then((res) => res.json()),
			fetch(`${API_BASE_URL}/last/fan`).then((res) => res.json()),
			fetch(`${API_BASE_URL}/last/air_conditioner`).then((res) => res.json()),
			fetch(`${API_BASE_URL}/last/ring`).then((res) => res.json()),
			fetch(`${API_BASE_URL}/last/door`).then((res) => res.json()),
			fetch(`${API_BASE_URL}/count/ring`).then((res) => res.text()),
			fetch(`${API_BASE_URL}/count/door`).then((res) => res.text()),
			fetch(`${API_BASE_URL}/count/fan`).then((res) => res.text()),
			fetch(`${API_BASE_URL}/count/air_conditioner`).then((res) => res.text()),
			fetch(`${API_BASE_URL}/count/led`).then((res) => res.text()),
		]).then(([ledRes, fanRes, acRes, ringRes, doorRes, ringCount, doorCount, fanCount, acCount, ledCount]) => {
			setLedStatus(ledRes.status.toUpperCase() === "ON");
			setFanStatus(fanRes.status.toUpperCase() === "ON");
			setAcStatus(acRes.status.toUpperCase() === "ON");
			setRingStatus(ringRes.status.toUpperCase() === "ON");
			setDoorStatus(doorRes.status.toUpperCase() === "ON");
			setRingCount(Number(ringCount));
			setDoorCount(Number(doorCount));
			setFanCount(Number(fanCount));
			setAcCount(Number(acCount));
			setLedCount(Number(ledCount));
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
					count={ledCount}
					onToggle={(setLoading: () => void) => toggleDevice("led", ledStatus, () => setLedStatus(!ledStatus), setLoading)}
				/>
				<DeviceControl
					deviceName="Quạt"
					count={fanCount}
					status={fanStatus}
					onToggle={(setLoading: () => void) => toggleDevice("fan", fanStatus, () => setFanStatus(!fanStatus), setLoading)}
				/>
				<DeviceControl
					deviceName="Điều hoà"
					status={acStatus}
					count={acCount}
					onToggle={(setLoading: () => void) =>
						toggleDevice("air_conditioner", acStatus, () => setAcStatus(!acStatus), setLoading)
					}
				/>
				<DeviceControl
					deviceName="Chuông"
					status={ringStatus}
					onToggle={(setLoading: () => void) => toggleDevice("ring", ringStatus, () => setRingStatus(!ringStatus), setLoading)}
					count={ringCount}
				/>
				<DeviceControl
					deviceName="Cửa"
					status={doorStatus}
					onToggle={(setLoading: () => void) => toggleDevice("door", doorStatus, () => setDoorStatus(!doorStatus), setLoading)}
					count={doorCount}
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

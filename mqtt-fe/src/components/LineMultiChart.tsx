import React from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "antd";

export type SensorData = {
	id: number;
	createdDate: number[];
	temperature: number;
	humidity: number;
	brightness: number;
};

const CHART_COLORS = {
	temperature: "#fa8c16",
	humidity: "#1890ff",
	light: "#ffc53d",
};

type Props = {
	data: SensorData[];
};

const LineMultiChart: React.FC<Props> = ({ data }) => {
	const formattedData = React.useMemo(() => {
		return data.map((item) => {
			const dateObj = new Date(
				item.createdDate[0],
				item.createdDate[1] - 1,
				item.createdDate[2],
				item.createdDate[3],
				item.createdDate[4],
				item.createdDate[5],
				Math.floor(item.createdDate[6] / 1000000)
			);
			return {
				...item,
				createdDate: dateObj.toLocaleString(),
			};
		});
	}, [data]);
	return (
		<Card
			style={{
				marginBottom: 16,
				borderRadius: 12,
				boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
				padding: "12px",
			}}
		>
			<ResponsiveContainer width="100%" height={280}>
				<LineChart data={formattedData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="createdDate" />
					<YAxis
						yAxisId="left"
						label={{
							value: "Temp (°C) / Humidity (%)",
							angle: -90,
							position: "insideLeft",
							style: { textAnchor: "middle" },
						}}
					/>
					<YAxis
						yAxisId="right"
						orientation="right"
						label={{
							value: "Light (lux)",
							angle: 90,
							position: "insideRight",
							style: { textAnchor: "middle" },
						}}
					/>

					<Tooltip />
					<Legend />

					<Line
						yAxisId="left"
						type="monotone"
						dataKey="temperature"
						stroke={CHART_COLORS.temperature}
						name="Temperature"
						strokeWidth={2}
						dot={{ r: 3 }}
					/>
					<Line
						yAxisId="left"
						type="monotone"
						dataKey="humidity"
						stroke={CHART_COLORS.humidity}
						name="Humidity"
						strokeWidth={2}
						dot={{ r: 3 }}
					/>
					<Line
						yAxisId="right"
						type="monotone"
						dataKey="brightness"
						stroke={CHART_COLORS.light}
						name="Light"
						strokeWidth={2}
						dot={{ r: 3 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</Card>
	);
};

export default LineMultiChart;

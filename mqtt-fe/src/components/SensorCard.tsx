import React from "react";
import Card from "./ui/Card";

interface SensorCardProps {
	title: string;
	value: string;
	unit: string;
	icon?: React.ReactNode;
	updatedAt: number[];
}

const SensorCard: React.FC<SensorCardProps> = ({ title, value, unit, icon, updatedAt }) => {
	const dateObj = new Date(
		updatedAt[0],
		updatedAt[1] - 1,
		updatedAt[2],
		updatedAt[3],
		updatedAt[4],
		updatedAt[5],
		Math.floor(updatedAt[6] / 1000000)
	);
	return (
		<Card className="w-64">
			<div className="flex flex-col">
				<div className="flex justify-between items-center mb-3">
					<h3 className="text-lg font-semibold text-gray-800">{title}</h3>
					<div className="text-gray-500">{icon}</div>
				</div>

				<div className="flex items-baseline gap-2 mb-2">
					<span className="text-3xl font-bold text-gray-800">{value}</span>
					<span className="text-sm text-gray-500">{unit}</span>
				</div>

				<p className="text-sm text-gray-500">Cập nhật: {dateObj.toLocaleString() ?? "-"}</p>
			</div>
		</Card>
	);
};

export default SensorCard;

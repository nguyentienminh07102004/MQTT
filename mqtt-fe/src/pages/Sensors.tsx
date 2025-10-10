import { CopyOutlined } from "@ant-design/icons";
import { Button, Pagination, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import React from "react";
import { useSearchParams } from "react-router";
import SearchSensorComponent from "../components/SearchSensorComponent";
import type { PagedModel } from "./History";
import type { SensorData } from "../components/LineMultiChart";
import { API_BASE_URL } from "../configuration/App.constant";

const columns: ColumnsType<SensorData> = [
	{ title: "ID", key: "id", render: (_, __, index) => index + 1 },
	{ title: "Nhiệt độ", dataIndex: "temperature", key: "temperature" },
	{ title: "Độ ẩm", dataIndex: "humidity", key: "humidity" },
	{ title: "Ánh sáng", dataIndex: "brightness", key: "brightness" },
	{
		title: "Ngày tạo",
		dataIndex: "createdDate",
		key: "createdDate",
		render: (createdDate) => {
			const formattedDate = dayjs(createdDate).format("YYYY-MM-DD HH:mm:ss");
			return (
				<>
					<Button
						icon={<CopyOutlined />}
						iconPosition="end"
						onClick={() => {
							navigator.clipboard.writeText(formattedDate);
						}}
					>
						{formattedDate}
					</Button>
				</>
			);
		},
	},
];

const Sensors = () => {
	const [page, setPage] = React.useState<number>(1);
	const [limit, setLimit] = React.useState<number>(10);
	const [urlSearchParams, setUrlSearchParams] = useSearchParams();
	const [data, setData] = React.useState<PagedModel<SensorData>>({
		content: [],
		page: { totalElements: 0, totalPages: 0, number: 1, size: 10 },
	});
	const fetchData = async () => {
		let url = `${API_BASE_URL}/sensors?page=${page}&limit=${limit}`;
		const dateTime = urlSearchParams.get("dateTime");
		const sensorType = urlSearchParams.get("sensorType");
		const sort = urlSearchParams.get("sort");
		const value = urlSearchParams.get("value");
		if (value) url = `${url}&value=${value}`;
		if (sort) url = `${url}&sort=${sort}`;
		if (sensorType) url = `${url}&type=${sensorType}`;
		if (dateTime) url = `${url}&dateTime=${dateTime}`;
		const response: PagedModel<SensorData> = await (await fetch(url)).json();
		setData(response);
	};
	React.useEffect(() => {
		fetchData();
	}, [urlSearchParams, page, limit]);
	return (
		<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="p-6">
			<h1 className="text-2xl font-bold mb-2">Cảm biến</h1>
			<p className="text-gray-600 mb-6">Lịch sử điều khiển thiết bị trong hệ thống IoT</p>

			<div className="bg-white border border-gray-200 rounded-lg p-6">
				<SearchSensorComponent />
				<Table columns={columns} dataSource={data.content} pagination={false} rowKey={(r) => r.id} bordered />
				<div className="mt-4 flex items-center justify-between">
					<div className="text-sm text-gray-600">Hiển thị 1-5 trong 5 kết quả</div>
					<div className="flex items-center gap-2">
						<Pagination
							showSizeChanger
							total={data.page.totalElements}
							current={data.page.number + 1}
							pageSize={limit}
							onChange={(page, pageSize) => {
								if (pageSize) setLimit(pageSize);
								if (page) setPage(page);
								urlSearchParams.set("page", page.toString());
								urlSearchParams.set("limit", pageSize.toString());
								setUrlSearchParams(urlSearchParams);
							}}
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default Sensors;

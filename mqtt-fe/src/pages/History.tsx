import { CopyOutlined } from "@ant-design/icons";
import { Button, Pagination, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import React from "react";
import { useSearchParams } from "react-router";
import SearchHistoryComponent from "../components/SearchHistoryComponent";

enum Status {
	ON = "on",
	OFF = "off",
}

export interface Device {
	id: number;
	status: Status;
	deviceName: string;
	createdDate: string;
}
export interface PagedModel<T> {
	content: T[];
	page: {
		totalElements: number;
		totalPages: number;
		number: number;
		size: number;
	};
}

const columns: ColumnsType<Device> = [
	{
		title: "#",
		key: "index",
		render(_, __, index) {
			return <span>{index + 1}</span>;
		},
	},
	{
		title: "Thiết bị",
		dataIndex: "deviceName",
		key: "device",
	},
	{
		title: "Hành động",
		dataIndex: "status",
		key: "action",
	},
	{
		title: "Ngày tạo",
		dataIndex: "createdDate",
		key: "createdDate",
		render: (createdDate) => (
			<>
				<Button
					icon={<CopyOutlined />}
					iconPosition="end"
					onClick={() => {
						navigator.clipboard.writeText(dayjs(createdDate).format("YYYY-MM-DD HH:mm:ss"));
					}}
				>
					{dayjs(createdDate).format("YYYY-MM-DD HH:mm:ss")}
				</Button>
			</>
		),
	},
];

const History = () => {
	const [urlSearchParams, setUrlSearchParams] = useSearchParams();
	const [page, setPage] = React.useState<number>(1);
	const [limit, setLimit] = React.useState<number>(10);
	const [data, setData] = React.useState<PagedModel<Device>>({
		content: [],
		page: {
			totalElements: 0,
			totalPages: 0,
			number: 0,
			size: 10,
		},
	});
	const fetchData = async () => {
		let url = `http://localhost:8080/api/v1/histories?page=${page}&limit=${limit}`;
		const dateTime = urlSearchParams.get("dateTime");
		const deviceName = urlSearchParams.get("deviceName");
		if (dateTime) url = `${url}&dateTime=${dateTime}`;
		if (deviceName) url = `${url}&deviceName=${deviceName}`;
		const res = await fetch(url);
		setData(await res.json());
	};
	React.useEffect(() => {
		fetchData();
	}, [page, limit, urlSearchParams]);
	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="p-6">
			<h1 className="text-2xl font-bold mb-2">Lịch sử hoạt động</h1>
			<p className="text-gray-600 mb-6">Bảng lịch sử on/off các thiết bị trong hệ thống.</p>
			<SearchHistoryComponent />
			<div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
				<Table columns={columns} dataSource={data.content} pagination={false} rowKey={(r) => r.id} bordered />

				<div className="mt-4 flex items-center justify-end">
					<div className="flex items-center gap-2">
						<Pagination
							showSizeChanger
							total={data.page.totalElements}
							current={page}
							pageSize={limit}
							onChange={(page, pageSize) => {
								setPage(page);
								setLimit(pageSize);
								urlSearchParams.set('page', String(page));
								urlSearchParams.set('limit', String(pageSize));
								setUrlSearchParams(urlSearchParams);
							}}
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default History;

import { Select, Space } from "antd";
import React from "react";
import { useSearchParams } from "react-router";
import SearchValueInputComponent from "./SearchValueInputComponent";

export default function SearchHistoryComponent() {
	const { Option } = Select;
	type DeviceName = "led" | "fan" | "air_conditioner" | "";
	type Sort = "createdDate-Asc" | "createdDate-Desc";
	type Status = "status-on" | "status-off" | "";
	const [deviceName, setDeviceName] = React.useState<DeviceName>("");
	const [dateTime, setDateTime] = React.useState<string>("");
	const [urlSearchParams, setUrlSearchParams] = useSearchParams(window.location.search);
	const [sort, setSort] = React.useState<Sort>("createdDate-Asc");
	const [status, setStatus] = React.useState<Status>("");

	React.useEffect(() => {
		const deviceName = urlSearchParams.get("deviceName");
		const dateTime = urlSearchParams.get("dateTime");
		if (sort) setSort(sort as Sort);
		else setSort("createdDate-Asc");
		if (deviceName) setDeviceName(deviceName as DeviceName);
		if (dateTime) setDateTime(dateTime);
		if (status) setStatus(status as Status);
	}, []);
	React.useEffect(() => {
		if (deviceName) urlSearchParams.set("deviceName", deviceName);
		else urlSearchParams.delete("deviceName");
		if (dateTime) urlSearchParams.set("dateTime", dateTime);
		else urlSearchParams.delete("dateTime");
		if (sort) urlSearchParams.set("sort", sort);
		else urlSearchParams.delete("sort");
		if (status) urlSearchParams.set("status", status);
		else urlSearchParams.delete("status");
		setUrlSearchParams(urlSearchParams);
	}, [dateTime, deviceName, sort, status]);
	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
				<Space className="flex flex-1 md:flex-none" direction="horizontal">
					<SearchValueInputComponent keyname="dateTime" />
					<Select
						defaultValue=""
						style={{ width: 160 }}
						value={deviceName}
						onChange={(value) => setDeviceName(value as DeviceName)}
					>
						<Option value="">Tất cả thiết bị</Option>
						<Option value="led">Đèn</Option>
						<Option value="fan">Quạt</Option>
						<Option value="air_conditioner">Điều hoà</Option>
					</Select>
					<Select style={{ width: 200 }} value={sort} onChange={(value) => setSort(value as Sort)}>
						<Option value="createdDate-Asc">Thời gian tăng dần</Option>
						<Option value="createdDate-Desc">Thời gian giảm dần</Option>
					</Select>
					<Select style={{ width: 160 }} value={status} onChange={(value) => setStatus(value as Status)}>
						<Option value="">Tất cả trạng thái</Option>
						<Option value="on">Trạng thái bật</Option>
						<Option value="off">Trạng thái tắt</Option>
					</Select>
				</Space>
			</div>
		</>
	);
}

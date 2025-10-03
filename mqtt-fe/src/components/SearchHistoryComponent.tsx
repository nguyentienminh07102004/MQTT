import { Select, Space } from "antd";
import React from "react";
import { useSearchParams } from "react-router";
import SearchValueInputComponent from "./SearchValueInputComponent";

export default function SearchHistoryComponent() {
	const { Option } = Select;
	type DeviceName = "led" | "fan" | "air_conditioner" | "";
	type Sort = "createdDate-Asc" | "createdDate-Desc";
	const [deviceName, setDeviceName] = React.useState<DeviceName>("");
	const [dateTime, setDateTime] = React.useState<string>("");
	const [urlSearchParams, setUrlSearchParams] = useSearchParams(window.location.search);
	const [sort, setSort] = React.useState<Sort>("createdDate-Asc");

	React.useEffect(() => {
		const deviceName = urlSearchParams.get("deviceName");
		const dateTime = urlSearchParams.get("dateTime");
		if (sort) setSort(sort as Sort);
		else setSort("createdDate-Asc");
		if (deviceName) setDeviceName(deviceName as DeviceName);
		if (dateTime) setDateTime(dateTime);
	}, []);
	React.useEffect(() => {
		if (deviceName) urlSearchParams.set("deviceName", deviceName);
		else urlSearchParams.delete("deviceName");
		if (dateTime) urlSearchParams.set("dateTime", dateTime);
		else urlSearchParams.delete("dateTime");
		if (sort) urlSearchParams.set("sort", sort);
		else urlSearchParams.delete("sort");
		setUrlSearchParams(urlSearchParams);
	}, [dateTime, deviceName, sort]);
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
					<Select defaultValue="" style={{ width: 160 }} value={sort} onChange={(value) => setSort(value as Sort)}>
						<Option value="createdDate-Asc">Thời gian tăng dần</Option>
						<Option value="createdDate-Desc">Thời gian giảm dần</Option>
					</Select>
				</Space>
			</div>
		</>
	);
}

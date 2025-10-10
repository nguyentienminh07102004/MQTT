import { Select, Space } from "antd";
import React from "react";
import { useSearchParams } from "react-router";
import SearchValueInputComponent from "./SearchValueInputComponent";

export default function SearchSensorComponent() {
	const { Option } = Select;
	type Type = "temperature" | "humidity" | "brightness" | "";
	type Sort = "createdDate-Asc" | "createdDate-Desc";
	const [sensorType, setSensorType] = React.useState<Type>("");
	const [dateTime, setDateTime] = React.useState<string>("");
	const [sort, setSort] = React.useState<Sort>("createdDate-Asc");
	const [value, setValue] = React.useState<string | null>(null);
	const [disableValue, setDisableValue] = React.useState<boolean>(false);
	const [urlSearchParams, setUrlSearchParams] = useSearchParams(window.location.search);

	React.useEffect(() => {
		const sensorType = urlSearchParams.get("sensorType");
		const dateTime = urlSearchParams.get("dateTime");
		const sort = urlSearchParams.get("sort");
		if (sort) setSort(sort as Sort);
		else setSort("createdDate-Asc");
		if (sensorType) setSensorType(sensorType as Type);
		else setSensorType("");
		if (dateTime) setDateTime(dateTime);
		if (value) setValue(value);
		setDisableValue(!sensorType);
	}, []);
	React.useEffect(() => {
		if (sensorType) urlSearchParams.set("sensorType", sensorType);
		else urlSearchParams.delete("sensorType");
		if (sort) urlSearchParams.set("sort", sort);
		else urlSearchParams.delete("sort");
		if (value && Number(value)) urlSearchParams.set("value", value);
		else urlSearchParams.delete("value");
		setUrlSearchParams(urlSearchParams);
	}, [sensorType, sort, value]);
	return (
		<>
			<div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
				<Space className="flex-1 md:flex-none" direction="horizontal">
					<SearchValueInputComponent defaultValue={dateTime} keyname="dateTime" />
					<Select
						defaultValue=""
						style={{ width: 160 }}
						value={sensorType}
						onChange={(value) => {
							setSensorType(value as Type);
							setDisableValue(!value);
						}}
					>
						<Option value="">Tất cả cảm biến</Option>
						<Option value="temperature">Nhiệt độ</Option>
						<Option value="humidity">Độ ẩm</Option>
						<Option value="brightness">Ánh sáng</Option>
					</Select>
					<SearchValueInputComponent keyname="value" disabled={disableValue} />
					<Select defaultValue="" style={{ width: 160 }} value={sort} onChange={(value) => setSort(value as Sort)}>
						<Option value="createdDate-Asc">Thời gian tăng dần</Option>
						<Option value="createdDate-Desc">Thời gian giảm dần</Option>
						<Option value="temperature-Asc">Nhiệt độ tăng dần</Option>
						<Option value="temperature-Desc">Nhiệt độ giảm dần</Option>
						<Option value="humidity-Asc">Độ ẩm tăng dần</Option>
						<Option value="humidity-Desc">Độ ẩm giảm dần</Option>
						<Option value="brightness-Asc">Ánh sáng tăng dần</Option>
						<Option value="brightness-Desc">Ánh sáng giảm dần</Option>
					</Select>
				</Space>
			</div>
		</>
	);
}

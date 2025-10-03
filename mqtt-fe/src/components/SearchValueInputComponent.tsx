import { Input } from "antd";
import { useSearchParams } from "react-router";

export default function SearchValueInputComponent({
	keyname,
	disabled = false,
	defaultValue,
}: {
	keyname: string;
	disabled?: boolean;
	defaultValue?: string;
}) {
	const [urlSearchParams, setUrlSearchParams] = useSearchParams(window.location.search);
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && keyname) {
			const query = e.currentTarget.value;
			urlSearchParams.set(keyname, query);
			setUrlSearchParams(urlSearchParams);
		}
	};
	return (
		<>
			<Input
				defaultValue={defaultValue}
				disabled={disabled}
				placeholder={`Tìm kiếm theo ${keyname}...`}
				className="flex-1"
				onKeyDown={handleKeyDown}
			/>
		</>
	);
}

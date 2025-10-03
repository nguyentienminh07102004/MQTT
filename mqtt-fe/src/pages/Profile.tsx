import { ApiOutlined, FilePdfOutlined, GithubOutlined } from "@ant-design/icons";
import { Button, Card, Image } from "antd";

const Profile = () => {
	return (
		<Card className="w-full h-full flex justify-center items-center">
			<div className="w-full flex justify-between items-center">
				<div className="flex flex-col items-center p-4">
					<div className="w-28 h-28 bg-gray-300 rounded-full mb-4 overflow-hidden">
						<Image src="/avatar.jpg" />
					</div>
					<h2 className="text-xl font-bold">Nguyễn Tiến Minh</h2>
					<p className="text-gray-500">B22DCCN539</p>
					<p className="text-gray-500">MinhNT.B22CN539.stu.ptit.edu.vn</p>
					<p className="text-gray-500">0904756287</p>
					<p className="text-gray-500">Hà Nội, Việt Nam</p>
					<div className="flex justify-center gap-4">
						<Button
							type="primary"
							className="mt-4"
							href="https://github.com/nguyentienminh07102004"
							target="_blank"
							rel="noopener noreferrer"
							icon={<GithubOutlined />}
						>
							GitHub Profile
						</Button>
						<Button
							color="danger"
							type="default"
							className="mt-4"
							href="https://github.com/nguyentienminh07102004"
							target="_blank"
							rel="noopener noreferrer"
							icon={<FilePdfOutlined />}
						>
							Document Pdf
						</Button>
						<Button
							type="primary"
							className="mt-4"
							href="http://localhost:8080/swagger-ui/index.html"
							target="_blank"
							rel="noopener noreferrer"
							icon={<ApiOutlined />}
						>
							Api Document
						</Button>
					</div>
				</div>
				<main className="flex-1 p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h2 className="text-lg font-bold mb-2">Thông tin học tập</h2>
							<p className="text-gray-600">Ngành học: Khoa học máy tính</p>
							<p className="text-gray-600">Năm học: Năm 3</p>
							<p className="text-gray-600">GPA: 3.75</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h2 className="text-lg font-bold mb-2">Dự án IoT Dashboard</h2>
							<p className="text-gray-600">
								Hệ thống giám sát và điều khiển thiết bị IoT realtime với giao diện web hiện đại.
							</p>
							<p className="text-gray-600">Công nghệ sử dụng: React, TypeScript, Tailwind CSS</p>
						</div>
					</div>
				</main>
			</div>
		</Card>
	);
};

export default Profile;

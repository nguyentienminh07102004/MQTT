
import { ExperimentOutlined, HistoryOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', icon: <HomeOutlined /> },
  { to: '/profile', label: 'Profile', icon: <UserOutlined /> },
  { to: '/sensors', label: 'Sensors', icon: <ExperimentOutlined /> },
  { to: '/history', label: 'Action History', icon: <HistoryOutlined /> },
];

const NavBar = () => {
  return (
    <nav className="bg-white border-r border-gray-200 w-64 h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-500">IoT Dashboard</h1>
        <p className="text-sm text-gray-500">Realtime device & sensor monitor</p>
      </div>

      <ul className="flex-1 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ' +
                (isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100')
                }
              >
              {l.icon}
              <span>{l.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <button className="w-full px-4 py-2 bg-gray-800 text-white rounded">Settings</button>
      </div>
    </nav>
  );
};

export default NavBar;

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'

createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#6b7fd0',
        borderRadius: 12,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>,
)

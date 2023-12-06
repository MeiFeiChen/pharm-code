import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import {
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import { Navigate, useNavigate } from 'react-router-dom'
import Dashboard from '../components/AdminComponents/Dashboard'
import User from '../components/AdminComponents/User'
import Submission from '../components/AdminComponents/Submission'
import Discussion from '../components/AdminComponents/Discussion'
import ProblemList from '../components/AdminComponents/ProblemList'
import CreateProblem from '../components/AdminComponents/CreateProblem'


const { Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Dashboard', 'Dashboard', <PieChartOutlined />),
  getItem('General', 'General', <UserOutlined />, [
    getItem('User', 'User'),
    getItem('Submission', 'Submission'),
    getItem('Discussion', 'Discussion'),
  ]),
  getItem('Problem', 'Problem', <FileOutlined />, [
    getItem('ProblemList', 'Problem List'), 
    getItem('Create Problem', 'Create Problem')
  ])
];
function Admin() {
  const [collapsed, setCollapsed] = useState(false)
  const { token: { colorBgContainer } } = theme.useToken()
  const [ breadcrumb, setBreadcrumb ] = useState([null, null])
  const navigate = useNavigate()

  const handleMenuItemClick = ({ keyPath }) => {
    setBreadcrumb(keyPath.reverse())
    navigate(`/admin/${keyPath[0].toLowerCase()}${keyPath[1]? '/'+ keyPath[1].toLowerCase().replace(/\s/g, ''):''}`)
  }

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['Dashboard']} mode="inline" items={items} onClick={handleMenuItemClick}/>
      </Sider>
      <Layout>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>{breadcrumb[0]}</Breadcrumb.Item>
            <Breadcrumb.Item>{breadcrumb[1]}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
            className='rounded-lg'
          >
            <Routes>
              <Route path='dashboard' element={<Dashboard />}/>
              <Route path='general/user' element={<User />}/>
              <Route path='general/submission' element={<Submission />}/>
              <Route path='general/discussion' element={<Discussion />}/>
              <Route path='problem/problemlist' element={<ProblemList />}/>
              <Route path='general/createproblem' element={<CreateProblem />}/>
            </Routes>
            
            Bill is a cat.
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
        </Footer>
      </Layout>
    </Layout>
  )
}
export default Admin
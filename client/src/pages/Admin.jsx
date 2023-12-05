import { useState } from 'react';
import {
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

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
  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('General', '2', <UserOutlined />, [
    getItem('User', '3'),
    getItem('Submission', '4'),
    getItem('Discussion', '5'),
  ]),
  getItem('Problem', 'sub2', <FileOutlined />, [
    getItem('Problem List', '6'), 
    getItem('Create Problem', '8')
  ])
];
function Admin() {
  const [collapsed, setCollapsed] = useState(false)
  const { token: { colorBgContainer } } = theme.useToken()
  const [sidebar, setSideBar ] = useState([])
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
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
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>null</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
            className='rounded-lg'
          >
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
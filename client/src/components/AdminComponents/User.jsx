import { useEffect, useState } from "react"
import { apiAdminGetUsers } from "../../api"
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import { Card, Table } from 'antd';


Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

function User() {
  const [users, setUsers] = useState([]);
  
  const currentDate = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
     },
      title: {
        display: true,
        text: 'Daily User Registration',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
              quarter: 'MMM YYYY'
          }
        },
        max: currentDate,
        min: sevenDaysAgo,
        title: {
          display: true,
          text: 'Date'
        },
      },
      y: {
        type: 'linear', // Set the type to 'linear' for integer values
        min: 0,
        ticks: {
          stepSize: 1, // Set the step size to 1 for integers
          beginAtZero: true, // Start the y-axis from 0
          precision: 0, // Display integers only
        },
        title: {
          display: true,
          text: 'Number of Users',
        },
      },
    },
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      width: 150,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiAdminGetUsers();
        setUsers(data.data);
      } catch (err) {
        console.error('Error fetching user data', err);
        setUsers([]);
      }
    };

    fetchData();
  }, [])

  // Preprocess data to accumulate y values for the same date
  const processedData = users.reduce((acc, user) => {
    const date = user.created_at.split('T')[0]; // Extracting date part
    const existingData = acc.find(item => item.x === date);

    if (existingData) {
      existingData.y += 1; // Accumulate y value
    } else {
      acc.push({ x: date, y: 1 });
    }

    return acc;
  }, [])

  const startDate = new Date(sevenDaysAgo);
  const endDate = new Date(currentDate);

  for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const existingData = processedData.find(item => item.x === dateStr)

    if (!existingData) {
      processedData.push({ x: dateStr, y: 0 });
    }
  }

  // 按日期排序
  const sortedData = processedData.sort((a, b) => new Date(a.x) - new Date(b.x))
  

  const chartData = {
    datasets: [
      {
        label: 'User number data',
        data: sortedData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return (
    <>
    <div className="flex items-center justify-between w-80%">
      <div className="w-1/2">
        <Card className="max-w-sm m-4">
          <div className="text-lg font-medium">Total users:</div>
          <div className="text-8xl text-center">{users.length}</div>
        </Card>
      </div>
      <div className="w-1/2">
          <Line options={options} data={chartData} className="w-full h-full"/>
      </div>
    </div>
    <Table 
      columns={columns} 
      dataSource={users} 
      pagination={{
        position: ['topCenter'],
      }}
    />

    </>

  )
}



export default User;

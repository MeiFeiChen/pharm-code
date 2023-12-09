import { useEffect, useState } from "react"
import { apiAdminGetSubmissions } from "../../api"
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import { Card, Table, Tag } from 'antd'
import { COMPILE_LANGUAGE, STATUS_COLOR } from "../../constant"
import { formatTimestamp } from '../../dateconfig'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ArcElement
)

function Submission() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiAdminGetSubmissions();
        setSubmissions(data.data);
      } catch (err) {
        console.error('Error fetching user data', err);
        setSubmissions([])
      }
    }
    fetchData()
  }, [])

  // count days
  const currentDate = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(currentDate.getDate() - 7)

  // doughnutData
  const statusCounts = {
    'pending': 0,
    'AC': 0,
    'WA': 0,
    'TLE': 0,
    'RE': 0,
  };
  
  submissions.forEach(item => {
    const status = item.status;
    if (Object.prototype.hasOwnProperty.call(statusCounts, status)) {
      statusCounts[status]++;
    }
  });
  
  const countArray = Object.values(statusCounts)

  const doughnutData = {
    labels: ['pending', 'AC', 'WA', 'TLE', 'RE'],
    datasets: [
      {
        label: 'status',
        data: countArray,
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxWidth: 12
        }
      }
    }
  }

  // line chart
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
     },
      title: {
        display: true,
        text: 'Daily User Submission',
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
        type: 'linear', 
        min: 0,
        ticks: {
          beginAtZero: true, 
          precision: 0, 
        },
        title: {
          display: true,
          text: 'Number of Users',
        },
      },
    },
  }

  // Preprocess data to accumulate y values for the same date
  const processedData = submissions.reduce((acc, user) => {
    const date = user.submitted_at.split('T')[0]; // Extracting date part
    const existingData = acc.find(item => item.x === date);

    if (existingData) {
      existingData.y += 1; // Accumulate y value
    } else {
      acc.push({ x: date, y: 1 });
    }

    return acc;
  }, [])

  const chartData = {
    datasets: [
      {
      label: 'User number data',
        data: processedData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
  // table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Problem Title',
      dataIndex: 'problem_title',
      key: 'problem_title',
      width: 200,
    },
    {
      title: 'User Name',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 150,
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      width: 80,
      render: (_, { language }) => (<Tag color={'geekblue'} key={language}>{COMPILE_LANGUAGE[language]}</Tag>)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (_, { status }) => (<Tag color={STATUS_COLOR[status]} key={status}>{status}</Tag>)
    },
    {
      title: 'Submitted at',
      dataIndex: 'submitted_at',
      key: 'submitted_at',
    },
  ]
  const tableData = submissions.map((item, index) => ({
    key: (index + 1).toString(),
    id: item.id,
    problem_title: item.problem_title,
    user_name: item.user_name,
    language: item.language,
    status: item.status,
    submitted_at: formatTimestamp(item.submitted_at)
  }))

  return (
    <>
    <div className="flex items-center justify-between w-80%">
      <div className="w-1/3">
        <Card className="max-w-sm m-4">
          <div className="text-lg font-medium">Total submissions:</div>
          <div className="sm:text-2xl md:text-4xl lg:text-8xl text-center">{submissions.length}</div>
        </Card>
      </div>
      <div className="w-1/3">
          <Line options={lineChartOptions} data={chartData} className="w-full"/>
      </div>
      <div className="w-1/3">
        <Doughnut data={doughnutData} options={doughnutOptions} className="w-full"/>
      </div>
    </div>
    <Table 
      columns={columns} 
      dataSource={tableData} 
      pagination={{
        position: ['topCenter'],
      }}
    />

    </>

  )
}


export default Submission
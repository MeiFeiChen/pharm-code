import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Tag
} from 'antd';
import { apiAdminGetProblemList, apiAdminUpdateProblem } from '../../api';
import { DIFFICULTY_COLOR } from '../../constant';
import { formatTimestamp } from '../../dateconfig'
import { Zoom, toast } from "react-toastify"

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}



function ProblemList() {
  const [ problemList, setProblemList ] = useState([])
  const [ editModeId, setEditModeId] = useState(null)

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: ( _, { difficulty }) => (<Tag color={DIFFICULTY_COLOR[difficulty]} key={difficulty}>{difficulty}</Tag>)
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: ( _, { type }) => (type? <Tag color={'geekblue'} key={type}>{type}</Tag>: '')
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: ( _, {id}) => (<Button onClick={()=> setEditModeId(id)} className='hover:text-blue-400'>Edit</Button>)
    },
  ]

  const fetchData = async() => {
    try {
      const { data } = await apiAdminGetProblemList()
      setProblemList(data.data)
    } catch (error) {
      console.error('Error fetching ProblemList data', error)
      setProblemList([])
    } 
  }

  useEffect(() => {
    
    fetchData()
  }, [])
  
  const data = problemList.map((item, index) => ({
    key: index,
    id: item.id,
    title: item.title,
    difficulty: item.difficulty,
    type: item.database? 'database': '',
    created_at: formatTimestamp(item.created_at),
    description: <FormPanel problem={item} editModeId={editModeId} setEditModeId={setEditModeId} fetchData={fetchData}/>, 
  }));

  return (
    <>
    <Table
      columns={columns}
      expandable={{
      expandedRowRender: (record) => (
        <div>
          {record.description}
        </div>
      ),
      rowExpandable: (record) => record.name !== 'Not Expandable',
    }}
    dataSource={data}
    />
    {/* <FormPanel /> */}
    </>
  ) 
}

FormPanel.propTypes = {
  problem: PropTypes.object,
  editModeId: PropTypes.string,
  setEditModeId: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired
}

function FormPanel({ problem, editModeId, setEditModeId, fetchData}) {
  const [form] = Form.useForm()
  
  const onFinish = async (values) => {
    try {
      const { data } = await apiAdminUpdateProblem({problem: values})
      console.log(data)
      fetchData()
      toast.success(`Successfully update problem ${problem.id}`, {  
        autoClose: 1000, 
        theme: "dark",
        hideProgressBar: true,
        closeOnClick: true, 
        draggable: true,
        transition: Zoom
      })  
    } catch (error) {
      console.error('error update problem')
      toast.error(`fail to update problem ${problem.id}, ${error.message}`, {  
        autoClose: 1000, 
        theme: "dark",
        hideProgressBar: true,
        closeOnClick: true, 
        draggable: true,
        transition: Zoom
      })  
    } finally {
      setEditModeId(null)
    }
    

  }
  
  return (
    <div className='w-full'>
    { problem && (
       <Form
        {...formItemLayout}
        form={form}
        name="updated"
        onFinish={onFinish}
        initialValues={{
          id: problem.id,
          title: problem.title,
          difficulty: problem.difficulty,
          problem_statement: problem.problem_statement,
          input: problem.input,
          output: problem.output,
          memory_limit: problem.memory_limit,
          time_limit: problem.time_limit,
          io_mode: problem.io_mode,
          database: problem.database
       }}
       style={{
         maxWidth: 800,
       }}
       scrollToFirstError
     >
       <Form.Item
         name="id"
         label="ID"
         rules={[
           {
             required: true,
             message: 'Please input title',
           },
         ]}
       >
         <Input disabled/>
       </Form.Item>
       <Form.Item
         name="title"
         label="Title"
         rules={[
           {
             required: true,
             message: 'Please input title',
           },
         ]}
       >
         <Input disabled={editModeId !== problem.id}/>
       </Form.Item>
       <Form.Item
         name="difficulty"
         label="Difficulty"
         rules={[
           {
             required: true,
             message: 'Please select difficulty',
           },
         ]}
       >
         <Select placeholder="select difficulty" disabled={editModeId !== problem.id}>
           <Option value="easy">easy</Option>
           <Option value="medium">medium</Option>
           <Option value="hard">hard</Option>
         </Select>
       </Form.Item>

       <Form.Item
         name="problem_statement"
         label="Problem statement"
         rules={[
           {
             required: true,
             message: 'Please input Intro',
           },
         ]}
       >
         <Input.TextArea showCount maxLength={500} rows={5} disabled={editModeId !== problem.id} />
       </Form.Item>
       <Form.Item
         name="input"
         label="Input"
         rules={[
           {
             required: true,
             message: 'Please input the description of input',
           },
         ]}
       >
         <Input disabled={editModeId !== problem.id}/>
       </Form.Item>
       <Form.Item
         name="output"
         label="Output"
         rules={[
           {
             required: true,
             message: 'Please input the description of output',
           },
         ]}
       >
         <Input disabled={editModeId !== problem.id}/>
       </Form.Item>

       <Form.Item
         name="memory_limit"
         label="Memory limit"
         rules={[
           {
             required: true,
             message: 'Please input the memory limit',
           },
         ]}
       >
         <InputNumber
           style={{
             width: '100%',
           }}
           disabled={editModeId !== problem.id}
         />
       </Form.Item>

       <Form.Item
         name="time_limit"
         label="Time limit"
         rules={[
           {
             required: true,
             message: 'Please input the time limit',
           },
         ]}
       >
         <InputNumber
           style={{
             width: '100%',
           }}
           disabled={editModeId !== problem.id}
         />
       </Form.Item>

       <Form.Item
         name="io_mode"
         label="IO mode"
         rules={[
           {
             required: true,
             message: 'Please input the IO mode',
           },
         ]}
       >
          <Select placeholder="select difficulty" disabled={editModeId !== problem.id}>
           <Option value="stdin/stdout">stdin/stdout</Option>
          </Select>
       </Form.Item>
 
      <Form.Item 
        name="database" 
        label="Is database?" 
        valuePropName="checked"
        tooltip="Is this a database problem?"
      >
         <Checkbox style={{ lineHeight: '32px' }} disabled={editModeId !== problem.id}>
           Database
         </Checkbox>
      </Form.Item>
 
      <Form.Item {...tailFormItemLayout}>
         <Button 
            type="primary" 
            htmlType="submit" 
            className='bg-[#0066cc]'
            disabled={editModeId !== problem.id}>
           Update
         </Button>
       </Form.Item>
       <div className='text-right text-zinc-400'>Last updated at: {formatTimestamp(problem.updated_at)}</div>
      </Form>
    )}
    </div>
  )
}

export default ProblemList;
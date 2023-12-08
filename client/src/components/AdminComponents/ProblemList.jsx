import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Select,
  Tag
} from 'antd';
import { apiAdminGetProblemList } from '../../api';
import { DIFFICULTY_COLOR } from '../../constant';

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
};
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
};

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
    title: 'Action',
    dataIndex: '',
    key: 'x',
    render: () => <a>Delete</a>,
  },
];

function ProblemList() {
  const [ problemList, setProblemList ] = useState([])

  useEffect(() => {
    const fetchData = async() => {
      try {
        const { data } = await apiAdminGetProblemList()
        setProblemList(data.data)
      } catch (error) {
        console.error('Error fetching ProblemList data', error)
        setProblemList([])
      } 
    }
    fetchData()
  }, [])
  console.log(problemList)
  const data = problemList.map((item, index) => ({
    key: index,
    id: item.id,
    title: item.title,
    difficulty: item.difficulty,
    type: item.database? 'database': '',
    description: <FormPanel problem={item}/>, // You can replace this with the actual description
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
}

function FormPanel({ problem }) {
  const [form] = Form.useForm()
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  }
  console.log(problem?.title)
  
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
         <Input/>
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
         <Select placeholder="select difficulty">
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
         <Input.TextArea showCount maxLength={500} rows={5}/>
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
         <Input/>
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
         <Input/>
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
          <Select placeholder="select difficulty">
           <Option value="stdin/stdout">stdin/stdout</Option>
          </Select>
       </Form.Item>
 
      <Form.Item name="database" label="Is database?" valuePropName="checked">
         <Checkbox style={{ lineHeight: '32px' }}>
           Database
         </Checkbox>
      </Form.Item>
 
      <Form.Item {...tailFormItemLayout}>
         <Button type="primary" htmlType="submit">
           Register
         </Button>
       </Form.Item>
      </Form>
    )}
   
    </div>
  )
}

export default ProblemList;
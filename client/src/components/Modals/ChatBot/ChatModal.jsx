import { Component, useState } from 'react'
import PropTypes from 'prop-types'
import ChatBot, { Loading } from 'react-simple-chatbot'
import { apiAssistanceItem } from '../../../api'
import MDEditor from '@uiw/react-md-editor'
// import { DeepChat } from "deep-chat-react"




class DBPedia extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      result: '',
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  async componentDidMount() {
    const self = this;
    const { steps } = this.props;

    console.log('search', steps)
    let requestBody
    if (steps.questionType.value === 'solution') {
      requestBody = { language: steps.language.value, problemId: steps.problemId.value, code: null }
    } else {
      requestBody = { language: steps.language.value, problemId: steps.problemId.value, code: steps.code.value }
    }
    
    console.log(requestBody)
    try {
      const { data } = await apiAssistanceItem(requestBody)
      console.log(data)
      const result = `題目${data.title}: ${data.content}`
      self.setState({ loading: false, result })
    } catch (error) {
      self.setState({ loading: false, result: `Error in fetching data owing to ${error.message}` });
    }
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="dbpedia w-full">
        { loading ? <Loading /> :  <div className='w-full'><MDEditor.Markdown source={result} className="w-full bg-transparent" /></div> }
        {
          !loading &&
          <div
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            {
              !trigger &&
              <button
                onClick={() => this.triggetNext()}
              >
                Ask Again
              </button>
            }
          </div>
        }
      </div>
    );
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

DBPedia.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

function  ChatModal() {
  const [open, setOpen] = useState(true);
  const onChange = (checked) => {
    setOpen(checked);
  }
  const initialMessages = [
    { role: "user", text: "Hey, how are you today?" },
    { role: "ai", text: "I am doing very well!" }
  ]

  return (
    <>
  {/* <DeepChat
      demo={true}
      style={{ borderRadius: "10px" }}
      textInput={{ placeholder: { text: "Welcome to the demo!" } }}
      initialMessages={initialMessages}
    />
       */}
   
    
    
  <ChatBot
  steps={[
    {
      id: '1',
      message: 'Which language do you want to learn?',
      trigger: 'language',
    },
    {
      id: 'language',
      options: [
        { value: 'Python 3', label: 'Python 3', trigger: '3' },
        { value: 'Javascript', label: 'Javascript', trigger: '3' }
      ],
    },
    {
      id: '3',
      message: 'Which problem do you want to ask? Please give me problem ID',
      trigger: 'problemId',
    },
    {
      id: 'problemId',
      user: true,
      trigger: '4',
    },
    {
      id: '4',
      message: 'What kind of question would you like to ask?',
      trigger: 'questionType',
    },
    {
      id: 'questionType',
      options: [
        { value: 'solution', label: 'Solution', trigger: '6' },
        { value: 'codeReview', label: 'Code Review', trigger: '5' }
      ],
    },
    {
      id: '5',
      message: 'Please show me your code',
      trigger: 'code',
    },
    {
      id: 'code',
      user: true,
      trigger: '6',
    },
    {
      id: '6',
      component: <DBPedia />,
      waitAction: true,
      trigger: '1',
    },
  ]}
  />
  </>
)}

export default ChatModal;
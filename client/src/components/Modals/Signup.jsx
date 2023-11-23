import { useSetRecoilState } from "recoil"
import { authModalState } from "../../atoms/authModalAtom"
import { ErrorMessage, Form, Formik, useField } from 'formik'
import * as yup from 'yup'
import { apiUserSignUp } from "../../api"

const validate = yup.object({
  name: yup.string().required('欄位不得為空'),
  email: yup.string().email('Email 格式錯誤').required('欄位不得為空'), 
  password: yup.string().min(6, '長度不可小於6').required('欄位不得為空')
})



function Signup() {
  const setAuthModalState = useSetRecoilState(authModalState)
  const handleClick = (type) => {
    setAuthModalState((prev) => ({ ...prev, type }))
  }
  const submitHandler = async (payload) => {
    try {
      const response = await apiUserSignUp(payload)
    } catch (error) {
  
    }
  
  }
  return (
    <Formik
      initialValues={{
        provider: 'native',
        name: '',
        email: '',
        password: ''
      }}
      validationSchema={validate}
      onSubmit={submitHandler}

    >
    <Form className='space-y-6 px-6 py-4'>
      <h3 className='text-xl font-medium text-white'>Register to PharmCode</h3>
      <div> 
        <label  htmlFor='name' className='text-sm font-medium block mb-2 text-gray-300'>
          Name
        </label>
        <InputField 
          type='name' 
          name='name' 
          id='name' 
          className='
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block
            w-full p-2.5 bg-gray-600 border-gray-600 placeholder:-gray-400 text-white'
          placeholder='王小明'/>
      </div>
      <div> 
        <label  htmlFor='email' className='text-sm font-medium block mb-2 text-gray-300'>
          Email
        </label>
        <InputField 
          type='email' 
          name='email' 
          id='email' 
          className='
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block
            w-full p-2.5 bg-gray-600 border-gray-600 placeholder:-gray-400 text-white'
          placeholder='xxx@example.com'/>
      </div>
      <div> 
        <label  htmlFor='password' className='text-sm font-medium block mb-2 text-gray-300'>
          Password
        </label>
        <InputField 
          type='password' 
          name='password' 
          id='password' 
          className='
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block
          w-full p-2.5 bg-gray-600 border-gray-600 placeholder:-gray-400 text-white'
          placeholder='******(at least 6 digits.)'/>
      </div>
      
			<button
				type='submit'
				className='w-full text-white focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s
            '
			>
				Register
			</button>
	
			<div className='text-sm font-medium text-gray-300'>
				Already have an account?{" "}
				<a href='#' className='text-blue-700 hover:underline' onClick={() => handleClick("login")}>
					Log In
				</a>
			</div>


    </Form>
    </Formik>
  )
}

function InputField({...props}) {
  const [field, meta] = useField(props)
  return (
    <>
      <input {...props} {...field}/>
      <div className='h-[8px]'>
        <ErrorMessage component='small' className='text-red-300' name={field.name}/>
      </div>
    </>
  )
}


export default Signup
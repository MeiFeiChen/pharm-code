import { useSetRecoilState } from "recoil"
import { authModalState } from "../../../atoms/authModalAtom"
import { ErrorMessage, Form, Formik, useField } from 'formik'
import * as yup from 'yup'
import { apiUserSignIn } from "../../../api"
import { Zoom, ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { setAuthToken } from "../../../utils"
import { useContext } from "react"
import { AuthContext } from "../../../context"




const validate = yup.object({
  email: yup.string().email('Invalid email format').required('Field cannot be empty'), 
  password: yup.string().min(6, 'Length cannot be less than 6').required('Field cannot be empty')
})


function Login() {
  const { setIsLogin, setUserProfile } = useContext(AuthContext)
  const setAuthModalState = useSetRecoilState(authModalState)


  // change page to register or forget password
  const handleClick = (type) => {
    setAuthModalState((prev) => ({ ...prev, type }))
  }

  const submitHandler = async (payload) => {
    try {
      const { data } = await apiUserSignIn(payload)
      // 跳轉頁面(關閉視窗和換Navbar的內容？)
      setAuthToken(data.data.access_token) // 存jwt至local storage
      setUserProfile(data.data.user)
      setIsLogin(true)
      setAuthModalState((prev) => ({...prev, isOpen: false}))
    } catch (error) {
      setAuthToken(null)
      console.error(error)
      toast.error(error.response.data.errors, { position: "top-center", autoClose: 500, theme: "dark" })  
    }
  }
  return (
    <>
    <Formik
      initialValues={{
        provider: 'native',
        email: '',
        password: ''
      }}
      validationSchema={validate}
      onSubmit={submitHandler}
    >
    <Form className='space-y-6 px-6 py-4'>
      <h3 className='text-xl font-medium text-white'>Sign in to PharmCode</h3>
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
          placeholder='******'/>
      </div>
      
			<button
				type='submit'
				className='w-full text-white focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s
            '
			>
				Log In
			</button>
      
			<button className='flex w-full justify-end' onClick={() => handleClick("forgotPassword")}>
				<a href='#' className='text-sm block text-brand-orange hover:underline w-full text-right'>
					Forgot Password?
				</a>
			</button>
      <ToastContainer
        transition={Zoom}
        position="top-center"
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="dark"
      />
			<div className='text-sm font-medium text-gray-300'>
				Not Registered?{" "}
				<a href='#' className='text-blue-700 hover:underline' onClick={() => handleClick("register")}>
					Create account
				</a>
			</div>
    </Form>
    </Formik>
    </>

  )
}

function InputField({...props}) {
  const [field, meta] = useField(props)
  return (
    <>
      <input {...props} {...field}/>
      <div className='h-[5px]'>
        <ErrorMessage component='small' className='text-red-300' name={field.name}/>
      </div>
    </>
  )
}

export default Login
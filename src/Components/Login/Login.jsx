import { useState } from 'react'
// import style from './Login.module.css'
import {useFormik} from 'formik'
import * as  Yup from 'yup' 
import axios from 'axios'
import {  Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { MagnifyingGlass } from 'react-loader-spinner'


export default function Login() {
  let Navigate =useNavigate();
  let [error,setError] = useState(null)
  let [isLoading , setisLoading]  = useState(false)

  async function submet(values){
    console.log(values);
    setisLoading(true);
    let {data}  = await axios.
    post(`https:note-sigma-black.vercel.app/api/v1/users/signIn`,values)
   .catch((err)=>{
    setError(err.response.data.msg)
    setisLoading(false)
    // console.log(err);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error,
    });

  })

  
   if(data.msg === 'done'){
    Swal.fire({
      icon: 'success',
      title: 'Congratulations',
      text: 'you are Loggrd in Suceessfully',
    })
    localStorage.setItem('userNoteToken',data.token);
    setisLoading(false)
    Navigate('/')
  }  
  }

  let validateSchema = Yup.object({
    email:Yup.string().email('is invalid name').required( 'email is required'),
    password:Yup.string().matches(/^[A-z][a-z0-9]{5,10}$/, 'password is invalid start with upper case and min is 5 char').required('password is required'),

  })

  
  const formik = useFormik({
    initialValues:{
      
      email:'',
      password:'',
      
    },
    validationSchema:validateSchema,
    onSubmit:submet,
    
  })

  return <>
    <div className='w-75 mx-auto py-5'>
      {error ? <div className='alert alert-danger'>{error}</div>:""}
      <h3>Login Now</h3>
      <form onSubmit={formik.handleSubmit}>
      
      <label htmlFor="email" >E-mail</label>
      <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} className='form-control mb-2' type="email"  name='email' id='email'/>
      {formik.errors.email && formik.touched.email? <div className='alert alert-danger mt-2 p-2'>{formik.errors.email}</div>:""}
      
      <label htmlFor="password" >Password</label>
      <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} className='form-control mb-2' type="password"  name='password' id='password'/>
      {formik.errors.password && formik.touched.password? <div className='alert alert-danger mt-2 p-2'>{formik.errors.password}</div>:""}
      
      
     {!isLoading?      
     <button disabled={!(formik.isValid && formik.dirty)} type='submit' className='btn btn-success text-white mt-2'> Login  </button>
      :<button  type='button' className='btn btn-success text-white mt-2'>  
            <MagnifyingGlass
            visible={true}
            height="20"
            width="40"
            ariaLabel="MagnifyingGlass-loading"
            wrapperStyle={{}}
            wrapperClass="MagnifyingGlass-wrapper"
            glassColor = '#c0efff'
            color = '#e15b64'
          />
       </button>}
       <Link  to='/noteApp/register'  className='btn btn-danger mx-4 text-white mt-2'> Register  </Link>
    </form>
    </div>
    
  </>
}

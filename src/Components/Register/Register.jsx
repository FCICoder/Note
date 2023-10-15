import { useState } from 'react'
// import style from './Register.module.css'
import {useFormik} from 'formik'
import * as  Yup from 'yup' 
import axios from 'axios'
import {  Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { MagnifyingGlass } from 'react-loader-spinner'


export default function Register() {
  // let { setUserToken , setUserData } = useContext(userContext)
  let Navigate =useNavigate();
  let [error,setError] = useState(null)
  let [isLoading , setisLoading]  = useState(false)

  async function submetRegister(values){
    console.log(values);
    setisLoading(true);
    let {data}  = await axios.
    post(`https:note-sigma-black.vercel.app/api/v1/users/signUp`,values)
   .catch((err)=>{
    setError(err.response.data.msg)
    setisLoading(false)
    
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
      text: 'you are Registered Suceessfully',
    })
    setisLoading(false)
    Navigate('/noteApp/login')
  }  
  }

  let phoneRegex= /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  let validateSchema = Yup.object({
    name:Yup.string().min(3 , 'name min length is 3').max(10 , 'name max length is 10 ').required('name is required'),
    email:Yup.string().email('is invalid name').required( 'email is required'),
    password:Yup.string().matches(/^[A-z][a-z0-9]{5,10}$/, 'password is invalid start with upper case and min is 5 char').required('password is required'),
    phone:Yup.string().matches(phoneRegex,'phone number is in valid').required('phone is required').matches(/^01[0125][0-9]{8}$/gm,'not valid phone number'),
    age:Yup.number().required("age is required").min(18,'min age is 18 years').max(60,'max age is 60 years')
  })

  
  const formik = useFormik({
    initialValues:{
      name:'',
      email:'',
      password:'',
      age:'',
      phone:'',
    },
    validationSchema:validateSchema,
    onSubmit:submetRegister,
    
  })

  return <>
    <div className='w-75 mx-auto py-5'>
      {error ? <div className='alert alert-danger'>{error}</div>:""}
      <h3>Register Now</h3>
      <form onSubmit={formik.handleSubmit}>
      <label htmlFor="name" >Name</label>
      <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.name} className='form-control mb-2' type="text"  name='name' id='name'/>
      {formik.errors.name && formik.touched.name? <div className='alert alert-danger mt-2 p-2'>{formik.errors.name}</div>:""}

      <label htmlFor="email" >E-mail</label>
      <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} className='form-control mb-2' type="email"  name='email' id='email'/>
      {formik.errors.email && formik.touched.email? <div className='alert alert-danger mt-2 p-2'>{formik.errors.email}</div>:""}
      
      <label htmlFor="password" >Password</label>
      <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} className='form-control mb-2' type="password"  name='password' id='password'/>
      {formik.errors.password && formik.touched.password? <div className='alert alert-danger mt-2 p-2'>{formik.errors.password}</div>:""}
      
      <label htmlFor="age" >age</label>
      <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.age} className='form-control mb-2' type="number"  name='age' id='age'/>
      {formik.errors.age && formik.touched.age? <div className='alert alert-danger mt-2 p-2'>{formik.errors.age}</div>:""}

      <label htmlFor="age" >Phone</label>
      <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.phone} className='form-control mb-2' type="tel"  name='phone' id='phone'/>
      {formik.errors.phone && formik.touched.phone? <div className='alert alert-danger mt-2 p-2'>{formik.errors.phone}</div>:""}
            
   
     {!isLoading?      
     <button disabled={!(formik.isValid && formik.dirty)} type='submit' className='btn btn-success text-white mt-2'> Register  </button>
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
       <Link  to='/noteApp/login'  className='btn btn-danger mx-4 text-white mt-2'> Login  </Link>
    </form>
    </div>
    
  </>
}

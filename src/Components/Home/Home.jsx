import axios from "axios"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { ColorRing, MagnifyingGlass } from "react-loader-spinner"
import Swal from "sweetalert2"
import * as Yup from 'yup'
import Note from "../Note/Note"
import { useNavigate } from "react-router-dom"
// import style from './Home.module.css'
export default function Home() {
  let navigate = useNavigate()
  let [notes , setNotes] =useState([])  
  let [error,setError] = useState(null)
  let [isLoading , setisLoading]  = useState(false)

  let validateSchema = Yup.object({
    title:Yup.string().required( 'title is required').max(10, 'max length is 10 ').min(3, 'min length is 3'),
    content:Yup.string().required('content is required').min(5, 'min length is 5').max(20, 'max length is 20'),

  })

  async function addNote(values){
    setisLoading(true);
    let {data} = await axios.post(`https:note-sigma-black.vercel.app/api/v1/notes`,values,{headers:{
      token:`3b8ny__${localStorage.getItem('userNoteToken')}`
    }})
    .catch((err)=>{
      setError(err.response.data.msg)
      setisLoading(false);
      // console.log(err.response.data.msg);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
      });
    })
    
    getMyNotes();
    if(data?.msg === 'done'){

      setisLoading(false);
      Swal.fire({
        icon: 'success',
        title: ' Note Added Successfullt ..!',
      });
    }

  }

  async function getMyNotes(){
    setisLoading(true);
    let { data } = await axios.get(`https:note-sigma-black.vercel.app/api/v1/notes`,{
      headers:{
        token:`3b8ny__${localStorage.getItem('userNoteToken')}`
      }
    }).catch((err)=>{
      setisLoading(false);
      setError(err.response.data.msg)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response.data.msg,
      });
    })
    if(data.msg === 'done'){
      setError(null)
      setisLoading(false);
      // console.log(data.notes);
      setNotes(data.notes)
    }
  }

  async function deletNote(noteId){
    setisLoading(true);
    
    let {data} = await axios.delete(`https:note-sigma-black.vercel.app/api/v1/notes/${noteId}`,{
      headers:{
        token:`3b8ny__${localStorage.getItem('userNoteToken')}`
      }
    })
    .catch((err)=>{
      setisLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response.data.msg,
      });
    })
    // console.log(data);
    if(data.msg === 'done'){
      setisLoading(false);
      getMyNotes();
      Swal.fire({
        icon: 'success',
        title: 'deleted Successfully',
      });
    }
  
  }
  const formik = useFormik({
    initialValues:{
      
      title:'',
      content:'',
      
    },
    validationSchema:validateSchema,
    onSubmit:addNote,
    
  })

  function logout(){
    localStorage.removeItem('userNoteToken')
    navigate('/login')
    
  }
  useEffect(()=>{
    getMyNotes();
  },[])

  // useEffect(()=>{
  //   getMyNotes();
  // },[])
  return <>
  
  <div className="container my-5 bg-secondary py-3" style={{height:500}}>
    <div className="row h-75 bg-dark p-4 mx-3">
      <div className="col-md-8">
      
      {isLoading?
      <div className=' w-100 bg-dark bg-opacity-50 py-5 d-flex justify-content-center align-items-center h-100' >
      <ColorRing
      visible={true}
      height="80"
      width="80"
      ariaLabel="blocks-loading"
      wrapperStyle={{}}
      wrapperClass="blocks-wrapper"
      colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
      </div>:
      error? <div className="w-100 alert alert-danger h-100 h1 d-flex align-items-center justify-content-center"> {error}</div>:  
      <div className="notes">
        <div className="row ">
          {notes.length>0?
          notes?.map((note)=><Note key={note.id} note={note} getnotes={getMyNotes} deletNote={deletNote}/>)
          :''}
        </div>
      </div>
      }
      </div>

      <div className="col-md-4">
        <form onSubmit={formik.handleSubmit}>
        {error ? <div className='alert alert-danger'>{error}</div>:""}
          <input type="text" name="title" className="form-control   my-2" placeholder="title" 
          onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.errors.title && formik.touched.title?<div className="alert alert-danger">{formik.errors.title}</div>:''}


          <input type="text" name="content" className="form-control  my-2" placeholder="content"
          onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.errors.content && formik.touched.content?<div className="alert alert-danger ">{formik.errors.content}</div>:''}

          {!isLoading?      
      <button disabled={!(formik.isValid && formik.dirty)} type='submit' className='btn btn-primary text-white w-100 mt-2'> Add note  </button>
      :<button  type='button' className='btn btn-primary text-white mt-2 w-100'>  
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
        </form>
      </div>
    </div>
    <button className=" btn btn-danger my-2  w-100" onClick={()=>logout()}>Logout</button>
  </div>
  
  </>
}

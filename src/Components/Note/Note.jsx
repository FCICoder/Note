import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from "react";
import { useFormik } from "formik";
// import style from './Note.module.css'
import * as Yup from 'yup'
import Swal from "sweetalert2";
import axios from "axios";
export default function Note({note , deletNote, getnotes}) {
  // console.log(note.title);
  let [error,setError] = useState(null)
  let [isLoading , setisLoading]  = useState(false)
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  let validateSchema = Yup.object({
    title:Yup.string().required( 'title is required').max(10, 'max length is 10 ').min(3, 'min length is 3'),
    content:Yup.string().required('content is required').min(5, 'min length is 5').max(20, 'max length is 20'),

  })

  async function updateNote(values){
    console.log(values);
    setisLoading(true);
    let {data} = await axios.put(`https:note-sigma-black.vercel.app/api/v1/notes/${note._id}`,values,{headers:{
      token:`3b8ny__${localStorage.getItem('userNoteToken')}`
    }}).catch((err)=>{
      setError(err.response.data.msg)
      setisLoading(false);
      // console.log(err.response.data.msg);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
      });
    })
    


    if(data.msg === 'done'){
      getnotes()
      setisLoading(false);
      Swal.fire({
        icon: 'success',
        title: ' Note updated Successfully ..!',
      });
    }

  }

  const formik = useFormik({
    initialValues:{
      
      title: note.title,
      content: note.content,
      
    },
    validationSchema:validateSchema,
    onSubmit:updateNote,
    
  })
  return <>
  
    <div className="col-md-4 mb-4 ">
      <div className="note  bg-success p-2">
      <h6 className="text-light fw-bold">title : {note.title}</h6>
      <p className="text-light">{note.content}</p>
      <Link>
      <i className=" text-danger  fas fa-trash me-3" onClick={()=>deletNote(note._id)}></i>
      </Link>
      <Link>
        <i className="fas fa-file-pen text-dark" onClick={handleShow}></i>
      </Link>
      </div>
    </div>
    
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <form >
        {error ? <div className='alert alert-danger'>{error}</div>:""}
          <input type="text" name="title" className="form-control   my-2" placeholder="title" 
          onChange={formik.handleChange} onBlur={formik.handleBlur} defaultValue={note.title} />
          {formik.errors.title && formik.touched.title?<div className="alert alert-danger">{formik.errors.title}</div>:''}


          <input type="text" name="content" className="form-control  my-2" placeholder="content"
          onChange={formik.handleChange} onBlur={formik.handleBlur} defaultValue={note.content}  />
          {formik.errors.content && formik.touched.content?<div className="alert alert-danger ">{formik.errors.content}</div>:''}
      
        </form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{
            handleClose()
            formik.handleSubmit()
          }}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
  </>
}

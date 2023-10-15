import { Navigate } from "react-router-dom"

// import style from './ProtectedRoute.module.css'
export default function ProtectedRoute({children}) {
  
  if(!localStorage.getItem('userNoteToken')){
    return <Navigate to="/login"></Navigate>
  }
  return children
  
}

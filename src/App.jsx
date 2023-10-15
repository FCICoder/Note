
import './App.css'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import NotFound from './Components/NotFound/NotFound'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'

function App() {

  const  routes = createBrowserRouter([
    {path:'/noteApp/',element:<Layout/>,children:[
      {index : true, element :<ProtectedRoute><Home/></ProtectedRoute> },
      {path:'/noteApp/login', element : <Login/>},
      {path:'/noteApp/register', element : <Register/>},
      {path:'*', element : <NotFound/>},

    ]}
  ])

  return (
    <>
  <RouterProvider router={routes}/>
    </>
  )
}

export default App

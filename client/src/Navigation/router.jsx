import { useRoutes, Navigate } from "react-router-dom"
import { Login } from "../Pages/login"
import { Signup } from "../Pages/signup"
import Restricted from "../Pages/Restricted"
import AuthChecker from "./AuthChecker"
import App from "../App"

const Routes = ({childen}) => {
  return (
   useRoutes([
    {
        path:"/",
        element:<App/>
    },
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/signup",
        element:<Signup />
    },
    {
      path:"/restricted",
      element:<AuthChecker toRoute={<Restricted />} />
    }
   ])
  )
}


export default Routes
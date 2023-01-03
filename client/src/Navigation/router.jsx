import { useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Login  from "../Pages/login"
import { Signup } from "../Pages/signup"
import Restricted from "../Pages/Restricted"
import AuthChecker, { RestrictiontoLogin } from "./AuthChecker"
import {Sorry} from "../Pages/custom"
import { Routes,Route } from "react-router-dom"


const Routessuperset = ({childen}) => {
  const currentLocation = useLocation()
  console.log(currentLocation.pathname)
  return (
        <AnimatePresence>   
            <Routes location={currentLocation} key={currentLocation.key}>
                    <Route path="/login" element={<RestrictiontoLogin toRoute={<Login/>} fromroute={currentLocation.pathname} />}/>
                    <Route path="/restricted" element={<AuthChecker toRoute={<Restricted />} />} />
                    <Route path="/signup" element={<Signup/>} />
                    <Route path="*"  element={<Sorry />}/>
            </Routes>
        </AnimatePresence>
        
  )
  }

export default Routessuperset
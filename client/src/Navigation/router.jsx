import { useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { Login,Restricted,Signup,Custom }  from "../Pages"
import AuthChecker, { RestrictiontoLogin } from "./AuthChecker"
import { Routes,Route } from "react-router-dom"


const Routessuperset = ({childen}) => {
  const currentLocation = useLocation()
  console.log(currentLocation.pathname)
  return (
        <AnimatePresence>   
            <Routes location={currentLocation} key={currentLocation.key}>
                    <Route path="/login" element={<RestrictiontoLogin toRoute={<Login/>} fromroute={currentLocation.pathname} />}/> {/* prevent logged in user from again accessing the login page*/}
                    <Route path="/restricted" element={<AuthChecker toRoute={<Restricted />} />} />
                    <Route path="/signup" element={<Signup/>} />
                    <Route path="*"  element={<Custom />}/>
            </Routes>
        </AnimatePresence>
        
  )
  }

export default Routessuperset
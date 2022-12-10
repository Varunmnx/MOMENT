import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';
 const AuthChecker = ({toRoute}) => {
                            let userloginstatus = useSelector((state) => state.auth.status);
                            return ( userloginstatus ? toRoute :<Navigate to="/login" />)
              }

//  redirect user to from page if user is authenticated and try to access login page             
export const RestrictiontoLogin =({toRoute,fromroute})=>{
                const currentLocation = useLocation()
                console.log(currentLocation)
                let userloginstatus = useSelector(state=>state.auth.status)

                if(userloginstatus&&currentLocation.pathname =="/login"){
                    <Navigate to={fromroute} />
                } else{
                    return toRoute
                }
    }


export default AuthChecker
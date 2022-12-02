import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
 const AuthChecker = ({toRoute}) => {
                            let userloginstatus = useSelector((state) => state.auth.status);
                            return ( userloginstatus ? toRoute :<Navigate to="/login" />)
              }

export default AuthChecker
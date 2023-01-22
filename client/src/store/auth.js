import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

// helper functions to filter unwanted data from response 

import { setUser,handleLoginErrorGlobal } from "./apiresponseparser/states";



const authSlice = createSlice({
    name: "auth",
    initialState: {
         loginStatus:false,
         notaUser:false,
         currentUser:null
    },
    reducers: {

      setCurrentuser(state,action){
           const currentUserDetails = action.payload 
           state.currentUser = currentUserDetails
           state.loginStatus = true
           state.notaUser = false
      },
    
      logOutUser(state,action){
             state.status = false
             state.notaUser = false
            console.log("___running___logout___user___reducer____")
             console.log(action.payload)
      },

      notAUser(state,action){
          // console.log("_____serving___not___a___User____")
           state.notaUser = true
           console.log(action.payload)
           if(action.payload==="forgot"){
             state.loginStatus ="forgot"
           }
           
      }
    },
  });

  export const actions =  authSlice.actions
  
  export default authSlice

 

export function signUpUser(data){
    //thunk function
     return (dispatch,getState)=>{
        //  let signedUpuser =   axios.post(import.meta.env.VITE_API_END_POINT)      
        //  dispatch(actions.setCurrentuser({user:cart}))
        console.log(data)
        console.log(import.meta.env.VITE_API_END_POINT)
     }
}


export const loginUser = createAsyncThunk(
     'login/logout',
     async (userLoginDetails, {dispatch}) => {
          console.log("_____making___login___api___Call")

     let {   email , password } = userLoginDetails  // from login page
     try{
     let {data} = await axios.post(import.meta.env.VITE_API_END_POINT+"/user/login",{
           email ,password  })
     
     let currentuser = setUser( data ) // filtering response to only extract necessary response
     dispatch(actions.setCurrentuser(currentuser))}
     catch(err){
          let { response } = err
          handleLoginErrorGlobal(response.data.error,dispatch)
     }
     }
     );

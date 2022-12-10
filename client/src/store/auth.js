import { createSlice} from "@reduxjs/toolkit";
import axios from "axios"

const authSlice = createSlice({
    name: "auth",
    initialState: {
         status:false,
         notaUser:false,
         currentUser:{
          name:"",
          email:""
         }
    },
    reducers: {
      setCurrentuser(state,action){
           const {data} = action.payload 
           state.status = true
           state.currentUser = data
           state.notaUser = false
      },
      logOutUser(state,action){
             state.status = false
             state.notaUser = false
      },
      notAUser(state,action){
           state.notaUser = true,
           state.status = false
        
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


export function loginUser(formData){
  //thunk function
   return async (dispatch,getState)=>{
       let {data} =  await axios.post(import.meta.env.VITE_API_END_POINT+"/signin",{body:formData})
       console.log(data)
       if(data.status ==false){
            dispatch(actions.notAUser())
       }
   }
}
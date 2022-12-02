import { createSlice} from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: "auth",
    initialState: {
         status:true,
    },
    reducers: {
      fetchcart(state,action){
           const {data} = action.payload 
           state.cart = data
           state.total = data.subtotal.raw
      },
      cartRefreshed(state,action){
        state.total = 0
        console.log(state.total)
      }
    },
  });


  export default authSlice
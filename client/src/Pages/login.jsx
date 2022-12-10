import React, { useEffect,useState } from "react";
import { useFormik } from "formik";
import {basicSchema} from "../Schemas/FormSchemas"
import Input  from "./Components/Input";
import { useDispatch,useSelector } from "react-redux";
import { loginUser } from "../store/auth";
import { motion } from "framer-motion";
import {useNavigate} from "react-router-dom"
export const Login = () => {

  const {status,notaUser,currentUser} = useSelector(state=>state.auth)
  // console.log(status)
  // console.log(notaUser)
  // console.log(currentUser)
  let nav = useNavigate()
  const dispatch = useDispatch()
  
  const onSubmit = async (values,actions)=>{
      console.log("submitted")
      console.log(values)
      dispatch(loginUser(formik.values))
      await new Promise((resolve)=>setTimeout(resolve,1000))
      actions.resetForm()

  }

  const formik = useFormik({
        initialValues: {
          email: "",
          password:"",
          confirmPassword:""
        },
        validationSchema:basicSchema,
        onSubmit:onSubmit
  });

  const tempvar = {
    initial:{
      y:"-100vh"
    },
    animate:{
      y:0,
      transition:{type:"spring" ,damping:200,stiffness:400 ,ease:"easeInOut",duration:0.1},

    },
    exit:{
      y:"100vh"
    }
  }

  return (
    <motion.div className="flex flex-col items-center justify-center overflow-hidden h-full w-full"
                initial="initial"
                animate ="animate"
                exit ="exit"
                variants={tempvar}
    >
      <p className={notaUser?"block text-red ":"hidden"}>oops seems like you are not a member please signup to use </p>

            <form className="w-[300px] flex-shrink-0" onSubmit={formik.handleSubmit}>
                  <label className={ `text-xl transition-all ${formik.touched.email&&formik.errors.email&&"text-red-700 "}`} >Email</label>
                  <br />
                      <Input  onChange={formik.handleChange} 
                              value={formik.values.email}
                              onBlur={formik.handleBlur}
                              id="email"
                              placeholder="enter your email"
                              />
                  <br />
                  <label className=" text-xl">Password</label>
                  <br />
                        <Input  onChange={formik.handleChange} 
                              value={formik.values.password}
                              onBlur={formik.handleBlur}
                              id="password"
                              placeholder="enter your password"
                              />
                  <br />
                  <label className="text-xl w-100">Confirm Password</label>
                  <br />
                        <Input  onChange={formik.handleChange} 
                              value={formik.values.confirmPassword}
                              onBlur={formik.handleBlur}
                              id="confirmPassword"
                              placeholder="confirm your password"
                              />
                  <br/>
                  <div className="w-full grid items-center justify-center">
                          <motion.button 
                              className= {` bg-cyan-500 m-auto mt-3 focus:ring-2 focus:outline-none focus:ring-red-700 ${formik.isSubmitting ?"opacity-30":"opacity-100"}`} 
                              type="submit"
                              whileHover={{
                                scale:1.05
                              }}
                            whileTap ={{
                              scale:0.97
                            }}
                            disabled={formik.isSubmitting}
                              >
                            Submit
                            </motion.button>
                  </div>

                </form>
                        <motion.div
                          whileTap={{scale:0.9}} 
                          onClick={()=>nav("/signup")}
                          className="hover:text-green-300 cursor-pointer"
                          >signup</motion.div>
    </motion.div>
   
  );
};

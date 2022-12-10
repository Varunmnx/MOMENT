import React from 'react'
import {motion} from "framer-motion"
export const Signup = () => {
  return (
    <motion.div
          className="h-screen w-screen grid items-center justify-center  "
          initial={{opacity:0}}
          animate={{opacity:[0.5,0.7,1]}}
          exit={{opacity:1}}
          >
      <motion.div className='h-40 w-40'
         initial ={{y:"-100vw"}}
         animate ={{x:0}}
         exit ={{x:"100vw"}}
      >
        <h1>This is Signup</h1>
      </motion.div>
    </motion.div>
  )
}

import React from 'react'
import { memo } from 'react'
 const Input = ({onChange,value,onBlur,id,placeholder}) => {


  return (
    <div className="w-full mb-3">
    <input
      className="pl-2 h-10 w-full rounded-xl placeholder:text-gray-500 ring-0 placeholder:transition-all focus:ring-1 focus:ring-blue-300 placeholder:ml-3 focus:placeholder:opacity-0 placeholder:ease-in-out delay-100 placeholder:delay-100"
      onChange={onChange}
      id={id}
      placeholder={placeholder}
      value={value}
      onBlur={onBlur}
    />
</div>
  )
}


export default memo(Input)
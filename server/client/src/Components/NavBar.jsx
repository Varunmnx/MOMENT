import React from 'react'

const NavBar = (location) => {
  return (
    <div>{location !="Login"||"Signup"&& "NavBar"}</div>
  )
}

export default NavBar
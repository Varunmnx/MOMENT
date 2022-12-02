import { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import './App.css'

function App() {
  let cart = useSelector((state) => state.auth);
  console.log(cart)
  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  )
}

export default App

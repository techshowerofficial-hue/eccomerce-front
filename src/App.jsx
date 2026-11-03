import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import Login from './components/Loginpop/Login'
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Auth from "./pages/Auth/Auth";
import MyOrders from "./pages/Orders/MyOrders";
const App = () => {
  const [loginpo, setLoginpop] = useState(false); 
  return (
    <>
    {
      loginpo?<Login setLoginpop={setLoginpop}/>:<></>
     }
     <div className='app'>
   
<Navbar setLoginpop={setLoginpop}/>
<Routes>
  <Route path="/login" element={<Auth />} />
  <Route path='/' element={<Home/>} />
  <Route path='/cart' element={<Cart/>} />
  <Route path='/order' element={<PlaceOrder/>} />
  <Route path="/product/:id" element={<ProductDetails />} />
  <Route path="/my-orders" element={<MyOrders />} />
</Routes>
 
    </div>
    <Footer/>
    </>
   
  )
}

export default App
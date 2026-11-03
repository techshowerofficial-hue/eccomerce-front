import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import Explore from '../../components/Explore/Explore'
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay'

const Home = () => {
  const [category,setCategory] = useState("All");
  return (
    <div>
<Header/>
<Explore category={category} setCategory={setCategory}/>
<ProductDisplay category={category}/>

    </div>
  )
}

export default Home
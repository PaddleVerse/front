import React from 'react'
import Caroussel from './Caroussel'
import Header from './Header'


const GameOptions = () => {
  return (
    <div className='w-[94%] bg-transparent  py-[45px] px-[20px] sm:px-[150px] rounded-lg'
    style={{
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(13, 9, 10, 0.7)",
    }}
    >
      <Header />
      <Caroussel />
    </div>
  )
}

export default GameOptions

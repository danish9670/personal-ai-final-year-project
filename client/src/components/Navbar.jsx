import React from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'  
import { ArrowRight } from 'lucide-react'
import { useClerk ,UserButton , useUser } from '@clerk/clerk-react'


const Navbar = () => {
    const navigate=useNavigate()
    const {user}=useUser()
    const {openSignIn}=useClerk()
  return (
    <div className='fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20'>
      <img src={assets.logo} alt="logo" className='w-32 sm:w-44' onClick={()=>navigate('/')} />
       <div className=' flex item-center gap-4'>

       
       <button onClick={() => navigate('/ai')} className='border-1 w-21 text-white rounded bg-green-400 flex items-center ' >
        Dashboard 
        
      </button>
       

      {
        user ? <UserButton/>:(
          <button onClick={openSignIn} className='border-1 text-white bg-green-400 rounded flex items-center ' >
        Get Started <ArrowRight className='w-4 h-4  ' /> 
        
      </button>
        )
      }
      </div>
    </div>
  )
}

export default Navbar

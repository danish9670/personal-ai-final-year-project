import React from 'react'
import { useNavigate } from 'react-router-dom'
import {useUser} from '@clerk/clerk-react'
import { AiToolsData } from '../assets/assets'

const AiTools = () => {
    const navigate=useNavigate()
    const {user} =useUser()
  return (
    <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col justify-center bg-[url(/gradientBackground.png)] bg-cover w-full bg-no-repeat min-h-screen'>
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>Powerful AI Tools</h2>
        <p className='text-grey-500 max-w-lg mx-auto'>Everything you need to create. enhance, and optimize your content wiht cutting-edge AI technology. </p>

      </div>
      <div className='flex flex-wrap mt-10 justify-center'>
        {AiToolsData.map((tool, index)=>(
            <div key={index} className='bg-white shadow-md rounded-lg p-6 m-4 w-72 hover:shadow-xl transition-shadow cursor-pointer' onClick={()=> user && navigate(tool.path)}>
                <tool.Icon className='w-12 h-13 rounded-xl' style={{background:`linear-gradient(to bottom, ${tool.bg.to})`}} /> 
                 <h3 className='mt-6 mb-3 text-lg font-semibold '>{tool.title}</h3>    
                 <p className='text-grey-400  text-sm max-w-[95%]'>{tool.description}</p>
            </div>
        ))}    
    </div>
    </div>
  )
}

export default AiTools

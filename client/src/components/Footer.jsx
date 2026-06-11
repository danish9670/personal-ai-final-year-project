import React from 'react'
import assets from '../assets/assets'

const Footer = () => {
  return (
     
      <footer className='px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-grey-500 mt-20'>
       <div className='flex flex-col md:flex-row justify-between w-full gap-10 border-b border-grey-500/30 pb-6'>
       <div className='md:max-w-96'>
        <img className='h-9 ' src={assets.logo} alt="logo"  height={50} width={50}/>
        <p className='mt-6 text-sm'>
             Experience the power of AI with Prsnl AI , <br /> Transform your content creation with our suite of premium AI tools. Write articles , generate images, and enhance your workflow.
        </p>

       </div>
       <div className='flex-1 flex items-start md:justify-end gap-20'></div>
           <div>
            <h2 className='font-semibold mb-5 text-grey-800'>Company </h2>
            <ul className='text-sm space-y-2'>
                <li><a href="#">Home</a></li>
                <li><a href="#">About us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy policy</a></li>
            </ul>
           </div>
           <div>
               <h2 className='font-semibold text-grey-800 mb-5'> Subscribe to our newsletter</h2>
               <div className='text-sm space-y-2'> 
               <p>The latest news article and resources sent to your inbox weekly.</p>          
               <div className='flex items-center gap-2 pt-4'>
                <input type="text" placeholder='comment here ..' className='border border-grey-500/30 placeholder-grey-500 focus:ring-2 ring-indigo-600 outline-none' />
                <button className='bg-amber-600 w-24 h-9 text-grey-500 rounded cursor-pointer'>Subscribe</button>
               </div>
            </div>             
           </div>
         </div>
         <p className='pt-4  text-center text-xs md:text-sm pb-5'>Copyright 2025 @ SartajHuMai. All Right Reserved</p>
      </footer>
     
  )
}

export default Footer

import React from 'react'
import assets from '../assets/assets'

const Hero = () => {
  return (
    <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col justify-center bg-[url(/gradientBackground.png)] bg-cover w-full bg-no-repeat min-h-screen'>
      <div className='textr-center mb-6'>
          <h1 className='text-3xl max-w-xs md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1-2] '>
            Drive innovation <br />with <span className='text-primary text-green-500'> AI excellence </span>
          </h1>
          <p className='text-sm md:text-lg 2xl:text-xl mt-4 text-gray-600 font-medium max-w-2xl mx-auto'>
             Transform your workflow with cutting-edge AI designed to boost cretivity, accuracy and performance.
          </p>
      </div>

      <div className='flex items-center gap-4 cd client mx-auto text-grey-600' >
        <img src={assets.user_group} alt="" className='h-8' />Trusted by 5k+ people
      </div>
      
    </div>
  )
}

export default Hero

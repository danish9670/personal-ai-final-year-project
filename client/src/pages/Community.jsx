import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Heart } from 'lucide-react'

function Community() {
  const [creations, setCreations] = useState([])
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  // temporary function to avoid error
  const imageLikeToggle = (id) => {
    console.log("Toggled like for:", id)
  }

  return !loading ? (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      Creations
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {creations.map((creation, index) => (
          <div
            key={index}
            className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'
          >
            <img
              src={creation.content}
              alt=''
              className='w-full h-full object-cover rounded-lg'
            />

            <div className='absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-1'>
              <p className='text-sm hidden group-hover:block'>
                {creation.prompt}
              </p>
              <div className='flex gap-1 items-center'>
                <p>{creation.likes.length}</p>
                <Heart
                  onClick={() => imageLikeToggle(creation.id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    creation.likes.includes(user.id) ? "text-red-500" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community

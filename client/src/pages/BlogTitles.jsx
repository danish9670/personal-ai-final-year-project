import React from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { Sparkle } from 'lucide-react';
import { useState } from 'react';
import { Edit } from 'lucide-react';  
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const BlogTitles = () => {

  const blogCategories = [ 
    'General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food'
  ];

  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0])
  const [content , setContent] = useState('')

   const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter a topic!");
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      const prompt = `
      Write a detailed, well-structured and engaging blog about "${input}". 
      The article should be of category ${selectedCategory.length}.
      
      `;

      const { data } = await axios.post(
        "/api/ai/generate-blog-titles",
        { prompt, category : selectedCategory  },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Failed to generate article.");
      }
    } catch (error) {
      toast.error("Network error! Check your backend URL.");
    }

    setLoading(false);
  };


  return (
     <div  className="flex flex-col items-start justify-start h-screen bg-gray-50">
      <nav className='w-full px-8 min-h14 flex items-center justify-between p-4 border-b border-gray-200'> 
        <img className='cursor-pointer w-32 sm:w-44' src={assets.logo} alt="" onClick={()=>navigate('/')} />
      </nav>
      
      <div className='flex gap-6 p-6 items-start justify-start w-full overflow-y-auto'>
        {/* left column */}
        <form onSubmit={onSubmitHandler} className='mt-4 w-full max-w-lg p-6 bg-white rounded-lg shadow'>
           <div className='flex items-center gap-3'>
               <Sparkle className='w-6 text-green-500'/>
               <h2 className='text-xl font-semibold'>AI Title Generator</h2>
           </div>
           
           <p className='mt-6 text-sm font-medium'>Keyword</p>
           <input 
              type="text" 
              placeholder='The future of artificial intelligence is...' 
              className='w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              value={input}
              onChange={(e)=>setInput(e.target.value)}
            />

           <p className='mt-6 text-sm font-medium'>Category</p>
           <div className='mt-3 flex gap-3 flex-wrap'>
              {blogCategories.map((item , index)=>(
                <span 
                  key={index} 
                  onClick={()=>setSelectedCategory(item)} 
                  className={`px-4 py-1 border rounded-full cursor-pointer ${
                    selectedCategory===item 
                    ? 'bg-purple-600 text-white border-purple-600' 
                    : 'bg-white text-gray-700 border-gray-300'
                  } hover:bg-purple-500 hover:text-white transition duration-200`}>
                    {item}
                </span>
              ))}
           </div>
           
           <button
            disabled={loading} 
            className='w-full mt-6 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center justify-center gap-2'>
            {loading 
              ? <span className='w-4 h-4 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <Edit className='w-5'/>}
            Generate title
           </button>
        </form>

        {/* right column */}
        <div className='mt-4 w-full max-w-lg p-6 bg-white rounded-lg shadow'>
            <div className='flex items-center gap-3'>
                <Sparkle className='w-6 text-green-500'/>
                <h2 className='text-xl font-semibold'>Generated titles</h2>
            </div>
            
            <div className='mt-6'>
  {content ? (
    <div className="whitespace-pre-line text-gray-800 text-sm leading-6">
      {content}
    </div>
  ) : (
    <p className='mt-6 text-sm text-gray-500 text-center'>
      Enter a topic and click "Generate title" to get started
    </p>
  )}
</div>

        </div>
      </div>
     </div>
  )
}

export default BlogTitles

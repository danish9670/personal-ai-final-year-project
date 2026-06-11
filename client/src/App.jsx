import React from 'react'
import Home from './pages/Home.jsx'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import WriteArticle from './pages/WriteArticle.jsx'
import GenerateImages from './pages/GenerateImages.jsx'
import RemoveBackground from './pages/RemoveBackground.jsx'
import RemoveObject from './pages/RemoveObject.jsx'
import ReviewResume from './pages/ReviewResume.jsx'
import Community from './pages/Community.jsx'
import BlogTitles from './pages/BlogTitles.jsx'
import Dashboard from './pages/Dashboard.jsx'
import {Toaster} from 'react-hot-toast'

 
 const App = () => {
   return (
     <div>
      <Toaster/>
        <Routes>
          <Route path="/" element={<Home/>} />
              <Route path="write-article" element={<WriteArticle/>} />
              <Route path="/blog-titles" element={<BlogTitles/>} />
              <Route path="/Generate-images" element={<GenerateImages/>} />
              <Route path="/remove-background" element={<RemoveBackground/>} />
              <Route path="/remove-object" element={<RemoveObject/>} />
              <Route path="/review-resume" element={<ReviewResume/>} />
          <Route path="/ai" element={<Layout/>}>
              
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="community" element={<Community/>} />
              


              
          </Route>
        </Routes>
     </div>
   )
 }
 
 export default App
 
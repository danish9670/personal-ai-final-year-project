import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { OpenAI } from "openai";
import {v2 as cloudinary} from 'cloudinary'
import fs from "fs";
import FormData from "form-data";
import pdfParse from "pdf-parse";




const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});



export const generateArticle = async (req, res) => {

    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit Reached. Upgrade to premium plan" })
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "user", content: prompt },],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content
        await sql`INSERT INTO creations(user_id, prompt, content, type)
             VALUES ( ${userId}, ${prompt}, ${content}, 'article')`;
        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 },
            })
        }
        res.json({ success: true, content })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })

    }
}




export const generateBlogTitle = async (req, res) => {

    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit Reached. Upgrade to premium plan" })
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "user", content: prompt },],
            temperature: 0.7,
            max_tokens: 100,
        });

        const content = response.choices[0].message.content
        await sql`INSERT INTO creations(user_id, prompt, content, type)
             VALUES ( ${userId}, ${prompt}, ${content}, 'Blog-title')`;
        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 },
            })
        }
        res.json({ success: true, content })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })

    }
}




export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;

        const formData = new FormData();
        formData.append('prompt', prompt);

        // Send request to ClipDrop
        const response = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1',
            formData,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API_KEY,
                    ...formData.getHeaders()
                },
                responseType: 'arraybuffer'
            }
        );

        // Convert to base64
        const base64Image = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;

        // Upload to Cloudinary
        const { secure_url } = await cloudinary.uploader.upload(base64Image);

        // Insert into database
        await sql`INSERT INTO creations(user_id, prompt, content, type, publish)
                  VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

        // Return result
        res.json({ success: true, secure_url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}




export const removeImageBackground = async (req, res) => {

    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: " This feature is only available for Premium . Upgrade to premium plan" })
        }

        const {secure_url} = await cloudinary.uploader.upload( image.path,{
            transformation: [
                {
                    effect:'background_removal',
                    backgroud_removal:'remove_the_background'
                }
            ]

        })

         
        await sql`INSERT INTO creations(user_id , prompt ,  content, type ,)
             VALUES ( ${userId}, 'Remove background from image', ${secure_url}, 'image')`;
         
        res.json({ success: true, secure_url })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })

    }
}



export const removeImageObject = async (req, res) => {

    try {
        const { userId } = req.auth();
        const {object}=req.body
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: " This feature is only available for Premium . Upgrade to premium plan" })
        }

       const {public_id}= await cloudinary.uploader.upload(image.path)
       const imageUrl= cloudinary.url(public_id,{
        transformation: [
            {       
                effect:'gen_remove:${object}',

             }
        ],
        resource_type:'image'
       })

         
        await sql`INSERT INTO creations(user_id , prompt ,  content, type ,)
             VALUES ( ${userId},  ${`Remove ${object} from image`}, ${imageUrl}, 'image')`;
         
        res.json({ success: true, imageUrl })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })

    }
}


export const resumeReview = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File required. Please upload a resume."
      });
    }

    const pdfBuffer = req.file.buffer;

    // Extract text from resume
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to read resume. Upload a valid PDF."
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional HR recruiter. Review resumes and suggest improvements."
        },
        { role: "user", content: resumeText }
      ],
    });

    const reviewText = completion.choices[0].message.content;

    res.json({
      success: true,
      review: reviewText,
    });

  } catch (error) {
    console.error("Resume review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to review resume. Check server console.",
    });
  }
}


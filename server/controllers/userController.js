import sql from "../configs/db.js";



export const getUserCreations=async(req,res)=>{
    try{
        const {userId}=req.auth();

        const creation=await sql`SELECT * FROM creation WHERE user_id=${userId} ORDER BY created_at DESC`;
        res.json({success:true,creation}) 
    }catch(error){
        res.json({success:false,message: error.message})
    }
}


export const getPublishedCreations=async(req,res)=>{
    try{
        const {userId}=req.auth();

        const creation=await sql`SELECT * FROM creation WHERE publish = true ORDER BY created_at DESC`;
        res.json({success:true,creation}) 
    }catch(error){
        res.json({success:false,message: error.message})
    }
}

export const toggleLikeCreations=async(req,res)=>{
    try{
        const {userId}=req.auth();
        const {id}=req.body;


        const [creation]=await sql`SELECT * FROM creation WHERE id=${id} `;

        if(!creation){   
            res.json({success:false,message:"Creation not found"})
        }

        const currentLikes=creation.likes();
        const userIdstr=userId.toString();
        let updatedLikes;
        let message;

        if (currentLikes.includes(userIdstr)){
            updatedLikes=currentLikes.filter((user)=>user !== userIdstr);
            message="Creation unliked successfully"
        }else{
            updatedLikes=[...currentLikes,userIdstr];
            message="Creation liked successfully"
        }

        const formattedArray=`{${updatedLikes.join(',')}}`;
        await sql`UPDATE creation SET likes=${formattedArray}:: text[] WHERE id=${id}`; 



        res.json({success:true,creation}) 
    }catch(error){
        res.json({success:false,message: error.message})
    }
}
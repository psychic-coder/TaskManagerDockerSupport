import { TryCatch } from "../middlewares/error.js";
import { prisma } from "../utils/helper.js";




export const getProfile=TryCatch(async (req,res)=>{
    const {id} =req.params;
    const user =await prisma.user.findUnique({
        where:{id},
        select:{
            id:true,
            name:true,
            email:true,
            role:true,
            organizationId:true,
            createdAt:true,
            updatedAt:true,
        }
    })

    if(!user){
        return res.status(404).json({
            message:"User not found",
            success:true
        })
    }

    res.status(200).json({
        message:"User found",
        user,
        success:true
    })

})


export const removeUserFromOrg = TryCatch(async (req, res) => {
    const { id } = req.params;
  
    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });
    const admin=await prisma.user.findUnique({
        where: { id: req.user.id }
    })


    
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

   
    if (userToDelete.organizationId !== admin.organizationId) {
      return res.status(403).json({
        success: false,
        message: "Cannot remove user from another organization",
      });
    }
  
 
    if (userToDelete.role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete an admin",
      });
    }
  
    await prisma.user.delete({
      where: { id },
    });
  
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  });
  
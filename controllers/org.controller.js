import { TryCatch } from "../middlewares/error.js";
import { FRONTEND_URL } from "../utils/constants.js";
import { prisma } from "../utils/helper.js";
import { nanoid } from "nanoid";

export const getOrganizationDetails = TryCatch(async (req, res) => {
  const { id } = req.params;

const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      users: {
        select: { 
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      tasks: {  
        select: {
          title: true,
          description: true,
          category: true,
          priority: true,
          status: true,
          dueDate: true,
          assignedTo: true
        }
      }
    }
  });

  if (!organization) {
    return res.status(404).json({
      message: "No organization found",
      success: false,
    });
  }

  return res
    .status(200)
    .json({ organization, message: "Organization found", success: true });
});


export const updateOrganizationDetails = TryCatch(async(req,res)=>{
    const {id}=req.params;
    const {name}=req.body;

    const user=await prisma.user.findUnique({
        where:{id:req.user.id}
    })

    if(!user || user.organizationId !==id || user.role!=="ADMIN"){
        return res.status(403).json({
            success:false,
            message: "Unauthorized: You are not the admin of this organization",
        })
    }

    const updated =await prisma.organization.update({
        where:{id},
        data:{name}
    })

    return res.status(200).json({
        message:"Organization Updated",
        organization:updated,
    })

})


export const listOrganizationDetails=TryCatch(async(req,res)=>{
    const {id}=req.params;

    const organization=await prisma.organization.findUnique({
        where:{id},
        include:{
            users:{
                select:{
                    id:true,
                    name:true,
                    email:true,
                    role:true
                }
            }
        }
    })

    if(!organization){
        return res.status(404).json({
            message:"Organization not found",
            success:false
        })
    }

    return res.status(200).json({
        success:true,
        members:organization.users,
        message:"Got all the details of organization"
    })

})

export const changeUserRole=TryCatch(async(req,res)=>{
    const {userId,newRole}=req.body;
    const {id:organizationId}=req.params;
    if(!["MANAGER","MEMBER"].includes(newRole)){
        return res.status(400).json({
            message:"Invalid Role",
            success:false
        })
    }

    const user=await prisma.user.findUnique({
        where:{id:userId}
    })

    if(!user || user.organizationId!==organizationId){
        return res.status(404).json({
            message:"User not found in this organization",
            success:false
        })
    }

    const updatedUser=await prisma.user.update({
        where:{id:userId},
        data:{role:newRole}
    })

    return res.status(200).json({
        message:"Uer role updated",
        user:updatedUser,
        success:true
    })

})




export const generateInvite = TryCatch(async (req, res) => {
  const { organizationId, email } = req.body;

  
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user || (user.role !== "ADMIN")) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

  const invite = await prisma.invitation.create({
    data: {
      token,
      email,
      organizationId: user.organizationId,
      createdById: user.id,
      expiresAt,
    },
  });

  const inviteLink = `${FRONTEND_URL}/join/${token}`;

  res.status(201).json({
    message: "Invitation created",
    inviteLink,
    token,
    success:true
  });
});

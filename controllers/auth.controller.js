import { TryCatch } from "../middlewares/error.js";
import { generateToken, prisma, sendToken } from "../utils/helper.js";
import bcrypt from "bcryptjs";

export const register = TryCatch(async (req, res) => {
    const { name, email, password, organizationName, organizationId } = req.body;
  
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
  
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email id",
      });
    }
  
    const passwordHash = await bcrypt.hash(password, 10);
  
    let org;
    let role;
  
    if (organizationId) {
      org = await prisma.organization.findUnique({
        where: { id: organizationId },
      });
      if (!org)
        return res.status(400).json({
          message: "Organization not found",
        });
      role = "MEMBER";
    } else {
      if (!organizationName) {
        return res.status(400).json({
          message: "Organization name is required to create a new organization",
        });
      }
      org = await prisma.organization.create({
        data: { name: organizationName },
      });
      role = "ADMIN";
    }
  
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        organizationId: org.id,
      },
    });
  
    const token = generateToken(user);
    

    const tokenData = {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    };
  
    sendToken(res, 201,  tokenData,token, "User successfully created");
  });

export const login = TryCatch(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
  
    const isMatch = await bcrypt.compare(password, user.passwordHash);
  
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
  
    const token = generateToken(user);
    
 
    const tokenData = {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    };
  
    sendToken(res, 200,tokenData, token, "User logged in successfully");
  });

export const getMe=TryCatch(async (req, res)=>{
    const user=await prisma.user.findUnique({
        where:{id:req.user.id},
        select:{id:true,name:true,email:true,role:true,organizationId:true }
    });
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }

    return res.status(200).json({
        message:"User found",
        user
    })
})


export const joinWithInvite = TryCatch(async (req, res) => {
  const { token } = req.params;
  const { name, email, password } = req.body;

  const invite = await prisma.invitation.findUnique({ where: { token } });
  if (!invite || invite.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired invitation" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "MEMBER",
      organizationId: invite.organizationId,
    },
  });

  const jwtToken = generateToken(user);
  sendToken(res, 201, user, jwtToken, "User successfully joined via invite");
});

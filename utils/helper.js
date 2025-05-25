
import { PrismaClient } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { cookieOptions, JWT_SECRET } from './constants.js';
import jwt from 'jsonwebtoken';

export const prisma = new PrismaClient();

export const generateOrgId = (() => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const generateRandomString = customAlphabet(alphabet, 10);
  
  return () => 'ORGID' + generateRandomString();
});

export function generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }


 
  export const sendToken=(res,code,tokenData,token,message)=>{

    return res.status(code).cookie("access_token",token,cookieOptions).json({
        success:true,
        tokenData,
        message
    })
  };
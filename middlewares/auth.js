import jwt from 'jsonwebtoken';
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from './error.js';
import { JWT_SECRET } from '../utils/constants.js';

export const isAuthenticated = TryCatch((req, res, next) => {
   
    const token = req.cookies["access_token"];
    console.log(token);
    if (!token)
      return next(new ErrorHandler("Please login to access this route", 401));
  
    const decodedData = jwt.verify(token, JWT_SECRET);
  
    console.log("", decodedData);
    req.user = decodedData;
  
    next();
  });
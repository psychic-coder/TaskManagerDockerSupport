
  import express from "express"
import helmet from "helmet"
import cors from 'cors'
import {errorMiddleware} from "./middlewares/error.js"
import morgan from "morgan"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import orgRoutes from "./routes/org.routes.js"
import userRoutes from "./routes/user.routes.js"
import taskRoutes from "./routes/task.routes.js"
import dashRoutes from "./routes/dashboard.routes.js"
import notificationRoutes from "./routes/dashboard.routes.js"
import cookieParser from "cookie-parser"

  
  dotenv.config({path: './.env',});
  
  export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
  const port = process.env.PORT || 3000;
  
// const mongoURI = process.env.MONGO_URI! || 'mongodb://localhost:27017';
// connectDB(mongoURI);
  
  const app = express();
  
                                
  
  
app.use(
  helmet({
    contentSecurityPolicy: envMode !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
  })
);
    

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'))
    
  
  app.get('/', (req, res) => {
     res.send('Hello, World!');
  });
  

app.use("/api/auth",authRoutes);
app.use("/api/org",orgRoutes);
app.use("/api/user",userRoutes);
app.use("/api/task",taskRoutes);
app.use("/api/dash",dashRoutes);
app.use("/api/notification",notificationRoutes);


  // your routes here
  
    
  // app.get("*", (req, res) => {
  //   res.status(404).json({
  //     success: false,
  //     message: "Page not found",
  //   });
  // });
  
  app.use(errorMiddleware);
    
  app.listen(5000, '0.0.0.0', () => console.log('Server is running on port 5000'));

  
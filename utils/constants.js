export const DATABASE_URL =process.env.DATABASE_URL
// export const DATABASE_URL =process.env.DATABASE_URL

export const JWT_SECRET=process.env.JWT_SECRET || "secretkeyKyaSecretKey"

export const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  };



export const FRONTEND_URL=process.env.FRONTEND_URL||"https://yourfrontend.com"
import { jwtVerify, SignJWT } from 'jose';

// Secret as Uint8Array (jose requires this format)
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);

// Function to generate access token
export const generateAccessToken = async (payload: {
    userId: string , 
    role: string
}) => {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' }) // Specify HS256 algorithm
        .setExpirationTime('15m')              // Set expiration time
        .sign(secretKey);                      // Sign the JWT
};

// Function to generate refresh token
export const generateRefreshToken = async (payload: {
    userId: string , 
    role: string
}) => {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' }) // Specify HS256 algorithm
        .setExpirationTime('7d')              // Set expiration time
        .sign(secretKey);                      // Sign the JWT
};

// Function to verify the token
export const verifyToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, secretKey); // Verify the JWT
        return payload; // Return the decoded payload
    } catch (error) {
        console.error(error);
        throw new Error("TokenVerificationError");
    }
};

'use server'
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { TOKEN_COOKIE_NAME, TokenPayload } from "./create-jwt";
import { query } from "./db-connection";
import { JwtPayload } from "jsonwebtoken";
import { serialize } from "cookie";
import { redirect } from "next/navigation";

export async function getUser(){
    const cookieStore = cookies();

    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    if(!token) return null

    const decoded = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string)
    );

    const payload = decoded.payload as TokenPayload & JwtPayload;

    let qResult;
    
    qResult = await query('SELECT * FROM users WHERE email = $1', [payload.email]);

    return qResult.rows[0].firstname;


}

export async function signOut(){
    cookies().delete(TOKEN_COOKIE_NAME);
    redirect('/login');
}
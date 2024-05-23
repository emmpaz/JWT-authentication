'use server'
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { REFRESH_COOKIE_NAME, TOKEN_COOKIE_NAME, TokenPayload, decrypt } from "./jwt";
import { query } from "./db";
import { JwtPayload } from "jsonwebtoken";
import { serialize } from "cookie";
import { redirect } from "next/navigation";
import { add_ID_to_DB, isBlacklisted } from "./redis";

export async function getUser(){
    const cookieStore = cookies();

    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    if(!token) return null

    try{
        const decoded = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string)
        );
    
        const payload = decoded.payload as TokenPayload & JwtPayload;
    
        let qResult;
        
        qResult = await query('SELECT * FROM users WHERE email = $1', [payload.email]);
    
        return qResult.rows[0].firstname;
    }catch(error){
        return ""
    }
}

export async function signOut(){
    cookies().delete(TOKEN_COOKIE_NAME);

    const token = cookies().get(REFRESH_COOKIE_NAME)?.value;

    const decrypted = decrypt(token ?? "");

    try{
        const decoded = await jwtVerify(decrypted,
            new TextEncoder().encode(process.env.NEXT_PUBLIC_REFRESH_SECRET_KEY as string));
        
        const payload = decoded.payload as TokenPayload & JwtPayload;

        add_ID_to_DB(payload.refreshTokenId ?? "");
    }catch(error){}

    cookies().delete(REFRESH_COOKIE_NAME);
    redirect('/login');
}
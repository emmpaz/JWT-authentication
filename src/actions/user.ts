'use server'
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { REFRESH_COOKIE_NAME, TOKEN_COOKIE_NAME, TokenPayload, decrypt } from "./jwt";
import { query } from "./db";
import { JwtPayload } from "jsonwebtoken";
import { serialize } from "cookie";
import { redirect } from "next/navigation";
import { add_ID_to_DB, isBlacklisted } from "./redis";
import { get_user } from "./graphql/queries";
import { User } from "@/app/context/AuthContext";
import { delete_session } from "./sessions";

export async function find_current_user(){
    const cookieStore = cookies();

    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    if(!token) return null;

    try{
        
        let qResult : User | null;

        qResult = await get_user();
        return qResult;
    }catch(error){
        return null;
    }
}

export async function signOut(){

    const token = cookies().get(TOKEN_COOKIE_NAME)?.value;
    
    let payload;
    try{
        const decoded = await jwtVerify(token as string,
            new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string));
        
        payload = decoded.payload as TokenPayload & JwtPayload;

        await delete_session(payload.session_id);
    }catch(error){
        console.log(error);
    }

    

    cookies().delete(TOKEN_COOKIE_NAME);
    cookies().delete(REFRESH_COOKIE_NAME);
    redirect('/login');
}
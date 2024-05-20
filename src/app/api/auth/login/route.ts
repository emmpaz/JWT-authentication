import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { query } from "@/actions/db-connection";
import { QueryResult } from "pg";
import { generateAccessAndRefreshToken, setTokens } from "@/actions/create-jwt";

export async function POST(req: NextRequest, res: NextApiResponse){
    const {email, password } = await req.json();
    try {
        let qResult : QueryResult;
        try{
            qResult = await query('SELECT * FROM users WHERE email = $1', [email]);
        }catch(err){
            return NextResponse.json({ text: 'Email or password incorrect' }, { status: 500 });
        }
        const data = qResult.rows[0];

        const answer = await new Promise<boolean>((resolve: any, reject: any) => {
            bcrypt.compare(password, data.password, (err: Error | undefined, isMatch: boolean) => {
                if(err) reject(false)

                else if(isMatch){
                    
                    resolve(true)
                }
                else resolve(false)
            });
        })
        if(!answer) return NextResponse.json({ text: 'Incorrect password' }, { status: 200 }); 
        
        const {accessToken, refreshToken} = generateAccessAndRefreshToken({
            id: data.id,
            email: data.email,
            name: data.firstName
        });
        
        return setTokens(accessToken, refreshToken); 

    } catch (err) {
        console.log(err);
        return NextResponse.json({ text: err }, { status: 500 });
    }
}
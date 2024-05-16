import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { query } from "@/actions/db/db-connection";
import { QueryResult } from "pg";
import { generateAccessToken, setAccessToken } from "@/actions/jwt/create-jwt";

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
        
        const token = generateAccessToken({
            id: data.id,
            email: data.email
        });

        return setAccessToken(token); 

    } catch (err) {
        console.log(err);
        return NextResponse.json({ text: err }, { status: 500 });
    }
}
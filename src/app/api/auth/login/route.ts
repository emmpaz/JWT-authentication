import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { query } from "@/actions/db/db-connection";
import { QueryResult } from "pg";



const saltRounds = Number(process.env.NEXT_PUBLIC_SALT_ROUNDS)

export async function POST(req: NextRequest, res: NextApiResponse){
    const {email, password } = await req.json();
    try {
        let qResult : QueryResult;
        try{
            qResult = await query('SELECT password FROM users WHERE email = $1', [email]);
        }catch(err){
            return NextResponse.json({ text: 'Email or password incorrect' }, { status: 500 });
        }
        console.log(qResult.rows[0]);
        const qPassword = qResult.rows[0].password;

        const answer = await new Promise<boolean>((resolve: any, reject: any) => {
            bcrypt.compare(password, qPassword, (err: Error | undefined, isMatch: boolean) => {
                if(err) reject(false)

                else if(isMatch){
                   resolve(true)
                }
                else resolve(false)
            });
        })
        if(!answer) return NextResponse.json({ text: 'Incorrect password' }, { status: 200 }); 

        return NextResponse.json({ text: 'Logged in' }, { status: 200 }); 

    } catch (err) {
        console.log(err);
        return NextResponse.json({ text: err }, { status: 500 });
    }
}
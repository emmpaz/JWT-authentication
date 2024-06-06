import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { query } from "@/actions/db";
import { QueryResult } from "pg";
import { generateAccessAndRefreshToken, setTokens } from "@/actions/jwt";
import { create_session, refresh_token_in_session } from "@/actions/sessions";


enum AUTH_COLUMNS {
    id = 'id',
    name = 'name',
    email = 'email',
    pwd = 'encrypted_password',
    sign_in = 'last_sign_in_at',
}

export async function POST(req: NextRequest, res: NextApiResponse){
    const {email, password } = await req.json();
    try {
        let qResult : QueryResult;
        try{
            qResult = await query(`SELECT * FROM users WHERE ${AUTH_COLUMNS.email} = $1`, [email]);
        }catch(err){
            return NextResponse.json({ message: 'Email or password incorrect' }, { status: 500 });
        }
        const data = qResult.rows[0] as {
            id: string,
            name: string,
            email: string,
            encrypted_password: string,
            last_sign_in_at: string
            // failed_attempts: number,
            // lockout_until: Date
        };
        
        // if(data.lockout_until && data.lockout_until > new Date()){
        //     return NextResponse.json({message: 'Account is temporarily locked.'}, {status: 403})
        // }

        // else if(data.lockout_until && data.lockout_until < new Date()){
        //     await query('UPDATE users set failed_attempts = $1, lockout_until = $2 WHERE id = $3', [0, null, data.id]);
        // }

        const answer = await new Promise<boolean>((resolve: any, reject: any) => {
            bcrypt.compare(password, data.encrypted_password, (err: Error | undefined, isMatch: boolean) => {
                
                if(err) reject(false);
                else if(isMatch){
                    resolve(true)
                }
                else resolve(false)
            });
        });
        if(!answer) {
            //const failedAttempts: number = data.failed_attempts + 1;

            // if(failedAttempts >= parseInt(process.env.NEXT_PUBLIC_MAX_ATTEMPTS as string)){

            //     const lockout_date = new Date(Date.now() + parseInt(process.env.NEXT_PUBLIC_LOCKOUT_DURATION as string))

            //     //await query('UPDATE users set failed_attempts = $1, lockout_until = $2 WHERE id = $3', [failedAttempts, lockout_date, data.id]);
            
            //     return NextResponse.json({ message: 'Account locked out.' }, { status: 200 }); 
            // }else{
                
            //     await query('UPDATE users set failed_attempts = $1 WHERE id = $2', [failedAttempts, data.id]);             
            // }
            return NextResponse.json({ message: 'Incorrect password' }, { status: 200 }); 
        }
        
        const session_id = await create_session({
            user_id: data.id, 
            ip_address: req.headers.get('x-forwarded-for') ?? "no ip address", 
            user_agent: req.headers.get('user-agent') ?? "no user agent"
        })
        
        const {accessToken, refreshToken} = generateAccessAndRefreshToken({
            id: data.id,
            email: data.email,
            name: data.name,
            last_signed_in: data.last_sign_in_at,
            session_id
        });

        await refresh_token_in_session(session_id, refreshToken);

        return setTokens(accessToken, refreshToken); 

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: err }, { status: 500 });
    }
}
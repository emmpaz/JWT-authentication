import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { query } from '../../../../actions/db';
import bcrypt from 'bcrypt';

const saltRounds = Number(process.env.NEXT_PUBLIC_SALT_ROUNDS)

export async function POST(req: NextRequest, res: NextApiResponse) {
    const { firstname, lastname, email, password } = await req.json();

    try {
        const hashedPassword = await new Promise<string>((resolve: any, reject: any) => {
            bcrypt.hash(password, saltRounds as number,
                (err: Error | undefined, hashedPassword: string) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hashedPassword);
                    }
                });
        });

        const queryString = 'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)';
        const values = [firstname, lastname, email, hashedPassword];
        
        await query(queryString, values);

        return NextResponse.json({ text: 'Inserted' }, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ text: err }, { status: 500 });
    }
}
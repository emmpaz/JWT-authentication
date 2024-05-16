import { TOKEN_COOKIE_NAME } from "@/actions/jwt/create-jwt";
import { serialize } from "cookie";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req: NextRequest, res: NextApiResponse) {
    

    const cookie = serialize(TOKEN_COOKIE_NAME, '', {
        path: '/',
        maxAge: -1,
    })

    return NextResponse.json(
        {message: 'Login successful'},
        {
            status: 200,
            headers: {
                'Set-Cookie': cookie
            }
        }
    )
}
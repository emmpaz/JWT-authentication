import { TOKEN_COOKIE_NAME, TokenPayload, decrypt, refreshAccessToken } from "@/actions/create-jwt";
import { query } from "@/actions/db-connection";
import { JWTVerifyResult, jwtVerify } from "jose";
import { JwtPayload } from "jsonwebtoken";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest, res: NextApiResponse) {
    const { refresh } = await req.json();

    if (!refresh) {
        return NextResponse.json({
            message: 'No refresh token provided'
        }, {
            status: 406
        })
    }
    const decrypted = decrypt(refresh);

    try {
        const decoded = await jwtVerify(decrypted,
            new TextEncoder().encode(process.env.NEXT_PUBLIC_REFRESH_SECRET_KEY as string)
        )

        const payload = decoded.payload as JwtPayload & TokenPayload;

        const qResult = await query('SELECT * FROM users WHERE id = $1', [payload.id]);

        const data = qResult.rows[0];

        const new_token = await refreshAccessToken({
            id: data.id,
            email: data.email,
            name: data.firstName
        });


        return NextResponse.json({
            token : new_token
        },{
            status: 200
        });

    } catch (error) {
        return NextResponse.json({
            message: 'Refresh token expired or invalid. Log in to regain access.'
        }, {
            status: 401
        })
    }

}
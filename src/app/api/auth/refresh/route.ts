import { REFRESH_COOKIE_NAME, TOKEN_COOKIE_NAME, TokenPayload, decrypt, refreshAccessToken, rotateRefreshToken } from "@/actions/jwt";
import { query } from "@/actions/db-connection";
import { JWTVerifyResult, jwtVerify } from "jose";
import { JwtPayload } from "jsonwebtoken";
import { NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { add_ID_to_DB, isBlacklisted } from "@/actions/redis";




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

        const inDB = await isBlacklisted(payload.refreshTokenId ?? "");

        if(inDB) {
            const response = NextResponse.json({
                message: 'Refresh is revoked. Sign in again to receive a new one'
            }, {
                status: 401
            });

            return response;
        }

        add_ID_to_DB(payload.refreshTokenId ?? "");

        const qResult = await query('SELECT * FROM users WHERE id = $1', [payload.id]);

        const data = qResult.rows[0];

        const access_token = await refreshAccessToken({
            id: data.id,
            email: data.email,
            name: data.firstName
        });

        const refresh_token = await rotateRefreshToken({
            id: data.id,
            email: data.email,
            name: data.firstName
        })

        return NextResponse.json({
            access_token : access_token,
            refresh_token: refresh_token
        },{
            status: 200
        });

    } catch (error) {

        const response = NextResponse.json({
            message: 'Refresh token expired or invalid. Log in to regain access.'
        }, {
            status: 401
        });

        return response;
    }

}
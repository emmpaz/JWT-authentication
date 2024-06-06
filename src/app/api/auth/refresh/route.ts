import { REFRESH_COOKIE_NAME, TOKEN_COOKIE_NAME, TokenPayload, decrypt, refreshAccessToken, rotateRefreshToken } from "@/actions/jwt";
import { query } from "@/actions/db";
import { JWTVerifyResult, jwtVerify } from "jose";
import { JwtPayload } from "jsonwebtoken";
import { NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { add_ID_to_DB, isBlacklisted } from "@/actions/redis";
import { delete_session_by_refresh, refresh_token_in_session } from "@/actions/sessions";




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

        const data = qResult.rows[0] as {
            id: string,
            name: string,
            email: string,
            encrypted_password: string,
            last_sign_in_at: string
        };

        const access_token = await refreshAccessToken({
            id: data.id,
            email: data.email,
            name: data.name,
            last_signed_in: data.last_sign_in_at,
            session_id: payload.session_id
        });

        const refresh_token = await rotateRefreshToken({
            id: data.id,
            email: data.email,
            name: data.name,
            session_id: payload.session_id
        });

        await refresh_token_in_session(payload.session_id, refresh_token);

        return NextResponse.json({
            access_token : access_token,
            refresh_token: refresh_token
        },{
            status: 200
        });

    } catch (error) {
        await delete_session_by_refresh(refresh);
        const response = NextResponse.json({
            message: 'Refresh token expired or invalid. Log in to regain access.'
        }, {
            status: 401
        });

        return response;
    }

}
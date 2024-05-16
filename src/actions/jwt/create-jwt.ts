import Cookies from 'js-cookie';
import { NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');


export const TOKEN_COOKIE_NAME = '__example_jt__';

export type TokenPayload = {
    id: string,
    email: string,

}

export function generateAccessToken(user: TokenPayload) {
    const payload = {
        id: user.id,
        email: user.email
    }

    const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

    const options = {
        expiresIn: '1h'
    };

    return jwt.sign(payload, secret, options);
}

export function setAccessToken(token: string) {

    const cookie = serialize(TOKEN_COOKIE_NAME, token, {
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
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
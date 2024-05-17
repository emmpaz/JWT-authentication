
import Cookies from 'js-cookie';
import { NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
        expiresIn: '10s'
    };

    return jwt.sign(payload, secret, options);
}

export function setAccessToken(token: string) {
        
    const response = NextResponse.json({
        message: 'Log in successful'},
        {status: 200}
    );

    response.cookies.set({
        name: TOKEN_COOKIE_NAME,
        value: token,
        maxAge: 10,
        path: '/',
        httpOnly: true
    })

    return response;
}
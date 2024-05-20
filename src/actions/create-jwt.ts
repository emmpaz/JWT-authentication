
import Cookies from 'js-cookie';
import { NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { QueryResult } from 'pg';
import { query } from './db-connection';

export const TOKEN_COOKIE_NAME = '__example_jt__';
export const REFRESH_COOKIE_NAME = '__example_refresh__';

export type TokenPayload = {
    id: string,
    email: string,
    name: string
}
/**
 * NOTES
 * 
 * we need to specify the input and output encoding for the cipher/decipher
 * reverse them
 * 
 * using env strings to create the buffer and specify encoding
 * 
 * since we are using AES-256-GCM encryption algo, we need to add the auth tag to use in decryption
 * and the initialization vector needs to be 12 bytes long
 */


export function encrypt(token: string) {
    const keyBuffer = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPT_SECRET_KEY as string, 'hex');
    const iv = randomBytes(12);

    const cipher = createCipheriv(
        'aes-256-gcm',
        keyBuffer,
        iv
    );
    //need to call final to ensure all data is processed and is finalized
    let encrypted = cipher.update(token, 'utf-8', 'hex');
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

export function decrypt(encryptedToken: string) {
    const [ivHex, encryptedData, authTagHex] = encryptedToken.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const keyBuffer = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPT_SECRET_KEY as string, 'hex');

    const decipher = createDecipheriv(
        'aes-256-gcm',
        keyBuffer,
        iv
    );
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');

    decrypted += decipher.final('utf-8');

    return decrypted;
}

export function generateAccessAndRefreshToken(user: TokenPayload) {
    const accessPayload = {
        id: user.id,
        email: user.email,
        name: user.name
    }

    const refreshPayload = {
        id: user.id,
        email: user.email,
        name: user.name
    }

    const accessSecret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string;

    const refreshSecret = process.env.NEXT_PUBLIC_REFRESH_SECRET_KEY as string;



    const accessOptions = {
        expiresIn: '10s'
    };

    const refreshOptions = {
        expiresIn: '7d'
    };

    const accessToken = jwt.sign(accessPayload, accessSecret, accessOptions);
    const refreshToken = jwt.sign(refreshPayload, refreshSecret, refreshOptions)


    const encrypted_refreshToken = encrypt(refreshToken);

    return {
        accessToken: accessToken,
        refreshToken: encrypted_refreshToken
    };
}

export async function refreshAccessToken(user: TokenPayload) {

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name
    }

    const accessSecret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string;

    const accessOptions = {
        expiresIn: '10s'
    };

    const accessToken = jwt.sign(payload, accessSecret, accessOptions);

    return accessToken;
}

export function setTokens(accessToken: string, refreshToken: string) {

    const response = NextResponse.json({
        message: 'Log in successful'
    },
        { status: 200 }
    );

    response.cookies.set({
        name: TOKEN_COOKIE_NAME,
        value: accessToken,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    })

    response.cookies.set({
        name: REFRESH_COOKIE_NAME,
        value: refreshToken,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    })

    return response;
}
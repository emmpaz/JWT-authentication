import { NextRequest, NextResponse } from "next/server";
import { REFRESH_COOKIE_NAME, TOKEN_COOKIE_NAME, TokenPayload } from "./actions/create-jwt";
import { jwtVerify } from "jose";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { error } from "console";


/**
 * Next has two server runtimes
 *  - node.js runtime
 *      - 
 *  - edge runtime (more limited)
 *      - used for middleware
 * 
 */


export async function middleware(request: NextRequest) {
  const token = cookies().get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  };
  try {
    const decoded = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string)
    );
    if (decoded.payload.exp as number < Date.now() / 1000) {
      console.log('done');
    }
  } catch (error) {
    const refresh = await fetch('https://localhost:3000/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refresh: cookies().get(REFRESH_COOKIE_NAME)?.value,
      })
    })
    if (refresh.ok) {
      const response = NextResponse.next();

      const {token} = await refresh.json();


      response.cookies.set({
        name: TOKEN_COOKIE_NAME,
        value: token,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      })

      return response;
    }
  }
  return NextResponse.next();
}


export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    '/'
  ],
};
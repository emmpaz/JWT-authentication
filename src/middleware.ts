import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE_NAME, TokenPayload } from "./actions/create-jwt";
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


export async function middleware(request: NextRequest){
  const token = cookies().get(TOKEN_COOKIE_NAME)?.value;
  
  if(!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  };

    const decoded = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string)
    )
    .then()
    .catch((reason) => console.log('error') );

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
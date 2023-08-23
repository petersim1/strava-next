import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// import { jwtVerify, SignJWT } from "jose";

// import { JWTtoSignI, JWTVerifyReturnI } from "@/types/strava";
// import refreshToken from "@/lib/auth/refresh";

// const { JWT_SECRET } = process.env;

// export const middleware = async (request: NextRequest): Promise<NextResponse> => {
//   const { value: token } = request.cookies.get("token") ?? { value: undefined };

//   const response = NextResponse.next();

//   if (!token) {
//     // user hasn't oauthed yet, or they revoked it.
//     return NextResponse.next();
//   }

//   try {
//     const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
//     const { athlete } = payload as JWTVerifyReturnI;
//     response.headers.set("X-Strava-Athlete", JSON.stringify(athlete));
//   } catch (error) {
//     const newObj = await refreshToken(token);
//     const obj: JWTtoSignI = {
//       athlete: newObj.athlete,
//       refresh_token: newObj.refresh_token,
//       access_token: newObj.access_token,
//     };

//     const newToken = await new SignJWT({ ...obj })
//       .setProtectedHeader({ alg: "HS256" })
//       .setIssuedAt()
//       .setExpirationTime(newObj.expires_at * 1000)
//       .sign(new TextEncoder().encode(JWT_SECRET));

//     response.cookies.set("token", newToken);
//     response.headers.set("X-Strava-Athlete", JSON.stringify(newObj.athlete));
//   }

//   return response;
// };

export const middleware = (): NextResponse => {
  // ignore this for now. Can uncomment above if needed. I moved this to a server action instead.
  return NextResponse.next();
};

export const config = {
  matcher: "/",
};

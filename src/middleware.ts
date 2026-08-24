import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isNotOnboarded = token && token.onboarded === false;
        const isOnboardingRoute = req.nextUrl.pathname.startsWith("/onboarding");

        if (isNotOnboarded && !isOnboardingRoute)
            return NextResponse.redirect(new URL("/onboarding", req.url));

        if (!isNotOnboarded && isOnboardingRoute)
            return NextResponse.redirect(new URL("/profile", req.url));

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({token}) => !!token,
        },
        pages: {
            signIn: "/",
        }
    }
);

export const config = {
    matcher: [
        "/onboarding",
        "/profile/:path*",
        "/dashboard/:path*"
    ],
};
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith("/student") || req.nextUrl.pathname.startsWith("/mentor")
    const isOnAuth = req.nextUrl.pathname.startsWith("/auth")

    if (isOnDashboard) {
        if (isLoggedIn) return NextResponse.next()
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl))
    }

    // Allow auth pages to handle their own redirects
    // This lets register/mentor-register pages show helpful messages to logged-in users
    if (isOnAuth) {
        return NextResponse.next()
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// export default function middleware(request: NextRequest) {
//   const token = JSON.stringify(localStorage.getItem('taskToken') || '');

//   if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   return NextResponse.next();
// }
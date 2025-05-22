import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Forward the request to your backend including cookies
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3500';
    
    // When the request comes from the client side, the credentials and cookies
    // will be automatically included by the browser
    const response = await fetch(`${backendUrl}/api/auth/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    const data = await response.json();
    
    // Return the response from the backend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Auth status check error:', error);
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
} 
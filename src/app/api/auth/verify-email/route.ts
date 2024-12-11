// src/app/api/auth/verify-email/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawToken = searchParams.get('token');

    // console.log('Received raw token for verification:', rawToken);

    if (!rawToken) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Hash the received raw token
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    // console.log('Computed hash from raw token:', hashedToken);

    // Find user with this hashed token
    const user = await prisma.user.findFirst({
      where: { 
        verificationToken: hashedToken,
        emailVerified: false
      }
    });

    // console.log('Found user:', user ? 'Yes' : 'No');

    if (!user) {
      return NextResponse.json(
        { 
          error: "Invalid verification token",
          details: "User not found or already verified"
        },
        { status: 400 }
      );
    }

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null
      }
    });

    // console.log('User verified successfully');

    // Return success JSON instead of redirecting
    return NextResponse.json({ 
      success: true,
      message: "Email verified successfully" 
    });

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { 
        error: "Failed to verify email",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
// src/app/api/auth/resend-verification/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';
import { sendEmailWithRetry } from "@/lib/email";
import VerificationEmail from "@/emails/VerificationEmail";
import { createElement } from "react";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // Check if we can send another email (e.g., rate limiting)
    const lastAttempt = user.emailVerificationLastAttempt;
    if (lastAttempt && Date.now() - lastAttempt.getTime() < 60000) { // 1 minute cooldown
      return NextResponse.json(
        { error: "Please wait before requesting another verification email" },
        { status: 429 }
      );
    }

    // Generate new token
    const newToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(newToken)
      .digest('hex');

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: hashedToken,
        emailVerificationAttempts: {
          increment: 1
        },
        emailVerificationLastAttempt: new Date(),
        emailVerificationStatus: 'PENDING'
      }
    });

    // Send new verification email
    try {
      await sendEmailWithRetry({
        to: user.email,
        subject: "Verify your email address",
        react: createElement(VerificationEmail, {
          verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${newToken}`,
          userName: user.name ?? ''
        })
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationStatus: 'SENT'
        }
      });

      return NextResponse.json({
        success: true,
        message: "Verification email sent successfully"
      });

    } catch (error) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationStatus: 'FAILED'
        }
      });

      throw error;
    }

  } catch {
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}
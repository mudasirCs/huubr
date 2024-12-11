// src/app/api/auth/forgot-password/route.ts

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Generate reset token and set expiry
    const passwordResetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto
      .createHash('sha256')
      .update(passwordResetToken)
      .digest('hex')

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + 3600000), // 1 hour from now
      }
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${passwordResetToken}`

    // Send email
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>Hi ${user.name || 'there'},</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #FF4D00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Reset Password
            </a>
          </div>
          <p>If you did not request this, please ignore this email.</p>
          <p>This reset link will expire in 1 hour.</p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}
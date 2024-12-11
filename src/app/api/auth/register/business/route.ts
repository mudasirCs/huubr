// src/app/api/auth/register/business/route.ts

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"
import { Prisma } from '@prisma/client'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email'
import { createElement } from 'react';
import VerificationEmail from '@/components/emails/VerificationEmail';


type PrismaErrorTarget = {
  target?: string[];
};

const businessRegistrationSchema = z.object({
  // Personal Info
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  
  // Business Info
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessCategory: z.string().min(1, "Business category is required"),
  phoneNumber: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Invalid phone number"),
  website: z.string().url().nullish().or(z.literal("")),

  // Location & Hours
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  county: z.string().min(2, "County is required"),
  eircode: z.string().optional().nullable(),
  openingHours: z.record(z.object({
    isOpen: z.boolean(),
    start: z.string().optional(),
    end: z.string().optional(),
  }))
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


// In your business registration route
async function sendVerificationEmail(email: string, token: string, name: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  try {
    const emailComponent = createElement(VerificationEmail, {
      verificationUrl,
      userName: name
    });

    const result = await sendEmail({
      to: email,
      subject: "Verify your email address",
      react: emailComponent
    });

    console.log('Verification email result:', result);
    return result;
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log("Received registration data:", data)

    const validatedData = businessRegistrationSchema.parse(data)
    console.log("Validation passed")

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { 
        email: validatedData.email 
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        passwordResetToken: true,
        passwordResetExpires: true
      }
    })

    if (existingUser) {
      if (!existingUser.emailVerified) {
        // If user exists but email not verified, we could:
        // 1. Either resend verification email
        // 2. Or tell them to verify their email
        return NextResponse.json({
          error: "Please verify your email to complete registration",
          needsVerification: true
        }, { status: 400 })
      }
      return NextResponse.json({
        error: "Email already registered"
      }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12)

    // Use transaction to create both user and business
    const result = await prisma.$transaction(async (tx) => {
      // console.log("Starting transaction")
      
      // Generate verification token
      const rawToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');

      // console.log('Generated raw token:', rawToken);
      // console.log('Hashed token for storage:', hashedToken);
      
      // Create user with hashed token
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.fullName,
          password: hashedPassword,
          role: "BUSINESS_OWNER",
          emailVerified: false,
          points: 0,
          verificationToken: hashedToken,
          passwordResetToken: null,
          passwordResetExpires: null
        }
      })
      // console.log("User created:", user.id)

      // Create business
      const business = await tx.business.create({
        data: {
          name: validatedData.businessName,
          category: validatedData.businessCategory,
          phone: validatedData.phoneNumber,
          website: validatedData.website || "",
          address: validatedData.address,
          city: validatedData.city,
          county: validatedData.county,
          eircode: validatedData.eircode || "",
          openingHours: validatedData.openingHours,
          ownerId: user.id
        }
      })
      // console.log("Business created:", business.id)

      return { user, business, rawToken }
    })

    // Send verification email
    try {
     /* const emailResult = */await sendVerificationEmail(
        result.user.email,
        result.rawToken, // Use the raw token for the email
        result.user.name ?? ''
      );
      
      // console.log("Verification email result:", emailResult);
      // console.log("Verification email sent successfully", emailResult);
    } catch (error) {
      // console.error("Failed to send verification email:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error during email verification');
    }

  return NextResponse.json({
    success: true,
    businessId: result.business.id,
    message: "Business registered successfully. Please check your email to verify your account."
  }, { status: 201 })

} catch (error) {
  console.error("Business registration error:", error)
  
  if (error instanceof z.ZodError) {
    return NextResponse.json({
      error: "Validation failed",
      details: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    }, { status: 400 })
  }

if (error instanceof Prisma.PrismaClientKnownRequestError) {
  if (error.code === 'P2002') {
    const meta = error.meta as PrismaErrorTarget;
    const target = meta?.target?.[0];
    return NextResponse.json({
      error: target === 'email' 
        ? "A user with this email already exists"
        : "Please try again"
    }, { status: 400 })
  }
}

  return NextResponse.json({
    error: "Failed to register business. Please try again later."
  }, { status: 500 })
}
}
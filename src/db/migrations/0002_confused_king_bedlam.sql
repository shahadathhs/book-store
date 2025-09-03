CREATE TYPE "public"."otp_purpose" AS ENUM('PASSWORD_RESET', 'LOGIN_VERIFICATION');--> statement-breakpoint
ALTER TABLE "otps" ALTER COLUMN "purpose" SET DEFAULT 'LOGIN_VERIFICATION'::"public"."otp_purpose";--> statement-breakpoint
ALTER TABLE "otps" ALTER COLUMN "purpose" SET DATA TYPE "public"."otp_purpose" USING "purpose"::"public"."otp_purpose";--> statement-breakpoint
ALTER TABLE "otps" ALTER COLUMN "purpose" DROP NOT NULL;
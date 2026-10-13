
import "dotenv/config";
import { sendVerificationEmail } from "../src/services/emailService.js";

async function testEmail() {
  try {
    const testOtp = "123456";

    await sendVerificationEmail(
      "mustafabangash456@gmail.com",
      testOtp
    );

    console.log("Verification email accepted by Brevo!");
  } catch (error) {
    console.error("Email test failed:", error.message);
  }
}

testEmail();


import "dotenv/config";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Sends a customer email verification OTP using Brevo.
 *
 * @param {string} recipientEmail - Customer's email address
 * @param {string} otp - Six-digit verification code
 */
export async function sendVerificationEmail(recipientEmail, otp) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Fixly";

  if (!apiKey || !senderEmail) {
    throw new Error("Brevo email configuration is missing");
  }

  const emailData = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: recipientEmail,
      },
    ],
    subject: "Verify your Fixly account",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px;">
        <h2>Welcome to Fixly!</h2>

        <p>Thank you for creating your Fixly account.</p>

        <p>Use the verification code below to verify your email address:</p>

        <h1 style="font-size: 32px; letter-spacing: 6px; color: #2563eb;">
          ${otp}
        </h1>

        <p>This code will expire in <strong>5 minutes</strong>.</p>

        <p>If you didn't create a Fixly account, you can ignore this email.</p>

        <p>Regards,<br />The Fixly Team</p>
      </div>
    `,
    textContent: `Your Fixly verification code is ${otp}. It expires in 5 minutes.`,
  };

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(emailData),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Brevo email delivery failed:", response.status, errorBody);
    throw new Error("Unable to send verification email");
  }

  return true;
}

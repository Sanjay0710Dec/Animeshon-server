import sgMail from "@sendgrid/mail";
import { TokenType } from "@prisma/client";


const sendgridKey = process.env.SENDGRID_API_KEY as string;
const senderEmail = process.env.SENDER_EMAIL as string;
const senderUsername = process.env.SENDER_USERNAME as string;



const sender = {
  name: senderUsername,
  email: senderEmail,
};
sgMail.setApiKey(sendgridKey);

export async function sendEmail(
  email: string,
  type: TokenType,
  verificationLink: string,
) {
  try {
    if (type === "EMAIL_VERIFICATION") {
      const mailOptions = {
        to: email,
        from: sender,
        subject: "Account Verification",
        text: "please click on below link in order to verify your email",
        html: `
                
    
                    <div style=" background-color: orange; font-family: Verdana, Geneva, Tahoma, sans-serif; padding: 20px 20px; border-radius:4px">
                      <p>please click on below link to verify</p>
                        <a href=${verificationLink}>verify your email</a>
                        <p style="letter-spacing: 2px; font-weight: 500; margin-left: 0.8rem;">If you did not request to create account, you can ignore this email.</p>
                    </div>
    `,
      };

      await sgMail.send(mailOptions);
    }

    if (type === "RESET_PASSWORD") {
      const mailOptions = {
        to: email,
        from: sender,
        subject: "Reset Password",
        text: "please click on below link in order to verify your email",
        html: `
                
    
                    <div style="height: 100%; width:100%; background-color: beige; font-family: Verdana, Geneva, Tahoma, sans-serif; padding: 20px 20px; border-radius:4px">\
                           <a href=${verificationLink}>verify your email</a>
                        <p style="letter-spacing: 2px; font-weight: 500; margin-left: 0.8rem;">If you did not ask to reset your password, you can ignore this email.</p>
                    </div>
    `,
      };
      await sgMail.send(mailOptions);
    }
  } catch (error) {
    console.log(error);
    throw new Error("error while sending email");
  }
}

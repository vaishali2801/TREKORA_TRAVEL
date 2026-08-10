// ===== Shared email layout & styling (travel themed) =====

const baseStyle = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2f6f9; line-height: 1.6; color: #334155; }
  .email-container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 30px rgba(15, 60, 90, 0.12); }
  .header { background: linear-gradient(135deg, #0f766e 0%, #0e7490 50%, #1d4ed8 100%); padding: 36px 24px; text-align: center; color: #ffffff; }
  .header .icon { font-size: 44px; line-height: 1.2; }
  .header h1 { font-size: 26px; font-weight: 700; margin: 8px 0 4px; letter-spacing: 0.3px; }
  .header p { font-size: 13px; opacity: 0.9; }
  .content { padding: 34px 30px; }
  .greeting { font-size: 17px; margin-bottom: 16px; }
  .greeting strong { color: #0e7490; }
  .message { font-size: 14.5px; color: #475569; margin-bottom: 22px; line-height: 1.8; }
  .card { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0e7490; border-radius: 10px; padding: 18px 20px; margin: 18px 0; }
  .card p { font-size: 14px; padding: 4px 0; color: #475569; }
  .card p span.label { display: inline-block; min-width: 110px; color: #64748b; font-weight: 600; }
  .price { display: inline-block; background: linear-gradient(135deg, #f59e0b, #f97316); color: #ffffff; font-size: 20px; font-weight: 700; padding: 8px 18px; border-radius: 30px; margin-top: 8px; }
  .features { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 18px 20px; margin: 20px 0; }
  .features h3 { color: #0f766e; font-size: 14px; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .features li { list-style: none; font-size: 13.5px; color: #475569; padding: 5px 0; }
  .features li:before { content: "✓"; color: #0f766e; font-weight: 700; margin-right: 9px; }
  .cta-button { display: inline-block; background: linear-gradient(135deg, #0f766e, #1d4ed8); color: #ffffff !important; padding: 13px 34px; text-decoration: none; border-radius: 30px; font-size: 15px; font-weight: 600; margin: 18px 0; }
  .note { font-size: 13px; color: #64748b; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 14px 16px; margin-top: 20px; }
  .footer { background: #f8fafc; padding: 22px 26px; text-align: center; border-top: 1px solid #e2e8f0; }
  .footer p { font-size: 12px; color: #94a3b8; margin: 6px 0; }
  .footer a { color: #0e7490; text-decoration: none; }
  @media only screen and (max-width: 600px) {
    .email-container { margin: 0; border-radius: 0; }
    .content { padding: 26px 20px; }
    .header { padding: 28px 16px; }
  }
`;

const layout = ({ icon, title, subtitle, body, footer = "Tour Package Management • Happy Travels!" }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${baseStyle}</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="icon">${icon}</div>
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>
    <div class="content">${body}</div>
    <div class="footer">
      <p>🏔️ Explore. Experience. Enjoy. 🌍</p>
      <p>${footer}</p>
    </div>
  </div>
</body>
</html>
`;

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

/**
 * Welcome email sent after registration.
 */
export const getWelcomeEmailTemplate = (userName) =>
  layout({
    icon: "🎒",
    title: "Welcome Aboard!",
    subtitle: "Your adventure starts here",
    body: `
      <div class="greeting">Hi <strong>${userName}</strong>, 👋</div>
      <div class="message">
        Thank you for joining <strong>Tour Package Management</strong>! We're thrilled to have you.
        Whether you crave snowy treks, monsoon trails, or a family beach escape — your next adventure
        is just a click away.
      </div>
      <div class="features">
        <h3>What you can do:</h3>
        <ul>
          <li>Discover curated trekking &amp; tour packages</li>
          <li>Book upcoming treks and special events</li>
          <li>Rent or buy trekking gear from our store</li>
          <li>Rate packages and share your experience</li>
          <li>Track every booking from your dashboard</li>
        </ul>
      </div>
      <div class="message">
        Your account is ready. Start exploring the trails — the mountains are calling! ⛰️
      </div>
      <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/packages" class="cta-button">Explore Packages</a>
      <div class="note">
        <strong>Pro tip:</strong> Complete your profile to get faster checkouts and personalized recommendations.
      </div>
    `,
  });

/**
 * Booking confirmation email.
 */
export const getBookingConfirmationEmailTemplate = (userName, { packageTitle, bookingDate, participants, totalPrice }) =>
  layout({
    icon: "✅",
    title: "Booking Confirmed!",
    subtitle: "Pack your bags — adventure awaits",
    body: `
      <div class="greeting">Hi <strong>${userName}</strong>,</div>
      <div class="message">Your booking has been <strong>received successfully</strong>. Here are your trip details:</div>
      <div class="card">
        <p><span class="label">🏕️ Package</span>${packageTitle}</p>
        <p><span class="label">📅 Trip Date</span>${new Date(bookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        <p><span class="label">👥 Travelers</span>${participants}</p>
        <p><span class="label">💳 Total</span><span class="price">${money(totalPrice)}</span></p>
      </div>
      <div class="note">
        Your booking is <strong>Pending</strong> until an admin confirms it. Keep an eye on your email for updates. 🚀
      </div>
    `,
  });

/**
 * Booking cancelled email.
 */
export const getBookingCancelledEmailTemplate = (userName, packageTitle) =>
  layout({
    icon: "😔",
    title: "Booking Cancelled",
    subtitle: "We hope to see you on another trail soon",
    body: `
      <div class="greeting">Hi <strong>${userName}</strong>,</div>
      <div class="message">Your booking for <strong>${packageTitle}</strong> has been cancelled as requested.</div>
      <div class="card">
        <p>If you cancelled by mistake, you can book again anytime — many packages are just one click away.</p>
      </div>
      <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/packages" class="cta-button">Find Another Adventure</a>
    `,
  });

/**
 * Booking completed email.
 */
export const getBookingCompletedEmailTemplate = (userName, packageTitle) =>
  layout({
    icon: "🎉",
    title: "Trip Completed!",
    subtitle: "Thank you for travelling with us",
    body: `
      <div class="greeting">Hi <strong>${userName}</strong>,</div>
      <div class="message">
        Your <strong>${packageTitle}</strong> trip has been marked as <strong>Completed</strong>.
        We hope it was an unforgettable journey! 🌄
      </div>
      <div class="features">
        <h3>Loved the trip? Here's how to help:</h3>
        <ul>
          <li>Leave a rating &amp; review on the package</li>
          <li>Share photos in our community gallery</li>
          <li>Refer friends and plan the next adventure</li>
        </ul>
      </div>
    `,
  });

/**
 * Forgot password email with reset link.
 */
export const getForgotPasswordEmailTemplate = (userName, resetLink) =>
  layout({
    icon: "🔐",
    title: "Reset Your Password",
    subtitle: "Password recovery request",
    body: `
      <div class="greeting">Hi <strong>${userName}</strong>,</div>
      <div class="message">
        We received a request to reset your <strong>Tour Package Management</strong> account password.
        Click the button below to set a new password. 🌄
      </div>
      <div class="features">
        <h3>Important:</h3>
        <ul>
          <li>This link will expire in <strong>15 minutes</strong></li>
          <li>It can be used only <strong>once</strong></li>
          <li>You'll be asked to login again after resetting</li>
        </ul>
      </div>
      <a href="${resetLink}" class="cta-button">Reset Password</a>
      <div class="note">
        If you did not request a password reset, you can safely ignore this email.
        Your account will remain secure. 🔒
      </div>
    `,
  });

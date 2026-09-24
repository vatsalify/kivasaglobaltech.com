Web3Forms: Autoresponder, Notification Templates, and SMTP Setup

This document contains ready-to-copy templates and step-by-step SMTP instructions to configure Web3Forms for `contact.html`.

1) Quick checklist (already present in `contact.html`)
- Form `action="https://api.web3forms.com/submit"` — present.
- Hidden `access_key` — present.
- Honeypot `_gotcha` — present.
- Client script sets `reply_to` and `to` (configured to light.kivasaglobaltech@gmail.com).
- Added hidden inputs: `form_id=project-enquiry`, `source=website-contact-form`, `redirect=/thank-you`.

2) Dashboard steps
- Log into Web3Forms -> Forms -> Open form matching the `access_key`.
- In Form Settings:
  - Recipient email(s): light.kivasaglobaltech@gmail.com
  - Reply-To: set to the field `email` (use `{{email}}` if templating required).
  - Subject: "New Project Enquiry — Kivasa Globaltech"
- Enable Autoresponder (to enquirer):
  - To: `{{email}}`
  - From: use a verified sending address (recommended: use your SMTP-configured domain)
  - Subject: "Kivasa Globaltech — We received your enquiry"
  - Body (plain or HTML): see template below.
- Notification template (internal): include all fields, IP, user agent, and timestamp.
- Anti-spam: keep `_gotcha` enabled; enable reCAPTCHA or built-in spam protection if available.
- Webhook (optional): add your webhook/CRM endpoint for server-side logging.

3) Autoresponder template (copy into Web3Forms autoresponder)
Subject:
Kivasa Globaltech — We received your enquiry

Body (plain text):
Hi {{name}},

Thanks for contacting Kivasa Globaltech about your {{project_type}} project. We have received your enquiry and our engineering team will review the details. We aim to respond within 24 business hours.

Summary of your submission:
- Project Type: {{project_type}}
- City: {{city}}
- Approx. Quantity / BOQ: {{quantity}}

If this is urgent, please call +91 82004 61631 or message us on WhatsApp: https://wa.me/918200461631

Regards,
Kivasa Globaltech
light.kivasaglobaltech@gmail.com

4) Internal notification template (email to `light.kivasaglobaltech@gmail.com`)
Subject:
[Website] New Project Enquiry — {{project_type}} — {{name}}

Body:
New project enquiry received via website contact form.

Timestamp: {{submitted_at}}
Name: {{name}}
Email: {{email}}
Phone: {{phone}}
Company: {{company}}
Project Type: {{project_type}}
City: {{city}}
Quantity / BOQ: {{quantity}}
Timeline: {{timeline}}
Requirement: {{requirement}}
Form ID: {{form_id}}
Source: {{source}}
IP: {{ip}}

5) Redirect / Thank-you page
- The form includes `redirect=/thank-you`. Create `/thank-you` page or change redirect to your preferred URL.
- Client script currently shows `#formSuccess` when Web3Forms returns success; the redirect will only be used if you prefer a full-page thank-you.

6) SMTP setup (recommended for deliverability)
A: Gmail (App Password)
- Requirements: Gmail account with 2FA enabled.
- Create an App Password: Google Account > Security > App passwords > create for "Mail" on "Other (custom name)".
- In Web3Forms dashboard > Settings > SMTP:
  - Host: smtp.gmail.com
  - Port: 587
  - Encryption: TLS
  - Username: your-gmail-username@gmail.com
  - Password: the App Password generated above
  - From: use a consistent from address (e.g., noreply@yourdomain.com or light.kivasaglobaltech@gmail.com)
- Note: Sending from your own domain is better; if sending as `@gmail.com`, SPF/DKIM handling is via Google.

B: SendGrid (recommended for higher volume)
- Create SendGrid account and verify domain or use verified sender.
- In Web3Forms SMTP settings:
  - Host: smtp.sendgrid.net
  - Port: 587
  - Encryption: TLS
  - Username: apikey
  - Password: <Your SendGrid API Key>
  - From: a verified sender (e.g., noreply@kivasaglobaltech.com)
- Configure SPF TXT record for your domain: `v=spf1 include:sendgrid.net ~all`
- Configure DKIM per SendGrid domain verification for best deliverability.

7) SPF / DKIM recommendations
- If you send from `@kivasaglobaltech.com`, add SPF record permitting SendGrid or your SMTP provider.
- Configure DKIM signing for the domain in your SMTP provider's dashboard.
- Publish DMARC (optional) for reporting.

8) Testing checklist
- Submit the form with a test email and confirm Web3Forms returns `success: true` and `#formSuccess` is shown.
- Confirm internal email delivered to `light.kivasaglobaltech@gmail.com` (check spam folder).
- Confirm autoresponder email delivered to the enquirer.
- If emails go to spam, enable SMTP with SendGrid or Gmail App Password and re-test.

9) Optional improvements
- Add a short server-side webhook to log every submission into a secure DB (recommended for auditability).
- Gate large catalogue PDF downloads behind a separate lead form and track downloads as conversions.

If you want, I can add a `/thank-you` page and patch the form to redirect there after success, or add webhook POST to a server endpoint. Tell me which one to do next.

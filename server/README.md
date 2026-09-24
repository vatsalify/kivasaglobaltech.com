Kivasa Webhook Receiver

This small Node/Express app receives POST requests at `/webhook` and logs submissions to `submissions.log` and `last-submission.json`.

Quick start

1. Install dependencies

```bash
cd server
npm install
```

2. Run locally

```bash
# optional: set a secret to require in webhook header
export WEBHOOK_SECRET=your-secret
export ADMIN_USER=admin
export ADMIN_PASS=changeme
npm start
```

3. Test with curl

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret" \
  -d '{"name":"Test","email":"test@example.com","project_type":"Railway"}'
```

Expose to the internet (for Web3Forms dashboard)

Use ngrok or a similar tunnel to expose `http://localhost:3000`.

```bash
ngrok http 3000
```

Then set the Web3Forms webhook URL to `https://<your-ngrok-host>.ngrok.io/webhook` and (if using a secret) configure the header `x-webhook-secret: your-secret` in Web3Forms webhook settings.

Admin UI

Visit `http://localhost:3000/admin` in your browser. Enter the `ADMIN_USER` and `ADMIN_PASS` credentials to load recent submissions and export CSV.

Notes on security

- The admin UI is protected by an API that requires Basic Auth using `ADMIN_USER`/`ADMIN_PASS`.
- For production, run behind HTTPS and set strong environment credentials.

Notes

- The server writes logs to `server/submissions.log`.
- For production, run under a process manager (pm2, systemd) and secure with HTTPS and proper access controls.
- Consider storing submissions in a database for long-term auditing.

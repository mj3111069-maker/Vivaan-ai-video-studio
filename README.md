# VIVAAN AI Video Studio (API connected starter)

This project wires the HTML frontend to fal.ai WAN 2.7 text-to-video through a Node/Express server. The API key stays server-side in `.env` and is never sent to the browser.

## Setup
1. Create an API key at https://fal.ai/dashboard/keys (fal usage is billed/credit-based; do not assume free unlimited usage).
2. Install Node.js 20+.
3. Copy `.env.example` to `.env`, set `FAL_KEY=your_key`.
4. Run `npm install`, then `npm start`.
5. Open http://localhost:3000

## Deploy
Deploy this folder to a Node hosting provider (e.g. Render/Railway). Add `FAL_KEY` as a server environment variable in the hosting dashboard. Do not commit `.env` or expose the key in frontend code.

## Important
- The code uses `fal-ai/wan/v2.7/text-to-video`; the model accepts prompt, aspect ratio, resolution (720p/1080p), duration 2–15 seconds.
- Generation requires a valid fal account, API key, access, and credits/billing. Actual output quality and realism vary by model and prompt.
- This starter does not implement user accounts, quotas, persistent video storage, payments, or rate limiting. Add these before public deployment.

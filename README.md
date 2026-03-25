# MonCash + Next.js Payment Demo

A simple Next.js app that integrates with the MonCash mobile payment SDK for Haiti.

## How it works

```
┌─────────────┐      POST /api/create-payment       ┌─────────────────┐
│  React Page  │ ──────────────────────────────────▶ │  Next.js API     │
│  (form)      │                                     │  Route           │
└──────┬───────┘                                     └────────┬─────────┘
       │                                                       │
       │  ◀──── returns { redirectUrl, orderId } ─────────────┘
       │                        │
       │                        │  SDK calls MonCash REST API:
       │                        │  1. Gets an OAuth token
       │                        │  2. Creates a payment
       │                        │  3. Returns a payment token
       │                        ▼
       │              ┌──────────────────┐
       └─────────────▶│  MonCash Payment  │  (user pays on MonCash's site)
                      │  Gateway         │
                      └────────┬─────────┘
                               │
                   redirects to /payment/success?transactionId=xxx
                   or          /payment/error?transactionId=xxx
                               │
                               ▼
                      ┌──────────────────┐
                      │  Success / Error  │  (fetches payment details
                      │  Page            │   via GET /api/payment-status)
                      └──────────────────┘
```

## Setup

### 1. Get MonCash sandbox credentials

1. Go to [MonCash Sandbox Portal](https://sandbox.moncashbutton.digicelgroup.com)
2. Create an account
3. Create a business → you'll get a **Client ID** and **Client Secret**

### 2. Configure environment variables

Edit `.env.local` and fill in your credentials:

```env
MONCASH_CLIENT_ID=your_client_id_here
MONCASH_CLIENT_SECRET=your_client_secret_here
MONCASH_MODE=sandbox
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project structure

```
moncash-nextjs/
├── .env.local                          # Your MonCash credentials
├── lib/
│   └── moncash.js                      # SDK configuration (server-only)
├── app/
│   ├── layout.js                       # Root layout
│   ├── globals.css                     # Styles
│   ├── page.js                         # Payment form (client component)
│   ├── api/
│   │   ├── create-payment/route.js     # Creates a payment via SDK
│   │   └── payment-status/route.js     # Looks up payment by ID
│   └── payment/
│       ├── success/page.js             # MonCash redirects here on success
│       └── error/page.js               # MonCash redirects here on failure
```

## Key concepts

### The SDK is server-side only

The `nodejs-moncash-sdk` uses your secret credentials to authenticate with
MonCash's API. It **cannot** run in the browser — that would expose your
secrets. That's why we use Next.js API routes: the SDK runs on the server,
and the browser only gets back a redirect URL.

### The payment flow

1. **User submits amount** → frontend POSTs to `/api/create-payment`
2. **API route creates payment** → SDK authenticates with MonCash, creates
   a payment order, returns a redirect URL with a payment token
3. **User is redirected** → MonCash's hosted payment page handles the
   actual money transfer (user enters their MonCash phone + PIN)
4. **MonCash redirects back** → to your success or error URL with a
   `transactionId` query parameter
5. **Success page fetches details** → calls `/api/payment-status` to get
   the full payment info (amount, payer, etc.)

### Currency

MonCash only supports **HTG** (Haitian Gourde). All amounts are in Gourdes.

## Going to production

1. Change `MONCASH_MODE` to `live`
2. Use your production Client ID and Secret from the [MonCash Business Portal](https://moncashbusiness.digicelgroup.com)
3. Update `NEXT_PUBLIC_BASE_URL` to your production domain
4. The success/error redirect URLs in the MonCash portal must match your domain

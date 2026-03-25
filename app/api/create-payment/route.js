// app/api/create-payment/route.js
// -----------------------------------------------
// POST /api/create-payment
// Body: { amount: number }
//
// 1. Generates a unique orderId
// 2. Calls the MonCash SDK to create a payment
// 3. Returns the redirect URL where the user
//    completes payment on MonCash's site
// -----------------------------------------------

const moncash = require("../../../lib/moncash");

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return Response.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Generate a unique order ID using timestamp + random suffix
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const paymentData = {
      amount: Number(amount),
      orderId: orderId,
    };

    // Wrap the callback-based SDK in a Promise
    const result = await new Promise((resolve, reject) => {
      const paymentCreator = moncash.payment;

      paymentCreator.create(paymentData, function (error, payment) {
        if (error) {
          reject(error);
        } else {
          // Get the redirect URI from the SDK
          const redirectUri = paymentCreator.redirect_uri(payment);
          resolve({
            orderId: orderId,
            redirectUrl: redirectUri,
            payment: payment,
          });
        }
      });
    });

    return Response.json(result);
  } catch (error) {
    console.error("MonCash payment creation error:", error);
    return Response.json(
      { error: "Failed to create payment. Check your MonCash credentials." },
      { status: 500 }
    );
  }
}

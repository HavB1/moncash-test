// app/api/payment-status/route.js
// -----------------------------------------------
// GET /api/payment-status?transactionId=xxx
// GET /api/payment-status?orderId=xxx
//
// Looks up a payment using the MonCash SDK's
// capture methods. You can query by either
// transactionId or orderId.
// -----------------------------------------------

const moncash = require("../../../lib/moncash");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("transactionId");
  const orderId = searchParams.get("orderId");

  if (!transactionId && !orderId) {
    return Response.json(
      { error: "Provide either transactionId or orderId as a query parameter" },
      { status: 400 }
    );
  }

  try {
    const result = await new Promise((resolve, reject) => {
      if (transactionId) {
        // Look up by transaction ID
        moncash.capture.getByTransactionId(
          transactionId,
          function (error, capture) {
            if (error) reject(error);
            else resolve(capture);
          }
        );
      } else {
        // Look up by order ID
        moncash.capture.getByOrderId(orderId, function (error, capture) {
          if (error) reject(error);
          else resolve(capture);
        });
      }
    });

    return Response.json(result);
  } catch (error) {
    console.error("MonCash status lookup error:", error);
    return Response.json(
      { error: "Failed to retrieve payment status" },
      { status: 500 }
    );
  }
}

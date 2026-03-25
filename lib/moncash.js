// lib/moncash.js
const HOST =
  process.env.MONCASH_MODE === "sandbox"
    ? "sandbox.moncashbutton.digicelgroup.com"
    : "moncashbutton.digicelgroup.com";

const GATEWAY_BASE =
  process.env.MONCASH_MODE === "sandbox"
    ? "https://sandbox.moncashbutton.digicelgroup.com/Moncash-middleware"
    : "https://moncashbutton.digicelgroup.com/Moncash-middleware";

async function getAccessToken() {
  const credentials = Buffer.from(
    `${process.env.MONCASH_CLIENT_ID}:${process.env.MONCASH_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch(`https://${HOST}/Api/oauth/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "scope=read,write&grant_type=client_credentials",
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get MonCash access token");
  return data.access_token;
}

async function createPayment({ amount, orderId }) {
  const token = await getAccessToken();

  const res = await fetch(`https://${HOST}/Api/v1/CreatePayment`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, orderId }),
  });

  const data = await res.json();
  if (data.status !== 202) throw new Error(JSON.stringify(data));

  const redirectUrl = `${GATEWAY_BASE}/Payment/Redirect?token=${data.payment_token.token}`;
  return { orderId, redirectUrl, payment: data };
}

async function getPaymentByTransactionId(transactionId) {
  const token = await getAccessToken();

  const res = await fetch(`https://${HOST}/Api/v1/RetrieveTransactionPayment`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transactionId }),
  });

  const data = await res.json();
  if (data.status !== 200) throw new Error(JSON.stringify(data));
  return data;
}

async function getPaymentByOrderId(orderId) {
  const token = await getAccessToken();

  const res = await fetch(`https://${HOST}/Api/v1/RetrieveOrderPayment`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId }),
  });

  const data = await res.json();
  if (data.status !== 200) throw new Error(JSON.stringify(data));
  return data;
}

module.exports = {
  createPayment,
  getPaymentByTransactionId,
  getPaymentByOrderId,
};

// lib/moncash.js
// -----------------------------------------------
// This file configures the MonCash SDK once and
// exports the configured instance for use in
// API routes. It only runs on the server.
// -----------------------------------------------

// const moncash = require("nodejs-moncash-sdk");

// moncash.configure({
//   mode: process.env.MONCASH_MODE || "sandbox",
//   client_id: process.env.MONCASH_CLIENT_ID,
//   client_secret: process.env.MONCASH_CLIENT_SECRET,
// });

// module.exports = moncash;

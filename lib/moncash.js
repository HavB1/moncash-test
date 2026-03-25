// lib/moncash.js
// -----------------------------------------------
// This file configures the MonCash SDK once and
// exports the configured instance for use in
// API routes. It only runs on the server.
// -----------------------------------------------

const moncash = require("nodejs-moncash-sdk");

moncash.configure({
  mode: process.env.MONCASH_MODE || "sandbox",
  client_id: process.env.MONCASH_CLIENT_ID,
  client_secret: process.env.MONCASH_CLIENT_SECRET,
});

module.exports = moncash;

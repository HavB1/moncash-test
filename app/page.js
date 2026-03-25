"use client";

import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Preset amounts in HTG (Haitian Gourde)
  const presets = [50, 100, 250, 500];

  async function handlePayment(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Call our API route to create a payment
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment creation failed");
      }

      // 2. Save the orderId so we can look it up later
      localStorage.setItem("lastOrderId", data.orderId);

      // 3. Redirect the user to MonCash to complete payment
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      {/* Brand */}
      <div className="brand fade-in">
        <div className="brand-logo">
          mon<span>cash</span>
        </div>
        <div className="brand-sub">Payment Demo</div>
      </div>

      {/* Payment Card */}
      <div className="card fade-in-delay">
        <h1 className="card-title">Send a payment</h1>
        <p className="card-desc">
          Enter an amount in Haitian Gourdes to test the MonCash payment flow.
        </p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handlePayment}>
          {/* Amount Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              min="1"
              step="1"
              className="form-input"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <div className="currency-tag">HTG — Haitian Gourde</div>
          </div>

          {/* Quick-select presets */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {presets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(String(val))}
                className="btn-secondary"
                style={{
                  flex: 1,
                  textAlign: "center",
                  borderColor:
                    amount === String(val)
                      ? "var(--gold)"
                      : "var(--ink-border)",
                  color:
                    amount === String(val) ? "var(--gold)" : "var(--sand)",
                }}
              >
                {val} HTG
              </button>
            ))}
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Connecting to MonCash...
              </>
            ) : (
              "Pay with MonCash"
            )}
          </button>
        </form>
      </div>

      <p className="footer-note fade-in-delay">
        Sandbox mode · No real money is charged ·{" "}
        <a
          href="https://sandbox.moncashbutton.digicelgroup.com"
          target="_blank"
          rel="noreferrer"
        >
          Get API keys
        </a>
      </p>
    </div>
  );
}

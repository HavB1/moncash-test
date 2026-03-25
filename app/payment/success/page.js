"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDetails() {
      if (!transactionId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/payment-status?transactionId=${transactionId}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);
        setPaymentDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [transactionId]);

  return (
    <div className="page-wrapper">
      <div className="card fade-in" style={{ textAlign: "center" }}>
        <div className="status-icon success">✓</div>
        <h1 className="card-title">Payment successful</h1>
        <p className="card-desc">
          Your MonCash payment has been processed.
        </p>

        {loading && (
          <p style={{ color: "var(--sand-muted)", fontSize: "0.9rem" }}>
            <span className="spinner" style={{ borderTopColor: "var(--gold)" }} />
            Loading details...
          </p>
        )}

        {error && <div className="error-msg">{error}</div>}

        {paymentDetails?.payment && (
          <div style={{ textAlign: "left", marginTop: "1rem" }}>
            <div className="detail-row">
              <span className="detail-label">Transaction ID</span>
              <span className="detail-value">
                {paymentDetails.payment.transaction_id}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Order ID</span>
              <span className="detail-value">
                {paymentDetails.payment.reference}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount</span>
              <span className="detail-value">
                {paymentDetails.payment.cost} HTG
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payer</span>
              <span className="detail-value">
                {paymentDetails.payment.payer}
              </span>
            </div>
          </div>
        )}

        {!loading && transactionId && !paymentDetails && !error && (
          <div style={{ textAlign: "left", marginTop: "1rem" }}>
            <div className="detail-row">
              <span className="detail-label">Transaction ID</span>
              <span className="detail-value">{transactionId}</span>
            </div>
          </div>
        )}

        <a href="/" className="btn-secondary" style={{ marginTop: "1.5rem" }}>
          ← Make another payment
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="page-wrapper">
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ color: "var(--sand-muted)" }}>Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

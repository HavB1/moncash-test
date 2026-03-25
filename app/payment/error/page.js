"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const errorMessage = searchParams.get("errorMessage");

  return (
    <div className="page-wrapper">
      <div className="card fade-in" style={{ textAlign: "center" }}>
        <div className="status-icon error">✕</div>
        <h1 className="card-title">Payment failed</h1>
        <p className="card-desc">
          {errorMessage || "Something went wrong with your MonCash payment."}
        </p>

        {transactionId && (
          <div style={{ textAlign: "left", marginTop: "1rem" }}>
            <div className="detail-row">
              <span className="detail-label">Transaction ID</span>
              <span className="detail-value">{transactionId}</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "center" }}>
          <a href="/" className="btn-primary" style={{ width: "auto", padding: "0.7rem 1.5rem" }}>
            Try again
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
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
      <ErrorContent />
    </Suspense>
  );
}

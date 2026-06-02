interface CVReceivedEmailProps {
  fullName: string;
  packageName: string;
  orderReference: string;
}

export default function CVReceivedEmail({
  fullName,
  packageName,
  orderReference,
}: CVReceivedEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        color: "#333",
      }}
    >
      <h2 style={{ color: "#1a1a1a" }}>We've received your CV! 🎉</h2>

      <p>Hi {fullName},</p>

      <p>
        Thank you for submitting your CV. We've received it and our team will
        begin working on your <strong>{packageName}</strong> right away.
      </p>

      <div
        style={{
          background: "#f5f5f5",
          borderRadius: "8px",
          padding: "16px",
          margin: "24px 0",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          Order Reference
        </p>
        <p style={{ margin: "4px 0 0", fontWeight: "bold", fontSize: "16px" }}>
          {orderReference}
        </p>
      </div>

      <p>Here's what happens next:</p>
      <ol style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
        <li>Our team reviews your submitted CV</li>
        <li>We begin optimizing it to the standard of your selected package</li>
        <li>
          You'll receive the first draft via email within the agreed turnaround
          time
        </li>
      </ol>

      <p>
        If you have any questions in the meantime, feel free to reply to this
        email or contact our support team.
      </p>

      <p>
        Warm regards,
        <br />
        <strong>The Kracada Team</strong>
      </p>
    </div>
  );
}

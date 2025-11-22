import { QRCodeCanvas } from "qrcode.react";

interface QRCodePrintProps {
  url: string;
  size?: number;
}

const QRCodePrint: React.FC<QRCodePrintProps> = ({ url, size = 256 }) => {
  return (
    <div
      id="print-area"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "40px",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "var(--brand-color)", marginBottom: "2rem" }}>
        Scan to Provide Feedback
      </h1>

      <QRCodeCanvas value={url} size={size} level="H" includeMargin={true} />

      {/* <p
        style={{
          marginTop: "20px",
          wordBreak: "break-all",
          fontSize: "16px",
          maxWidth: "300px",
        }}
      >
        {url}
      </p> */}

      <button
        onClick={() => window.print()}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "var(--brand-color)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 600,
          transition: "background-color 0.3s ease, transform 0.1s ease",
        }}
      >
        Print QR Code
      </button>
    </div>
  );
};

export default QRCodePrint;

import { useState } from "react";
import chatIcon from "/assets/chat_icon.svg";

export default function DifyChatIframe() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          padding: "12px 16px",
          borderRadius: 999,
          background: "#00c1d6e6",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          zIndex: 2147483647,
        }}
      >
        <img src={chatIcon} alt="icon" width={20} height={20} />
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 80,
            width: 380,
            height: 560,
            maxWidth: "92vw",
            maxHeight: "80vh",
            border: "1px solid #ddd",
            borderRadius: 16,
            overflow: "hidden",
            background: "#fff",
            zIndex: 2147483646,
            boxShadow: "0 8px 24px rgba(0,0,0,.2)",
          }}
        >
          <iframe
            src="https://udify.app/chatbot/Daeo9aMpVsygmKlV"
            style={{ width: "100%", height: "100%", border: 0 }}
            allow="microphone"
          />
        </div>
      )}
    </>
  );
}

import { useTheme } from "../hooks/useTheme";

const LoadingFallback = () => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(135deg, rgb(224, 231, 255), rgb(240, 242, 245))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 280,
          height: 280,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "16px solid transparent",
            borderTop: `16px solid ${colors.info}`,
            borderRight: `16px solid ${colors.primary}`,
            animation: "spin 1.5s linear infinite",
            boxSizing: "border-box",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="https://assurerepair.com/wp-content/uploads/2025/09/Untitled-design-14-scaled-e1757424242558.png"
            alt="Company Logo"
            style={{ width: 150, marginBottom: 24 }}
          />
          <span
            style={{
              color: colors.info,
              fontWeight: 700,
              fontSize: 24,
              textAlign: "center",
            }}
          >
            Please wait...
          </span>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingFallback;

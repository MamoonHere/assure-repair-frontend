import { Layout } from "antd";
import Navbar from "../commons/Navbar";
import { useTheme } from "../hooks/useTheme";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { K } from "../constants/constants";

const { Content } = Layout;

const Home = () => {
  const { colors, spacing } = useTheme();
  const socketRef = useRef(null);

  useEffect(() => {
    const socketURL = K.NetworkCall.baseURL
    const socket = io(socketURL, {
      withCredentials: true
    });
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log("✅ Socket.IO connection established successfully");
      console.log("Socket ID:", socket.id);
    });
    socket.onAny((eventName, ...args) => {
      console.log(`📨 Socket.IO event received: "${eventName}"`, args);
    });
    socket.on('connect_error', (error) => {
      console.error("❌ Socket.IO connection error:", error);
    });
    socket.on('disconnect', (reason) => {
      console.log("🔌 Socket.IO disconnected:", reason);
    });
    return () => {
      if (socketRef.current && socketRef.current.connected) {
        console.log("Cleaning up Socket.IO connection...");
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", background: colors.bgContainer }}>
      <Navbar />
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: `${spacing.paddingLG}px`,
          background: "linear-gradient(135deg, #e0e7ff, #f0f2f5)",
        }}
      >
      </Content>
    </Layout>
  );
};

export default Home;

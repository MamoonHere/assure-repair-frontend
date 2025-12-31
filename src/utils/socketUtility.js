export const handleSocketConnected = (socket) => {
  socket.on("connect", () => console.log("Socket connected:", socket.id));
};

export const handleSocketThrownError = (socket) => {
  socket.on("connect_error", (err) => console.error("Socket error:", err));
};

export const handleSocketDisconnected = (socket) => {
  socket.on("disconnect", (msg) => console.log("Socket disconnected:", msg));
};

export const handleSocketCleanup = (socket) => {
  if (socket.connected) socket.disconnect();
};

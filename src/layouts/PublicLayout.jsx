import { useTheme } from "../hooks/useTheme";

const PublicLayout = (Component) => {
  return function PublicLayoutWrapper() {
    const { gradients } = useTheme();

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: gradients.primaryVertical,
        }}
      >
        <Component />
      </div>
    );
  };
};

export default PublicLayout;

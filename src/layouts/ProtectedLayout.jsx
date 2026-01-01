import { Layout } from "antd";
import Navbar from "../components/Navbar";
import { useTheme } from "../hooks/useTheme";

const { Content } = Layout;

const ProtectedLayout = (Component, addContentStyles = false) => {
  return function ProtectedLayoutWrapper(props) {
    const { colors, borderRadius, shadows } = useTheme();

    return (
      <Layout style={{ minHeight: "100vh", background: colors.bgContainer }}>
        <Navbar />
        <Content
          style={
            addContentStyles
              ? {
                  borderRadius: borderRadius.card,
                  boxShadow: shadows.card,
                  backgroundColor: colors.bgContainer,
                }
              : {}
          }
        >
          <Component {...props} />
        </Content>
      </Layout>
    );
  };
};

export default ProtectedLayout;

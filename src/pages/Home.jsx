import { Layout, Card, Typography } from "antd";
import Navbar from "../commons/Navbar";
import { useTheme } from "../hooks/useTheme";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  const { colors, borderRadius, shadows, spacing } = useTheme();

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
        <Card
          style={{
            width: 600,
            borderRadius: borderRadius.card,
            boxShadow: shadows.card,
            textAlign: "center",
            padding: `${spacing.paddingLG}px`,
            backgroundColor: colors.bgContainer,
          }}
        >
          <Title level={2} style={{ color: colors.text }}>
            Welcome to Live Map
          </Title>
          <Paragraph style={{ fontSize: 16, color: colors.textSecondary }}>
            This is the home page. The <strong>Live Map</strong> feature will be
            implemented here.
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  );
};

export default Home;

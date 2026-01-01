import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { colors, borderRadius, shadows, gradients, spacing } = useTheme();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(
        values.email || values.username,
        values.password
      );
      if (result.success) {
        message.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      message.error(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        width: 400,
        borderRadius: borderRadius.card,
        boxShadow: shadows.card,
        padding: `${spacing.paddingLG}px ${spacing.padding}px`,
        backgroundColor: colors.bgContainer,
        textAlign: "center",
      }}
    >
      <img
        src="https://assurerepair.com/wp-content/uploads/2025/09/Untitled-design-14-scaled-e1757424242558.png"
        alt="Company Logo"
        style={{ width: 150, marginBottom: 24 }}
      />

      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
          style={{ textAlign: "left" }}
        >
          <Input
            placeholder="Enter your email"
            style={{
              borderRadius: borderRadius.base,
            }}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          style={{ textAlign: "left" }}
        >
          <Input.Password
            placeholder="Enter your password"
            style={{
              borderRadius: borderRadius.base,
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{
              borderRadius: borderRadius.base,
              background: gradients.primary,
              border: "none",
              marginTop: spacing.marginLG,
            }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;

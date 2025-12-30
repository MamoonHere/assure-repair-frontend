import { useState, useEffect } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { userApi } from "../services/requests/userApi";

const SetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { colors, borderRadius, shadows, gradients, spacing } = useTheme();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      message.error("Invalid or missing token");
      navigate("/login");
    }
  }, [token, navigate]);

  const onFinish = async (values) => {
    if (!token) {
      message.error("Invalid or missing token");
      return;
    }

    setLoading(true);
    try {
      await userApi.setPassword(token, values.password);
      message.success("Password set successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      message.error(
        error.message || "Failed to set password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
          name="setPassword"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters!",
              },
            ]}
            style={{ textAlign: "left" }}
          >
            <Input.Password
              placeholder="Enter your password"
              style={{
                borderRadius: borderRadius.base,
              }}
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
            style={{ textAlign: "left" }}
          >
            <Input.Password
              placeholder="Confirm your password"
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
              Set Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SetPassword;



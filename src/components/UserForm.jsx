import { useState, useEffect } from "react";
import { Modal, Form, Input, message, Button, Space, Row, Col } from "antd";
import { userApi } from "../services/requests/userApi";

const UserForm = ({ open, onCancel, onSuccess, userData = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!userData;

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        form.setFieldsValue({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, userData, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let response;
      if (isEditMode) {
        response = await userApi.updateUser(
          values.email,
          values.firstName,
          values.lastName,
          userData.id
        );
        message.success(response?.message || "User updated successfully");
      } else {
        response = await userApi.createUser(
          values.email,
          values.firstName,
          values.lastName
        );
        message.success(response?.message || "User created successfully");
      }
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (err) {
      console.error(err);
      message.error(
        err?.message || isEditMode
          ? "Failed to update user"
          : "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      title={isEditMode ? "Update User" : "Create User"}
      onCancel={handleCancel}
      footer={null}
      centered
      width={500}
    >
      <Form
        form={form}
        name="userForm"
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
        style={{ marginTop: 24 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please input first name!" }]}
            >
              <Input placeholder="Enter First Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Please input last name!" }]}
            >
              <Input placeholder="Enter Last Name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter Email" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditMode ? "Update" : "Create"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;

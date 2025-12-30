import {
  Layout,
  Card,
  Typography,
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Flex,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined, MailOutlined } from "@ant-design/icons";
import Navbar from "../commons/Navbar";
import { useTheme } from "../hooks/useTheme";
import { userApi } from "../services/requests/userApi";
import { useEffect, useState } from "react";
import UserForm from "../components/UserForm";

const { Content } = Layout;
const { Title } = Typography;

const UserManagement = () => {
  const [tableState, setTableState] = useState({
    users: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    loading: false,
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    selectedUser: null,
  });
  const { colors, borderRadius, shadows, spacing } = useTheme();

  const fetchUsers = async (page, limit) => {
    setTableState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await userApi.getAllUsers(page, limit);
      if (response.data) {
        setTableState({
          users: response.data.users || [],
          pagination: {
            current: response.data.pagination?.page || page,
            pageSize: response.data.pagination?.limit || limit,
            total: response.data.pagination?.total || 0,
          },
          loading: false,
        });
      }
    } catch (err) {
      console.error(err);
      message.error(err?.message || "Failed to fetch users");
      setTableState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchUsers(1, 10);
  }, []);

  const handleTableChange = (newPagination) => {
    fetchUsers(newPagination.current, newPagination.pageSize);
  };

  const handleUpdate = (record) => {
    setModalState({ isOpen: true, selectedUser: record });
  };

  const handleCreate = () => {
    setModalState({ isOpen: true, selectedUser: null });
  };

  const handleFormSuccess = () => {
    fetchUsers(tableState.pagination.current, tableState.pagination.pageSize);
  };

  const handleModalCancel = () => {
    setModalState({ isOpen: false, selectedUser: null });
  };

  const handleDelete = async (record) => {
    try {
      const response = await userApi.deleteUser(record.id);
      message.success(response?.message ||"User deleted successfully");
      fetchUsers(tableState.pagination.current, tableState.pagination.pageSize);
    } catch (err) {
      console.error(err);
      message.error(err?.message || "Failed to delete");
    }
  };

  const handleResendEmail = async (record) => {
    try {
      const response = await userApi.resendEmail(record.id);
      message.success(response?.message || "Password reset email sent successfully");
    } catch (err) {
      console.error(err);
      message.error(err?.message || "Failed to send email");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      align: "center",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      align: "center",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      align: "center",
      render: (roles) => {
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
          return "-";
        }
        return (
          <>
            {roles.map((role) => (
              <Tag key={role.id || role.name} color="green">
                {role.name}
              </Tag>
            ))}
          </>
        );
      },
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      align: "center",
      render: (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString();
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleUpdate(record)}
          >
            Update
          </Button>
          <Popconfirm
            title="Delete User"
            description={`Are you sure you want to proceed?`}
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Resend Email"
            description={`Are you sure you want to proceed?`}
            onConfirm={() => handleResendEmail(record)}
            okText="Yes"
            cancelText="No"
            placement="topLeft"
          >
            <Button icon={<MailOutlined />} size="small">
              Resend Email
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: colors.bgContainer }}>
      <Navbar />
      <Content
        style={{
          padding: `${spacing.paddingLG}px`,
          background: colors.bgContainer,
        }}
      >
        <Card
          style={{
            borderRadius: borderRadius.card,
            boxShadow: shadows.card,
            backgroundColor: colors.bgContainer,
          }}
        >
          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: `${spacing.marginLG}px` }}
          >
            <Title level={2} style={{ margin: 0 }}>
              User Management
            </Title>
            <Button type="primary" size="middle" onClick={handleCreate}>
              Create User
            </Button>
          </Flex>
          <Table
            columns={columns}
            dataSource={tableState.users}
            rowKey="id"
            loading={tableState.loading}
            pagination={{
              current: tableState.pagination.current,
              pageSize: tableState.pagination.pageSize,
              total: tableState.pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            onChange={handleTableChange}
          />
        </Card>
      </Content>
      <UserForm
        open={modalState.isOpen}
        onCancel={handleModalCancel}
        onSuccess={handleFormSuccess}
        userData={modalState.selectedUser}
      />
    </Layout>
  );
};

export default UserManagement;

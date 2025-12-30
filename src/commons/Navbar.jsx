import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Dropdown, Avatar, Space, Typography } from "antd";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { useTheme } from "../hooks/useTheme";
import LogOut from "../components/LogOut";
import { useAuth } from "../contexts/AuthContext";
import "../css/navbar.css";

const { Header } = Layout;
const { Text } = Typography;

const formatName = (name = "") =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

const isPermissionPresent = (requiredPermission, userPermissions = []) => {
  return userPermissions.includes(requiredPermission);
};

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { colors, borderRadius, shadows, gradients, spacing } = useTheme();

  const menuItems = [
    {
      key: "/",
      label: <span style={{ color: "#fff" }}>Live Map</span>,
    },
    {
      key: "/user-management",
      label: <span style={{ color: "#fff" }}>User Managment</span>,
      permission: "USERS.MANAGE",
    },
  ];

  const userMenu = {
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        onClick: () => setIsOpen(true),
      },
    ],
  };

  return (
    <React.Fragment>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: gradients.primary,
          padding: `0 ${spacing.paddingLG}px`,
          boxShadow: shadows.secondary,
          height: 70,
          lineHeight: "70px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              backgroundColor: colors.bgContainer,
              padding: `${spacing.paddingXS}px ${spacing.paddingSM}px`,
              borderRadius: borderRadius.base,
              marginRight: spacing.marginLG,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => navigate("/")}
          >
            <img
              src="https://assurerepair.com/wp-content/uploads/2025/09/Untitled-design-14-scaled-e1757424242558.png"
              alt="Company Logo"
              style={{ width: 120, display: "block" }}
            />
          </div>
          <Menu
            theme="light"
            mode="horizontal"
            items={menuItems.filter(
              (item) =>
                !item.permission ||
                isPermissionPresent(item.permission, user.permissions)
            )}
            onClick={({ key }) => navigate(key)}
            selectedKeys={[location.pathname]}
            style={{
              background: "transparent",
              fontWeight: 500,
              borderBottom: "none",
              flex: 1,
              minWidth: 0,
            }}
            className="navbar-menu"
          />
        </div>
        <div style={{ marginLeft: 16 }}>
          <Dropdown
            menu={userMenu}
            placement="bottom"
            trigger={["click"]}
            align={{ offset: [0, -6] }}
          >
            <Space
              size="middle"
              style={{
                cursor: "pointer",
                padding: "6px 10px",
                borderRadius: borderRadius.base,
                transition: "background 0.2s",
              }}
            >
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{
                  cursor: "pointer",
                  backgroundColor: colors.bgContainer,
                  color: colors.primary,
                }}
              />
              <Text style={{ color: "#fff", fontWeight: 500 }}>
                {formatName(user?.firstName)}
              </Text>
              <DownOutlined style={{ color: "#fff", fontSize: 12 }} />
            </Space>
          </Dropdown>
        </div>
      </Header>
      <LogOut isOpen={isOpen} setIsOpen={setIsOpen} />
    </React.Fragment>
  );
};

export default Navbar;

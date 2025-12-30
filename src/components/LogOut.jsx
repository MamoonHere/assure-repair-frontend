import { Button, Modal, Space, Result } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LogOut = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (type = false) => {
    logout(type);
    navigate("/login");
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      title="Are you sure you want to log out?"
      onCancel={handleCancel}
      centered
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={handleCancel}>Cancel</Button>

          <Space>
            <Button type="primary" onClick={() => handleLogout(true)}>
              Log out from all devices
            </Button>
            <Button type="primary" onClick={handleLogout}>
              Log out
            </Button>
          </Space>
        </div>
      }
    >
      <Result
        title="You can log out from this
        device or from all devices for better security."
        subTitle="Please choose how you would like to proceed."
      />
    </Modal>
  );
};

export default LogOut;

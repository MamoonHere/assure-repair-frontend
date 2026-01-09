import { AutoComplete, Input, Typography, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useTheme } from "../hooks/useTheme";

const { Text } = Typography;

const LocationInput = ({
  label,
  value,
  options,
  loading,
  disabled,
  placeholder,
  icon,
  onSearch,
  onChange,
  onSelect,
}) => {
  const { borderRadius, spacing } = useTheme();

  return (
    <div>
      <Text strong style={{ display: "block", marginBottom: spacing.marginSM }}>
        {label}:
      </Text>
      <AutoComplete
        value={value}
        options={options}
        disabled={disabled}
        allowClear
        style={{ width: "100%" }}
        placeholder={placeholder}
        notFoundContent={
          loading ? (
            <Spin
              size="small"
              indicator={<LoadingOutlined spin />}
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px 0",
              }}
            />
          ) : (
            "No results found"
          )
        }
        showSearch={{ onSearch, filterOption: false }}
        onChange={onChange}
        onSelect={onSelect}
      >
        <Input
          prefix={icon}
          disabled={disabled}
          style={{
            borderRadius: borderRadius.base,
            boxShadow: "0 0 6px rgba(24, 66, 129, 0.35)",
          }}
        />
      </AutoComplete>
    </div>
  );
};

export default LocationInput;

import { ConfigProvider } from 'antd';

const themeConfig = {
  token: {
    colorPrimary: '#184281',
    colorInfo: '#184281',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    colorText: 'rgba(0, 0, 0, 0.88)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
    colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
    colorLink: '#0e5fa5',
    colorLinkHover: '#22245c',
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 500,
      primaryShadow: '0 2px 0 rgba(14, 95, 165, 0.1)',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      paddingInline: 16,
      paddingBlock: 12,
    },
    Card: {
      borderRadius: 12,
      paddingLG: 24,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    },
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 8,
      itemActiveBg: 'rgba(14, 95, 165, 0.1)',
      itemSelectedBg: 'rgba(14, 95, 165, 0.1)',
      itemSelectedColor: '#0e5fa5',
    },
    Form: {
      labelFontSize: 14,
      verticalLabelPadding: '0 0 8px',
    },
    Avatar: {
      borderRadius: 8,
    },
    Dropdown: {
      borderRadius: 8,
    },
    Layout: {
      bodyBg: '#f0f2f5',
      headerBg: 'transparent',
      headerPadding: '0 32px',
    },
  },
};

const ThemeProvider = ({ children }) => {
  return (
    <ConfigProvider theme={themeConfig}>
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;

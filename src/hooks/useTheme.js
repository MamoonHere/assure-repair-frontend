import { theme } from "antd";

export const useTheme = () => {
  const { token } = theme.useToken();

  return {
    colors: {
      primary: token.colorPrimary,
      info: token.colorInfo,
      success: token.colorSuccess,
      warning: token.colorWarning,
      error: token.colorError,
      bgContainer: token.colorBgContainer,
      bgElevated: token.colorBgElevated,
      border: token.colorBorder,
      borderSecondary: token.colorBorderSecondary,
      text: token.colorText,
      textSecondary: token.colorTextSecondary,
      textTertiary: token.colorTextTertiary,
      link: token.colorLink,
      linkHover: token.colorLinkHover,
    },
    spacing: {
      padding: token.padding,
      paddingLG: token.paddingLG,
      paddingSM: token.paddingSM,
      paddingXS: token.paddingXS,
      margin: token.margin,
      marginLG: token.marginLG,
      marginSM: token.marginSM,
      marginXS: token.marginXS,
    },
    borderRadius: {
      base: token.borderRadius,
      card: 12,
    },
    shadows: {
      base: token.boxShadow,
      secondary: token.boxShadowSecondary,
      card: "0 8px 24px rgba(0, 0, 0, 0.1)",
    },
    typography: {
      fontSize: token.fontSize,
      fontFamily: token.fontFamily,
    },
    controlHeight: {
      base: token.controlHeight,
      large: token.controlHeightLG,
      small: token.controlHeightSM,
    },
    gradients: {
      primary: "linear-gradient(90deg, #22245c 0%, #0e5fa5 100%)",
      primaryVertical: "linear-gradient(135deg, #22245c 0%, #0e5fa5 100%)",
    },
    token,
  };
};


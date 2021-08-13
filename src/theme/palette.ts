import { alpha } from '@material-ui/core/styles';

// ----------------------------------------------------------------------

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

interface GradientsPaletteOptions {
  primary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface Palette {
    gradients: GradientsPaletteOptions;
  }
  interface PaletteOptions {
    gradients?: GradientsPaletteOptions;
  }
}

declare module '@material-ui/core' {
  interface Color {
    0: string;
    500_8: string;
    500_12: string;
    500_16: string;
    500_24: string;
    500_32: string;
    500_48: string;
    500_56: string;
    500_80: string;
  }
}

// SETUP COLORS
const PRIMARY = {
  lighter: '#f9baac',
  light: '#f7a694',
  main: '#f37f65',
  dark: '#ef5836',
  darker: '#ed441e'
};
const SECONDARY = {
  lighter: '#6674c3',
  light: '#5463bc',
  main: '#3E4C9F',
  dark: '#303a7a',
  darker: '#293268'
};
const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A'
};
const SUCCESS = {
  lighter: '#4bd786',
  light: '#36d278',
  main: '#27ae60',
  dark: '#1e8449',
  darker: '#19703e'
};
const WARNING = {
  lighter: '#f7df93',
  light: '#f5d77c',
  main: '#f2c94c',
  dark: '#efbb1c',
  darker: '#e1ae10'
};
const ERROR = {
  lighter: '#d38783',
  light: '#cc7570',
  main: '#bf514a',
  dark: '#9e3e38',
  darker: '#8b3731'
};
const GREY = {
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8)
};
const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main)
};
const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY, contrastText: '#fff' },
  secondary: { ...SECONDARY, contrastText: '#fff' },
  info: { ...INFO, contrastText: '#fff' },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: '#fff' },
  grey: GREY,
  gradients: GRADIENTS,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48
  }
};

const palette = {
  light: {
    ...COMMON,
    text: { primary: '#242832', secondary: '#474F63', disabled: '#9CA4B8' },
    background: { paper: '#FFFBF4', default: '#FFFBF4', neutral: '#FFFBF4' },
    action: { active: '#474F63', ...COMMON.action }
  },
  dark: {
    ...COMMON,
    text: { primary: '#FFFBF4', secondary: '#FFF6E9', disabled: '#CED2DC' },
    background: { paper: '#242832', default: '#242832', neutral: '#474F63' },
    action: { active: '#FFF6E9', ...COMMON.action }
  }
};

export default palette;

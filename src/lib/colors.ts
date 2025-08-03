// Minimal color palette for the research assessment project
export const colors = {
  // Primary colors
  white: '#FFFFFF',
  grey: '#F5F5F5',
  lightGrey: '#FAFAFA',
  turquoise: '#40E0D0',
  pastelBlue: '#7FB3D3',
  pastelGreen: '#8BC34A',
  pastelYellow: '#FFD54F',
  pastelPink: '#F48FB1',
  pastelPurple: '#B39DDB',
  
  // Semantic colors
  success: '#8BC34A',
  warning: '#FFD54F',
  error: '#F48FB1',
  info: '#7FB3D3',
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F5F5F5',
    card: '#FFFFFF',
    modal: '#FFFFFF',
  },
  
  // Text colors
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    tertiary: '#BDC3C7',
    inverse: '#FFFFFF',
  },
  
  // Border colors
  border: {
    primary: '#ECF0F1',
    secondary: '#F5F5F5',
    focus: '#40E0D0',
  },
  
  // Status colors
  status: {
    success: {
      bg: '#E8F5E8',
      text: '#2E7D32',
      border: '#8BC34A',
    },
    warning: {
      bg: '#FFF8E1',
      text: '#F57C00',
      border: '#FFD54F',
    },
    error: {
      bg: '#FCE4EC',
      text: '#D32F2F',
      border: '#F48FB1',
    },
    info: {
      bg: '#E3F2FD',
      text: '#0277BD',
      border: '#7FB3D3',
    },
  },
  
  // Chart colors
  chart: {
    primary: '#40E0D0',    // Turquoise
    secondary: '#7FB3D3',  // Pastel Blue
    tertiary: '#8BC34A',   // Pastel Green
    quaternary: '#FFD54F', // Pastel Yellow
    quinary: '#F48FB1',    // Pastel Pink
    senary: '#B39DDB',     // Pastel Purple
  },
  
  // Research type colors
  researchType: {
    'TRL medical devices': '#40E0D0',
    'TRL software': '#7FB3D3',
    'TRL medicines vaccines stem cells': '#8BC34A',
    'TRL plant/animal breeds': '#FFD54F',
  },
  
  // TRL level colors
  trlLevel: {
    TRL1: '#F48FB1',
    TRL2: '#FFD54F',
    TRL3: '#8BC34A',
    TRL4: '#7FB3D3',
    TRL5: '#40E0D0',
    TRL6: '#B39DDB',
    TRL7: '#F48FB1',
    TRL8: '#FFD54F',
    TRL9: '#8BC34A',
  },
  
  // Status colors for research
  researchStatus: {
    'Todo': '#F5F5F5',
    'In process': '#7FB3D3',
    'Done': '#8BC34A',
    'Approve': '#8BC34A',
  },
} as const;

// Type definitions for better TypeScript support
export type ColorKey = keyof typeof colors;
export type BackgroundKey = keyof typeof colors.background;
export type TextKey = keyof typeof colors.text;
export type BorderKey = keyof typeof colors.border;
export type StatusKey = keyof typeof colors.status;
export type ChartKey = keyof typeof colors.chart;
export type ResearchTypeKey = keyof typeof colors.researchType;
export type TrlLevelKey = keyof typeof colors.trlLevel;
export type ResearchStatusKey = keyof typeof colors.researchStatus;

// Utility functions
export const getColor = (key: ColorKey): string => colors[key] as string;
export const getBackgroundColor = (key: BackgroundKey): string => colors.background[key];
export const getTextColor = (key: TextKey): string => colors.text[key];
export const getBorderColor = (key: BorderKey): string => colors.border[key];
export const getStatusColor = (key: StatusKey) => colors.status[key];
export const getChartColor = (key: ChartKey): string => colors.chart[key];
export const getResearchTypeColor = (key: ResearchTypeKey): string => colors.researchType[key];
export const getTrlLevelColor = (key: TrlLevelKey): string => colors.trlLevel[key];
export const getResearchStatusColor = (key: ResearchStatusKey): string => colors.researchStatus[key]; 
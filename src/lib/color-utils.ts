import { colors } from './colors';

// Utility functions for easy color usage
export const colorUtils = {
  // Background colors
  bg: {
    body: 'bg-color-body-default',
    bodySecondary: 'bg-color-body-secondary',
    bodyTertiary: 'bg-color-body-tertiary',
    card: 'bg-white',
    modal: 'bg-white',
  },
  
  // Text colors
  text: {
    primary: 'text-color-text-primary',
    secondary: 'text-color-text-secondary',
    tertiary: 'text-color-text-tertiary',
    inverse: 'text-color-text-inverse',
  },
  
  // Border colors
  border: {
    primary: 'border-color-border-primary',
    secondary: 'border-color-border-secondary',
    focus: 'border-color-border-focus',
  },
  
  // Status colors
  status: {
    success: 'bg-color-status-success text-white',
    warning: 'bg-color-status-warning text-black',
    error: 'bg-color-status-error text-white',
    info: 'bg-color-status-info text-white',
  },
  
  // Chart colors
  chart: {
    primary: 'text-color-chart-primary',
    secondary: 'text-color-chart-secondary',
    tertiary: 'text-color-chart-tertiary',
    quaternary: 'text-color-chart-quaternary',
    quinary: 'text-color-chart-quinary',
    senary: 'text-color-chart-senary',
  },
  
  // Research type colors
  research: {
    type: {
      medical: 'text-color-research-type-medical',
      software: 'text-color-research-type-software',
      medicine: 'text-color-research-type-medicine',
      biology: 'text-color-research-type-biology',
    },
    status: {
      todo: 'text-color-research-status-todo',
      inProcess: 'text-color-research-status-in-process',
      done: 'text-color-research-status-done',
      approve: 'text-color-research-status-approve',
    },
  },
  
  // TRL level colors
  trl: {
    TRL1: 'text-color-trl-TRL1',
    TRL2: 'text-color-trl-TRL2',
    TRL3: 'text-color-trl-TRL3',
    TRL4: 'text-color-trl-TRL4',
    TRL5: 'text-color-trl-TRL5',
    TRL6: 'text-color-trl-TRL6',
    TRL7: 'text-color-trl-TRL7',
    TRL8: 'text-color-trl-TRL8',
    TRL9: 'text-color-trl-TRL9',
  },
} as const;

// Helper function to get research type color
export const getResearchTypeColor = (type: string): string => {
  const typeMap: Record<string, string> = {
    'TRL medical devices': colors.researchType['TRL medical devices'],
    'TRL software': colors.researchType['TRL software'],
    'TRL medicines vaccines stem cells': colors.researchType['TRL medicines vaccines stem cells'],
    'TRL plant/animal breeds': colors.researchType['TRL plant/animal breeds'],
  };
  return typeMap[type] || colors.grey;
};

// Helper function to get TRL level color
export const getTrlLevelColor = (level: string): string => {
  return colors.trlLevel[level as keyof typeof colors.trlLevel] || colors.grey;
};

// Helper function to get research status color
export const getResearchStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Todo': colors.researchStatus.Todo,
    'In process': colors.researchStatus['In process'],
    'Done': colors.researchStatus.Done,
    'Approve': colors.researchStatus.Approve,
  };
  return statusMap[status] || colors.grey;
}; 
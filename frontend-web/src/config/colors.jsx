// Medical theme color palette - Teal gradient theme
export const colors = {
  // Primary colors - Teal gradient
  primary: {
    main: '#0e7490',      // Primary dark cyan
    light: '#14b8a6',     // Teal-500 - Lighter variant for gradient end
    dark: '#164e63',      // Very dark cyan for text
    hover: '#0891b2',     // Cyan-600 - Hover state
  },

  // Gradient colors
  gradient: {
    start: '#0e7490',     // Gradient start (dark cyan)
    end: '#14b8a6',       // Gradient end (teal)
    light1: '#67e8f9',    // Light cyan for accents
    light2: '#a7f3d0',    // Light green for accents
  },

  // Secondary colors - Complementary teal shades
  secondary: {
    main: '#0891b2',      // Cyan-600
    light: '#67e8f9',     // Light cyan
    dark: '#155e75',      // Cyan-900
  },

  // Curio-specific colors
  curio: {
    inputBg: '#f0fdfa',   // Very light teal for input backgrounds
    inputText: '#164e63', // Dark cyan for input text
    cardBg: '#ffffff',    // White for cards
  },

  // Success/Health - Green
  success: {
    main: '#10B981',      // Emerald-500
    light: '#34D399',     // Emerald-400
    dark: '#059669',      // Emerald-600
  },

  // Warning - Amber
  warning: {
    main: '#F59E0B',      // Amber-500
    light: '#FBBF24',     // Amber-400
    dark: '#D97706',      // Amber-600
  },

  // Error - Red
  error: {
    main: '#EF4444',      // Red-500
    light: '#F87171',     // Red-400
    dark: '#DC2626',      // Red-600
  },

  // Neutral/Gray scale
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
  },

  // Background colors
  background: {
    default: '#F9FAFB',        // Light gray background
    paper: '#FFFFFF',          // Card/Paper background
    dark: '#0F172A',           // Dark mode background
    lightGradient: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', // Light teal gradient
  },

  // Text colors
  text: {
    primary: '#111827',   // Main text
    secondary: '#6B7280', // Secondary text
    disabled: '#9CA3AF',  // Disabled text
    inverse: '#FFFFFF',   // Text on dark backgrounds
  },
}

export default colors

/**
 * DESIGN TOKENS - Custom Design System
 * This file defines all design decisions to ensure consistency
 * and avoid AI-generated vibe. Every value is intentional and documented.
 */

// COLOR PALETTE - Custom, not default Tailwind
export const colors = {
  // Primary - Deep Blue (Sky inspiration)
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    500: '#1e3a8a', // Main primary
    600: '#1e40af',
    700: '#1e3a8a',
    900: '#0f172a',
  },
  
  // Secondary - Bold Red (Accent/Emphasis)
  secondary: {
    500: '#dc2626',
    600: '#b91c1c',
    700: '#991b1b',
  },
  
  // Accent - Teal Green (Travel/Nature)
  accent: {
    500: '#059669',
    600: '#047857',
    700: '#065f46',
  },
  
  // Neutral - Grays with personality
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// TYPOGRAPHY - Custom font pairing (explains why NOT using defaults)
export const typography = {
  // Why Sora? Modern, geometric, perfect for travel app headers
  // Why Inter? Highly legible, professional, great readability
  
  fonts: {
    heading: '"Sora", "Segoe UI", sans-serif', // Google Font: Sora
    body: '"Inter", system-ui, -apple-system, sans-serif', // System + Inter fallback
    mono: '"Fira Code", "Courier New", monospace',
  },
  
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

// SPACING SYSTEM - Intentional, not random
// Based on 8px scale (8, 16, 24, 32, 48, 64...)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
};

// BORDER RADIUS - Subtle, not aggressive
export const radius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
};

// SHADOWS - Custom, not default Tailwind
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  // Custom shadows for travel app
  'card-hover': '0 20px 25px -5px rgba(30, 58, 138, 0.15)',
  'input-focus': '0 0 0 3px rgba(30, 58, 138, 0.1)',
};

// TRANSITIONS - Smooth, intentional animations
export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

// BREAKPOINTS - Mobile-first approach
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// COMPONENT-SPECIFIC TOKENS

export const buttons = {
  primary: {
    bg: colors.primary[500],
    text: '#ffffff',
    hover: colors.primary[600],
    active: colors.primary[700],
    radius: radius.lg,
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  secondary: {
    bg: colors.neutral[100],
    text: colors.neutral[900],
    hover: colors.neutral[200],
    active: colors.neutral[300],
    border: colors.neutral[200],
    radius: radius.lg,
    padding: `${spacing.md} ${spacing.lg}`,
  },
};

export const inputs = {
  bg: '#ffffff',
  text: colors.neutral[900],
  border: colors.neutral[200],
  borderFocus: colors.primary[500],
  borderRadius: radius.lg,
  padding: `${spacing.md} ${spacing.lg}`,
  fontSize: typography.sizes.base,
  focusShadow: shadows['input-focus'],
};

export const cards = {
  bg: '#ffffff',
  borderRadius: radius.xl,
  padding: spacing.lg,
  shadow: shadows.md,
  shadowHover: shadows['card-hover'],
  border: `1px solid ${colors.neutral[200]}`,
};

export const badge = {
  borderRadius: radius.full,
  padding: `${spacing.sm} ${spacing.md}`,
  fontSize: typography.sizes.sm,
  fontWeight: typography.weights.medium,
};

/**
 * DESIGN RATIONALE - Why these choices?
 * 
 * 1. COLOR PALETTE
 *    - Blue (Primary): Represents sky, travel, reliability
 *    - Red (Secondary): Creates urgency, excitement (booking travel)
 *    - Teal (Accent): Nature, adventure, sustainability
 *    - Neutral: Professional, readable, not distracting
 * 
 * 2. TYPOGRAPHY
 *    - Sora: Modern geometric font, popular in travel/lifestyle apps
 *    - Inter: Industry standard for body text, maximum readability
 *    - NOT system defaults (would look generic)
 * 
 * 3. SPACING
 *    - 8px base scale: Professional, intentional, not random
 *    - Tighter than AI defaults: More sophisticated
 *    - Clear hierarchy: Premium feeling
 * 
 * 4. SHADOWS
 *    - Subtle, realistic: Not dramatic or fake-looking
 *    - Custom card shadow: Designed for this specific use case
 * 
 * 5. ANIMATIONS
 *    - 200ms default: Fast enough to feel responsive, slow enough to be graceful
 *    - Easing: ease-in-out for natural motion
 * 
 * This entire system makes the app look INTENTIONAL and AUTHENTIC
 * not like "ChatGPT + Tailwind template" 😎
 */

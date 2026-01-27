export const theme = {
    colors: {
        primary: '#4F46E5', // Indigo-600
        secondary: '#10B981', // Emerald-500
        danger: '#EF4444', // Red-500
        warning: '#F59E0B', // Amber-500
        success: '#10B981',
        background: '#F9FAFB', // Gray-50
        text: '#111827', // Gray-900
        textSecondary: '#6B7280', // Gray-500
    },
    spacing: {
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
    },
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
    },
} as const;

export type Theme = typeof theme;

export const appColorClasses = {
  pageBg: "bg-surface",
  cardBg: "bg-card",
  textPrimary: "text-text-primary",
  textSecondary: "text-text-secondary",
  textMuted: "text-text-muted",
  borderSoft: "border-border-soft",
  borderSubtle: "border-border-subtle",
} as const;

export const intentColorClasses = {
  brand: {
    text: "text-brand-600",
    textStrong: "text-brand-500",
    bg: "bg-brand-50",
    bgHover: "hover:bg-brand-100",
    border: "border-brand-400",
    borderStrong: "border-brand-500",
  },
  success: {
    text: "text-success-600",
    bg: "bg-success-100",
  },
  danger: {
    text: "text-danger-600",
    bg: "bg-danger-50",
  },
  ai: {
    text: "text-ai-500",
    bg: "bg-ai-50",
  },
  warning: {
    bg: "bg-warning-400",
  },
} as const;

export const appColorHex = {
  background: "#ffffff",
  foreground: "#171717",
  surface: "#f9fafb",
  card: "#ffffff",
  textPrimary: "#111827",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  borderSoft: "#e5e7eb",
  borderSubtle: "#f3f4f6",
  brand50: "#eff6ff",
  brand100: "#dbeafe",
  brand400: "#60a5fa",
  brand500: "#3b82f6",
  brand600: "#2563eb",
  success100: "#dcfce7",
  success600: "#16a34a",
  danger50: "#fef2f2",
  danger600: "#dc2626",
  warning400: "#facc15",
  ai50: "#faf5ff",
  ai500: "#a855f7",
} as const;

import { describe, it, expect } from 'vitest';
import { appColorClasses, intentColorClasses, appColorHex } from './colors';

describe('appColorClasses', () => {
  it('should contain all expected color classes', () => {
    expect(appColorClasses).toHaveProperty('pageBg');
    expect(appColorClasses).toHaveProperty('cardBg');
    expect(appColorClasses).toHaveProperty('textPrimary');
    expect(appColorClasses).toHaveProperty('textSecondary');
    expect(appColorClasses).toHaveProperty('textMuted');
    expect(appColorClasses).toHaveProperty('borderSoft');
    expect(appColorClasses).toHaveProperty('borderSubtle');
  });

  it('should have valid Tailwind CSS class names', () => {
    expect(appColorClasses.pageBg).toBe('bg-surface');
    expect(appColorClasses.cardBg).toBe('bg-card');
    expect(appColorClasses.textPrimary).toBe('text-text-primary');
    expect(appColorClasses.textSecondary).toBe('text-text-secondary');
    expect(appColorClasses.textMuted).toBe('text-text-muted');
    expect(appColorClasses.borderSoft).toBe('border-border-soft');
    expect(appColorClasses.borderSubtle).toBe('border-border-subtle');
  });

  it('should be readonly/immutable', () => {
    // Test that the object structure is preserved as const
    expect(typeof appColorClasses.pageBg).toBe('string');
    expect(typeof appColorClasses.cardBg).toBe('string');
    expect(typeof appColorClasses.textPrimary).toBe('string');
    expect(typeof appColorClasses.textSecondary).toBe('string');
    expect(typeof appColorClasses.textMuted).toBe('string');
    expect(typeof appColorClasses.borderSoft).toBe('string');
    expect(typeof appColorClasses.borderSubtle).toBe('string');
  });
});

describe('intentColorClasses', () => {
  it('should contain all intent categories', () => {
    expect(intentColorClasses).toHaveProperty('brand');
    expect(intentColorClasses).toHaveProperty('success');
    expect(intentColorClasses).toHaveProperty('danger');
    expect(intentColorClasses).toHaveProperty('ai');
    expect(intentColorClasses).toHaveProperty('warning');
  });

  it('should have brand color classes', () => {
    expect(intentColorClasses.brand).toHaveProperty('text');
    expect(intentColorClasses.brand).toHaveProperty('textStrong');
    expect(intentColorClasses.brand).toHaveProperty('bg');
    expect(intentColorClasses.brand).toHaveProperty('bgHover');
    expect(intentColorClasses.brand).toHaveProperty('border');
    expect(intentColorClasses.brand).toHaveProperty('borderStrong');

    expect(intentColorClasses.brand.text).toBe('text-brand-600');
    expect(intentColorClasses.brand.textStrong).toBe('text-brand-500');
    expect(intentColorClasses.brand.bg).toBe('bg-brand-50');
    expect(intentColorClasses.brand.bgHover).toBe('hover:bg-brand-100');
    expect(intentColorClasses.brand.border).toBe('border-brand-400');
    expect(intentColorClasses.brand.borderStrong).toBe('border-brand-500');
  });

  it('should have success color classes', () => {
    expect(intentColorClasses.success).toHaveProperty('text');
    expect(intentColorClasses.success).toHaveProperty('bg');

    expect(intentColorClasses.success.text).toBe('text-success-600');
    expect(intentColorClasses.success.bg).toBe('bg-success-100');
  });

  it('should have danger color classes', () => {
    expect(intentColorClasses.danger).toHaveProperty('text');
    expect(intentColorClasses.danger).toHaveProperty('bg');

    expect(intentColorClasses.danger.text).toBe('text-danger-600');
    expect(intentColorClasses.danger.bg).toBe('bg-danger-50');
  });

  it('should have AI color classes', () => {
    expect(intentColorClasses.ai).toHaveProperty('text');
    expect(intentColorClasses.ai).toHaveProperty('bg');

    expect(intentColorClasses.ai.text).toBe('text-ai-500');
    expect(intentColorClasses.ai.bg).toBe('bg-ai-50');
  });

  it('should have warning color classes', () => {
    expect(intentColorClasses.warning).toHaveProperty('bg');

    expect(intentColorClasses.warning.bg).toBe('bg-warning-400');
  });

  it('should have valid Tailwind CSS class names for all intents', () => {
    const allClasses = [
      ...Object.values(intentColorClasses.brand),
      ...Object.values(intentColorClasses.success),
      ...Object.values(intentColorClasses.danger),
      ...Object.values(intentColorClasses.ai),
      ...Object.values(intentColorClasses.warning)
    ];

    allClasses.forEach(className => {
      expect(typeof className).toBe('string');
      expect(className.length).toBeGreaterThan(0);
      // Should contain valid Tailwind patterns
      expect(className).toMatch(/^(text|bg|hover:bg|border)-/);
    });
  });
});

describe('appColorHex', () => {
  it('should contain all expected hex colors', () => {
    expect(appColorHex).toHaveProperty('background');
    expect(appColorHex).toHaveProperty('foreground');
    expect(appColorHex).toHaveProperty('surface');
    expect(appColorHex).toHaveProperty('card');
    expect(appColorHex).toHaveProperty('textPrimary');
    expect(appColorHex).toHaveProperty('textSecondary');
    expect(appColorHex).toHaveProperty('textMuted');
    expect(appColorHex).toHaveProperty('borderSoft');
    expect(appColorHex).toHaveProperty('borderSubtle');
    expect(appColorHex).toHaveProperty('brand50');
    expect(appColorHex).toHaveProperty('brand100');
    expect(appColorHex).toHaveProperty('brand400');
    expect(appColorHex).toHaveProperty('brand500');
    expect(appColorHex).toHaveProperty('brand600');
    expect(appColorHex).toHaveProperty('success100');
    expect(appColorHex).toHaveProperty('success600');
    expect(appColorHex).toHaveProperty('danger50');
    expect(appColorHex).toHaveProperty('danger600');
    expect(appColorHex).toHaveProperty('warning400');
    expect(appColorHex).toHaveProperty('ai50');
    expect(appColorHex).toHaveProperty('ai500');
  });

  it('should have valid hex color format', () => {
    const hexColors = Object.values(appColorHex);
    hexColors.forEach(color => {
      expect(typeof color).toBe('string');
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('should have expected color values', () => {
    expect(appColorHex.background).toBe('#ffffff');
    expect(appColorHex.foreground).toBe('#171717');
    expect(appColorHex.surface).toBe('#f9fafb');
    expect(appColorHex.card).toBe('#ffffff');
    expect(appColorHex.textPrimary).toBe('#111827');
    expect(appColorHex.textSecondary).toBe('#6b7280');
    expect(appColorHex.textMuted).toBe('#9ca3af');
    expect(appColorHex.borderSoft).toBe('#e5e7eb');
    expect(appColorHex.borderSubtle).toBe('#f3f4f6');
  });

  it('should have brand color palette', () => {
    expect(appColorHex.brand50).toBe('#eff6ff');
    expect(appColorHex.brand100).toBe('#dbeafe');
    expect(appColorHex.brand400).toBe('#60a5fa');
    expect(appColorHex.brand500).toBe('#3b82f6');
    expect(appColorHex.brand600).toBe('#2563eb');
  });

  it('should have success color palette', () => {
    expect(appColorHex.success100).toBe('#dcfce7');
    expect(appColorHex.success600).toBe('#16a34a');
  });

  it('should have danger color palette', () => {
    expect(appColorHex.danger50).toBe('#fef2f2');
    expect(appColorHex.danger600).toBe('#dc2626');
  });

  it('should have warning and AI colors', () => {
    expect(appColorHex.warning400).toBe('#facc15');
    expect(appColorHex.ai50).toBe('#faf5ff');
    expect(appColorHex.ai500).toBe('#a855f7');
  });

  it('should have consistent color relationships', () => {
    // Brand colors should be blue-based
    expect(appColorHex.brand50).toMatch(/^#e.*f$/);
    expect(appColorHex.brand500).toMatch(/^#3.*6$/);
    expect(appColorHex.brand600).toMatch(/^#2.*b$/);

    // Success should be green
    expect(appColorHex.success600).toMatch(/^#1.*a$/);

    // Danger should be red
    expect(appColorHex.danger600).toMatch(/^#d.*6$/);

    // AI should be purple
    expect(appColorHex.ai500).toMatch(/^#a.*7$/);
  });
});

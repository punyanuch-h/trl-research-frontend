# Color System Documentation

This directory contains the color system for the research assessment project.

## Files

- `colors.ts` - Main color definitions and utility functions
- `color-utils.ts` - Tailwind CSS class utilities for easy color usage
- `README.md` - This documentation file

## Usage

### 1. Using Tailwind CSS Classes

You can use the custom colors directly in your components:

```tsx
// Background colors
<div className="bg-color-body-default">Default background</div>
<div className="bg-color-body-secondary">Secondary background</div>

// Text colors
<h1 className="text-color-text-primary">Primary text</h1>
<p className="text-color-text-secondary">Secondary text</p>

// Border colors
<div className="border-color-border-primary">Primary border</div>
<div className="border-color-border-focus">Focus border</div>

// Status colors
<div className="bg-color-status-success text-white">Success status</div>
<div className="bg-color-status-warning text-black">Warning status</div>

// Chart colors
<div className="text-color-chart-primary">Chart primary color</div>
<div className="text-color-chart-secondary">Chart secondary color</div>

// Research type colors
<div className="text-color-research-type-medical">Medical devices</div>
<div className="text-color-research-type-software">Software</div>

// TRL level colors
<div className="text-color-trl-TRL1">TRL1</div>
<div className="text-color-trl-TRL9">TRL9</div>
```

### 2. Using Color Utilities

Import and use the utility functions:

```tsx
import { colorUtils, getColorClass, getChartColors } from '../lib/color-utils';

// Using predefined classes
<div className={colorUtils.bg.body}>Default body background</div>
<div className={colorUtils.text.primary}>Primary text</div>
<div className={colorUtils.status.success}>Success status</div>

// Using helper functions
<div className={getColorClass('bg', 'body')}>Body background</div>
<div className={getColorClass('text', 'primary')}>Primary text</div>

// Getting chart colors for Recharts
const chartColors = getChartColors();
```

### 3. Using Direct Color Values

Import colors for use in charts or inline styles:

```tsx
import { colors, getResearchTypeColor, getTrlLevelColor } from '../lib/colors';

// For Recharts components
<Line stroke={colors.chart.primary} />
<Bar fill={colors.chart.secondary} />

// For dynamic colors
const typeColor = getResearchTypeColor('TRL medical devices');
const trlColor = getTrlLevelColor('TRL5');
```

## Color Palette

### Primary Colors
- **White**: #FFFFFF
- **Grey**: #808080
- **Light Grey**: #D3D3D3
- **Turquoise**: #40E0D0
- **Green**: #32CD32
- **Yellow**: #FFFF00

### Semantic Colors
- **Success**: #32CD32 (Green)
- **Warning**: #FFFF00 (Yellow)
- **Error**: #808080 (Grey)
- **Info**: #40E0D0 (Turquoise)

### Chart Colors
- **Primary**: #40E0D0 (Turquoise)
- **Secondary**: #32CD32 (Green)
- **Tertiary**: #FFFF00 (Yellow)
- **Quaternary**: #808080 (Grey)
- **Quinary**: #D3D3D3 (Light Grey)
- **Senary**: #FFFFFF (White)

### Research Type Colors
- **Medical Devices**: #40E0D0 (Turquoise)
- **Software**: #32CD32 (Green)
- **Medicine/Vaccines**: #FFFF00 (Yellow)
- **Biology**: #808080 (Grey)

### TRL Level Colors
- **TRL1**: #FF6B6B (Red)
- **TRL2**: #FFA07A (Light Coral)
- **TRL3**: #FFD93D (Golden)
- **TRL4**: #6BCF7F (Light Green)
- **TRL5**: #4ECDC4 (Turquoise)
- **TRL6**: #45B7D1 (Sky Blue)
- **TRL7**: #96CEB4 (Mint)
- **TRL8**: #FFEAA7 (Light Yellow)
- **TRL9**: #DDA0DD (Plum)

## Examples

### Dashboard Component
```tsx
import { colorUtils } from '../lib/color-utils';

export default function Dashboard() {
  return (
    <div className={colorUtils.bg.body}>
      <h1 className={colorUtils.text.primary}>Dashboard</h1>
      <div className={colorUtils.bg.bodySecondary}>
        <p className={colorUtils.text.secondary}>Content</p>
      </div>
    </div>
  );
}
```

### Chart Component
```tsx
import { getChartColors } from '../lib/color-utils';

export default function Chart() {
  const colors = getChartColors();
  
  return (
    <LineChart data={data}>
      <Line stroke={colors[0]} /> {/* Turquoise */}
      <Line stroke={colors[1]} /> {/* Green */}
    </LineChart>
  );
}
```

### Status Badge Component
```tsx
import { colorUtils } from '../lib/color-utils';

export default function StatusBadge({ status }: { status: string }) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'success': return colorUtils.status.success;
      case 'warning': return colorUtils.status.warning;
      case 'error': return colorUtils.status.error;
      default: return colorUtils.status.info;
    }
  };

  return (
    <span className={getStatusClass(status)}>
      {status}
    </span>
  );
}
```

## Best Practices

1. **Use Tailwind classes** for most styling needs
2. **Use utility functions** for dynamic color selection
3. **Use direct color values** for charts and complex styling
4. **Maintain consistency** by using the predefined color palette
5. **Test accessibility** with color contrast tools

## Adding New Colors

To add new colors:

1. Add the color to `colors.ts`
2. Add corresponding Tailwind classes to `tailwind.config.ts`
3. Add utility functions to `color-utils.ts`
4. Update this documentation

## Accessibility

All colors have been chosen to meet WCAG contrast requirements. Test with tools like:
- WebAIM Contrast Checker
- Stark Contrast Checker
- Browser DevTools 
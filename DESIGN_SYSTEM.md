# FoodSpoils Design System

## Brand Overview

FoodSpoils is a warm, friendly app that helps households reduce food waste. The visual identity blends **freshness (greens)** with **warmth (coral/orange)** and **clean minimalism** — approachable, not clinical.

---

## Color Palette

### Primary — Fresh Greens
| Token | Hex | Usage |
|---|---|---|
| `green-50` | `#F0FFF4` | Lightest tint — backgrounds, cards |
| `green-100` | `#D4EDDA` | Subtle accent, secondary backgrounds |
| `green-200` | `#A8E6B6` | Progress bar fill, decorative |
| `green-400` | `#4ADE80` | Active states, fresh indicators |
| `green-500` | `#22C55E` | **Primary brand color** — buttons, links, header |
| `green-600` | `#16A34A` | Hover states, pressed buttons |
| `green-700` | `#15803D` | Dark text on light bg, active tab |
| `green-900` | `#14532D` | Deep accent for prestige/trust |

### Accent — Warm Coral
| Token | Hex | Usage |
|---|---|---|
| `coral-400` | `#FD8B64` | Light accent, hover hints |
| `coral-500` | `#FF6B35` | **Primary accent** — CTAs, urgency, premium badges |
| `coral-600` | `#E85D26` | Active/pressed accent state |

### Status Colors — Expiry Indicators
| Token | Hex | Meaning |
|---|---|---|
| `status-fresh` | `#22C55E` | Green — good, plenty of time |
| `status-soon` | `#FACC15` | Yellow — expiring within 3 days |
| `status-urgent` | `#FF6B35` | Orange — expiring today/tomorrow |
| `status-expired` | `#EF4444` | Red — expired |

### Neutrals
| Token | Hex | Usage |
|---|---|---|
| `white` | `#FFFFFF` | Card backgrounds, modal surfaces |
| `gray-50` | `#F9FAFB` | Page backgrounds |
| `gray-100` | `#F3F4F6` | Input backgrounds, dividers |
| `gray-200` | `#E5E7EB` | Borders, disabled states |
| `gray-400` | `#9CA3AF` | Secondary text, placeholders |
| `gray-600` | `#6B7280` | Body text |
| `gray-800` | `#1F2937` | Headings, primary text |
| `gray-900` | `#111827` | Highest emphasis text |

---

## Typography

### Font Family
- **Primary**: `'Inter', system-ui, -apple-system, sans-serif`
- **Monospace** (for numbers/dates): `'JetBrains Mono', monospace`

### Type Scale (Mobile-First)
| Level | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `xs` | 0.75rem (12px) | 400 | 1.4 | Captions, metadata |
| `sm` | 0.875rem (14px) | 400 | 1.5 | Body text, form labels |
| `base` | 1rem (16px) | 400 | 1.5 | Default body |
| `lg` | 1.125rem (18px) | 500 | 1.4 | Card titles |
| `xl` | 1.25rem (20px) | 600 | 1.3 | Section headings |
| `2xl` | 1.5rem (24px) | 700 | 1.25 | Page titles |
| `3xl` | 1.875rem (30px) | 700 | 1.2 | Hero headings |

---

## Spacing System

Based on a 4px grid:
- `1` = 4px, `2` = 8px, `3` = 12px, `4` = 16px, `5` = 20px, `6` = 24px
- `8` = 32px, `10` = 40px, `12` = 48px, `16` = 64px
- Card padding: `p-4` (16px) mobile, `p-6` (24px) tablet+
- Page gutter: `px-4` mobile, `px-6` tablet+

---

## Border Radius
| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 6px | Buttons, inputs |
| `rounded-md` | 10px | Cards, modals |
| `rounded-lg` | 14px | Large cards, dialog |
| `rounded-full` | 9999px | Badges, avatars, icons |

---

## Shadows
| Token | Value | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards resting |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.07)` | Elevated cards |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.08)` | Modals, drawer |
| `shadow-glow-green` | `0 0 12px rgba(34,197,94,0.3)` | Success states |

---

## Iconography
- Style: **Line icons** with 1.5px or 2px stroke, rounded caps
- Sizes: 16px (inline), 20px (UI buttons), 24px (navigation), 32px (empty states)
- Key icons: leaf/fridge, clock, bell, scan/barcode, cart, trash, share, user, settings

---

## Component Architecture

All components follow this pattern:
- **Mobile-first** — designed for 375px+ viewports
- **Dark mode ready** — uses CSS custom properties
- **Accessible** — proper aria labels, contrast ≥ 4.5:1
- **Touch-friendly** — minimum tap target 44×44px
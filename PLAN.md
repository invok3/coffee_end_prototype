# Coffee Shop Pre-Order Prototype — Plan

## Overview

A single-page mobile-first prototype (portrait only) for a drive-through coffeeshop.
The user flow: **browse menu → pick product & size/quantity → choose pickup side of road via interactive map → confirm order**.

Three files: `index.html`, `styles.css`, `app.js`. Pure vanilla HTML/CSS/JS, no frameworks.

**Language**: Arabic only, full RTL layout. No English text anywhere.

---

## File Structure

```
coffee_end/
├── PLAN.md         # This plan document
├── index.html      # All markup + inline SVGs for the map
├── styles.css      # Mobile-first portrait-only styles
└── app.js          # State management, screen transitions, interactions
```

---

## Screen Flow (6 Screens)

The app uses a **single HTML container** with 6 "screen" divs. JavaScript toggles `active` class to show/hide screens. No routing library needed.

### Screen 1: Welcome (الترحيب)

- Coffeeshop logo/name: كويك ستوب
- Tagline: "اطلب مسبقاً. استلم. انطلق."
- CTA button: "ابدأ الطلب"
- Warm brown + cream color palette

### Screen 2: Menu (القائمة)

- 4 product cards in a 2×2 grid:
  - ☕ قهوة — $3.00
  - 🥤 ميلك شيك — $5.00
  - 🧃 عصير — $4.00
  - 🍹 كوكتيل سلاش — $5.00
- Each card: emoji icon, name, base price
- Tap to select → advances to Product Detail

### Screen 3: Product Detail (تفاصيل المنتج)

- Product name + large icon
- **Size selector**: صغير / متوسط / كبير (3 buttons, one active)
  - Price adjusts per size (e.g., قهوة: $3 / $4 / $5)
- **Quantity selector**: minus [-] / number / plus [+]
- "اختر جانب الاستلام" button → advances to Pickup Map

### Screen 4: Pickup Map (خريطة الاستلام) — the core feature

- **Title**: "من أي جانب تقترب؟"
- **Two SVG images** side by side, representing the two halves of one road:
  - **Incoming side** (الجهة القادمة): arrow pointing LEFT (←) towards coffeeshop
  - **Outgoing side** (الجهة الصادرة): arrow pointing RIGHT (→) away from coffeeshop
  - A small coffeeshop icon/marker sits at the center dividing line
- In RTL layout: incoming appears on the RIGHT, outgoing on the LEFT
- **Hover interaction**: hovering an SVG highlights that side (glow/opacity/border change) and reveals a label
- **Click to confirm**: clicking the hovered side selects it
- Visual feedback: selected side stays highlighted, "متابعة" button appears
- The two SVGs are simple: a road rectangle, a directional arrow, a dashed center line, and a small building icon

### Screen 5: Order Confirmation (تأكيد الطلب)

- Order summary card:
  - Product name + size
  - Quantity
  - Total price
  - Pickup side: "الجهة القادمة" or "الجهة الصادرة" with arrow indicator
- "تأكيد الطلب" button
- On confirm: shows a confirmation message with estimated pickup time (e.g., "جاهز خلال ~٥ دقائق") and a note "ادفع عند الوصول"

### Screen 6: Done (تم)

- Success checkmark animation
- "تم الطلب!" heading
- Pickup side reminder
- "طلب جديد" button to restart

---

## CSS Strategy

- `@media (orientation: landscape)` — hide content, show "rotate your phone" message (Arabic)
- Mobile viewport: `max-width: 430px` centered on larger screens (looks like a phone)
- RTL support: `dir="rtl"` on `<html>`, CSS `direction: rtl` where needed
- `direction: ltr` forced on size selector and quantity selector to maintain logical button order
- Color palette:
  - Primary brown: `#5C3D2E`
  - Light cream: `#F5E6D3`
  - Accent warm: `#D4A574`
  - Text dark: `#2C1810`
  - White: `#FFFAF5`
- Screen transitions: CSS fade/slide with `.active` class
- Map hover: CSS `:hover` + JS class toggle for touch devices

## JS Strategy

- State object holds: `{ currentScreen, product, size, quantity, side }`
- Arabic text maps: `products` object with Arabic names, `sideNames` for side labels, `sizeLabels` for Arabic size letters (ص/م/ك)
- Functions: `navigateTo(screenId)`, `selectProduct(id)`, `selectSize(size)`, `changeQty(delta)`, `updateDetailPrice()`, `handleMapTap(side)`, `confirmSide(side)`, `renderConfirmation()`, `placeOrder()`, `resetOrder()`
- Touch support: two-tap system on map (first tap = preview, second tap = confirm)
- No external dependencies

---

## Key Design Decisions

1. **Arabic only, full RTL** — all text is Arabic, HTML `dir="rtl"`, layout mirrors naturally
2. **SVGs inline** in the HTML (not external files) — simpler for a prototype, no file loading issues
3. **RTL-aware map arrows** — incoming arrow points LEFT (towards center), outgoing points RIGHT (away from center); flex layout reverses side order in RTL
4. **Touch-first hover**: On mobile, the user taps the map side (first tap = hover preview, second tap = confirm) to simulate the desktop hover experience
5. **No persistence** — purely client-side, no localStorage or backend
6. **Single file per concern** — keeps it easy to hand off or extend

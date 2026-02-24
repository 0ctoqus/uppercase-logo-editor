# uppercase-logo-editor

An interactive logo mark editor for the Uppercase "UC" brand mark.

## What it does

A React component that renders a parametric SVG logo — the overlapping **U** and **C** letterforms that share a central spine — with a live control panel for tuning every aspect of the mark:

- **Stroke width** and overall proportions (U width, C width)
- **Corner radii** — U top-left, U bottom-left curve, C outer/inner corners
- **C opening** — gap size, return length, and gap corner radii
- **Symmetry controls** — mirror C top/bottom, link all outer corners
- **Presets** — Sharp, Original, Soft, Round, Thin, Heavy, Wide C, Narrow, Tall
- **Scale preview** at 48 / 32 / 20 / 14 px
- **Color strip** — previews the mark across 6 brand colour contexts
- **Lockup previews** — horizontal and stacked logo layouts
- **Dark / light mode** toggle
- **Copy JSON** — exports current params to clipboard
- **Reset** — returns to default params

## File

| File                | Description                                                            |
|---------------------|------------------------------------------------------------------------|
| `uc-editor-v3.jsx`  | Self-contained React component (no external dependencies beyond React) |

## Usage

Drop `uc-editor-v3.jsx` into any React project and render the default export:

```jsx
import LogoEditor from "./uc-editor-v3";

export default function App() {
  return <LogoEditor />;
}
```

Requires React 18+ with hooks support.

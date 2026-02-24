# Uppercase Logo Editor

An interactive parametric editor for the Uppercase "UC" brand mark. Live-tune every aspect of the SVG letterform and export in multiple formats.

**[Open the editor →](https://0ctoqus.github.io/uppercase-logo-editor/)**

## Features

- **Shape controls** — stroke width, U width, C width, gap size, return length
- **Corner radii** — U top-left, U bottom-left curve, C outer/inner corners, gap corner radii
- **Symmetry** — mirror C top/bottom, link all outer corners
- **Presets** — Sharp, Original, Soft, Round, Thin, Heavy, Wide C, Narrow, Tall
- **Scale preview** — 48 / 32 / 20 / 14 px
- **Color strip** — mark across 6 brand colour contexts
- **Lockup previews** — horizontal (light, mixed weight) and stacked layouts
- **Dark / light mode**
- **Export** — SVG download, PNG download, Gmail signature HTML, Copy JSON params

## Usage

`editor.jsx` is a self-contained React component with no dependencies beyond React. Drop it into any React 18+ project:

```jsx
import LogoEditor from "./editor";

export default function App() {
  return <LogoEditor />;
}
```

## Local development

```sh
npm install
npm run dev
```

## License

MIT

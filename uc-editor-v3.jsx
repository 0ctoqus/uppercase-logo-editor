import { useState, useCallback } from "react";

const defaultParams = {
  // Global
  strokeWidth: 25,
  totalWidth: 240,
  totalHeight: 200,
  // Shared
  letterHeight: 188,
  // U proportions
  uWidth: 98,
  // C proportions  
  cWidth: 95,
  cReturnLength: 25,
  cGap: 72, // vertical gap between C returns (opening size)
  // U corners
  uBottomLeft: 50,
  uTopLeft: 13,
  // C corners
  cTopRightOuter: 13,
  cTopRightInner: 0,
  cBottomRightOuter: 13,
  cBottomRightInner: 0,
  cGapTopRadius: 5,
  cGapBottomRadius: 5,
  symmetricC: true,
  linkOuterCorners: true,
};

const Mark = ({ color = "#fff", size = 200, params }) => {
  const {
    strokeWidth: t,
    totalWidth: tw,
    totalHeight: th,
    letterHeight: lH,
    uWidth: uW,
    cWidth: cW,
    cReturnLength: cRet,
    cGap,
    uBottomLeft: uBLRaw,
    uTopLeft: uTLRaw,
    cTopRightOuter: cTRoRaw,
    cTopRightInner: cTRiRaw,
    cBottomRightOuter: cBRoRaw,
    cBottomRightInner: cBRiRaw,
    cGapTopRadius: cGTRaw,
    cGapBottomRadius: cGBRaw,
  } = params;

  const scale = size / th;

  // Shared vertical positioning
  const padY = (th - lH) / 2;
  
  // U positioning
  const uLeft = 0;
  const uTop = padY;
  const uRight = uLeft + uW;
  const uBottom = padY + lH;
  const uInnerLeft = uLeft + t;
  const uInnerBottom = uBottom - t;

  // Spine: shared between U right and C left
  const spineL = uRight - t;
  const spineR = uRight;

  // C positioning
  const cLeft = spineL;
  const cTop = padY;
  const cBottom = padY + lH;
  const cRight = cLeft + cW;
  const cTopB = cTop + t;
  const cBotT = cBottom - t;

  // C gap: centered vertically
  const gapHalf = cGap / 2;
  const cMid = (cTop + cBottom) / 2;
  const cRetTopEnd = cMid - gapHalf;
  const cRetBotStart = cMid + gapHalf;

  // Clamp radii
  const uBL = Math.min(uBLRaw, lH / 2, uW / 2);
  const uTL = Math.min(uTLRaw, t * 0.49);
  const maxCR = Math.min(t * 0.98);
  const cTRo = Math.min(cTRoRaw, maxCR);
  const cTRi = Math.min(cTRiRaw, maxCR);
  const cBRo = Math.min(cBRoRaw, maxCR);
  const cBRi = Math.min(cBRiRaw, maxCR);
  const cGT = Math.min(cGTRaw, t * 0.49, cRet * 0.49);
  const cGB = Math.min(cGBRaw, t * 0.49, cRet * 0.49);

  const innerR = Math.max(0, uBL - t);

  // U path
  const uPath = [
    `M ${uLeft + uTL} ${uTop}`,
    `L ${uInnerLeft} ${uTop}`,
    `L ${uInnerLeft} ${uInnerBottom - innerR}`,
    innerR > 0
      ? `Q ${uInnerLeft} ${uInnerBottom} ${uInnerLeft + innerR} ${uInnerBottom}`
      : `L ${uInnerLeft} ${uInnerBottom}`,
    `L ${spineR} ${uInnerBottom}`,
    `L ${spineR} ${uBottom}`,
    `L ${uLeft + uBL} ${uBottom}`,
    uBL > 0
      ? `Q ${uLeft} ${uBottom} ${uLeft} ${uBottom - uBL}`
      : `L ${uLeft} ${uBottom}`,
    `L ${uLeft} ${uTop + uTL}`,
    uTL > 0
      ? `Q ${uLeft} ${uTop} ${uLeft + uTL} ${uTop}`
      : `L ${uLeft} ${uTop}`,
    "Z",
  ].join(" ");

  // C top arm
  const cTopPath = [
    `M ${spineR} ${cTop}`,
    `L ${cRight - cTRo} ${cTop}`,
    cTRo > 0
      ? `Q ${cRight} ${cTop} ${cRight} ${cTop + cTRo}`
      : `L ${cRight} ${cTop}`,
    // Down to gap — outer gap corner
    `L ${cRight} ${cRetTopEnd - cGT}`,
    cGT > 0
      ? `Q ${cRight} ${cRetTopEnd} ${cRight - cGT} ${cRetTopEnd}`
      : `L ${cRight} ${cRetTopEnd}`,
    // Across to inner — inner gap corner
    `L ${cRight - cRet + cGT} ${cRetTopEnd}`,
    cGT > 0
      ? `Q ${cRight - cRet} ${cRetTopEnd} ${cRight - cRet} ${cRetTopEnd - cGT}`
      : `L ${cRight - cRet} ${cRetTopEnd}`,
    // Up inner edge (connects return inner to arm inner)
    `L ${cRight - t} ${cTopB + cTRi}`,
    cTRi > 0
      ? `Q ${cRight - t} ${cTopB} ${cRight - t - cTRi} ${cTopB}`
      : `L ${cRight - t} ${cTopB}`,
    `L ${spineR} ${cTopB}`,
    "Z",
  ].join(" ");

  // C bottom arm
  const cBotPath = [
    `M ${spineR} ${cBottom}`,
    `L ${cRight - cBRo} ${cBottom}`,
    cBRo > 0
      ? `Q ${cRight} ${cBottom} ${cRight} ${cBottom - cBRo}`
      : `L ${cRight} ${cBottom}`,
    // Up to gap — outer gap corner
    `L ${cRight} ${cRetBotStart + cGB}`,
    cGB > 0
      ? `Q ${cRight} ${cRetBotStart} ${cRight - cGB} ${cRetBotStart}`
      : `L ${cRight} ${cRetBotStart}`,
    // Across to inner — inner gap corner
    `L ${cRight - cRet + cGB} ${cRetBotStart}`,
    cGB > 0
      ? `Q ${cRight - cRet} ${cRetBotStart} ${cRight - cRet} ${cRetBotStart + cGB}`
      : `L ${cRight - cRet} ${cRetBotStart}`,
    // Down inner edge (connects return inner to arm inner)
    `L ${cRight - t} ${cBotT - cBRi}`,
    cBRi > 0
      ? `Q ${cRight - t} ${cBotT} ${cRight - t - cBRi} ${cBotT}`
      : `L ${cRight - t} ${cBotT}`,
    `L ${spineR} ${cBotT}`,
    "Z",
  ].join(" ");

  // Spine rect fills the full height of C
  const spineTop = Math.min(uTop, cTop);
  const spineBot = Math.max(uBottom, cBottom);

  return (
    <svg viewBox={`0 0 ${cRight} ${th}`} width={cRight * scale} height={th * scale} xmlns="http://www.w3.org/2000/svg">
      <rect x={spineL} y={spineTop} width={t} height={spineBot - spineTop} fill={color} />
      <path d={uPath} fill={color} />
      <path d={cTopPath} fill={color} />
      <path d={cBotPath} fill={color} />
    </svg>
  );
};

function Slider({ label, value, onChange, min = 0, max = 60, color = "#B8986A", step = 1 }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 10.5, color: "#777" }}>{label}</span>
        <span style={{ fontSize: 10.5, color: "#ddd", fontFamily: "monospace", minWidth: 28, textAlign: "right" }}>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color, cursor: "pointer", height: 3 }}
      />
    </div>
  );
}

function Section({ label, children, subtle, muted, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${subtle}` }}>
      <button onClick={() => setOpen(!open)} style={{
        fontSize: 9, letterSpacing: "0.3em", color: muted, marginBottom: open ? 10 : 0,
        background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex",
        alignItems: "center", gap: 6, width: "100%", fontFamily: "inherit",
      }}>
        <span style={{ fontSize: 8, transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▶</span>
        {label}
      </button>
      {open && children}
    </div>
  );
}

const presets = {
  "Sharp": { ...defaultParams, uBottomLeft: 0, cTopRightOuter: 0, cTopRightInner: 0, cBottomRightOuter: 0, cBottomRightInner: 0, uTopLeft: 0 },
  "Original": { ...defaultParams },
  "Soft": { ...defaultParams, uBottomLeft: 42, uTopLeft: 4, cTopRightOuter: 14, cTopRightInner: 10, cBottomRightOuter: 14, cBottomRightInner: 10 },
  "Round": { ...defaultParams, strokeWidth: 30, uBottomLeft: 60, uTopLeft: 10, cTopRightOuter: 24, cTopRightInner: 18, cBottomRightOuter: 24, cBottomRightInner: 18, cReturnLength: 34, cGap: 80 },
  "Thin": { ...defaultParams, strokeWidth: 18, uBottomLeft: 32, uTopLeft: 6, cTopRightOuter: 12, cTopRightInner: 8, cBottomRightOuter: 12, cBottomRightInner: 8, cReturnLength: 22 },
  "Heavy": { ...defaultParams, strokeWidth: 38, uBottomLeft: 50, cTopRightOuter: 0, cBottomRightOuter: 0, cReturnLength: 34, cGap: 70 },
  "Wide C": { ...defaultParams, cWidth: 140, cGap: 80, cReturnLength: 32 },
  "Narrow": { ...defaultParams, uWidth: 80, cWidth: 96, strokeWidth: 22, uBottomLeft: 34 },
  "Tall": { ...defaultParams, uBottomLeft: 50, strokeWidth: 24 },
};

export default function LogoEditor() {
  const [params, setParams] = useState(defaultParams);
  const [activePreset, setActivePreset] = useState("Original");
  const [darkMode, setDarkMode] = useState(true);
  const [autoReturnLength, setAutoReturnLength] = useState(true);

  const effectiveParams = autoReturnLength
    ? { ...params, cReturnLength: params.strokeWidth }
    : params;

  const bg = darkMode ? "#080808" : "#F5F2ED";
  const fg = darkMode ? "#FFFFFF" : "#080808";
  const muted = darkMode ? "#4A4A4A" : "#AAA";
  const subtle = darkMode ? "#151515" : "#E0DDD7";
  const panel = darkMode ? "#0C0C0C" : "#EDEBE5";

  const update = useCallback((key, val) => {
    setParams((p) => {
      const next = { ...p, [key]: val };
      // Mirror C top/bottom
      if (p.symmetricC) {
        if (key === "cTopRightOuter") next.cBottomRightOuter = val;
        if (key === "cTopRightInner") next.cBottomRightInner = val;
        if (key === "cBottomRightOuter") next.cTopRightOuter = val;
        if (key === "cBottomRightInner") next.cTopRightInner = val;
        if (key === "cGapTopRadius") next.cGapBottomRadius = val;
        if (key === "cGapBottomRadius") next.cGapTopRadius = val;
      }
      // Link all outer corners
      if (p.linkOuterCorners) {
        if (key === "cTopRightOuter" || key === "cBottomRightOuter") {
          next.uTopLeft = val;
          next.cTopRightOuter = val;
          next.cBottomRightOuter = val;
        }
        if (key === "uTopLeft") {
          next.cTopRightOuter = val;
          next.cBottomRightOuter = val;
        }
      }
      return next;
    });
    setActivePreset(null);
  }, []);

  const applyPreset = (name) => {
    setParams({ ...presets[name], symmetricC: params.symmetricC, linkOuterCorners: params.linkOuterCorners });
    setActivePreset(name);
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, color: fg, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", display: "flex", transition: "background 0.3s" }}>
      {/* Panel */}
      <div style={{ width: 290, background: panel, padding: "16px 16px", overflowY: "auto", borderRight: `1px solid ${subtle}`, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.35em", color: muted }}>UC EDITOR</span>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: "none", color: muted, fontSize: 10, cursor: "pointer" }}>
            {darkMode ? "☀" : "●"}
          </button>
        </div>

        {/* Presets */}
        <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${subtle}` }}>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: muted, marginBottom: 8 }}>PRESETS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {Object.keys(presets).map((name) => (
              <button key={name} onClick={() => applyPreset(name)} style={{
                padding: "5px 10px", background: activePreset === name ? "#B8986A" : "#1A1A1A",
                border: "none", borderRadius: 4, color: activePreset === name ? "#000" : "#666",
                fontSize: 9, letterSpacing: "0.08em", cursor: "pointer", fontFamily: "inherit",
              }}>{name}</button>
            ))}
          </div>
        </div>

        <Section label="GLOBAL" subtle={subtle} muted={muted}>
          <Slider label="Stroke Width" value={params.strokeWidth} onChange={(v) => update("strokeWidth", v)} min={8} max={55} />
        </Section>

        <Section label="PROPORTIONS" subtle={subtle} muted={muted}>
          <Slider label="U Width" value={params.uWidth} onChange={(v) => update("uWidth", v)} min={50} max={180} color="#7BA3C9" />
          <Slider label="C Width" value={params.cWidth} onChange={(v) => update("cWidth", v)} min={60} max={200} color="#C9A37B" />
        </Section>

        <Section label="U — CORNERS" subtle={subtle} muted={muted} defaultOpen={false}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={params.linkOuterCorners}
                onChange={(e) => {
                  const linked = e.target.checked;
                  setParams((p) => {
                    const val = p.cTopRightOuter;
                    return { ...p, linkOuterCorners: linked, ...(linked ? { uTopLeft: val } : {}) };
                  });
                }}
                style={{ accentColor: "#7BA3C9" }}
              />
              <span style={{ fontSize: 9, color: "#777", letterSpacing: "0.1em" }}>LINK ALL OUTER CORNERS</span>
            </label>
          </div>
          <Slider label="↖ Top-Left" value={params.uTopLeft} onChange={(v) => update("uTopLeft", v)} max={20} color="#7BA3C9" />
          <Slider label="↙ Bottom-Left (curve)" value={params.uBottomLeft} onChange={(v) => update("uBottomLeft", v)} max={80} color="#7BA3C9" />
        </Section>

        <Section label="C — OPENING" subtle={subtle} muted={muted}>
          <Slider label="C Opening (gap)" value={params.cGap} onChange={(v) => update("cGap", v)} min={20} max={160} color="#C9A37B" />
          <div style={{ marginBottom: 6 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={autoReturnLength}
                onChange={(e) => setAutoReturnLength(e.target.checked)}
                style={{ accentColor: "#C9A37B" }}
              />
              <span style={{ fontSize: 9, color: "#777", letterSpacing: "0.1em" }}>AUTO RETURN (= STROKE WIDTH)</span>
            </label>
          </div>
          <div style={{ opacity: autoReturnLength ? 0.3 : 1, pointerEvents: autoReturnLength ? "none" : "auto" }}>
            <Slider label={`C Return Length${autoReturnLength ? " (auto)" : ""}`} value={effectiveParams.cReturnLength} onChange={(v) => update("cReturnLength", v)} min={0} max={70} color="#C9A37B" />
          </div>
          <div style={{ fontSize: 8, color: muted, letterSpacing: "0.12em", marginBottom: 6, marginTop: 12 }}>GAP CORNER RADII</div>
          <Slider label="Top Gap Radius" value={params.cGapTopRadius} onChange={(v) => update("cGapTopRadius", v)} max={20} color="#C9A37B" />
          <div style={{ opacity: params.symmetricC ? 0.3 : 1, pointerEvents: params.symmetricC ? "none" : "auto" }}>
            <Slider label={"Bottom Gap Radius" + (params.symmetricC ? " (mirrored)" : "")} value={params.cGapBottomRadius} onChange={(v) => update("cGapBottomRadius", v)} max={20} color="#C9A37B" />
          </div>
        </Section>

        <Section label="C — CORNERS" subtle={subtle} muted={muted} defaultOpen={false}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={params.symmetricC}
                onChange={(e) => setParams((p) => ({ ...p, symmetricC: e.target.checked }))}
                style={{ accentColor: "#B8986A" }}
              />
              <span style={{ fontSize: 9, color: "#777", letterSpacing: "0.1em" }}>MIRROR TOP ↔ BOTTOM</span>
            </label>
          </div>
          <div style={{ fontSize: 8, color: muted, letterSpacing: "0.12em", marginBottom: 6, marginTop: 10 }}>TOP-RIGHT</div>
          <Slider label="Outer" value={params.cTopRightOuter} onChange={(v) => update("cTopRightOuter", v)} max={30} color="#C9A37B" />
          <Slider label="Inner" value={params.cTopRightInner} onChange={(v) => update("cTopRightInner", v)} max={30} color="#C9A37B" />
          <div style={{ fontSize: 8, color: muted, letterSpacing: "0.12em", marginBottom: 6, marginTop: 10, opacity: params.symmetricC ? 0.3 : 1 }}>BOTTOM-RIGHT {params.symmetricC && "(mirrored)"}</div>
          <div style={{ opacity: params.symmetricC ? 0.3 : 1, pointerEvents: params.symmetricC ? "none" : "auto" }}>
            <Slider label="Outer" value={params.cBottomRightOuter} onChange={(v) => update("cBottomRightOuter", v)} max={30} color="#C9A37B" />
            <Slider label="Inner" value={params.cBottomRightInner} onChange={(v) => update("cBottomRightInner", v)} max={30} color="#C9A37B" />
          </div>
        </Section>

        {/* Mini preview */}
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: muted, marginBottom: 10 }}>SCALE</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
            {[48, 32, 20, 14].map((s) => (
              <div key={s} style={{ textAlign: "center" }}>
                <Mark color={fg} size={s} params={effectiveParams} />
                <div style={{ fontSize: 7, color: muted, marginTop: 5 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Hero */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, minHeight: 400 }}>
          <Mark color={fg} size={300} params={effectiveParams} />
        </div>

        {/* Color strip */}
        <div style={{ display: "flex", gap: 2, margin: "0 20px", borderRadius: 10, overflow: "hidden" }}>
          {[
            { bg: "#000", fg: "#FFF" },
            { bg: "#FFF", fg: "#000" },
            { bg: "#1A1A1A", fg: "#B8986A" },
            { bg: "#B8986A", fg: "#FFF" },
            { bg: "#0A1628", fg: "#FFF" },
            { bg: "#F5F2ED", fg: "#2C2C2C" },
          ].map((ctx, i) => (
            <div key={i} style={{ flex: 1, background: ctx.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "22px 8px" }}>
              <Mark color={ctx.fg} size={42} params={effectiveParams} />
            </div>
          ))}
        </div>

        {/* Lockups */}
        <div style={{ display: "flex", gap: 12, padding: "18px 20px", justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: subtle, padding: "12px 22px", borderRadius: 8 }}>
            <Mark color={fg} size={30} params={effectiveParams} />
            <div style={{ width: 1, height: 22, background: `${muted}40` }} />
            <span style={{ fontWeight: 300, fontSize: 14, letterSpacing: "0.35em", color: fg }}>UPPERCASE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: subtle, padding: "12px 22px", borderRadius: 8 }}>
            <Mark color={fg} size={30} params={effectiveParams} />
            <div style={{ width: 1, height: 22, background: `${muted}40` }} />
            <span style={{ fontSize: 14, color: fg }}>
              <span style={{ fontWeight: 700, letterSpacing: "0.1em" }}>UPPER</span>
              <span style={{ fontWeight: 200, letterSpacing: "0.1em" }}>CASE</span>
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: subtle, padding: "12px 22px", borderRadius: 8 }}>
            <Mark color={fg} size={38} params={effectiveParams} />
            <span style={{ fontWeight: 300, fontSize: 9, letterSpacing: "0.35em", color: fg }}>UPPERCASE</span>
          </div>
        </div>

        {/* Params bar */}
        <div style={{ padding: "10px 20px 14px", borderTop: `1px solid ${subtle}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 8, color: muted, fontFamily: "monospace", letterSpacing: "0.05em" }}>
            t:{params.strokeWidth} uW:{params.uWidth} cW:{params.cWidth} gap:{params.cGap} ret:{effectiveParams.cReturnLength}{autoReturnLength ? "(auto)" : ""} uBL:{params.uBottomLeft} uTL:{params.uTopLeft} cTRo:{params.cTopRightOuter} cTRi:{params.cTopRightInner}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => { navigator.clipboard.writeText(JSON.stringify(effectiveParams, null, 2)).catch(() => {}); }}
              style={{ background: "#333", border: "none", color: "#aaa", padding: "5px 12px", fontSize: 9, letterSpacing: "0.1em", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}
            >COPY JSON</button>
            <button
              onClick={() => { setParams(defaultParams); setActivePreset("Original"); setAutoReturnLength(true); }}
              style={{ background: "#B8986A", border: "none", color: "#000", padding: "5px 12px", fontSize: 9, letterSpacing: "0.1em", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}
            >RESET</button>
          </div>
        </div>
      </div>
    </div>
  );
}

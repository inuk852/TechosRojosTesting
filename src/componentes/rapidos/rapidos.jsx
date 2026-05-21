import { useState, useCallback, useRef } from "react";

/* ══════════════════════════════════════════════
   ESTILOS GLOBALES
══════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+SC:wght@400;600;700&family=Quicksand:wght@400;500;600;700&display=swap');

  :root {
    --red:          #b41800;
    --red-hover:    #961400;
    --red-dark:     #7e1100;
    --red-soft:     #fae8e5;
    --red-ghost:    rgba(180,24,0,.08);
    --bg:           #ffffff;
    --bg-soft:      #fdfaf9;
    --bg-muted:     #f5f0ee;
    --ink:          #1a1208;
    --ink-soft:     #4a4038;
    --muted:        #9a8f89;
    --border:       rgba(180,24,0,.18);
    --border-light: rgba(180,24,0,.10);
    --green:        #1a7a4a;
    --green-soft:   #e8f5ee;
    --amber:        #c47a00;
    --radius:       12px;
    --radius-lg:    18px;
    --radius-xl:    24px;
    --shadow-sm:    0 1px 4px rgba(60,20,10,.07);
    --shadow-md:    0 6px 22px rgba(60,20,10,.11);
    --shadow-lg:    0 18px 52px rgba(60,20,10,.16);
    --t:            .18s cubic-bezier(.4,0,.2,1);
    --font-body:    'DM Sans', system-ui, sans-serif;
    --font-display: 'Playfair Display', Georgia, serif;
    --font-mono:    'JetBrains Mono', monospace;
    --font-ui:      'Quicksand', sans-serif;
    --sidebar-w:    200px;
    --topbar-h:     52px;
  }

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body, #root { height:100%; overflow:hidden; }
  body { font-family:var(--font-body); background:var(--bg-soft); color:var(--ink); -webkit-font-smoothing:antialiased; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border); border-radius:10px; }

  .kanji {
    position:fixed; font-family:'Noto Serif SC',serif; font-weight:700;
    color:hsla(10,80%,55%,.07); user-select:none; pointer-events:none; z-index:0; line-height:1;
  }

  /* ─── SHELL ─── */
  .app { display:flex; height:100vh; overflow:hidden; position:relative; }

  /* ─── SIDEBAR ─── */
  .sidebar {
    width:var(--sidebar-w); height:100vh; background:var(--red);
    display:flex; flex-direction:column; padding:.9rem; flex-shrink:0; z-index:10;
  }
  .sidebar-brand {
    display:flex; align-items:center; gap:.6rem;
    padding-bottom:.9rem; border-bottom:1px solid rgba(255,255,255,.18); margin-bottom:.9rem;
  }
  .sidebar-logo {
    width:36px; height:36px; background:white; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-family:'Noto Serif SC',serif; font-size:1.1rem; color:var(--red); font-weight:700; flex-shrink:0;
  }
  .sidebar-brand h3 { font-size:.82rem; font-weight:700; color:white; line-height:1.2; }
  .sidebar-brand span { font-size:.68rem; color:rgba(255,255,255,.65); display:block; }
  .sidebar-nav { display:flex; flex-direction:column; gap:.2rem; flex:1; }
  .nav-link {
    display:flex; align-items:center; padding:.65rem .85rem; border-radius:10px;
    font-size:.82rem; font-weight:600; color:rgba(255,255,255,.72); transition:var(--t);
    font-family:var(--font-ui); cursor:pointer; border:none; background:transparent; width:100%; text-align:left;
  }
  .nav-link:hover { background:rgba(255,255,255,.12); color:white; }
  .nav-link.active { background:white; color:var(--red); box-shadow:var(--shadow-md); }
  .sidebar-logout {
    width:100%; background:rgba(255,255,255,.1); border:none; color:white; cursor:pointer;
    padding:10px; border-radius:var(--radius); font-weight:500; font-family:var(--font-body);
    font-size:.82rem; transition:background .2s; margin-top:auto;
  }
  .sidebar-logout:hover { background:rgba(255,255,255,.2); }

  /* ─── MAIN ─── */
  .main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }

  /* ─── TOPBAR ─── */
  .topbar {
    height:var(--topbar-h); background:var(--bg); border-bottom:1px solid var(--border-light);
    padding:0 16px; display:flex; align-items:center; justify-content:space-between;
    flex-shrink:0; gap:12px; z-index:5;
  }
  .topbar-brand { display:flex; align-items:center; gap:8px; }
  .topbar-logo {
    width:30px; height:30px; background:var(--red); border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    font-family:'Noto Serif SC',serif; font-size:1rem; color:white; font-weight:700; flex-shrink:0;
  }
  .topbar-title { font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--ink); }
  .topbar-sub { font-size:10px; color:var(--muted); font-family:var(--font-ui); }
  .topbar-sub .cn { font-family:'Noto Serif SC',serif; }
  .chip {
    display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px;
    font-size:11px; font-weight:600; background:var(--bg-muted); color:var(--ink-soft);
    border:1px solid var(--border-light); font-family:var(--font-ui); white-space:nowrap;
  }

  /* stepper */
  .stepper { display:flex; align-items:center; }
  .step { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:600; color:var(--muted); font-family:var(--font-ui); }
  .step.done  { color:var(--red); }
  .step.active{ color:var(--ink); font-weight:700; }
  .step-bullet {
    width:22px; height:22px; border-radius:50%; border:2px solid currentColor;
    display:flex; align-items:center; justify-content:center;
    font-size:10px; font-weight:700; flex-shrink:0; transition:var(--t);
  }
  .step.done   .step-bullet { background:var(--red); border-color:var(--red); color:white; }
  .step.active .step-bullet { background:var(--red); border-color:var(--red); color:white; }
  .step-line { width:32px; height:2px; background:var(--border-light); margin:0 4px; border-radius:2px; }
  .step-line.done { background:var(--red); }

  /* ══════════════════════════════════════════════
     VISTA: PRODUCTOS
  ══════════════════════════════════════════════ */
  .rapido-body { flex:1; display:flex; overflow:hidden; min-height:0; }

  .productos-panel { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }

  .search-cats-bar {
    padding:8px 14px; border-bottom:1px solid var(--border-light);
    background:var(--bg); flex-shrink:0; display:flex; flex-direction:column; gap:7px;
  }
  .search-wrap { position:relative; }
  .search-wrap svg { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }
  .search-input {
    width:100%; height:36px; border:1.5px solid var(--border); border-radius:999px;
    padding:0 12px 0 34px; font-size:13px; outline:none; transition:var(--t);
    background:var(--bg-muted); color:var(--ink); font-family:var(--font-body);
  }
  .search-input:focus { border-color:var(--red); box-shadow:0 0 0 3px var(--red-ghost); background:var(--bg); }
  .search-input::placeholder { color:var(--muted); }

  .cats { display:flex; gap:5px; flex-wrap:nowrap; overflow-x:auto; scrollbar-width:none; padding-bottom:1px; }
  .cats::-webkit-scrollbar { display:none; }
  .cat-btn {
    height:28px; padding:0 11px; border-radius:999px; border:1.5px solid var(--border-light);
    background:var(--bg-muted); color:var(--muted); font-size:11px; font-weight:600;
    font-family:var(--font-ui); transition:var(--t); white-space:nowrap; cursor:pointer; flex-shrink:0;
  }
  .cat-btn:hover { border-color:var(--red); color:var(--red); background:var(--red-ghost); }
  .cat-btn.active { background:var(--red); color:white; border-color:var(--red); }

  .product-grid-wrap { flex:1; overflow-y:auto; padding:12px 14px; }
  .product-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(155px,1fr)); gap:9px; }

  .product-card {
    background:var(--bg); border:1.5px solid var(--border-light); border-radius:var(--radius-lg);
    padding:13px 12px; cursor:pointer; display:flex; flex-direction:column; gap:5px;
    transition:var(--t); position:relative; overflow:hidden;
  }
  .product-card:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); border-color:var(--red); }
  .product-card:active { transform:scale(.97); }
  .pc-cn { font-family:'Noto Serif SC',serif; font-size:1.25rem; color:var(--red); opacity:.5; line-height:1; }
  .pc-name { font-size:.84rem; font-weight:700; color:var(--ink); line-height:1.2; }
  .pc-cat { font-size:.68rem; color:var(--muted); font-family:var(--font-ui); }
  .pc-footer { display:flex; align-items:center; justify-content:space-between; margin-top:auto; padding-top:6px; }
  .pc-price { font-size:.88rem; font-weight:700; color:var(--ink); font-family:var(--font-mono); }
  .pc-add {
    width:26px; height:26px; border-radius:50%; background:var(--red); color:white;
    display:flex; align-items:center; justify-content:center; font-size:.95rem;
    flex-shrink:0; transition:var(--t); border:none; cursor:pointer;
  }
  .product-card:hover .pc-add { transform:scale(1.12); box-shadow:0 4px 10px rgba(180,24,0,.3); }

  .empty-state { grid-column:1/-1; text-align:center; padding:2.5rem; color:var(--muted); }
  .empty-cn { font-family:'Noto Serif SC',serif; font-size:2.5rem; color:rgba(180,24,0,.18); display:block; margin-bottom:.4rem; }

  /* ─── CART PANEL ─── */
  .cart-panel {
    width:270px; flex-shrink:0; background:var(--bg);
    border-left:1px solid var(--border-light); display:flex; flex-direction:column; overflow:hidden;
  }
  .cart-header {
    padding:10px 13px; border-bottom:1px solid var(--border-light);
    display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
  }
  .cart-title { font-family:var(--font-display); font-size:14px; font-weight:700; color:var(--ink); }
  .cart-badge {
    background:var(--red); color:white; font-size:.65rem; font-weight:700;
    width:20px; height:20px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-family:var(--font-ui); transition:transform .15s;
  }
  .cart-body { flex:1; overflow-y:auto; padding:10px 12px; }
  .cart-empty {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    height:100%; gap:5px; color:var(--muted); text-align:center;
  }
  .cart-list { display:flex; flex-direction:column; gap:6px; list-style:none; }
  .cart-item {
    display:flex; align-items:center; gap:7px; padding:7px 9px;
    background:var(--bg-soft); border-radius:var(--radius);
    border:1px solid var(--border-light); animation:fadeUp .18s ease both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
  .ci-info { flex:1; min-width:0; }
  .ci-name { font-size:.76rem; font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ci-meta { font-size:.65rem; color:var(--muted); font-family:var(--font-mono); }
  .qty-ctrl { display:flex; align-items:center; gap:3px; flex-shrink:0; }
  .qty-btn {
    width:22px; height:22px; border-radius:6px; background:var(--bg-muted);
    color:var(--ink-soft); display:flex; align-items:center; justify-content:center;
    font-size:.85rem; font-weight:700; transition:var(--t); border:none; cursor:pointer;
  }
  .qty-btn:hover { background:var(--red); color:white; }
  .qty-val { font-size:.78rem; font-weight:700; min-width:16px; text-align:center; font-family:var(--font-mono); }
  .ci-remove { color:var(--muted); font-size:.7rem; cursor:pointer; padding:.15rem; transition:var(--t); flex-shrink:0; line-height:1; background:none; border:none; }
  .ci-remove:hover { color:var(--red); }
  .cart-footer { padding:10px 12px; border-top:1px solid var(--border-light); flex-shrink:0; }
  .totals { display:flex; flex-direction:column; gap:4px; margin-bottom:10px; }
  .total-row { display:flex; justify-content:space-between; font-size:11.5px; color:var(--ink-soft); }
  .total-row span:last-child { font-family:var(--font-mono); }
  .total-row.final { font-size:14px; font-weight:700; color:var(--ink); padding-top:5px; border-top:1px solid var(--border-light); margin-top:2px; }
  .btn-checkout {
    width:100%; padding:9px; border-radius:var(--radius); background:var(--red); color:white;
    font-size:13px; font-weight:600; font-family:var(--font-body); border:none; cursor:pointer;
    transition:var(--t); display:flex; align-items:center; justify-content:center; gap:6px;
  }
  .btn-checkout:hover:not(:disabled) { background:var(--red-hover); box-shadow:var(--shadow-md); }
  .btn-checkout:disabled { opacity:.45; cursor:not-allowed; }
  .thanks { font-size:9.5px; color:var(--muted); text-align:center; margin-top:7px; font-family:'Noto Serif SC',serif; }

  /* ══════════════════════════════════════════════
     VISTA: CAJA (3 columnas)
  ══════════════════════════════════════════════ */
  .caja-body {
    flex:1; display:grid;
    grid-template-columns:1fr 1.15fr 260px;
    overflow:hidden; min-height:0;
  }

  /* col 1 — resumen */
  .panel-resumen {
    display:flex; flex-direction:column; overflow:hidden;
    border-right:1px solid var(--border-light); background:var(--bg-soft);
  }
  .panel-scroll { flex:1; overflow-y:auto; padding:18px 16px; }

  .resumen-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
  .resumen-title { font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--ink); }
  .order-id-badge {
    font-family:var(--font-mono); font-size:11px; font-weight:600; padding:3px 10px;
    border-radius:20px; border:1px solid var(--border); color:var(--ink-soft); background:var(--bg);
  }
  .order-items { display:flex; flex-direction:column; gap:7px; margin-bottom:16px; }
  .order-item {
    display:flex; align-items:center; gap:9px; padding:9px 11px;
    background:var(--bg); border:1px solid var(--border-light); border-radius:var(--radius);
  }
  .item-qty-badge {
    width:26px; height:26px; border-radius:7px; background:var(--red); color:white;
    font-size:10px; font-weight:700; font-family:var(--font-mono);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .item-info { flex:1; min-width:0; }
  .item-name { font-size:12.5px; font-weight:600; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .item-unit { font-size:10.5px; color:var(--muted); font-family:var(--font-mono); }
  .item-total { font-family:var(--font-mono); font-size:12.5px; font-weight:700; color:var(--ink); flex-shrink:0; }

  .discount-row {
    display:flex; align-items:center; gap:8px; padding:9px 11px;
    background:var(--bg); border:1px solid var(--border-light); border-radius:var(--radius); margin-bottom:12px;
  }
  .discount-label { font-size:12px; color:var(--muted); flex:1; }
  .discount-input {
    width:80px; padding:5px 9px; border:1.5px solid var(--border); border-radius:8px;
    font-size:13px; font-family:var(--font-mono); color:var(--ink); background:var(--bg-soft);
    outline:none; text-align:right; transition:var(--t);
  }
  .discount-input:focus { border-color:var(--red); box-shadow:0 0 0 3px var(--red-ghost); }

  .totals-block { border-top:1px solid var(--border-light); padding-top:12px; display:flex; flex-direction:column; gap:7px; }
  .tr { display:flex; justify-content:space-between; font-size:12.5px; color:var(--ink-soft); }
  .tr span:last-child { font-family:var(--font-mono); }
  .tr.discount span:last-child { color:var(--green); }
  .tr.grand { font-size:15px; font-weight:700; color:var(--ink); padding-top:7px; border-top:1px solid var(--border); margin-top:2px; }
  .tr.grand span:last-child { color:var(--red); font-size:17px; }

  /* col 2 — pago */
  .panel-pago {
    display:flex; flex-direction:column; overflow:hidden;
    border-right:1px solid var(--border-light); background:var(--bg);
  }
  .eyebrow {
    font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    color:var(--muted); font-family:var(--font-ui); margin-bottom:11px;
  }
  .metodos-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; margin-bottom:18px; }
  .metodo-btn {
    padding:10px 5px; border-radius:var(--radius-lg); border:1.5px solid var(--border-light);
    background:var(--bg-soft); cursor:pointer; text-align:center; transition:var(--t);
    display:flex; flex-direction:column; align-items:center; gap:3px;
  }
  .metodo-btn:hover { border-color:var(--red); background:var(--red-ghost); }
  .metodo-btn.selected { border-color:var(--red); background:var(--red-soft); }
  .metodo-cn { font-family:'Noto Serif SC',serif; font-size:1.15rem; color:var(--red); line-height:1; }
  .metodo-name { font-size:12px; font-weight:700; color:var(--red); }
  .metodo-sublabel { font-size:9.5px; color:var(--muted); font-family:var(--font-ui); }

  .monto-wrap { position:relative; margin-bottom:11px; }
  .monto-prefix {
    position:absolute; left:13px; top:50%; transform:translateY(-50%);
    font-size:14px; font-weight:600; color:var(--muted); pointer-events:none;
  }
  .monto-input {
    width:100%; padding:12px 12px 12px 28px; border:1.5px solid var(--border);
    border-radius:var(--radius-lg); font-size:20px; font-weight:700;
    font-family:var(--font-mono); color:var(--ink); background:var(--bg); outline:none; transition:var(--t);
  }
  .monto-input:focus { border-color:var(--red); box-shadow:0 0 0 3px var(--red-ghost); }
  .monto-input::placeholder { color:var(--border); }

  .bills { display:flex; gap:7px; margin-bottom:16px; flex-wrap:wrap; }
  .bill-btn {
    padding:6px 13px; border-radius:999px; border:1.5px solid var(--border-light);
    background:var(--bg); font-size:12px; font-weight:700; font-family:var(--font-mono);
    color:var(--ink-soft); cursor:pointer; transition:var(--t);
  }
  .bill-btn:hover { border-color:var(--red); color:var(--red); background:var(--red-ghost); }
  .bill-btn.exact { border-color:var(--green); color:var(--green); }
  .bill-btn.exact:hover { background:var(--green-soft); }

  .cambio-box {
    display:flex; align-items:center; justify-content:space-between; padding:12px 14px;
    border-radius:var(--radius-lg); background:var(--bg-muted); border:1px solid var(--border-light);
  }
  .cambio-label { font-size:12.5px; color:var(--ink-soft); }
  .cambio-value { font-family:var(--font-mono); font-size:17px; font-weight:700; color:var(--ink); }
  .cambio-value.positive { color:var(--green); }

  .mixto-note { display:flex; flex-direction:column; gap:10px; margin-top:4px; }
  .mixto-field { display:flex; flex-direction:column; gap:4px; }
  .mixto-field label { font-size:11px; font-weight:600; color:var(--muted); font-family:var(--font-ui); }
  .mixto-input {
    padding:9px 12px; border:1.5px solid var(--border); border-radius:var(--radius);
    font-size:14px; font-family:var(--font-mono); color:var(--ink);
    background:var(--bg-soft); outline:none; transition:var(--t); width:100%;
  }
  .mixto-input:focus { border-color:var(--red); box-shadow:0 0 0 3px var(--red-ghost); }

  /* col 3 — lateral */
  .panel-lateral { display:flex; flex-direction:column; overflow:hidden; background:var(--bg); }
  .total-hero {
    background:var(--red); padding:18px 16px; flex-shrink:0; position:relative; overflow:hidden;
  }
  .total-hero::after {
    content:'会计'; position:absolute; bottom:-8px; right:-2px;
    font-family:'Noto Serif SC',serif; font-size:4rem; font-weight:700;
    color:rgba(255,255,255,.1); line-height:1; pointer-events:none; user-select:none;
  }
  .th-label { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.65); font-family:var(--font-ui); margin-bottom:3px; }
  .th-amount { font-family:var(--font-mono); font-size:2.2rem; font-weight:700; color:white; line-height:1.1; }
  .th-method { font-size:11px; color:rgba(255,255,255,.7); margin-top:4px; font-family:var(--font-ui); }

  .pedido-info { flex:1; overflow-y:auto; padding:14px 14px 8px; display:flex; flex-direction:column; gap:9px; }
  .info-row { display:flex; justify-content:space-between; align-items:baseline; }
  .info-key { font-size:11px; color:var(--muted); font-family:var(--font-ui); }
  .info-val { font-size:12px; font-weight:700; color:var(--ink); font-family:var(--font-mono); text-align:right; }

  .thanks-txt { font-family:'Noto Serif SC',serif; font-size:10px; color:var(--muted); text-align:center; padding:8px 0; border-top:1px solid var(--border-light); flex-shrink:0; margin:0 14px; }

  .action-btns { padding:10px 12px; display:flex; flex-direction:column; gap:7px; flex-shrink:0; }
  .btn-cobrar {
    width:100%; padding:12px; border-radius:var(--radius-xl); background:var(--red); color:white;
    font-size:13.5px; font-weight:700; font-family:var(--font-body); border:none; cursor:pointer;
    transition:var(--t); display:flex; align-items:center; justify-content:center; gap:7px;
  }
  .btn-cobrar:hover:not(:disabled) { background:var(--red-hover); box-shadow:var(--shadow-md); }
  .btn-cobrar:disabled { opacity:.45; cursor:not-allowed; }
  .btn-cancelar {
    width:100%; padding:9px; border-radius:var(--radius-lg); background:transparent;
    color:var(--ink-soft); font-size:12.5px; font-weight:600; font-family:var(--font-body);
    border:1.5px solid var(--border-light); cursor:pointer; transition:var(--t);
    display:flex; align-items:center; justify-content:center; gap:5px;
  }
  .btn-cancelar:hover { border-color:var(--red); color:var(--red); background:var(--red-ghost); }

  /* ─── MODAL ÉXITO ─── */
  .success-overlay {
    position:fixed; inset:0; background:rgba(10,5,0,.55); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center; z-index:200;
    animation:fadeIn .2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .success-modal {
    background:var(--bg); border-radius:var(--radius-xl); box-shadow:var(--shadow-lg);
    border:1px solid var(--border-light); width:min(400px,90vw); padding:32px 28px; text-align:center;
    animation:slideUp .25s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:none;opacity:1} }
  .success-icon { font-size:3rem; margin-bottom:10px; display:block; }
  .success-title { font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--ink); margin-bottom:5px; }
  .success-sub { font-size:12.5px; color:var(--muted); margin-bottom:20px; }
  .success-change { font-family:var(--font-mono); font-size:26px; font-weight:700; color:var(--green); margin-bottom:3px; }
  .success-change-label { font-size:11.5px; color:var(--muted); margin-bottom:20px; }
  .btn-nuevo {
    width:100%; padding:11px; border-radius:var(--radius-xl); background:var(--red); color:white;
    font-size:13.5px; font-weight:700; font-family:var(--font-body); border:none; cursor:pointer; transition:var(--t);
  }
  .btn-nuevo:hover { background:var(--red-hover); box-shadow:var(--shadow-md); }

  /* ─── TOAST ─── */
  .toast-wrap { position:fixed; top:14px; right:14px; display:flex; flex-direction:column; gap:6px; z-index:300; pointer-events:none; }
  .toast {
    background:var(--green); color:white; padding:8px 14px; border-radius:var(--radius);
    font-size:12px; font-weight:500; box-shadow:var(--shadow-lg);
    animation:toastIn .22s ease, toastOut .28s ease 2s forwards;
  }
  @keyframes toastIn  { from{transform:translateX(16px);opacity:0} to{transform:none;opacity:1} }
  @keyframes toastOut { to{transform:translateX(16px);opacity:0} }
`;

/* ══════════════════════════════════════════════
   DATOS
══════════════════════════════════════════════ */
const PRODUCTS = [
  { id:"p1",  name:"Chow Mein",          cn:"炒面",     cat:"Fideos",   price:12.5 },
  { id:"p2",  name:"Lo Mein Res",        cn:"牛肉捞面", cat:"Fideos",   price:14.0 },
  { id:"p3",  name:"Chop Suey",          cn:"炒杂碎",   cat:"Wok",      price:13.5 },
  { id:"p4",  name:"Arroz Frito",        cn:"炒饭",     cat:"Arroces",  price:11.0 },
  { id:"p5",  name:"Arroz Especial",     cn:"特色饭",   cat:"Arroces",  price:14.5 },
  { id:"p6",  name:"Pollo Agridulce",    cn:"甜酸鸡",   cat:"Wok",      price:15.0 },
  { id:"p7",  name:"Cerdo BBQ",          cn:"叉烧",     cat:"Parrilla", price:16.5 },
  { id:"p8",  name:"Costillas",          cn:"排骨",     cat:"Parrilla", price:18.0 },
  { id:"p9",  name:"Rollitos Primavera", cn:"春卷",     cat:"Entradas", price:7.5  },
  { id:"p10", name:"Sopa Wonton",        cn:"馄饨汤",   cat:"Sopas",    price:9.0  },
  { id:"p11", name:"Sopa Maíz",          cn:"玉米汤",   cat:"Sopas",    price:8.5  },
  { id:"p12", name:"Té Frío",            cn:"冷茶",     cat:"Bebidas",  price:3.5  },
  { id:"p13", name:"Jugo Natural",       cn:"果汁",     cat:"Bebidas",  price:4.5  },
  { id:"p14", name:"Agua",               cn:"水",       cat:"Bebidas",  price:2.0  },
  { id:"p15", name:"Banana Split",       cn:"香蕉船",   cat:"Postres",  price:6.5  },
];

const CATS    = ["Todos","Fideos","Arroces","Wok","Parrilla","Entradas","Sopas","Bebidas","Postres"];
const METODOS = [
  { id:"efectivo",  cn:"现金", name:"Efectivo",  sub:"现金"  },
  { id:"tarjeta",   cn:"卡片", name:"Tarjeta",   sub:"卡片"  },
  { id:"qr",        cn:"扫码", name:"Pago QR",   sub:"扫码"  },
  { id:"mixto",     cn:"混合", name:"Mixto",     sub:"混合"  },
];
const BILLS   = [10, 20, 50, 100];
const NAV     = ["Mesas","Rapido","Domicilios","Caja","Inventario","Historial","Menú"];

const fmt   = n => `$${n.toFixed(2)}`;
const today = () => new Date().toLocaleDateString("es-CO", { weekday:"short", day:"numeric", month:"short" });
let orderCounter = 1;
const genId = () => `#J-${String(orderCounter++).padStart(4,"0")}`;

/* ══════════════════════════════════════════════
   COMPONENTE
══════════════════════════════════════════════ */
export default function Rapido() {
  /* ── vista activa: "productos" | "caja" ── */
  const [vista,      setVista]      = useState("productos");

  /* ── estado productos ── */
  const [cart,       setCart]       = useState([]);
  const [activeCat,  setActiveCat]  = useState("Todos");
  const [query,      setQuery]      = useState("");
  const badgeRef = useRef(null);

  /* ── estado caja ── */
  const [orderId]                   = useState(genId);
  const [descuento,  setDescuento]  = useState("");
  const [metodo,     setMetodo]     = useState("efectivo");
  const [monto,      setMonto]      = useState("");
  const [mixtoEfec,  setMixtoEfec]  = useState("");
  const [mixtoTarj,  setMixtoTarj]  = useState("");
  const [showSuccess,setShowSuccess]= useState(false);

  /* ── toasts ── */
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2400);
  }, []);

  /* ── carrito ── */
  const addToCart = useCallback((p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
    addToast(`+ ${p.name}`);
    if (badgeRef.current) {
      badgeRef.current.style.transform = "scale(1.55)";
      setTimeout(() => { if (badgeRef.current) badgeRef.current.style.transform = ""; }, 200);
    }
  }, [addToast]);

  const changeQty = useCallback((id, delta) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      if (item.qty + delta <= 0) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i);
    });
  }, []);

  const removeItem = useCallback((id) => setCart(prev => prev.filter(i => i.id !== id)), []);

  /* ── totales carrito ── */
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotalP  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const taxP       = subtotalP * 0.10;
  const totalP     = subtotalP + taxP;

  /* ── totales caja ── */
  const descNum  = Math.min(parseFloat(descuento) || 0, subtotalP);
  const base     = subtotalP - descNum;
  const taxC     = base * 0.10;
  const totalC   = base + taxC;
  const montoNum = parseFloat(monto) || 0;
  const cambio   = montoNum - totalC;

  const canCobrar = metodo === "tarjeta" || metodo === "qr"
    ? true
    : metodo === "mixto"
    ? (parseFloat(mixtoEfec)||0) + (parseFloat(mixtoTarj)||0) >= totalC - 0.001
    : montoNum >= totalC - 0.001;

  /* ── navegación a caja ── */
  const irACaja = () => {
    setMonto("");
    setDescuento("");
    setMetodo("efectivo");
    setMixtoEfec(""); setMixtoTarj("");
    setVista("caja");
  };

  /* ── cobrar ── */
  const handleCobrar = () => {
    if (!canCobrar) return;
    addToast("🖨️ Imprimiendo comprobante…");
    setTimeout(() => setShowSuccess(true), 600);
  };

  /* ── nuevo pedido (desde éxito) ── */
  const nuevoPedido = () => {
    setCart([]);
    setShowSuccess(false);
    setVista("productos");
    setMonto(""); setDescuento("");
    setMetodo("efectivo");
    setMixtoEfec(""); setMixtoTarj("");
  };

  /* ── productos filtrados ── */
  const q        = query.toLowerCase();
  const filtered = PRODUCTS.filter(p => {
    const inCat = activeCat === "Todos" || p.cat === activeCat;
    const inQ   = !q || p.name.toLowerCase().includes(q) || p.cn.includes(q) || p.cat.toLowerCase().includes(q);
    return inCat && inQ;
  });

  /* ─────────────────────────────────────────────
     TOPBAR adaptable según vista
  ───────────────────────────────────────────── */
  const Topbar = () => (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="topbar-logo">麺</div>
        <div>
          <div className="topbar-title">{vista === "caja" ? "Caja" : "Rápido"}</div>
          <div className="topbar-sub">
            {vista === "caja"
              ? <>Cobro · <span className="cn">会计</span></>
              : <>Venta rápida · <span className="cn">快速</span></>}
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper">
        <div className={`step ${vista === "productos" ? "active" : "done"}`}>
          <div className="step-bullet">{vista === "productos" ? "1" : "✓"}</div>
          <span>Productos</span>
        </div>
        <div className={`step-line${vista === "caja" ? " done" : ""}`} />
        <div className={`step ${vista === "caja" ? "active" : ""}`}>
          <div className="step-bullet">2</div>
          <span>Caja</span>
        </div>
      </div>

      <div className="chip">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        {today()}
      </div>
    </header>
  );

  /* ═════════════════════════════════════════════
     RENDER
  ═════════════════════════════════════════════ */
  return (
    <>
      <style>{CSS}</style>

      <span className="kanji" style={{ top:"1.5rem", left:"1.5rem", fontSize:"7rem" }}>
        {vista === "caja" ? "会" : "快"}
      </span>
      <span className="kanji" style={{ bottom:"2rem", right:"2rem", fontSize:"5.5rem" }}>
        {vista === "caja" ? "计" : "速"}
      </span>

      <div className="app">

     

        {/* ── MAIN ── */}
        <div className="main">
          <Topbar />

          {/* ════════════════════════════════════
              VISTA: PRODUCTOS
          ════════════════════════════════════ */}
          {vista === "productos" && (
            <div className="rapido-body">

              {/* Grid de productos */}
              <div className="productos-panel">
                <div className="search-cats-bar">
                  <div className="search-wrap">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      className="search-input"
                      placeholder="Buscar producto o categoría…"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                    />
                  </div>
                  <div className="cats">
                    {CATS.map(c => (
                      <button key={c} className={`cat-btn${c === activeCat ? " active" : ""}`} onClick={() => setActiveCat(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="product-grid-wrap">
                  <div className="product-grid">
                    {filtered.length === 0 ? (
                      <div className="empty-state">
                        <span className="empty-cn">空</span>
                        <p style={{ fontSize:13, color:"var(--muted)" }}>Sin resultados</p>
                      </div>
                    ) : filtered.map(p => (
                      <article key={p.id} className="product-card" onClick={() => addToCart(p)}>
                        <div className="pc-cn">{p.cn}</div>
                        <div className="pc-name">{p.name}</div>
                        <div className="pc-cat">{p.cat}</div>
                        <div className="pc-footer">
                          <span className="pc-price">{fmt(p.price)}</span>
                          <button className="pc-add" onClick={e => { e.stopPropagation(); addToCart(p); }}>+</button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              {/* Carrito */}
              <aside className="cart-panel">
                <div className="cart-header">
                  <span className="cart-title">Pedido actual</span>
                  <div ref={badgeRef} className="cart-badge">{totalItems}</div>
                </div>

                <div className="cart-body">
                  {cart.length === 0 ? (
                    <div className="cart-empty">
                      <span className="empty-cn" style={{ fontSize:"2rem" }}>空</span>
                      <span style={{ fontSize:12, color:"var(--muted)" }}>El pedido está vacío</span>
                    </div>
                  ) : (
                    <ul className="cart-list">
                      {cart.map(i => (
                        <li key={i.id} className="cart-item">
                          <div className="ci-info">
                            <div className="ci-name">{i.name}</div>
                            <div className="ci-meta">{fmt(i.price)} c/u · {fmt(i.price * i.qty)}</div>
                          </div>
                          <div className="qty-ctrl">
                            <button className="qty-btn" onClick={() => changeQty(i.id, -1)}>−</button>
                            <span className="qty-val">{i.qty}</span>
                            <button className="qty-btn" onClick={() => changeQty(i.id,  1)}>+</button>
                          </div>
                          <button className="ci-remove" onClick={() => removeItem(i.id)}>✕</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="cart-footer">
                  <div className="totals">
                    <div className="total-row"><span>Subtotal</span><span>{fmt(subtotalP)}</span></div>
                    <div className="total-row"><span>Impuestos (10%)</span><span>{fmt(taxP)}</span></div>
                    <div className="total-row final"><span>Total</span><span>{fmt(totalP)}</span></div>
                  </div>
                  <button
                    className="btn-checkout"
                    disabled={cart.length === 0}
                    onClick={irACaja}
                  >
                    Ir a Caja
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                  <p className="thanks">非常感谢 · Gracias por su preferencia</p>
                </div>
              </aside>

            </div>
          )}

          {/* ════════════════════════════════════
              VISTA: CAJA
          ════════════════════════════════════ */}
          {vista === "caja" && (
            <div className="caja-body">

              {/* COL 1 — Resumen */}
              <div className="panel-resumen">
                <div className="panel-scroll">
                  <div className="resumen-header">
                    <span className="resumen-title">Resumen del pedido</span>
                    <span className="order-id-badge">{orderId}</span>
                  </div>

                  <div className="order-items">
                    {cart.map(item => (
                      <div key={item.id} className="order-item">
                        <div className="item-qty-badge">{item.qty}×</div>
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-unit">{item.cn} · {fmt(item.price)}</div>
                        </div>
                        <div className="item-total">{fmt(item.price * item.qty)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="discount-row">
                    <span className="discount-label">Descuento aplicado</span>
                    <input
                      className="discount-input"
                      type="number" min="0" step="0.50" placeholder="0.00"
                      value={descuento}
                      onChange={e => setDescuento(e.target.value)}
                    />
                  </div>

                  <div className="totals-block">
                    <div className="tr"><span>Subtotal</span><span>{fmt(subtotalP)}</span></div>
                    <div className="tr discount"><span>Descuento</span><span>− {fmt(descNum)}</span></div>
                    <div className="tr"><span>Impuestos (10%)</span><span>{fmt(taxC)}</span></div>
                    <div className="tr grand"><span>Total a cobrar</span><span>{fmt(totalC)}</span></div>
                  </div>
                </div>
              </div>

              {/* COL 2 — Método de pago */}
              <div className="panel-pago">
                <div className="panel-scroll">
                  <div className="eyebrow">Método de pago</div>

                  <div className="metodos-grid">
                    {METODOS.map(m => (
                      <button
                        key={m.id}
                        className={`metodo-btn${metodo === m.id ? " selected" : ""}`}
                        onClick={() => { setMetodo(m.id); setMonto(""); }}
                      >
                        <span className="metodo-cn">{m.cn}</span>
                        <span className="metodo-name">{m.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Efectivo */}
                  {metodo === "efectivo" && (
                    <>
                      <div className="eyebrow">Monto recibido</div>
                      <div className="monto-wrap">
                        <span className="monto-prefix">$</span>
                        <input
                          className="monto-input" type="number" min="0" step="0.01"
                          placeholder="0.00" value={monto}
                          onChange={e => setMonto(e.target.value)} autoFocus
                        />
                      </div>
                      <div className="bills">
                        {BILLS.map(b => (
                          <button key={b} className="bill-btn" onClick={() => setMonto(b.toString())}>${b}</button>
                        ))}
                        <button className="bill-btn exact" onClick={() => setMonto(totalC.toFixed(2))}>Exacto</button>
                      </div>
                      <div className="cambio-box">
                        <span className="cambio-label">Cambio a entregar</span>
                        <span className={`cambio-value${cambio > 0 ? " positive" : ""}`}>
                          {montoNum > 0 ? fmt(Math.max(cambio, 0)) : "$0.00"}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Tarjeta / QR */}
                  {(metodo === "tarjeta" || metodo === "qr") && (
                    <div style={{ textAlign:"center", padding:"28px 16px", color:"var(--muted)" }}>
                      <div style={{ fontSize:"2.8rem", marginBottom:10 }}>
                        {metodo === "tarjeta" ? "💳" : "📱"}
                      </div>
                      <div style={{ fontSize:13.5, fontWeight:600, color:"var(--ink)", marginBottom:6 }}>
                        {metodo === "tarjeta" ? "Pase la tarjeta por el datáfono" : "Muestre el código QR al cliente"}
                      </div>
                      <div style={{ fontSize:12 }}>
                        Total a cobrar:{" "}
                        <span style={{ fontFamily:"var(--font-mono)", fontWeight:700, color:"var(--red)" }}>
                          {fmt(totalC)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Mixto */}
                  {metodo === "mixto" && (
                    <div className="mixto-note">
                      <div className="eyebrow" style={{ marginBottom:0 }}>Distribución del pago</div>
                      <div className="mixto-field">
                        <label>Efectivo recibido</label>
                        <input className="mixto-input" type="number" min="0" step="0.01"
                          placeholder="0.00" value={mixtoEfec} onChange={e => setMixtoEfec(e.target.value)} />
                      </div>
                      <div className="mixto-field">
                        <label>Tarjeta / transferencia</label>
                        <input className="mixto-input" type="number" min="0" step="0.01"
                          placeholder="0.00" value={mixtoTarj} onChange={e => setMixtoTarj(e.target.value)} />
                      </div>
                      <div className="cambio-box" style={{ marginTop:4 }}>
                        <span className="cambio-label">Suma ingresada</span>
                        <span className={`cambio-value${(parseFloat(mixtoEfec)||0)+(parseFloat(mixtoTarj)||0) >= totalC-0.001 ? " positive" : ""}`}>
                          {fmt((parseFloat(mixtoEfec)||0) + (parseFloat(mixtoTarj)||0))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 3 — Lateral */}
              <div className="panel-lateral">
                <div className="total-hero">
                  <div className="th-label">Total a cobrar</div>
                  <div className="th-amount">{fmt(totalC)}</div>
                  <div className="th-method">Pago: {METODOS.find(m => m.id === metodo)?.name}</div>
                </div>

                <div className="pedido-info">
                  <div className="info-row"><span className="info-key">Pedido</span><span className="info-val">{orderId}</span></div>
                  <div className="info-row"><span className="info-key">Items</span><span className="info-val">{totalItems} producto{totalItems !== 1 ? "s" : ""}</span></div>
                  <div className="info-row"><span className="info-key">Subtotal</span><span className="info-val">{fmt(subtotalP)}</span></div>
                  <div className="info-row"><span className="info-key">Descuento</span><span className="info-val">− {fmt(descNum)}</span></div>
                  <div className="info-row"><span className="info-key">Impuestos</span><span className="info-val">{fmt(taxC)}</span></div>
                </div>

                <div className="thanks-txt">非常感谢 · Gracias</div>

                <div className="action-btns">
                  <button className="btn-cobrar" disabled={!canCobrar} onClick={handleCobrar}>
                    Cobrar e imprimir
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 6 2 18 2 18 9"/>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                      <rect x="6" y="14" width="12" height="8"/>
                    </svg>
                  </button>
                  <button className="btn-cancelar" onClick={() => setVista("productos")}>
                    ← Volver a productos
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>{/* /main */}
      </div>{/* /app */}

      {/* Modal éxito */}
      {showSuccess && (
        <div className="success-overlay" onClick={() => {}}>
          <div className="success-modal">
            <span className="success-icon">✅</span>
            <div className="success-title">¡Cobro exitoso!</div>
            <div className="success-sub">Pedido {orderId} · {METODOS.find(m => m.id === metodo)?.name}</div>
            {metodo === "efectivo" && cambio > 0 && (
              <>
                <div className="success-change">{fmt(cambio)}</div>
                <div className="success-change-label">Cambio a entregar al cliente</div>
              </>
            )}
            <button className="btn-nuevo" onClick={nuevoPedido}>Nuevo pedido</button>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-wrap">
        {toasts.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
      </div>
    </>
  );
}
import { useState } from "react";
import { createPortal } from "react-dom";
import "./mesa.css";

const MENU_EJEMPLO = {
    "Principales": [
        { id: "p1", nombre: "Hamburguesa Especial", precio: 25000 },
        { id: "p3", nombre: "Pizza Personal", precio: 20000 },
        { id: "p4", nombre: "Nuggets de Pollo", precio: 15000 },
    ],
    "Acompañamientos": [
        { id: "p2", nombre: "Papas Rústicas", precio: 12000 },
    ],
    "Bebidas": [
        { id: "p5", nombre: "Gaseosa 500ml", precio: 5000 },
        { id: "p6", nombre: "Limonada Natural", precio: 7000 }
    ]
};

/* ══════════════════════════════════════════════
   COMPONENTE MESA
══════════════════════════════════════════════ */
export function Mesa({ numero, nombre, onDelete, onRename }) {
    const baseMesa = Number(numero) || 1;

    const [expandida,           setExpandida]           = useState(false);
    const [cuentas,             setCuentas]             = useState([{ id: Date.now(), items: [] }]);
    const [mostrarMenuPlatos,   setMostrarMenuPlatos]   = useState(false);
    const [cuentaActivaId,      setCuentaActivaId]      = useState(null);
    const [categoriaExpandida,  setCategoriaExpandida]  = useState(null);
    const [editandoNombre,      setEditandoNombre]      = useState(false);
    const [inputNombre,         setInputNombre]         = useState(nombre || `Mesa ${numero}`);

    /* ── nombre ─────────────────────────────── */
    function guardarNombre() {
        const n = inputNombre.trim() || `Mesa ${numero}`;
        setInputNombre(n);
        onRename?.(n);
        setEditandoNombre(false);
    }

    /* ── cuentas ────────────────────────────── */
    function agregarCuenta() {
        if (cuentas.length >= 5) { alert("Máximo 5 cuentas por mesa"); return; }
        setCuentas(prev => [...prev, { id: Date.now(), items: [] }]);
    }

    function borrarCuenta(idCuenta) {
        setCuentas(prev => prev.filter(c => c.id !== idCuenta));
    }

    function juntarCuentas() {
        const todos = cuentas.flatMap(c => c.items);
        setCuentas([{ id: Date.now(), items: todos }]);
    }

    /* ── platos ─────────────────────────────── */
    function abrirMenuParaCuenta(cuentaId) {
        setCuentaActivaId(cuentaId);
        setCategoriaExpandida(null);
        setMostrarMenuPlatos(true);
    }

    function alternarCategoria(categoria) {
        setCategoriaExpandida(prev => prev === categoria ? null : categoria);
    }

    /* FIX ─ NO cierra el modal al agregar un plato */
    function seleccionarPlato(plato) {
        setCuentas(prev => prev.map(c => {
            if (c.id !== cuentaActivaId) return c;
            return {
                ...c,
                items: [...c.items, { ...plato, uniqueId: Date.now() + Math.random() }]
            };
        }));
        /* setMostrarMenuPlatos(false)  <-- eliminado */
    }

    function eliminarPlato(cuentaId, uniqueId) {
        setCuentas(prev => prev.map(c => {
            if (c.id !== cuentaId) return c;
            return { ...c, items: c.items.filter(i => i.uniqueId !== uniqueId) };
        }));
    }

    /* ── totales ────────────────────────────── */
    const calcularTotalCuenta = items => items.reduce((s, i) => s + i.precio, 0);
    const totalMesa = cuentas.reduce((s, c) => s + calcularTotalCuenta(c.items), 0);

    /* ══════════════════════════════════════════
       RENDER
    ══════════════════════════════════════════ */
    return (
        <>
            <div className={`mesa ${expandida ? "mesa-expandida" : "mesa-colapsada"}`}>

                {/* ── TOPBAR (siempre visible, hace toggle) ── */}
                <div className="mesa-topbar-btn" onClick={() => setExpandida(v => !v)}>
                    <div className="mesa-topbar-izq">
                        {/* FIX ─ número */}
                        <span className="id">#{numero}</span>
                        {/* FIX ─ nombre siempre visible */}
                        <span className="mesa-nombre-chip">
                            {inputNombre || `Mesa ${numero}`}
                        </span>
                    </div>
                    <div className="mesa-topbar-der">
                        <span className="cuentas-badge">
                            {cuentas.length} {cuentas.length === 1 ? "cuenta" : "cuentas"}
                        </span>
                        <span className="mesa-chevron">{expandida ? "▲" : "▼"}</span>
                    </div>
                </div>

                {/* ── CONTENIDO EXPANDIDO ── */}
                {expandida && (
                    <div className="mesa-body">

                        {/* nombre editable + total */}
                        <div className="nombre-total-row">
                            {editandoNombre ? (
                                <input
                                    autoFocus
                                    className="edicion-nombre-input"
                                    value={inputNombre}
                                    onChange={e => setInputNombre(e.target.value)}
                                    onBlur={guardarNombre}
                                    onKeyDown={e => e.key === "Enter" && guardarNombre()}
                                />
                            ) : (
                                /* FIX ─ nombre editable al hacer click */
                                <h3
                                    className="mesa-nombre-titulo"
                                    onClick={() => setEditandoNombre(true)}
                                    title="Click para editar"
                                >
                                    {inputNombre || `Mesa ${numero}`}
                                </h3>
                            )}
                            <span className="monto-total">${totalMesa.toLocaleString()}</span>
                        </div>

                        {/* FIX ─ lista con scroll interno, altura fija */}
                        <div className="lista-cuentas-detallada">
                            {cuentas.map((cuenta, index) => {
                                const totalCuenta = calcularTotalCuenta(cuenta.items);
                                return (
                                    <div key={cuenta.id} className="bloque-cuenta">
                                        <div className="header-cuenta">
                                            {/* FIX ─ numeración correcta: baseMesa.1, baseMesa.2 … */}
                                            <h4>{baseMesa}.{index + 1}</h4>
                                            <div className="acciones-cuenta">
                                                <button
                                                    type="button"
                                                    className="btn-del-cuenta"
                                                    onClick={() => borrarCuenta(cuenta.id)}
                                                >
                                                    Borrar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-add-plato"
                                                    onClick={() => abrirMenuParaCuenta(cuenta.id)}
                                                >
                                                    + Plato
                                                </button>
                                            </div>
                                        </div>

                                        {cuenta.items.length === 0 ? (
                                            <p className="sin-platos">Sin órdenes</p>
                                        ) : (
                                            <ul className="items-cuenta">
                                                {cuenta.items.map(item => (
                                                    <li key={item.uniqueId}>
                                                        <span className="item-nombre">{item.nombre}</span>
                                                        <div className="item-derecha">
                                                            <span className="item-precio">
                                                                ${item.precio.toLocaleString()}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                className="btn-del-plato"
                                                                onClick={() => eliminarPlato(cuenta.id, item.uniqueId)}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <div className="total-cuenta-fila">
                                            <span>Subtotal:</span>
                                            <strong>${totalCuenta.toLocaleString()}</strong>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* botones de la mesa */}
                        <div className="acciones-mesa">
                            <button
                                type="button"
                                className="btn-secundario btn-eliminar-mesa"
                                onClick={onDelete}
                            >
                                Borrar Mesa
                            </button>
                            <button
                                type="button"
                                className="btn-secundario"
                                onClick={agregarCuenta}
                            >
                                Nueva Cuenta
                            </button>
                            {cuentas.length > 1 && (
                                <button
                                    type="button"
                                    className="btn-secundario"
                                    onClick={juntarCuentas}
                                >
                                    Juntar Todo
                                </button>
                            )}
                        </div>

                    </div>
                )}
            </div>

            {/* ── MODAL MENÚ ── */}
            {mostrarMenuPlatos && createPortal(
                <div className="modal-overlay" onClick={() => setMostrarMenuPlatos(false)}>
                    <article className="modal-menu-platos" onClick={e => e.stopPropagation()}>

                        <div className="header-modal">
                            <h3>Menú</h3>
                            {/* FIX ─ botón X para cerrar */}
                            <button
                                type="button"
                                className="btn-cerrar-modal"
                                onClick={() => setMostrarMenuPlatos(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="contenido-modal-scroll">
                            {Object.entries(MENU_EJEMPLO).map(([categoria, platos]) => (
                                <div key={categoria} className="menu-seccion">
                                    <div
                                        className="header-seccion-menu"
                                        onClick={() => alternarCategoria(categoria)}
                                    >
                                        <h4 className="titulo-seccion-menu">{categoria}</h4>
                                        <span className="icono-desplegable">
                                            {categoriaExpandida === categoria ? "−" : "+"}
                                        </span>
                                    </div>

                                    {categoriaExpandida === categoria && (
                                        <div className="grid-menu-seleccion">
                                            {platos.map(plato => (
                                                <div
                                                    key={plato.id}
                                                    className="tarjeta-plato-seleccion"
                                                    /* FIX ─ ya no cierra el modal */
                                                    onClick={() => seleccionarPlato(plato)}
                                                >
                                                    <span className="plato-nombre">{plato.nombre}</span>
                                                    <span className="plato-precio">
                                                        ${plato.precio.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    </article>
                </div>,
                document.body
            )}
        </>
    );
}

/* ══════════════════════════════════════════════
   COMPONENTE RAÍZ — lista de mesas
   (úsalo si no tienes ya un Mesas.jsx que
    llame a <Mesa /> con sus props)
══════════════════════════════════════════════ */
let _counter = 1;

export default function Mesas() {
    const [mesas, setMesas] = useState([
        { id: _counter++, nombre: "Mesa 1" }
    ]);

    function agregarMesa() {
        const id = _counter++;
        setMesas(prev => [...prev, { id, nombre: `Mesa ${id}` }]);
    }

    function eliminarMesa(id) {
        setMesas(prev => prev.filter(m => m.id !== id));
    }

    function renombrarMesa(id, nuevoNombre) {
        setMesas(prev => prev.map(m => m.id === id ? { ...m, nombre: nuevoNombre } : m));
    }

    return (
        <div className="mesas-page">
            <div className="mesas-header">
                <h2 className="mesas-titulo">Mesas</h2>
                {/* FIX ─ botón agregar mesa */}
                <button className="btn-agregar-mesa" onClick={agregarMesa}>
                    + Agregar mesa
                </button>
            </div>

            <div className="contenido-mesas">
                {mesas.map(mesa => (
                    <Mesa
                        key={mesa.id}
                        numero={mesa.id}
                        nombre={mesa.nombre}
                        onDelete={() => eliminarMesa(mesa.id)}
                        onRename={n => renombrarMesa(mesa.id, n)}
                    />
                ))}
            </div>
        </div>
    );
}
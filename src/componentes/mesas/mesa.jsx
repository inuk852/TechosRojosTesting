import { useState } from "react";
import { createPortal } from "react-dom";
import "./mesa.css";

const MENU_EJEMPLO = {
    "Principales": [
        { id: "p1", nombre: "Hamburguesa Especial", precio: 25000 },
        { id: "p3", nombre: "Pizza Personal", precio: 20000 },
        { id: "p4", nombre: "Nuggets de Pollo", precio: 15000 },
    ],
    "Acompanamientos": [
        { id: "p2", nombre: "Papas Rusticas", precio: 12000 },
    ],
    "Bebidas": [
        { id: "p5", nombre: "Gaseosa 500ml", precio: 5000 },
        { id: "p6", nombre: "Limonada Natural", precio: 7000 }
    ]
};

export default function Mesa({ numero, nombre, onDelete, onRename }) {
    const [cuentas, setCuentas] = useState([{ id: Date.now(), items: [] }]);
    const [mostrarMenuPlatos, setMostrarMenuPlatos] = useState(false);
    const [cuentaActivaId, setCuentaActivaId] = useState(null);
    
    // Estado para controlar que categoria del menu esta abierta
    const [categoriaExpandida, setCategoriaExpandida] = useState(null);
    
    const [editandoNombre, setEditandoNombre] = useState(false);
    const [inputNombre, setInputNombre] = useState(nombre);

    function guardarNombre() {
        if (inputNombre.trim() !== "") {
            onRename(inputNombre);
        } else {
            setInputNombre(nombre);
        }
        setEditandoNombre(false);
    }

    function agregarCuenta() {
        setCuentas([...cuentas, { id: Date.now(), items: [] }]);
    }

    function borrarCuenta(idCuenta) {
        setCuentas(cuentas.filter(cuenta => cuenta.id !== idCuenta));
    }

    function juntarCuentas() {
        const todosLosItems = cuentas.reduce((acc, cuenta) => [...acc, ...cuenta.items], []);
        setCuentas([{ id: Date.now(), items: todosLosItems }]);
    }

    function abrirMenuParaCuenta(cuentaId) {
        setCuentaActivaId(cuentaId);
        setMostrarMenuPlatos(true);
        setCategoriaExpandida(null); // Cierra las categorias al abrir el modal
    }

    function alternarCategoria(categoria) {
        setCategoriaExpandida(categoriaExpandida === categoria ? null : categoria);
    }

    function seleccionarPlato(plato) {
        setCuentas(cuentas.map(cuenta => {
            if (cuenta.id === cuentaActivaId) {
                return {
                    ...cuenta,
                    items: [...cuenta.items, { ...plato, uniqueId: Date.now() + Math.random() }]
                };
            }
            return cuenta;
        }));
        setMostrarMenuPlatos(false);
    }

    function eliminarPlato(cuentaId, uniqueId) {
        setCuentas(cuentas.map(cuenta => {
            if (cuenta.id === cuentaId) {
                return {
                    ...cuenta,
                    items: cuenta.items.filter(item => item.uniqueId !== uniqueId && item.id !== uniqueId)
                };
            }
            return cuenta;
        }));
    }

    const calcularTotalCuenta = (items) => items.reduce((sum, item) => sum + item.precio, 0);
    const totalMesa = cuentas.reduce((sum, cuenta) => sum + calcularTotalCuenta(cuenta.items), 0);

    return (
        <div className="mesa">
            <div className="topbar">
                <span className="id">#{numero}</span>
                <span className="cuentas-badge">
                    {cuentas.length} {cuentas.length === 1 ? "cuenta" : "cuentas"}
                </span>
            </div>

            <div className="content">
                {editandoNombre ? (
                    <div className="edicion-nombre">
                        <input 
                            autoFocus
                            type="text" 
                            value={inputNombre} 
                            onChange={(e) => setInputNombre(e.target.value)}
                            onBlur={guardarNombre}
                            onKeyDown={(e) => e.key === 'Enter' && guardarNombre()}
                        />
                    </div>
                ) : (
                    <h3 onClick={() => setEditandoNombre(true)} title="Haz clic para editar el nombre">
                        {nombre}
                    </h3>
                )}
                
                <span className="monto-total">Total: ${totalMesa.toLocaleString()}</span>

                <div className="lista-cuentas-detallada">
                    {cuentas.map((cuenta, index) => {
                        const totalCuenta = calcularTotalCuenta(cuenta.items);
                        return (
                            <div key={cuenta.id} className="bloque-cuenta">
                                <div className="header-cuenta">
                                    <h4>Cuenta {index + 1}</h4>
                                    <div className="acciones-cuenta">
                                        <button 
                                            type="button" 
                                            className="btn-del-cuenta"
                                            onClick={() => borrarCuenta(cuenta.id)}
                                            title="Borrar esta cuenta"
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
                                    <p className="sin-platos">Sin ordenes</p>
                                ) : (
                                    <ul className="items-cuenta">
                                        {cuenta.items.map((item) => (
                                            <li key={item.uniqueId || item.id}>
                                                <span className="item-nombre">{item.nombre}</span>
                                                <div className="item-derecha">
                                                    <span className="item-precio">${item.precio.toLocaleString()}</span>
                                                    <button 
                                                        type="button" 
                                                        className="btn-del-plato"
                                                        onClick={() => eliminarPlato(cuenta.id, item.uniqueId || item.id)}
                                                    >
                                                        x
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
            </div>

            <div className="acciones-mesa">
                <button type="button" className="btn-secundario btn-eliminar-mesa" onClick={onDelete}>
                    Borrar Mesa
                </button>
                <button type="button" className="btn-secundario" onClick={agregarCuenta}>
                    Nueva Cuenta
                </button>
                {cuentas.length > 1 && (
                    <button type="button" className="btn-secundario" onClick={juntarCuentas}>
                        Juntar Todo
                    </button>
                )}
            </div>

            {mostrarMenuPlatos && createPortal(
                <div className="modal">
                    <article className="modal-menu-platos">
                        <div className="header-modal">
                            <h3>Menu</h3>
                        </div>
                        
                        <div className="contenido-modal-scroll">
                            {Object.entries(MENU_EJEMPLO).map(([categoria, platos]) => (
                                <div key={categoria} className="menu-seccion">
                                    {/* Cabecera pulsable de la categoria */}
                                    <div 
                                        className="header-seccion-menu"
                                        onClick={() => alternarCategoria(categoria)}
                                    >
                                        <h4 className="titulo-seccion-menu">{categoria}</h4>
                                        <span className="icono-desplegable">
                                            {categoriaExpandida === categoria ? "-" : "+"}
                                        </span>
                                    </div>
                                    
                                    {/* Platos que solo se muestran si la categoria esta expandida */}
                                    {categoriaExpandida === categoria && (
                                        <div className="grid-menu-seleccion">
                                            {platos.map(plato => (
                                                <div 
                                                    key={plato.id} 
                                                    className="tarjeta-plato-seleccion"
                                                    onClick={() => seleccionarPlato(plato)}
                                                >
                                                    <span className="plato-nombre">{plato.nombre}</span>
                                                    <span className="plato-precio">${plato.precio.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            type="button" 
                            className="btn-cerrar" 
                            onClick={() => setMostrarMenuPlatos(false)}
                        >
                            Cerrar
                        </button>
                    </article>
                </div>,
                document.body
            )}
        </div>
    );
}
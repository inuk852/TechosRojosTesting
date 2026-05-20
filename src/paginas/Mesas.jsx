import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Mesa from '../componentes/mesas/mesa';
import '../componentes/header/header.css';

function Mesas() {
    const [mesas, setMesas] = useState([
        { id: "m1", nombre: "Mesa Principal" },
        { id: "m2", nombre: "Mesa Terraza" }
    ]);
    const [mostrarAgregarModal, setMostrarAgregarModal] = useState(false);
    const [mesaNombre, setMesaNombre] = useState("");

    function agregarMesa() {
        setMesas(actual => [
            ...actual,
            {
                id: Date.now().toString(),
                nombre: mesaNombre || "Nueva Mesa"
            }
        ]);
        setMostrarAgregarModal(false);
        setMesaNombre(""); // Limpia el input para la proxima
    }

    function quitarUltimaMesa() {
        setMesas(actual => actual.slice(0, -1));
    }

    function borrarMesa(idMesa) {
        setMesas(actual => actual.filter(mesa => mesa.id !== idMesa));
    }

    function renombrarMesa(idMesa, nuevoNombre) {
        setMesas(actual => actual.map(mesa =>
            mesa.id === idMesa ? { ...mesa, nombre: nuevoNombre } : mesa
        ));
    }

    return <>
        <header>
            <h1>Mesas</h1>
            <div className="botones">
                <button onClick={() => setMostrarAgregarModal(true)} className='agregar'>Agregar mesa</button>
                <button onClick={quitarUltimaMesa} className='eliminar'>Eliminar ultima</button >
            </div>
        </header>

        <section className='contenido-mesas'>
            {mesas.map((mesa, index) => (
                <Mesa 
                    key={mesa.id} 
                    numero={index + 1} 
                    nombre={mesa.nombre} 
                    onDelete={() => borrarMesa(mesa.id)}
                    onRename={(nuevoNombre) => renombrarMesa(mesa.id, nuevoNombre)}
                />
            ))}
        </section>

        {mostrarAgregarModal && createPortal(
            <div className='modal'>
                <article className="modal-crear-mesa">
                    <h3>Nueva Mesa</h3>
                    <label>Nombre de la mesa</label>
                    <input 
                        type="text" 
                        value={mesaNombre}
                        onChange={({ target }) => setMesaNombre(target.value)} 
                        placeholder="Ej: Mesa 3"
                    />
                    <br />
                    {/* Se elimino la peticion de monto inicial */}
                    <div className="modal-acciones-crear">
                        <button className="btn-confirmar" onClick={agregarMesa}>Agregar mesa</button>
                        <button className="btn-cancelar" onClick={() => {
                            setMostrarAgregarModal(false);
                            setMesaNombre("");
                        }}>Cancelar</button>
                    </div>
                </article>
            </div>, document.body)}
    </>
}

export default Mesas;
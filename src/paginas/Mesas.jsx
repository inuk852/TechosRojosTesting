import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import Mesa from '../componentes/mesas/mesa';
import '../componentes/header/header.css'

function Mesas() {
	const [mesas, setMesas] = useState([])
	const [mostrarAgregarModal, setMostrarAgregarModal] = useState(false);
	const [mesaNombre, setMesaNombre] = useState("")
	const [mesaPrecio, setMesaPrecio] = useState(0)

	function agregarMesa() {
		setMesas(actual => [
			...actual,
			{
				nombre: mesaNombre,
				precio: parseFloat(mesaPrecio) || 0
			}
		])
		setMostrarAgregarModal(false)
	}

	function quitarMesa() {
		setMesas(actual => actual.slice(0, -1))
	}

	return <>
		 <header>
            <h1>Mesas</h1>
            <div className="botones">
                <button onClick={() => setMostrarAgregarModal(true)} className='agregar' >Agregar mesa</button>
                <button onClick={quitarMesa} className='eliminar'>Eliminar mesa</button >
            </div>
        </header>
		<section className='contenido-mesas'>
			{mesas.map((mesa, index) => {
				return <Mesa id={index + 1} key={index} nombre={mesa.nombre} monto={mesa.precio}/>
			})}
		</section>
		{mostrarAgregarModal == true ? createPortal(<div className='modal'>
			<article>
				<label>Nombre</label>
				<input type="text" onChange={({ target }) => setMesaNombre(target.value)} />
				<br />
				<label>Precio</label>
				<input type="number" onChange={({ target }) => setMesaPrecio(target.value)} />
				<br />
				<button onClick={agregarMesa}>Agregar mesa</button>
			</article>
		</div>, document.body) : <></>}
	</>
}


export default Mesas
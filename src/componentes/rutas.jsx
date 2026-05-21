import { Route, Routes, useNavigate } from "react-router";
import Login from "../paginas/Login";
import Mesas from "../paginas/Mesas";
import Tarjeta from "./tarjeta/tarjeta";
import Sidebar from "./sidebar/sidebar";
import Rapido from "./rapidos/rapidos";
import { useState } from "react";

function Rutas() {

	const navigate = useNavigate()
	const [logeado, setLogeado] = useState(false)

	function onLogin() {
		navigate("/rapidos")
		setLogeado(true)
	}

	if (logeado == false) {
		return <div className="contenido">
			<Tarjeta onLogin={onLogin} />
		</div>
	}

	return <>
		<Sidebar />
		<div className="contenido">
			<Routes>
				<Route path="/rapidos" element={<Rapido />} />
			</Routes>
		</div>
	</>
}

export default Rutas
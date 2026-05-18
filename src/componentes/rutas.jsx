import { Route, Routes, useNavigate } from "react-router";
import Login from "../paginas/Login";
import Mesas from "../paginas/Mesas";
import Tarjeta from "./tarjeta/tarjeta";
import MenuPage from "./menu/MenuPage";
import Sidebar from "./sidebar/sidebar";
import { useState } from "react";

function Rutas() {

	const navigate = useNavigate()
	const [logeado, setLogeado] = useState(false)

	function onLogin() {
		navigate("/mesas")
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
				<Route path="/mesas" element={<Mesas />} />
				<Route path="/menu" element={<MenuPage />} />
			</Routes>
		</div>
	</>
}

export default Rutas
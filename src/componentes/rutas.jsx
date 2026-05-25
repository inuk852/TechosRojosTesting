import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../paginas/Login";
import Mesas from "./mesas/mesa.jsx";
import Tarjeta from "./tarjeta/tarjeta";
import Sidebar from "./sidebar/sidebar";
import Rapido from "./rapidos/rapidos";
import MenuPage from "./menu/MenuPage.jsx";
import Domicilios from "./domicilios/domicilios.jsx";
import { useState } from "react";

function Rutas() {

	const navigate = useNavigate()
	const [logeado, setLogeado] = useState(false)

	function onLogin() {
		setLogeado(true)
		navigate("/rapidos")
	}

	function onLogout() {
		setLogeado(false);
		navigate("/");
	}

	if (logeado == false) {
		return (
			<div className="contenido">
				<Login onLogin={onLogin} />
			</div>
		);
	}

	return <>
		<Sidebar onLogout={onLogout}/>
		<div className="contenido">
			<Routes>
				<Route path="/rapidos" element={<Rapido />} />
				<Route path="/mesas" element={<Mesas/>}/>
				<Route path="/MenuPage" element={<MenuPage/>}/>
				<Route path="/domicilios" element={<Domicilios/>}/>
			</Routes>
		</div>
	</>
}

export default Rutas
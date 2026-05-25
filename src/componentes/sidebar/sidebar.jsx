import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './sidebar.css'

function Sidebar({ onLogout }) {

    const [sidebarAbierto, setSidebarAbierto] = useState(true);

    // Componente para los botones del menú
    function ItemNav({ link, title }) {
        return (
            <NavLink
                to={link}
                className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                }
            >
                {title}
            </NavLink>
        );
    }

    return (
        <div className={"sidebar " + (sidebarAbierto ? "" : "cerrado")}>

            <div className="brand">

                <div className="logo"></div>

                <div className="nombre">
                    <h3>User</h3>
                    <span>Mesero</span>
                </div>

                <button
                    className='burger'
                    onClick={() => setSidebarAbierto(current => !current)}
                >
                    <img src="/menu.png" alt="" />
                </button>

            </div>

            <nav>

                <ItemNav
                    link="/mesas"
                    title="Mesas"
                />

                <ItemNav
                    link="/rapidos"
                    title="Rapido"
                />

                <ItemNav
                    link="/domicilios"
                    title="Domicilios"
                />

                <ItemNav
                    link="/caja"
                    title="Caja"
                />

                <ItemNav
                    link="/historial"
                    title="Historial"
                />

                <ItemNav
                    link="/MenuPage"
                    title="Menu"
                />

            </nav>

            <button
                className='logout-btn'
                onClick={onLogout}
            >
                Cerrar sesión
            </button>

        </div>
    )
}

export default Sidebar
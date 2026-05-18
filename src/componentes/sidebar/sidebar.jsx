import { useState } from 'react'
import { Link } from 'react-router-dom'
import './sidebar.css'

function Sidebar() {
    const [sidebarAbierto, setSidebarAbierto] = useState(true);

    function NavLink({ link, title }) {
        return <Link to={link}>{title}</Link>
    }

    return <div className={"sidebar " + (sidebarAbierto ? "" : "cerrado")}>
        <div className="brand">
            <div className="logo">

            </div>
            <div className="nombre">
                <h3>Sakura</h3>
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
            <NavLink link="/mesas" title="Mesas" />
            <NavLink link="/" title="Rapido" />
            <NavLink link="/" title="Domicilios" />
            <NavLink link="/" title="Caja" />
            <NavLink link="/" title="Historial" />
            <NavLink link="/menu" title="Menú" />
        </nav>

<button className='logout-btn'>Cerrar sesión</button>

    </div>
}

export default Sidebar
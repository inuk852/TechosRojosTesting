import "./mesa.css"

export default function Mesa({id, cuentas, nombre, monto}) {
    return (
        <div className="mesa">

            <div className="topbar">
               <span className="id">#{id}</span>
                <span className="cuentas">{cuentas}4 cuentas</span>
            </div>

            <div className="content">
                <span>
                    <img src="/menu.png" alt="" />
                </span>
                <h3>{nombre}</h3>
                <span>${monto}</span>
            </div>

        </div>

    )
}
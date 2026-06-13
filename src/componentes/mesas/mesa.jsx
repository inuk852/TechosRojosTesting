import "./mesa.css"

export default function Mesa({id, cuentas, monto}) {
    return (
        <div className="mesa">

            <div className="topbar">
               <span className="id">#1</span>
                <span className="cuentas">{cuentas}4 cuentas</span>
            </div>

            <div className="content">
                <span>
                    <img src="/menu.png" alt="" />
                </span>
                <h3>¿backend?</h3>
                <span>${monto}</span>
            </div>

        </div>

    )
}
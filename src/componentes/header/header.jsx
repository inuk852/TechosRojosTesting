import "./header.css"



export default function Header(props) {
    return (
        <header>
            <h1>{props.section}</h1>
<div className="botones">
    <button className="agregar">Agregar mesa</button>
    <button className="eliminar">Eliminar mesa</button>
</div>
        </header>
    )
}
import Campo from "./Campo";
import Boton from "./Boton";

export default function Ingreso({ onGoToRegister, onLogin }) {
  return (
    <section className="SeccionFormulario">
      <span className="TextoDecorativo">登录</span>
      <h1 className="Titulo">
        Control total de tu restaurante,<br />en un solo lugar.
      </h1>
      <p className="Descripcion">
        Accede rápidamente para gestionar mesas, pedidos y caja sin fricción.
      </p>
      <Campo type="text" placeholder="Usuario" />
      <Campo type="password" placeholder="Contraseña" />
      <div className="GrupoBotones">
        <Boton className="BotonPrincipal" onClick={onLogin}
          defaultLabel="Entrar" hoverLabel="登录" />
        <Boton className="BotonSecundario" onClick={onGoToRegister}
          defaultLabel="Crear cuenta" hoverLabel="注册" />
      </div>
    </section>
  );
}

import Campo from "./Campo";
import Boton from "./Boton";

export default function Registro({ onGoToLogin }) {
  return (
    <section className="SeccionRegistro">
      <span className="ChinoDecorativo">创建账户</span>
      <h1 className="Titulo">Crear cuenta</h1>
      <Campo type="text" placeholder="Nombre" />
      <Campo type="email" placeholder="Correo" />
      <Campo type="password" placeholder="Contraseña" />
      <Boton className="BotonCompleto" onClick={onGoToLogin}
        defaultLabel="Registrarse" hoverLabel="创建账户" />
    </section>
  );
}

import { useState } from "react";
import "./tarjeta.css";


// Estos son los campos

function Campo({ type = "text", placeholder }) {
  return (
    <div className="GrupoCampo">
      <input type={type} placeholder={placeholder} className="CampoTexto" />
    </div>
  );
}


// aquí se crean los botones

function Boton({ className, onClick, defaultLabel, hoverLabel }) {
  const [label, setLabel] = useState(defaultLabel);

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      onMouseEnter={() => setLabel(hoverLabel)}
      onMouseLeave={() => setLabel(defaultLabel)}
    >
      {label}
    </button>
  );
}

// esta es la foto del ramen

function Imagen({
  imageSrc = "/src/images/chopsuey.png",
  logoSrc = "/src/images/TRlogo.png",
}) {
  return (
    <section className="SeccionImagen">
      <img src={imageSrc} alt="Ilustración ramen" className="Ramen" />
      <img src={logoSrc} alt="Techos Rojos" className="Logo" />
    </section>
  );
}

// este es el rostro de la tarjeta en sí, del lado izquierdo especificamente

function Ingreso({ onGoToRegister, onLogin }) {
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
      <a href="">¿Olvidaste tu contraseña?</a>
      <div className="GrupoBotones">
        <Boton
          className="BotonPrincipal1"
          onClick={onLogin}
          defaultLabel="Entrar"
          hoverLabel="登录"
        />
        <Boton
          className="BotonSecundario2"
          onClick={onGoToRegister}
          defaultLabel="Crear cuenta"
          hoverLabel="注册"
        />
      </div>
    </section>
  );
}

// este es el lado derecho de la tarjeta

function Registro({ onGoToLogin }) {
  return (
    <section className="SeccionRegistro">
      <span className="ChinoDecorativo">创建账户</span>
      <h1 className="Titulo">Crear cuenta</h1>
      <Campo type="text" placeholder="Nombre" />
      <Campo type="email" placeholder="Correo" />
      <Campo type="password" placeholder="Contraseña" />
      <Boton
        className="BotonCompleto"
        onClick={onGoToLogin}
        defaultLabel="Registrarse"
        hoverLabel="创建账户"
      />
    </section>
  );
}

// esto es ya el producto terminado y listo para su exportación


export default function Tarjeta({ onLogin = () => {}, imageSrc, logoSrc }) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="ContenedorPrincipal">
      <span className="DecoracionLetra DecoracionLetraArriba">红</span>
      <span className="DecoracionLetra DecoracionLetraAbajo">屋</span>
      <div className={`Tarjeta${isRegister ? " TarjetaActiva" : ""}`}>
        <Ingreso
          onGoToRegister={() => setIsRegister(true)}
          onLogin={onLogin}
        />
        <Registro onGoToLogin={() => setIsRegister(false)} />
        <Imagen imageSrc={imageSrc} logoSrc={logoSrc} />
      </div>
    </div>
  );
}

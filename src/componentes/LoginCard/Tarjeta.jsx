import { useState } from "react";
import "./Tarjeta.css";
import Ingreso from "./Ingreso";
import Registro from "./Registro";
import Imagen from "./Imagen";

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

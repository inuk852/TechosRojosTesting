import { useState } from "react";

export default function Boton({ className, onClick, defaultLabel, hoverLabel }) {
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

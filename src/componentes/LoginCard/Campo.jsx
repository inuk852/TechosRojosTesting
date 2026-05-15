export default function Campo({ type = "text", placeholder }) {
  return (
    <div className="GrupoCampo">
      <input type={type} placeholder={placeholder} className="CampoTexto" />
    </div>
  );
}

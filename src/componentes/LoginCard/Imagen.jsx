export default function Imagen({
  imageSrc = "/src/images/chopsuey.png",
  logoSrc  = "/src/images/TRlogo.png",
}) {
  return (
    <section className="SeccionImagen">
      <img src={imageSrc} alt="Ilustración ramen" className="Ramen" />
      <img src={logoSrc}  alt="Techos Rojos"      className="Logo"  />
    </section>
  );
}

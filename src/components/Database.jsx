import { useEffect, useState } from "react";
import {
  crearCategoria,
  crearProducto,
  obtenerCategorias,
  obtenerProductos,
} from "../services/database.js";
import "./Database.css";

export default function Database() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaNombre, setCategoriaNombre] = useState("");
  const [productoNombre, setProductoNombre] = useState("");
  const [productoPrecio, setProductoPrecio] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [mensaje, setMensaje] = useState("");

  const showMessage = (text) => {
    setMensaje(text);
    setTimeout(() => setMensaje(""), 4000);
  };

  const loadCategorias = async () => {
    try {
      const items = await obtenerCategorias();
      setCategorias(items);
    } catch (error) {
      showMessage(`Error cargando categorías: ${error.message}`);
    }
  };

  const loadProductos = async () => {
    try {
      const items = await obtenerProductos();
      setProductos(items);
    } catch (error) {
      showMessage(`Error cargando productos: ${error.message}`);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const categoriaItems = await obtenerCategorias();
        setCategorias(categoriaItems);
      } catch (error) {
        showMessage(`Error cargando categorías: ${error.message}`);
      }

      try {
        const productoItems = await obtenerProductos();
        setProductos(productoItems);
      } catch (error) {
        showMessage(`Error cargando productos: ${error.message}`);
      }
    }

    init();
  }, []);

  const handleCreateCategory = async () => {
    try {
      const nombre = categoriaNombre.trim() || "Bebidas y Snacks";
      const categoria = await crearCategoria(nombre);
      setCategoriaNombre("");
      setCategoriaSeleccionada(categoria.categoriaId);
      showMessage(`Categoría creada: ${categoria.nombre}`);
      await loadCategorias();
    } catch (error) {
      showMessage(`Error creando categoría: ${error.message}`);
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (!categoriaSeleccionada) {
        return showMessage("Selecciona primero una categoría.");
      }

      const nombre = productoNombre.trim() || "Café Americano";
      const precio = Number(productoPrecio) || 120;

      const producto = await crearProducto({
        nombre,
        precio,
        estado: "disponible",
        categoriaId: categoriaSeleccionada,
      });

      setProductoNombre("");
      setProductoPrecio("");
      showMessage(`Producto creado: ${producto.nombre}`);
      await loadProductos();
    } catch (error) {
      showMessage(`Error creando producto: ${error.message}`);
    }
  };

  return (
    <div className="demo-shell">
      <section className="demo-header">
        <h1>Administración de Productos</h1>
        <p>
          Esta plantilla inicial permite crear categorías y productos, y mostrar
          un listado funcional de los datos.
        </p>
      </section>

      <div className="demo-actions">
        <div className="demo-group">
          <label>Nombre de categoría</label>
          <input
            value={categoriaNombre}
            onChange={(event) => setCategoriaNombre(event.target.value)}
            placeholder="Nueva categoría"
          />
          <button onClick={handleCreateCategory}>Crear Categoría</button>
        </div>

        <div className="demo-group">
          <label>Producto</label>
          <input
            value={productoNombre}
            onChange={(event) => setProductoNombre(event.target.value)}
            placeholder="Nombre del producto"
          />
          <input
            value={productoPrecio}
            onChange={(event) => setProductoPrecio(event.target.value)}
            placeholder="Precio"
            type="number"
          />
          <label>Categoría</label>
          <select
            value={categoriaSeleccionada}
            onChange={(event) => setCategoriaSeleccionada(event.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.categoriaId} value={categoria.categoriaId}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          <button onClick={handleCreateProduct}>Crear Producto</button>
        </div>
      </div>

      <div className="demo-status">
        <button onClick={loadCategorias}>Refrescar Categorías</button>
        <button onClick={loadProductos}>Refrescar Productos</button>
      </div>

      {mensaje && <div className="demo-message">{mensaje}</div>}

      <div className="demo-grid">
        <section className="demo-panel">
          <h2>Categorías</h2>
          <ul className="demo-list">
            {categorias.length > 0 ? (
              categorias.map((categoria) => (
                <li key={categoria.categoriaId}>{categoria.nombre}</li>
              ))
            ) : (
              <li>No hay categorías creadas.</li>
            )}
          </ul>
        </section>

        <section className="demo-panel demo-table-panel">
          <h2>Productos</h2>
          <div className="demo-table-wrapper">
            <table className="demo-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <tr key={producto.productoId}>
                      <td>{producto.productoId}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.precio}</td>
                      <td>{producto.estado}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No hay productos disponibles.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import "./domicilios.css";

const PRODUCTOS = [
  { id: 1, nombre: "Chow Mein", precio: 12500 },
  { id: 2, nombre: "Arroz Frito", precio: 11000 },
  { id: 3, nombre: "Pollo Agridulce", precio: 15000 },
  { id: 4, nombre: "Sopa Wonton", precio: 9000 },
  { id: 5, nombre: "Rollitos Primavera", precio: 7500 }
];

const CLIENTES = [
  {
    id: 1,
    nombre: "Juan Pérez",
    telefono: "3101111111",
    direccion: {
      zona: "Cra 10",
      detalle: "#10-10",
      referencia: "Casa blanca"
    }
  },
  {
    id: 2,
    nombre: "María López",
    telefono: "3112222222",
    direccion: {
      zona: "Cll 20",
      detalle: "#20-20",
      referencia: "Portón negro"
    }
  }
];

const PEDIDOS_INICIALES = [
  {
    id: 1,
    nombre: "Laura Mendoza",
    estado: "pendiente",
    telefono: "3101234567",
    direccion: {
      zona: "Cra 45",
      detalle: "#12-30"
    },
    nota: "Casa blanca con un palo de mango",
    items: ["Sushi California x2", "Sopa Miso"],
    total: 48000,
    hora: "14:30"
  },
  {
    id: 2,
    nombre: "Carlos Vega",
    estado: "entregado",
    telefono: "3134567890",
    direccion: {
      zona: "Cra 30",
      detalle: "#8-45"
    },
    nota: "Apartamento 302",
    items: ["Yakitori Combo"],
    total: 22000,
    hora: "13:20"
  }
];

export default function Domicilios() {
  const [pedidos, setPedidos] = useState(PEDIDOS_INICIALES);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    zona: "",
    detalle: "",
    nota: ""
  });

  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const pendientes = pedidos.filter(p => p.estado === "pendiente").length;
  const entregados = pedidos.filter(p => p.estado === "entregado").length;

  const total = useMemo(() => {
    return productosSeleccionados.reduce((acc, p) => acc + p.precio, 0);
  }, [productosSeleccionados]);

  const pedidosFiltrados = pedidos.filter(p => {
    const coincideFiltro =
      filtro === "todos" || p.estado === filtro;

    const texto = `
      ${p.nombre}
      ${p.direccion.zona}
      ${p.direccion.detalle}
    `.toLowerCase();

    return coincideFiltro && texto.includes(busqueda.toLowerCase());
  });

  function agregarProducto(idProducto) {
    const producto = PRODUCTOS.find(p => p.id === Number(idProducto));
    if (!producto) return;

    setProductosSeleccionados(prev => [...prev, producto]);
  }

  function eliminarProducto(index) {
    setProductosSeleccionados(prev =>
      prev.filter((_, i) => i !== index)
    );
  }

  function avanzarEstado(id) {
    setPedidos(prev =>
      prev.map(p => {
        if (p.id !== id) return p;

        return {
          ...p,
          estado: "entregado"
        };
      })
    );
  }

  function crearPedido(e) {
    e.preventDefault();

    const nuevo = {
      id: Date.now(),
      nombre: form.nombre,
      telefono: form.telefono,
      estado: "pendiente",
      direccion: {
        zona: form.zona,
        detalle: form.detalle
      },
      nota: form.nota,
      items: productosSeleccionados.map(p => p.nombre),
      total,
      hora: new Date().toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setPedidos(prev => [nuevo, ...prev]);

    setForm({
      nombre: "",
      telefono: "",
      zona: "",
      detalle: "",
      nota: ""
    });

    setProductosSeleccionados([]);
    setMostrarModal(false);
  }

  function seleccionarCliente(id) {
    const cliente = CLIENTES.find(c => c.id === Number(id));
    if (!cliente) return;

    setForm(prev => ({
      ...prev,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      zona: cliente.direccion.zona,
      detalle: cliente.direccion.detalle,
      nota: cliente.direccion.referencia
    }));
  }

  return (
    <div className="domicilios-page">

      <div className="domicilios-header">
        <div>
          <span className="breadcrumb">
            出前 · DELIVERY
          </span>

          <h1>Domicilios</h1>

          <p>
            Gestiona los pedidos a domicilio del día
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setMostrarModal(true)}
        >
          + Nuevo domicilio
        </button>
      </div>

      <section className="stats">
        <div className="stat">
          <span>PENDIENTES</span>
          <h2>{pendientes}</h2>
        </div>

        <div className="stat">
          <span>ENTREGADOS</span>
          <h2>{entregados}</h2>
        </div>
      </section>

      <section className="filters">

        <input
          type="text"
          placeholder="Buscar cliente o dirección"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="tabs">

          <button
            className={filtro === "todos" ? "active" : ""}
            onClick={() => setFiltro("todos")}
          >
            Todos
          </button>

          <button
            className={filtro === "pendiente" ? "active" : ""}
            onClick={() => setFiltro("pendiente")}
          >
            Pendientes
          </button>

          <button
            className={filtro === "entregado" ? "active" : ""}
            onClick={() => setFiltro("entregado")}
          >
            Entregados
          </button>

        </div>
      </section>

      <section className="cards">

        {pedidosFiltrados.map(pedido => (
          <article
            key={pedido.id}
            className={`card ${pedido.estado}`}
          >

            <div className="card-header">

              <div className="card-id">
                #{pedido.id}
              </div>

              <span className={`badge ${pedido.estado}`}>
                {pedido.estado}
              </span>

            </div>

            <div className="card-client">
              <strong>{pedido.nombre}</strong>
            </div>

            <div className="card-details">

              <p>
                📍 {pedido.direccion.zona}{" "}
                {pedido.direccion.detalle}
              </p>

              <p>
                📞 {pedido.telefono}
              </p>

              <p>
                🕐 {pedido.hora}
              </p>

              <p className="nota">
                📝 {pedido.nota}
              </p>

            </div>

            <div className="items-preview">

              {pedido.items.map((item, index) => (
                <span
                  key={index}
                  className="item-tag"
                >
                  {item}
                </span>
              ))}

            </div>

            <div className="footer">

              <span>
                {pedido.items.length} items
              </span>

              <span className="total">
                ${pedido.total.toLocaleString()}
              </span>

            </div>

            {pedido.estado !== "entregado" && (
              <div className="card-actions">

                <button
                  className="btn-action btn-forward"
                  onClick={() => avanzarEstado(pedido.id)}
                >
                  Marcar entregado
                </button>

              </div>
            )}

          </article>
        ))}

      </section>

      {/* MODAL */}

      {mostrarModal && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>Nuevo domicilio</h2>

              {/* SOLO CIERRA CON X */}
              <button
                className="close-modal"
                onClick={() => setMostrarModal(false)}
              >
                ✕
              </button>

            </div>

            <form onSubmit={crearPedido}>

              <div className="form-group">

                <label>
                  Cliente frecuente
                </label>

                <select
                  onChange={(e) =>
                    seleccionarCliente(e.target.value)
                  }
                >
                  <option value="">
                    Seleccionar cliente...
                  </option>

                  {CLIENTES.map(cliente => (
                    <option
                      key={cliente.id}
                      value={cliente.id}
                    >
                      {cliente.nombre}
                    </option>
                  ))}
                </select>

              </div>

              <div className="form-group">
                <label>Nombre</label>

                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nombre: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>

                <input
                  type="text"
                  value={form.telefono}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      telefono: e.target.value
                    })
                  }
                  required
                />
              </div>

              {/* DIRECCIÓN MEJORADA */}

              <div className="direccion-grid">

                <div className="form-group">
                  <label>Zona / Calle</label>

                  <input
                    type="text"
                    placeholder="Ej: Cra 45"
                    value={form.zona}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        zona: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Detalle</label>

                  <input
                    type="text"
                    placeholder="#12-30"
                    value={form.detalle}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        detalle: e.target.value
                      })
                    }
                    required
                  />
                </div>

              </div>

              {/* NUEVA NOTA */}

              <div className="form-group">

                <label>
                  Nota / Referencia
                </label>

                <textarea
                  placeholder="Casa blanca con un palo de mango"
                  value={form.nota}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nota: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Agregar producto
                </label>

                <select
                  onChange={(e) =>
                    agregarProducto(e.target.value)
                  }
                >
                  <option value="">
                    Seleccionar...
                  </option>

                  {PRODUCTOS.map(producto => (
                    <option
                      key={producto.id}
                      value={producto.id}
                    >
                      {producto.nombre} - $
                      {producto.precio.toLocaleString()}
                    </option>
                  ))}

                </select>

              </div>

              <div className="lista-productos">

                {productosSeleccionados.map((producto, index) => (
                  <div
                    key={index}
                    className="producto-item"
                  >

                    <span>
                      {producto.nombre}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        eliminarProducto(index)
                      }
                    >
                      ✕
                    </button>

                  </div>
                ))}

              </div>

              <div className="total-box">
                Total: ${total.toLocaleString()}
              </div>

              <button
                type="submit"
                className="btn-submit"
              >
                Crear domicilio
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}
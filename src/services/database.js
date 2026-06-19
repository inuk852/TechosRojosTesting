import { v4 as uuidv4 } from "uuid";
import { Usuario, Categoria, Producto, Mesa, Pedido, PedidoItem } from "../db/index.js";

const now = () => new Date().toISOString();
const genId = () => uuidv4();

export async function crearUsuario(datos) {
  try {
    const usuarioId = genId();
    const result = await Usuario.create({
      usuarioId,
      nombre: datos.nombre ?? "Usuario",
      email: datos.email ?? "",
      creadoEn: now(),
    }).go();

    return result.data ?? { usuarioId, ...datos, creadoEn: now() };
  } catch (error) {
    console.error("crearUsuario error", error);
    throw error;
  }
}

export async function obtenerUsuarios() {
  try {
    const result = await Usuario.scan().go();
    return result.Items ?? [];
  } catch (error) {
    console.error("obtenerUsuarios error", error);
    throw error;
  }
}

export async function obtenerUsuarioPorId(id) {
  try {
    const result = await Usuario.get({ usuarioId: id }).go();
    return result.data ?? null;
  } catch (error) {
    console.error("obtenerUsuarioPorId error", error);
    throw error;
  }
}

export async function crearCategoria(nombre) {
  try {
    const categoriaId = genId();
    const result = await Categoria.create({
      categoriaId,
      nombre,
      creadoEn: now(),
    }).go();
    return result.data ?? { categoriaId, nombre, creadoEn: now() };
  } catch (error) {
    console.error("crearCategoria error", error);
    throw error;
  }
}

export async function obtenerCategorias() {
  try {
    const result = await Categoria.scan().go();
    return result.Items ?? [];
  } catch (error) {
    console.error("obtenerCategorias error", error);
    throw error;
  }
}

export async function crearProducto(datos) {
  try {
    if (!datos.categoriaId) {
      throw new Error("Se requiere categoriaId para crear un producto.");
    }
    const productoId = genId();
    const result = await Producto.create({
      productoId,
      nombre: datos.nombre ?? "Producto",
      precio: datos.precio ?? 0,
      estado: datos.estado ?? "disponible",
      categoriaId: datos.categoriaId,
      creadoEn: now(),
    }).go();
    return result.data ?? { productoId, ...datos, creadoEn: now() };
  } catch (error) {
    console.error("crearProducto error", error);
    throw error;
  }
}

export async function obtenerProductos() {
  try {
    const result = await Producto.scan().go();
    return result.Items ?? [];
  } catch (error) {
    console.error("obtenerProductos error", error);
    throw error;
  }
}

export async function obtenerProductosPorCategoria(categoriaId) {
  try {
    const result = await Producto.query.byCategoria({ categoriaId }).go();
    return result.Items ?? [];
  } catch (error) {
    console.error("obtenerProductosPorCategoria error", error);
    throw error;
  }
}

export async function actualizarProducto(id, nombre, datos = {}) {
  try {
    const update = Producto.update({ productoId: id });
    const changes = {};

    if (nombre) {
      changes.nombre = nombre;
    }
    if (datos.precio !== undefined) {
      changes.precio = datos.precio;
    }
    if (datos.estado) {
      changes.estado = datos.estado;
    }
    if (datos.categoriaId) {
      changes.categoriaId = datos.categoriaId;
    }

    if (Object.keys(changes).length === 0) {
      throw new Error("No hay cambios para aplicar en el producto.");
    }

    await update.set(changes).go();
    return { productoId: id, ...changes };
  } catch (error) {
    console.error("actualizarProducto error", error);
    throw error;
  }
}

export async function crearMesa(nombre) {
  try {
    const mesaId = genId();
    const result = await Mesa.create({
      mesaId,
      nombre,
      estado: "libre",
      creadoEn: now(),
    }).go();
    return result.data ?? { mesaId, nombre, estado: "libre", creadoEn: now() };
  } catch (error) {
    console.error("crearMesa error", error);
    throw error;
  }
}

export async function obtenerMesas() {
  try {
    const result = await Mesa.scan().go();
    return result.Items ?? [];
  } catch (error) {
    console.error("obtenerMesas error", error);
    throw error;
  }
}

export async function obtenerMesasPorEstado(estado) {
  try {
    const result = await Mesa.query.byEstado({ estado }).go();
    return result.Items ?? [];
  } catch (error) {
    console.error("obtenerMesasPorEstado error", error);
    throw error;
  }
}

export async function actualizarMesa(id, nombre, estado) {
  try {
    const update = Mesa.update({ mesaId: id });
    const changes = {};
    if (nombre) changes.nombre = nombre;
    if (estado) changes.estado = estado;

    if (Object.keys(changes).length === 0) {
      throw new Error("No hay cambios para aplicar en la mesa.");
    }

    await update.set(changes).go();
    return { mesaId: id, ...changes };
  } catch (error) {
    console.error("actualizarMesa error", error);
    throw error;
  }
}

export async function crearPedido(datos) {
  try {
    if (!datos.usuarioId) {
      throw new Error("Se requiere usuarioId para crear un pedido.");
    }

    const pedidoId = genId();
    const result = await Pedido.create({
      pedidoId,
      usuarioId: datos.usuarioId,
      estado: datos.estado ?? "pendiente",
      total: datos.total ?? 0,
      creadoEn: now(),
    }).go();
    return result.data ?? { pedidoId, ...datos, creadoEn: now() };
  } catch (error) {
    console.error("crearPedido error", error);
    throw error;
  }
}

export async function obtenerPedidos() {
  try {
    const result = await Pedido.scan().go();
    return result.Items ?? [];
  } catch (error) {
    console.error("obtenerPedidos error", error);
    throw error;
  }
}

export async function obtenerPedidosPorUsuario(usuarioId) {
  try {
    const result = await Pedido.query.byUsuario({ usuarioId }).go();
    return result.Items ?? [];
  } catch (error) {
    console.error("obtenerPedidosPorUsuario error", error);
    throw error;
  }
}

export async function obtenerPedidosPorEstado(estado) {
  try {
    const result = await Pedido.query.byEstado({ estado }).go();
    return result.Items ?? [];
  } catch (error) {
    console.error("obtenerPedidosPorEstado error", error);
    throw error;
  }
}

export async function actualizarEstadoPedido(id, creadoEn, nuevoEstado) {
  try {
    if (!nuevoEstado) {
      throw new Error("Se requiere un nuevo estado para el pedido.");
    }

    await Pedido.update({ pedidoId: id }).set({ estado: nuevoEstado }).go();
    return { pedidoId: id, estado: nuevoEstado };
  } catch (error) {
    console.error("actualizarEstadoPedido error", error);
    throw error;
  }
}

export async function agregarItemAPedido(datos) {
  try {
    if (!datos.pedidoId || !datos.productoId || !datos.cantidad) {
      throw new Error("Se requieren pedidoId, productoId y cantidad para agregar un item.");
    }

    let precio = datos.precio;
    if (precio === undefined) {
      const product = await Producto.get({ productoId: datos.productoId }).go();
      precio = product.data?.precio ?? 0;
    }

    const pedidoItemId = genId();
    const pedidoItem = await PedidoItem.create({
      pedidoId: datos.pedidoId,
      pedidoItemId,
      productoId: datos.productoId,
      cantidad: datos.cantidad,
      precio,
      creadoEn: now(),
    }).go();

    const pedidoActual = await Pedido.get({ pedidoId: datos.pedidoId }).go();
    const totalActual = pedidoActual.data?.total ?? 0;
    const nuevoTotal = totalActual + datos.cantidad * precio;
    await Pedido.update({ pedidoId: datos.pedidoId }).set({ total: nuevoTotal }).go();

    return pedidoItem.data ?? { pedidoItemId, ...datos, precio, creadoEn: now() };
  } catch (error) {
    console.error("agregarItemAPedido error", error);
    throw error;
  }
}

export async function obtenerItemsDePedido(pedidoId) {
  try {
    const result = await PedidoItem.query.primary({ pedidoId }).go();
    return result.Items ?? [];
  } catch (error) {
    console.error("obtenerItemsDePedido error", error);
    throw error;
  }
}

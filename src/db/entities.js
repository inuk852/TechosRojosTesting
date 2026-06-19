import { Entity, Table } from "electrodb";
import client from "./config.js";

const env = import.meta.env;

const table = new Table(
  {
    model: {
      service: "TechosRojos",
      entity: "TechosRojos",
      version: "1",
    },
    table: env.VITE_DYNAMODB_TABLE ?? env.DYNAMODB_TABLE ?? "TechosRojosTable",
    indexes: {
      primary: {
        pk: { field: "pk", composite: ["pk"] },
        sk: { field: "sk", composite: ["sk"] },
      },
      gsi1: {
        pk: { field: "gsi1pk", composite: ["gsi1pk"] },
        sk: { field: "gsi1sk", composite: ["gsi1sk"] },
      },
      gsi2: {
        pk: { field: "gsi2pk", composite: ["gsi2pk"] },
        sk: { field: "gsi2sk", composite: ["gsi2sk"] },
      },
      gsi3: {
        pk: { field: "gsi3pk", composite: ["gsi3pk"] },
        sk: { field: "gsi3sk", composite: ["gsi3sk"] },
      },
    },
  },
  { client }
);

export const Usuario = new Entity(
  {
    model: {
      entity: "Usuario",
      service: "TechosRojos",
      version: "1",
    },
    attributes: {
      usuarioId: { type: "string", required: true },
      nombre: { type: "string" },
      email: { type: "string" },
      creadoEn: { type: "string" },
    },
    indexes: {
      primary: {
        pk: { field: "pk", composite: ["usuarioId"] },
        sk: { field: "sk", composite: ["usuarioId"] },
      },
    },
  },
  { table }
);

export const Categoria = new Entity(
  {
    model: {
      entity: "Categoria",
      service: "TechosRojos",
      version: "1",
    },
    attributes: {
      categoriaId: { type: "string", required: true },
      nombre: { type: "string" },
      creadoEn: { type: "string" },
    },
    indexes: {
      primary: {
        pk: { field: "pk", composite: ["categoriaId"] },
        sk: { field: "sk", composite: ["categoriaId"] },
      },
    },
  },
  { table }
);

export const Producto = new Entity(
  {
    model: {
      entity: "Producto",
      service: "TechosRojos",
      version: "1",
    },
    attributes: {
      productoId: { type: "string", required: true },
      nombre: { type: "string" },
      precio: { type: "number" },
      estado: { type: "string" },
      categoriaId: { type: "string" },
      creadoEn: { type: "string" },
    },
    indexes: {
      primary: {
        pk: { field: "pk", composite: ["productoId"] },
        sk: { field: "sk", composite: ["productoId"] },
      },
      byCategoria: {
        index: "gsi1",
        pk: { field: "gsi1pk", composite: ["categoriaId"] },
        sk: { field: "gsi1sk", composite: ["productoId"] },
      },
    },
  },
  { table }
);

export const Mesa = new Entity(
  {
    model: {
      entity: "Mesa",
      service: "TechosRojos",
      version: "1",
    },
    attributes: {
      mesaId: { type: "string", required: true },
      nombre: { type: "string" },
      estado: { type: "string" },
      creadoEn: { type: "string" },
    },
    indexes: {
      primary: {
        pk: { field: "pk", composite: ["mesaId"] },
        sk: { field: "sk", composite: ["mesaId"] },
      },
      byEstado: {
        index: "gsi2",
        pk: { field: "gsi2pk", composite: ["estado"] },
        sk: { field: "gsi2sk", composite: ["mesaId"] },
      },
    },
  },
  { table }
);

export const Pedido = new Entity(
  {
    model: {
      entity: "Pedido",
      service: "TechosRojos",
      version: "1",
    },
    attributes: {
      pedidoId: { type: "string", required: true },
      usuarioId: { type: "string", required: true },
      estado: { type: "string" },
      total: { type: "number" },
      creadoEn: { type: "string" },
    },
    indexes: {
      primary: {
        pk: { field: "pk", composite: ["pedidoId"] },
        sk: { field: "sk", composite: ["pedidoId"] },
      },
      byUsuario: {
        index: "gsi1",
        pk: { field: "gsi1pk", composite: ["usuarioId"] },
        sk: { field: "gsi1sk", composite: ["pedidoId"] },
      },
      byEstado: {
        index: "gsi3",
        pk: { field: "gsi3pk", composite: ["estado"] },
        sk: { field: "gsi3sk", composite: ["pedidoId"] },
      },
    },
  },
  { table }
);

export const PedidoItem = new Entity(
  {
    model: {
      entity: "PedidoItem",
      service: "TechosRojos",
      version: "1",
    },
    attributes: {
      pedidoId: { type: "string", required: true },
      pedidoItemId: { type: "string", required: true },
      productoId: { type: "string", required: true },
      cantidad: { type: "number", required: true },
      precio: { type: "number" },
      creadoEn: { type: "string" },
    },
    indexes: {
      primary: {
        pk: { field: "pk", composite: ["pedidoId"] },
        sk: { field: "sk", composite: ["pedidoItemId"] },
      },
    },
  },
  { table }
);

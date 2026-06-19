# TechosRojosTesting

Este repositorio entrega una plantilla funcional de base de datos para una aplicación web, usando ElectroDB sobre DynamoDB y una interfaz React desarrollada con Vite.

## Objetivo

El proyecto es una base funcional y escalable que puede crecer con nuevas entidades y operaciones según las necesidades. Está pensada como punto de partida para:

- modelar datos en DynamoDB con ElectroDB,
- implementar una capa de servicios CRUD,
- integrar un frontend React que muestre resultados y facilite pruebas.

## Qué contiene la plantilla

- `src/db/config.js` — cliente de DynamoDB con soporte para DynamoDB Local y variables Vite.
- `src/db/entities.js` — modelo de entidades ElectroDB:
  - `Usuario`
  - `Categoria`
  - `Producto`
  - `Mesa`
  - `Pedido`
  - `PedidoItem`
- `src/services/database.js` — capa de acceso con funciones CRUD reutilizables.
- `src/components/Database.jsx` — interfaz inicial para crear y listar productos.
- `src/components/Database.css` — estilos básicos que complementan la interfaz.

## Cómo ejecutar

1. Instala dependencias:

```bash
npm install
```

2. Ejecuta la aplicación:

```bash
npm run dev
```

3. Abre el navegador en la URL que indique Vite.

## Uso con DynamoDB Local

Para trabajar localmente, ejecuta DynamoDB Local en `http://localhost:8000`.

Por defecto, `src/db/config.js` usa:

- `endpoint`: `http://localhost:8000`
- `accessKeyId`: `local`
- `secretAccessKey`: `local`
- `table`: `TechosRojosTable`

Si quieres personalizarlo, define variables de entorno Vite:

```bash
VITE_DYNAMODB_ENDPOINT=http://localhost:8000
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=local
VITE_AWS_SECRET_ACCESS_KEY=local
VITE_DYNAMODB_TABLE=TechosRojosTable
```

## Cómo extender esta base

Para seguir construyendo sobre esta plantilla, puedes:

- agregar nuevas entidades en `src/db/entities.js`,
- crear índices adicionales si necesitas consultas especializadas,
- añadir más funciones service en `src/services/database.js`,
- exponer una API backend en Node.js o serverless si necesitas seguridad,
- conectar más componentes React que usen la capa de servicios.

## Adaptación para AWS

ElectroDB se usa sobre DynamoDB, por lo que el modelo de datos es compatible con AWS.

Para un entorno productivo en AWS, lo ideal es:

- mover la lógica de acceso a datos a un backend seguro,
- no exponer credenciales de AWS desde el frontend,
- usar variables de entorno del servidor para `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` y `AWS_REGION`.

Si necesitas probar una conexión en backend, estas variables serían las usadas:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<tu-access-key>
AWS_SECRET_ACCESS_KEY=<tu-secret-key>
DYNAMODB_TABLE=TechosRojosTable
```

> En Vite, las variables expuestas al cliente deben usar `VITE_*`, como `VITE_AWS_REGION`.

## Qué se puede mostrar en una presentación

- la estructura de carpetas y archivos,
- el modelo inicial de datos en `src/db/entities.js`,
- la capa CRUD de `src/services/database.js`,
- la interfaz de inicio en `src/components/Database.jsx`,
- la capacidad de ampliar esta base como plantilla inicial.



import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import "./MenuPage.css";
import MultiSelectChip from "./MultiSelectChip";
import SkeletonLoader from "./SkeletonLoader";


const LS_KEY = "tr_menu_products";
const LS_DRAFT_KEY = "tr_menu_draft";
const LS_DRAFT_SCHEDULE_KEY = "tr_menu_draft_schedule";

function loadProducts() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(LS_KEY, JSON.stringify(products));
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(LS_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft(draft) {
  if (draft) {
    localStorage.setItem(LS_DRAFT_KEY, JSON.stringify(draft));
  } else {
    localStorage.removeItem(LS_DRAFT_KEY);
  }
}

function loadDraftSchedule() {
  return localStorage.getItem(LS_DRAFT_SCHEDULE_KEY) || "";
}

function saveDraftSchedule(value) {
  if (value) {
    localStorage.setItem(LS_DRAFT_SCHEDULE_KEY, value);
  } else {
    localStorage.removeItem(LS_DRAFT_SCHEDULE_KEY);
  }
}

const Icon = {
  Edit: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  ),
  Toggle: ({ on }) => on ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3" fill="currentColor" stroke="none"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="8" cy="12" r="3" fill="currentColor" stroke="none"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  X: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Warn: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Package: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
};

function formatPrice(value) {
  // Solo mantiene dígitos
  let numero = String(value).replace(/\D/g, "");
  // Formatea con separador de miles
  if (numero) {
    numero = new Intl.NumberFormat("es-CO").format(numero);
  }
  return numero ? `$ ${numero}` : "";
}

function CategoryFilter({ categories, selected, onChange }) {
  return (
    <MultiSelectChip
      options={categories}
      value={selected}
      onChange={onChange}
      placeholder="Selecciona categorías..."
    />
  );
}

function getChangedFields(current, pending) {
  const fields = [
    { key: "name", label: "Nombre" },
    { key: "description", label: "Descripcion" },
    { key: "category", label: "Categoria" },
    { key: "price", label: "Precio", format: formatPrice },
    { key: "active", label: "Estado", format: (value) => value ? "Activo" : "Inactivo" },
  ];

  return fields.reduce((changes, field) => {
    const currentValue = current?.[field.key] ?? "";
    const pendingValue = pending?.[field.key] ?? "";
    const normalize = field.key === "price" ? Number : String;

    if (normalize(currentValue) !== normalize(pendingValue)) {
      changes.push({
        label: field.label,
        before: field.format ? field.format(currentValue) : String(currentValue || "Sin valor"),
        after: field.format ? field.format(pendingValue) : String(pendingValue || "Sin valor"),
      });
    }

    return changes;
  }, []);
}

function QueueModal({ items, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="CapaSuperpuesta"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="CajaModal CajaColaCambios">
        <div className="SeccionCabeceraModal">
          <h2 className="TituloCabeceraModal">Cola de cambios</h2>
          <p className="SubtituloCabeceraModal">Solo lectura de los productos que tienen cambios pendientes.</p>
        </div>

        {items.length === 0 ? (
          <div className="EstadoColaVacia">No hay productos con cambios pendientes.</div>
        ) : (
          <div className="ListaColaCambios">
            {items.map(item => (
              <div className="ItemColaCambio" key={item.key}>
                <div className="CabeceraItemCola">
                  <span className="NombreItemCola">{item.name}</span>
                  <span className="EtiquetaPendiente">Pendiente</span>
                </div>
                <div className="ListaCamposCola">
                  {item.changes.map(change => (
                    <div className="CampoColaCambio" key={change.label}>
                      <span className="EtiquetaCampoCola">{change.label}</span>
                      <span className="ValorCampoCola Antes">{change.before}</span>
                      <span className="SeparadorCampoCola">a</span>
                      <span className="ValorCampoCola Despues">{change.after}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="ContenedorAccionesModal">
          <button className="BotonPrincipal BotonAccionModal" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product, index, onEdit, onToggle, onDelete, isDraftMode, onDraftChange, isPending, categories = [] }) {
  const inputRef = useRef(null);
  const [inputPos, setInputPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (isDraftMode && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setInputPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isDraftMode, product.category]);

  const date = product.created
    ? new Date(product.created).toLocaleDateString("es-CO", {
      day: "2-digit", month: "short", year: "numeric"
    })
    : "";

  return (
    <div className={`ContenedorFilaProducto ${product.active ? "" : "Inactivo"} ${isPending ? "FilaPendiente" : ""}`}>
      <div className="ColumnaPuntoProducto">
        <div className={`PuntoEstadoProducto ${product.active ? "Activo" : "Inactivo"}`} />
      </div>

      <div className="ColumnaNombreProducto">
        {isDraftMode ? (
          <div className="ContenedorDraftInputs">
            <input
              className="Entrada EntradaDraft"
              value={product.name}
              onChange={(e) => onDraftChange(index, "name", e.target.value)}
              placeholder="Nombre"
            />
            <input
              className="Entrada EntradaDraft"
              value={product.description || ""}
              onChange={(e) => onDraftChange(index, "description", e.target.value)}
              placeholder="Descripción (opcional)"
            />
          </div>
        ) : (
          <>
            <span className="TextoNombreProducto">
              {product.name}
            </span>
            {product.description && (
              <span className="TextoDescripcionProducto">
                {product.description}
              </span>
            )}
            {isPending && <span className="EtiquetaPendiente">Cambios pendientes</span>}
          </>
        )}
      </div>

      <div className="ColumnaCategoriaProducto ColumnasLista categoria">
        {isDraftMode ? (
          <div className="InputCategoriaConSugerencias">
            <input
              ref={inputRef}
              className="Entrada EntradaDraft InputCategoriaDraft"
              type="text"
              value={product.category}
              onChange={(e) => onDraftChange(index, "category", e.target.value)}
              placeholder="Categoría"
              autoComplete="off"
            />
            {product.category && categories.length > 0 && (
              <div
                className="ListaSugerenciasCategoria"
                style={{
                  top: `${inputPos.top}px`,
                  left: `${inputPos.left}px`,
                  width: `${inputPos.width}px`,
                }}
              >
                {categories
                  .filter(cat => 
                    cat.toLowerCase().includes(product.category.toLowerCase()) &&
                    cat !== product.category
                  )
                  .slice(0, 4)
                  .map(cat => (
                    <div
                      key={cat}
                      className="SugerenciaCategoria"
                      onClick={() => onDraftChange(index, "category", cat)}
                    >
                      {cat}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          <span className="EtiquetaCategoriaProducto">
            {product.category}
          </span>
        )}
      </div>

      <div className="ColumnaPrecioProducto">
        {isDraftMode ? (
          <input
            className="Entrada EntradaDraft EntradaPrecioDraft"
            type="text"
            value={product.price ? `$ ${Number(product.price).toLocaleString("es-CO")}` : ""}
            onChange={(e) => {
              // Extrae solo números del input
              const soloNumeros = e.target.value.replace(/\D/g, "");
              onDraftChange(index, "price", soloNumeros);
            }}
            placeholder="$ Precio"
          />
        ) : (
          <span className="ValorPrecioProducto">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      <div className="ColumnaFechaProducto ColumnasLista">
        <span className="ValorFechaProducto">
          {date}
        </span>
      </div>

      <div className="ColumnaAccionesProducto AccionesFila">
        {!isDraftMode && (
          <>
            <button
              className="BotonIcono"
              title="Editar producto"
              onClick={() => onEdit(index)}
              aria-label="Editar"
            >
              <Icon.Edit />
            </button>
            <button
              className={`BotonIcono AlternadorActivo ${product.active ? "Encendido" : ""}`}
              title={product.active ? "Desactivar producto" : "Activar producto"}
              onClick={() => onToggle(index)}
              aria-label={product.active ? "Desactivar" : "Activar"}
            >
              <Icon.Toggle on={product.active} />
            </button>
            <button
              className="BotonIcono Peligro"
              title="Eliminar producto"
              onClick={() => onDelete(index)}
              aria-label="Eliminar"
            >
              <Icon.Trash />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ProductModal({ product, onSave, onClose, categories }) {
  const isEditing = product !== null;
  const [form, setForm] = useState({
    name: product?.name ?? "",
    price: product?.price ?? "",
    category: product?.category ?? "",
    description: product?.description ?? "",
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "El nombre es obligatorio";
    if (form.price === "" || isNaN(Number(form.price)) || Number(form.price) < 0)
      errs.price = "Ingresa un precio válido";
    if (!form.category.trim()) errs.category = "La categoría es obligatoria";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      name: form.name.trim(),
      price: parseFloat(form.price),
      category: form.category.trim(),
      description: form.description.trim(),
    });
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="CapaSuperpuesta"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="CajaModal">
        <div className="SeccionCabeceraModal">
          <h2 className="TituloCabeceraModal">
            {isEditing ? "Editar producto" : "Nuevo producto"}
          </h2>
          <p className="SubtituloCabeceraModal">
            {isEditing ? `Modificando "${product.name}"` : "Completa los campos para agregar al menú"}
          </p>
        </div>

        <div className="CuadriculaCamposModal">
          <div className="Campo">
            <label className="Etiqueta">Nombre del producto</label>
            <input
              className={`Entrada${errors.name ? " Error" : ""}`}
              type="text"
              placeholder="Ej. Ramen tonkotsu"
              value={form.name}
              onChange={set("name")}
              autoFocus
            />
            {errors.name && <span className="EtiquetaErrorCampo">{errors.name}</span>}
          </div>

          <div className="Campo">
            <label className="Etiqueta">Precio</label>
            <input
              className={`Entrada${errors.price ? " Error" : ""}`}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={set("price")}
              inputMode="decimal" /* Habilita teclado puramente numérico en tablets/celulares */
            />
            {errors.price && <span className="EtiquetaErrorCampo">{errors.price}</span>}
          </div>

          <div className="Campo">
            <label className="Etiqueta">Categoría</label>
            <input
              className={`Entrada${errors.category ? " Error" : ""}`}
              type="text"
              placeholder="Ej. Sopas, Entradas, Bebidas…"
              value={form.category}
              onChange={set("category")}
            />
            {errors.category && <span className="EtiquetaErrorCampo">{errors.category}</span>}

            {categories && categories.length > 0 && (
              <div className="ContenedorSugerenciasCategoria">
                <span className="TextoEtiquetaSugerida">Categorías sugeridas:</span>
                <div className="ListaPildorasSugeridas">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      className={`PildoraSugerida ${form.category.trim().toLowerCase() === cat.trim().toLowerCase() ? "Activo" : ""}`}
                      onClick={() => setForm(f => ({ ...f, category: cat }))}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="Campo">
            <label className="Etiqueta">Descripción <span style={{ fontWeight: 400, color: "var(--muted)" }}>(opcional)</span></label>
            <textarea
              className="Entrada EntradaTextoModal"
              placeholder="Ingredientes, preparación, alérgenos…"
              rows={3}
              value={form.description}
              onChange={set("description")}
            />
          </div>
        </div>

        <div className="ContenedorAccionesModal">
          <button className="BotonPrincipal BotonAccionModal" onClick={handleSave}>
            {isEditing ? "Guardar cambios" : "Agregar producto"}
          </button>
          <button className="BotonSecundario" onClick={onClose}>
            <Icon.X /> Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ config, onConfirm, onCancel }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  const iconColor = config.danger ? "#b41800" : "#2e7d32";
  const iconBg = config.danger ? "#fae8e5" : "#e8f5e9";

  return (
    <div
      className="CapaSuperpuesta CapaSuperpuestaConfirmar"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="CajaModal CajaConfirmar">
        <div 
          className="ContenedorIconoConfirmar"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon.Warn />
        </div>

        <h3 className="TituloCabeceraConfirmar">
          {config.title}
        </h3>

        <p className="MensajeDescripcionConfirmar">
          {config.message}
        </p>

        {config.productName && (
          <div className="CajaInfoProductoConfirmar">
            {config.productName}
          </div>
        )}

        <div className="ContenedorAccionesModal">
          <button
            className={`BotonPrincipal BotonConfirmar ${config.danger ? "AccionPeligro" : "AccionExito"}`}
            onClick={onConfirm}
          >
            {config.confirmLabel ?? "Confirmar"}
          </button>
          <button className="BotonSecundario BotonCancelarConfirmar" onClick={onCancel}>
            <Icon.X /> Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function ScheduleModal({ value, onSave, onClose }) {
  const [dateValue, setDateValue] = useState(value || "");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (dateValue) {
      const applyTime = new Date(dateValue).getTime();
      if (Number.isNaN(applyTime) || applyTime <= Date.now()) {
        setError("Selecciona una fecha y hora futura.");
        return;
      }
    }

    onSave(dateValue);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="CapaSuperpuesta CapaSuperpuestaConfirmar"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="CajaModal CajaFechaTemporal">
        <div className="SeccionCabeceraModal">
          <h2 className="TituloCabeceraModal">Fecha de cambios</h2>
          <p className="SubtituloCabeceraModal">Programa cuando se aplicará la cola de cambios temporales.</p>
        </div>

        <div className="Campo">
          <label className="Etiqueta" htmlFor="editarFechaCambiosTemporales">Aplicar el</label>
          <input
            id="editarFechaCambiosTemporales"
            className="Entrada EntradaFechaTemporalModal"
            type="datetime-local"
            value={dateValue}
            onChange={(e) => {
              setDateValue(e.target.value);
              setError("");
            }}
          />
          {error && <span className="EtiquetaErrorCampo">{error}</span>}
        </div>

        <div className="ContenedorAccionesModal">
          <button className="BotonPrincipal BotonAccionModal" onClick={handleSave}>
            Guardar fecha
          </button>
          <button className="BotonSecundario" onClick={() => onSave("")}>
            Sin fecha
          </button>
          <button className="BotonSecundario" onClick={onClose}>
            <Icon.X /> Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuPage({ Sidebar }) {
  const [products, setProducts] = useState(() => loadProducts());
  const [draftProducts, setDraftProducts] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(() => loadDraft());
  const [scheduledApplyAt, setScheduledApplyAt] = useState(() => loadDraftSchedule());
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productModal, setProductModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [temporaryMenuOpen, setTemporaryMenuOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [queueModalOpen, setQueueModalOpen] = useState(false);

  const categories = useMemo(
    () => [...new Set((draftProducts || products).map(p => p.category).filter(Boolean))].sort(),
    [products, draftProducts]
  );

  const filtered = useMemo(() => {
    let list = (draftProducts || products).map((p, i) => ({ ...p, _idx: i }));
    if (categoryFilter.length > 0) {
      list = list.filter(p => categoryFilter.includes(p.category));
    }
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
    return list;
  }, [products, draftProducts, categoryFilter, searchTerm]);

  const changedQueueItems = useMemo(() => {
    if (!pendingChanges) return [];

    return pendingChanges
      .map((pendingProduct, index) => {
        const currentProduct = products[index];
        const changes = getChangedFields(currentProduct, pendingProduct);
        return {
          key: pendingProduct.id ?? pendingProduct.created ?? index,
          name: pendingProduct.name || currentProduct?.name || `Producto ${index + 1}`,
          changes,
        };
      })
      .filter(item => item.changes.length > 0);
  }, [products, pendingChanges]);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const applyPendingChanges = useCallback(() => {
    if (!pendingChanges) return;
    setProducts(pendingChanges);
    setPendingChanges(null);
    setScheduledApplyAt("");
    setTemporaryMenuOpen(false);
    saveDraft(null);
    saveDraftSchedule("");
  }, [pendingChanges]);

  useEffect(() => {
    if (!pendingChanges || !scheduledApplyAt) return;

    const applyTime = new Date(scheduledApplyAt).getTime();
    if (Number.isNaN(applyTime)) return;

    const delay = applyTime - Date.now();
    if (delay <= 0) {
      const timer = setTimeout(applyPendingChanges, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(applyPendingChanges, Math.min(delay, 2147483647));
    return () => clearTimeout(timer);
  }, [pendingChanges, scheduledApplyAt, applyPendingChanges]);

  // Simula carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleStartDraft = () => {
    // Validar que haya productos antes de permitir cambios temporales
    if (products.length === 0) {
      alert("No hay productos agregados al menú. Debe agregar al menos un producto antes de hacer cambios temporales.");
      return;
    }
    if (!pendingChanges) {
      setScheduledApplyAt("");
    }
    setTemporaryMenuOpen(false);
    setDraftProducts(pendingChanges ? JSON.parse(JSON.stringify(pendingChanges)) : JSON.parse(JSON.stringify(products)));
  };

  const handleSaveDraft = () => {
    const cleanDraft = draftProducts.map(p => ({
      ...p,
      price: parseFloat(p.price) || 0
    }));

    const hasTemporaryChanges =
      cleanDraft.length !== products.length ||
      cleanDraft.some((product, index) => getChangedFields(products[index], product).length > 0);

    if (!hasTemporaryChanges) {
      alert("No hay cambios temporales para guardar. Modifica al menos un producto antes de confirmar.");
      return;
    }

    if (scheduledApplyAt) {
      const applyTime = new Date(scheduledApplyAt).getTime();
      if (Number.isNaN(applyTime) || applyTime <= Date.now()) {
        alert("Selecciona una fecha y hora futura para programar los cambios temporales.");
        return;
      }
    }

    setConfirmModal({
      config: {
        title: "Guardar borrador",
        message: "¿Estás seguro de que deseas guardar los cambios temporales? Quedarán almacenados como pendientes para ser aplicados más tarde.",
        confirmLabel: "Guardar borrador",
        danger: false,
      },
      action: () => {
        setPendingChanges(cleanDraft);
        saveDraft(cleanDraft);
        saveDraftSchedule(scheduledApplyAt);
        setDraftProducts(null);
        setTemporaryMenuOpen(false);
      }
    });
  };

  const handleApplyDraft = () => {
    setTemporaryMenuOpen(false);
    setConfirmModal({
      config: {
        title: "Aplicar cambios pendientes",
        message: "Esta acción reemplazará los productos del menú activo con las modificaciones del borrador guardado. ¿Deseas aplicar los cambios?",
        confirmLabel: "Aplicar cambios",
        danger: false,
      },
      action: applyPendingChanges
    });
  };

  const handleCancelDraft = () => {
    setTemporaryMenuOpen(false);
    setConfirmModal({
      config: {
        title: "Cancelar pendientes",
        message: "Esta acción eliminará de forma permanente todos los cambios pendientes guardados en el borrador. No se podrá deshacer. ¿Deseas descartarlos?",
        confirmLabel: "Eliminar borrador",
        danger: true,
      },
      action: () => {
        setPendingChanges(null);
        setScheduledApplyAt("");
        saveDraft(null);
        saveDraftSchedule("");
        setDraftProducts(null);
      }
    });
  };

  const handleCancelEdit = () => {
    if (!pendingChanges) {
      setScheduledApplyAt("");
    }
    setDraftProducts(null);
    setTemporaryMenuOpen(false);
  };

  const handleDraftChange = (index, field, value) => {
    setDraftProducts(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleViewQueue = () => {
    if (!pendingChanges) return;
    setTemporaryMenuOpen(false);
    setQueueModalOpen(true);
  };

  const handleOpenScheduleModal = () => {
    setTemporaryMenuOpen(false);
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = (value) => {
    setScheduledApplyAt(value);
    saveDraftSchedule(value);
    setScheduleModalOpen(false);
  };

  const isDraftMode = draftProducts !== null;
  const hasPendingChanges = pendingChanges !== null && draftProducts === null;
  const scheduleLabel = scheduledApplyAt
    ? `${new Date(scheduledApplyAt).toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`
    : "No hay fecha elegida";

  const openAdd = useCallback(() => {
    setProductModal({ product: null, index: null });
  }, []);

  const openEdit = useCallback((idx) => {
    setProductModal({ product: products[idx], index: idx });
  }, [products]);

  const handleSaveProduct = useCallback((formData) => {
    const { product, index } = productModal;
    
    if (index === null) {
      setProducts(prev => {
        const copy = [...prev];
        copy.push({ ...formData, active: true, created: Date.now() });
        return copy;
      });
      setProductModal(null);
      return;
    }

    const config = {
      title: "Confirmar edición",
      message: "¿Guardar los cambios en este producto?",
      productName: formData.name,
      confirmLabel: "Guardar",
      danger: false,
    };

    const action = () => {
      setProducts(prev => {
        const copy = [...prev];
        copy[index] = { ...product, ...formData };
        return copy;
      });
      setProductModal(null);
    };

    setProductModal(null);
    setConfirmModal({ config, action, formData, originalProduct: product, editIndex: index });
  }, [productModal]);

  const requestToggle = useCallback((idx) => {
    const p = products[idx];
    const willActivate = !p.active;
    setConfirmModal({
      config: {
        title: willActivate ? "Activar producto" : "Desactivar producto",
        message: willActivate
          ? "Este producto volverá a aparecer en el menú activo."
          : "Este producto se ocultará del menú activo.",
        productName: p.name,
        confirmLabel: willActivate ? "Activar" : "Desactivar",
        danger: !willActivate,
      },
      action: () => {
        setProducts(prev => {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], active: !copy[idx].active };
          return copy;
        });
      },
    });
  }, [products]);

  const requestDelete = useCallback((idx) => {
    const p = products[idx];
    setConfirmModal({
      config: {
        title: "Eliminar producto",
        message: "Esta acción no puede deshacerse. El producto será eliminado del menú permanentemente.",
        productName: p.name,
        confirmLabel: "Eliminar",
        danger: true,
      },
      action: () => {
        setProducts(prev => prev.filter((_, i) => i !== idx));
        if (categoryFilter.length > 0 && products.filter(p => categoryFilter.includes(p.category)).length === 0) {
          setCategoryFilter([]);
        }
      },
    });
  }, [products, categoryFilter]);

  const handleConfirm = useCallback(() => {
    if (confirmModal) {
      if (confirmModal.formData !== undefined) {
        const { formData, originalProduct, editIndex } = confirmModal;
        setProducts(prev => {
          const copy = [...prev];
          if (editIndex !== null) {
            copy[editIndex] = { ...originalProduct, ...formData };
          } else {
            copy.push({ ...formData, active: true, created: Date.now() });
          }
          return copy;
        });
      } else {
        confirmModal.action();
      }
    }
    setConfirmModal(null);
  }, [confirmModal]);

  const activeCount = products.filter(p => p.active).length;
  const inactiveCount = products.length - activeCount;

  return (
    <div className="ContenedorPaginaMenu">
      {Sidebar && <Sidebar />}

      <main className="MenuPrincipal">
        <header className="CabeceraMenu">
          <div className="FilaCabeceraFlex">
            {(
              <div className="ContenedorTituloMenu">
                <h1 className="TituloMenu">Gestión de Menú</h1>
                <div className="FilaEstadisticas">
                  <span className="EtiquetaEstadistica">
                    <strong>{products.length}</strong> productos
                  </span>
                  <span className="EtiquetaEstadisticaActiva">
                    <strong>{activeCount}</strong> activos
                  </span>
                  {inactiveCount > 0 && (
                    <span className="EtiquetaEstadistica">
                      <strong>{inactiveCount}</strong> inactivos
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="AccionesCabeceraFlex">
              {isDraftMode ? (
                <>
                  <div className="EstadoFechaTemporal">
                    <Icon.Calendar />
                    <span>{scheduleLabel}</span>
                  </div>
                  <div className="MenuTemporalDesplegable">
                    <button
                      className="BotonSecundario busqueda BotonMenuTemporal"
                      onClick={() => setTemporaryMenuOpen(open => !open)}
                    >
                      <Icon.Edit /> Temporales <Icon.ChevronDown />
                    </button>
                    {temporaryMenuOpen && (
                      <div className="PanelMenuTemporal">
                        <button className="OpcionMenuTemporal OpcionPrincipal" onClick={handleSaveDraft}>
                          Guardar cambios
                        </button>
                        {pendingChanges && (
                          <button className="OpcionMenuTemporal" onClick={handleViewQueue}>
                            Cola de cambios
                          </button>
                        )}
                        <button className="OpcionMenuTemporal" onClick={handleOpenScheduleModal}>
                          <Icon.Calendar /> Editar fecha
                        </button>
                        <button className="OpcionMenuTemporal" onClick={handleCancelEdit}>
                          Cancelar edición
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : hasPendingChanges ? (
                <>
                  <div className="EstadoFechaTemporal">
                    <Icon.Calendar />
                    <span>{scheduleLabel}</span>
                  </div>
                  <div className="MenuTemporalDesplegable">
                    <button
                      className="BotonPrincipal busqueda BotonExito BotonMenuTemporal"
                      onClick={() => setTemporaryMenuOpen(open => !open)}
                    >
                      Pendientes <Icon.ChevronDown />
                    </button>
                    {temporaryMenuOpen && (
                      <div className="PanelMenuTemporal">
                        <button className="OpcionMenuTemporal OpcionPrincipal" onClick={handleApplyDraft}>
                          Aplicar ahora
                        </button>
                        <button className="OpcionMenuTemporal" onClick={handleViewQueue}>
                          Cola de cambios
                        </button>
                        <button className="OpcionMenuTemporal" onClick={handleOpenScheduleModal}>
                          <Icon.Calendar /> Editar fecha
                        </button>
                        <button className="OpcionMenuTemporal" onClick={handleStartDraft}>
                          <Icon.Edit /> Editar pendientes
                        </button>
                        <button className="OpcionMenuTemporal OpcionPeligro" onClick={handleCancelDraft}>
                          <Icon.X /> Cancelar pendientes
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button className="BotonSecundario busqueda temporales" onClick={handleStartDraft}>
                  <Icon.Edit /> Cambios temporales
                </button>
              )}

              {!isDraftMode && (
                <div className="ContenedorBuscador">
                  <span className="IconoBuscador"><Icon.Search /></span>
                  <input
                    className="EntradaBuscador"
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}

              {!isDraftMode && !hasPendingChanges && (
                <button className="BotonPrincipal busqueda" onClick={openAdd}>
                  <Icon.Plus /> Producto
                </button>
              )}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="ContenedorFiltroCategorias">
              <CategoryFilter
                categories={categories}
                selected={categoryFilter}
                onChange={setCategoryFilter}
              />
            </div>
          )}
        </header>

        <div className="Desplazable VistaDesplazableLista">
          <div className="CabeceraColumnasLista ColumnasLista">
            <div className="ColumnaPuntoProducto" />
            <div className="EtiquetaColumna EtiquetaColumnaFlex2">Producto</div>
            <div className="EtiquetaColumna EtiquetaColumnaFlex1">Categoría</div>
            <div className="EtiquetaColumna EtiquetaColumnaAncho80">Precio</div>
            <div className="EtiquetaColumna EtiquetaColumnaAncho90">Fecha</div>
            <div className="EspaciadorAccionesLista" />
          </div>

          {filtered.length === 0 ? (
            <div className="VistaEstadoVacio">
              <div className="IconoEstadoVacio"><Icon.Package /></div>
              <p className="MensajeEstadoVacio">
                {products.length === 0 ? "No hay productos. Crea uno para empezar." : "Sin resultados para esta búsqueda o categoría."}
              </p>
              {products.length === 0 && (
                <div className="ContenedorBotonVacio">
                  <button className="BotonPrincipal" onClick={openAdd}>
                    <Icon.Plus /> Agregar primer producto
                  </button>
                </div>
              )}
            </div>
          ) : isLoading ? (
            <SkeletonLoader count={products.length > 0 ? products.length : 1} />
          ) : (
            filtered.map(product => {
              const isPending = !!(
                pendingChanges &&
                pendingChanges[product._idx] &&
                getChangedFields(product, pendingChanges[product._idx]).length > 0
              );
              return (
                <ProductRow
                  key={product._idx}
                  product={product}
                  index={product._idx}
                  onEdit={openEdit}
                  onToggle={requestToggle}
                  onDelete={requestDelete}
                  isDraftMode={isDraftMode}
                  onDraftChange={handleDraftChange}
                  isPending={isPending}
                  categories={categories}
                />
              );
            })
          )}
        </div>
      </main>

      {productModal !== null && (
        <ProductModal
          product={productModal.product}
          onSave={handleSaveProduct}
          onClose={() => setProductModal(null)}
          categories={categories}
        />
      )}

      {scheduleModalOpen && (
        <ScheduleModal
          value={scheduledApplyAt}
          onSave={handleSaveSchedule}
          onClose={() => setScheduleModalOpen(false)}
        />
      )}

      {queueModalOpen && (
        <QueueModal
          items={changedQueueItems}
          onClose={() => setQueueModalOpen(false)}
        />
      )}

      {confirmModal !== null && (
        <ConfirmModal
          config={confirmModal.config}
          onConfirm={handleConfirm}
          onCancel={() => {
            if (confirmModal.formData !== undefined && confirmModal.editIndex !== null) {
              setProductModal({
                product: confirmModal.originalProduct,
                index: confirmModal.editIndex,
              });
            } else if (confirmModal.formData !== undefined) {
              setProductModal({ product: null, index: null });
            }
            setConfirmModal(null);
          }}
        />
      )}
    </div>
  );
}

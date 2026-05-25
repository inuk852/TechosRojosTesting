import { useState, useRef, useEffect } from 'react';
import './MultiSelectChip.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MAX_VISIBLE_ITEMS = 4;

export default function MultiSelectChip({ 
  options = [], 
  value = [], 
  onChange = () => {},
  placeholder = 'Selecciona opciones...'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const toggleOption = (option) => {
    if (value.includes(option)) {
      onChange(value.filter(item => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (option) => {
    onChange(value.filter(item => item !== option));
  };

  const clearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const maxHeight = ITEM_HEIGHT * MAX_VISIBLE_ITEMS + ITEM_PADDING_TOP;

  return (
    <div className="MultiSelectContainer" ref={containerRef}>
      
      <div 
        className={`MultiSelectInput ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 ? (
          <span className="MultiSelectPlaceholder">{placeholder}</span>
        ) : (
          <div className="ChipsContainer">
            {value.map((item) => (
              <span
                key={item}
                className="Chip"
                onClick={() => removeOption(item)}
                role="button"
                tabIndex={0}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            ))}
          </div>
        )}
        
        <div className="MultiSelectActions">
          {value.length > 0 && (
            <button
              className="ClearButton"
              onClick={clearAll}
              type="button"
              title="Limpiar selección"
            >
              ✕
            </button>
          )}
          <span className={`DropdownIcon ${isOpen ? 'open' : ''}`}>▼</span>
        </div>
      </div>

      {isOpen && (
        <div className="MultiSelectDropdown" style={{ maxHeight: `${maxHeight}px` }}>
          {options.map((option) => (
            <div
              key={option}
              className={`MultiSelectItem ${value.includes(option) ? 'selected' : ''}`}
              onClick={() => toggleOption(option)}
            >
              <span className="MultiSelectItemLabel">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

const AutoComplete = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Type to search...",
  error,
  disabled = false,
  required = false,
  className = "",
  maxSuggestions = 8,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Filter options based on input value
  useEffect(() => {
    if (!value || value.length < 1) {
      setFilteredOptions([]);
      return;
    }

    const filtered = options
      .filter((option) => option.toLowerCase().includes(value.toLowerCase()))
      .slice(0, maxSuggestions);

    setFilteredOptions(filtered);
    setHighlightedIndex(-1);
  }, [value, options, maxSuggestions]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filteredOptions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (filteredOptions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = (e) => {
    // Delay closing to allow for option clicks
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }, 150);
  };

  const clearValue = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
            placeholder-gray-400 shadow-sm transition-colors
            focus:border-black focus:outline-none focus:ring-1 focus:ring-black
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            ${value ? "pr-10" : ""}
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : ""
            }
          `}
          {...props}
        />

        {/* Clear button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={clearValue}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}

        {/* Dropdown icon */}
        {!value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        )}

        {/* Dropdown list */}
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <ul ref={listRef} className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`
                    px-3 py-2 text-sm cursor-pointer transition-colors
                    ${
                      index === highlightedIndex
                        ? "bg-black text-white"
                        : "text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default AutoComplete;

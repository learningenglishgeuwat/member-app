'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = 'Select...',
  className = '',
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});
  const [triggerStyle, setTriggerStyle] = React.useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInsideContainer = containerRef.current?.contains(event.target as Node);
      const isInsideDropdown = listRef.current?.contains(event.target as Node);
      if (!isInsideContainer && !isInsideDropdown) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tutup dropdown saat user scroll di luar dropdown
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (event: Event) => {
      // Jika scroll terjadi di dalam dropdown, biarkan (scroll pilihan)
      if (listRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = Math.min(240, options.length * 40);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top: number;
      if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
        top = rect.bottom + 4;
      } else {
        top = rect.top - dropdownHeight - 4;
      }

      const isCameraFullPage = document.body.classList.contains('is-camera-full-page');
      const backgroundColor = isCameraFullPage ? 'rgba(22, 11, 47, 0.5)' : 'rgba(5, 10, 20, 0.98)';
      const backdropBlur = isCameraFullPage ? '8px' : '12px';

      setDropdownStyle({
        top: `${top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        backgroundColor,
        backdropFilter: `blur(${backdropBlur})`,
      });
    }
  }, [isOpen, options.length]);


  useEffect(() => {
    const updateTriggerStyle = () => {
      const isCameraFullPage = document.body.classList.contains('is-camera-full-page');
      const backgroundColor = isCameraFullPage ? 'rgba(22, 11, 47, 0.4)' : 'rgba(0, 0, 0, 0.85)';
      setTriggerStyle({ backgroundColor });
    };

    updateTriggerStyle();

    const observer = new MutationObserver(updateTriggerStyle);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, index: number) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleOptionClick(options[index].value);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  return (
    <div ref={containerRef} className={`custom-select-container ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className="custom-select-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        style={triggerStyle}
      >
        <span className="custom-select-value">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`custom-select-chevron ${isOpen ? 'is-open' : ''}`}
          size={16}
        />
      </button>

      {isOpen && createPortal(
        <ul
          ref={listRef}
          className="custom-select-dropdown"
          style={dropdownStyle}
          role="listbox"
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`custom-select-option ${
                option.value === value ? 'is-selected' : ''
              } ${index === highlightedIndex ? 'is-highlighted' : ''}`}
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(e) => handleOptionKeyDown(e, index)}
              role="option"
              aria-selected={option.value === value}
              tabIndex={-1}
            >
              <span className="custom-select-option-label">{option.label}</span>
              {option.value === value && <Check className="custom-select-check" size={14} />}
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
};

export default CustomSelect;

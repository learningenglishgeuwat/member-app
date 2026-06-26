'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import './CustomSelect.css';

type CustomSelectOption<T extends string> = {
  value: T;
  label: string;
};

type CustomSelectProps<T extends string> = {
  options: CustomSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  className?: string;
};

function CustomSelect<T extends string>({
  options,
  value,
  onChange,
  label,
  className = '',
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Tutup saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInsideContainer = containerRef.current?.contains(event.target as Node);
      const isInsideMenu = menuRef.current?.contains(event.target as Node);
      if (!isInsideContainer && !isInsideMenu) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tutup saat scroll di luar menu
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (event: Event) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  // Hitung posisi menu berdasarkan trigger (portal ke body)
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = Math.min(260, options.length * 36 + 8);
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow >= menuHeight || spaceBelow >= rect.top
      ? rect.bottom + 4
      : rect.top - menuHeight - 4;

    setMenuStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 9995,
    });
  }, [isOpen, options.length]);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className={`custom-select-container ${className}`} ref={containerRef}>
      {label && <span className="custom-select-label">{label}</span>}
      <button
        ref={triggerRef}
        type="button"
        className={`custom-select-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-select-value">{selectedOption?.label || 'Pilih...'}</span>
        <ChevronDown className={`custom-select-icon ${isOpen ? 'is-open' : ''}`} size={16} />
      </button>

      {isOpen && createPortal(
        <ul
          ref={menuRef}
          className="custom-select-menu"
          style={menuStyle}
          role="listbox"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={`custom-select-option ${option.value === value ? 'is-selected' : ''}`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
}

export default CustomSelect;

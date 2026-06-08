import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './ProgressModal.css';

export interface AssessmentOption {
  id: string;
  label: string;
  percentage: number;
  color: string;
  icon: string;
  range: string; // Rentang nilai yang ditampilkan
}

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: AssessmentOption) => void;
  title?: string;
  description?: string;
}

/**
 * Rubrik Penilaian Progress
 * 
 * Status Nilai:
 * 🟢 Sangat Bagus: 95–100 (representasi: 100%)
 * 🔵 Bagus: 80–94 (representasi: 94%)
 * 🟠 Perlu sedikit perbaikan: 65–79 (representasi: 79%)
 * 🔴 Perlu Perbaikan: 0–64 (representasi: 64%)
 * 
 * Nilai percentage menggunakan nilai tertinggi dari rentang untuk representasi.
 * Dokumentasi lengkap: /documentation/RUBRIK_PENILAIAN.md
 */
const ASSESSMENT_OPTIONS: AssessmentOption[] = [
  {
    id: 'sangat-bagus',
    label: 'Sangat Bagus',
    percentage: 100, // Highest value of 95-100
    color: 'green',
    icon: '🟢',
    range: '95–100',
  },
  {
    id: 'bagus',
    label: 'Bagus',
    percentage: 94, // Highest value of 80-94
    color: 'blue',
    icon: '🔵',
    range: '80–94',
  },
  {
    id: 'perlu-sedikit-perbaikan',
    label: 'Perlu sedikit perbaikan',
    percentage: 79, // Highest value of 65-79
    color: 'orange',
    icon: '🟠',
    range: '65–79',
  },
  {
    id: 'perlu-perbaikan',
    label: 'Perlu Perbaikan',
    percentage: 64, // Highest value of 0-64
    color: 'red',
    icon: '🔴',
    range: '0–64',
  },
];

const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'How well did you master this topic?',
  description = 'Select your current level of understanding',
}) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSelect = (option: AssessmentOption) => {
    onSelect(option);
    onClose();
  };

  const modalNode = (
    <div className="progress-modal-overlay" onClick={onClose}>
      <div className="progress-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="progress-modal__header">
          <h3 className="progress-modal__title">{title}</h3>
          <button 
            className="progress-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="progress-modal__description">{description}</p>

        {/* Options */}
        <div className="progress-modal__options">
          {ASSESSMENT_OPTIONS.map((option) => (
            <button
              key={option.id}
              className={`progress-modal__option progress-modal__option--${option.color}`}
              onClick={() => handleSelect(option)}
            >
              <span className="progress-modal__option-icon">{option.icon}</span>
              <div className="progress-modal__option-content">
                <span className="progress-modal__option-label">{option.label}</span>
                <span className="progress-modal__option-percentage">{option.range}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="progress-modal__footer">
          <button 
            className="progress-modal__cancel"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};

export default ProgressModal;

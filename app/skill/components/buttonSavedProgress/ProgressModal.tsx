import React from 'react';
import { X } from 'lucide-react';
import './ProgressModal.css';

export interface AssessmentOption {
  id: string;
  label: string;
  percentage: number;
  color: string;
  icon: string;
}

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: AssessmentOption) => void;
  title?: string;
  description?: string;
}

const ASSESSMENT_OPTIONS: AssessmentOption[] = [
  {
    id: 'excellent',
    label: 'Excellent',
    percentage: 100,
    color: 'green',
    icon: '🟢',
  },
  {
    id: 'good',
    label: 'Good',
    percentage: 80,
    color: 'blue',
    icon: '🔵',
  },
  {
    id: 'enough',
    label: 'Enough',
    percentage: 65,
    color: 'orange',
    icon: '🟠',
  },
  {
    id: 'lack',
    label: 'Lack',
    percentage: 50,
    color: 'red',
    icon: '🔴',
  },
];

const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'How well did you master this topic?',
  description = 'Select your current level of understanding',
}) => {
  if (!isOpen) return null;

  const handleSelect = (option: AssessmentOption) => {
    onSelect(option);
    onClose();
  };

  return (
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
                <span className="progress-modal__option-percentage">{option.percentage}%</span>
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
};

export default ProgressModal;

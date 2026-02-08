import React, { useState, useEffect } from 'react';
import { Check, Save, Loader2 } from 'lucide-react';
import ProgressModal, { AssessmentOption } from './ProgressModal';
import './ButtonSavedProgress.css';

export type ButtonSavedProgressProps = {
  isSaved?: boolean;
  isSaving?: boolean;
  onSave?: (percentage: number) => Promise<void>;
  onUnsave?: () => Promise<void>;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  topicName?: string;
}

const ButtonSavedProgress: React.FC<ButtonSavedProgressProps> = ({
  isSaved: initialIsSaved = false,
  isSaving = false,
  onSave,
  onUnsave,
  disabled = false,
  size = 'medium',
  variant = 'primary',
  className = '',
  topicName = 'this topic',
}) => {
  const [isSaved, setIsSaved] = useState(false); // Start with false to match server
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentOption | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Handle hydration and client-side state
  useEffect(() => {
    setIsClient(true);
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  useEffect(() => {
    setIsLoading(isSaving);
  }, [isSaving]);

  // Load saved assessment from localStorage on mount (client only)
  useEffect(() => {
    if (isClient && initialIsSaved && topicName) {
      const savedAssessments = JSON.parse(localStorage.getItem('savedAssessments') || '{}') as Record<string, AssessmentOption>;
      const topicKey = topicName.toLowerCase().replace(/\s+/g, '_');
      const savedAssessment = savedAssessments[topicKey];
      if (savedAssessment) {
        setSelectedAssessment(savedAssessment);
      }
    }
  }, [isClient, initialIsSaved, topicName]);

  const handleClick = () => {
    if (disabled || isLoading) return;

    if (isSaved) {
      handleUnsave();
    } else {
      setShowModal(true);
    }
  };

  const handleSave = async (option: AssessmentOption) => {
    setIsLoading(true);
    
    try {
      await onSave?.(option.percentage);
      setIsSaved(true);
      setSelectedAssessment(option);
      
      // Save assessment to localStorage for persistence
      const savedAssessments = JSON.parse(localStorage.getItem('savedAssessments') || '{}') as Record<string, AssessmentOption>;
      const topicKey = topicName.toLowerCase().replace(/\s+/g, '_');
      savedAssessments[topicKey] = option;
      localStorage.setItem('savedAssessments', JSON.stringify(savedAssessments));
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async () => {
    setIsLoading(true);
    
    try {
      await onUnsave?.();
      setIsSaved(false);
      setSelectedAssessment(null);
      
      // Remove assessment from localStorage
      const savedAssessments = JSON.parse(localStorage.getItem('savedAssessments') || '{}') as Record<string, AssessmentOption>;
      const topicKey = topicName.toLowerCase().replace(/\s+/g, '_');
      delete savedAssessments[topicKey];
      localStorage.setItem('savedAssessments', JSON.stringify(savedAssessments));
    } catch (error) {
      console.error('Error unsaving progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="animate-spin" size={16} />;
    }
    return isSaved ? <Check size={16} /> : <Save size={16} />;
  };

  const getText = () => {
    if (isLoading) return 'Saving...';
    if (isSaved && selectedAssessment) {
      return `${selectedAssessment.icon} ${selectedAssessment.label}`;
    }
    return 'Save Progress';
  };

  const buttonClasses = [
    'button-saved-progress',
    `button-saved-progress--${size}`,
    `button-saved-progress--${variant}`,
    isSaved && 'button-saved-progress--saved',
    isLoading && 'button-saved-progress--loading',
    disabled && 'button-saved-progress--disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <>
      <button
        className={buttonClasses}
        onClick={handleClick}
        disabled={disabled || isLoading}
        aria-label={getText()}
        title={getText()}
      >
        <span className="button-saved-progress__icon">
          {getIcon()}
        </span>
        <span className="button-saved-progress__text">
          {getText()}
        </span>
      </button>

      <ProgressModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleSave}
        title={`How well did you master ${topicName}?`}
        description="Select your current level of understanding"
      />
    </>
  );
};

export default ButtonSavedProgress;

import { IpaVisibilityToggle } from './IpaVisibilityToggle';

type HighlightVisibilityToggleColor = 'orange' | 'magenta';

type HighlightVisibilityToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color: HighlightVisibilityToggleColor;
  className?: string;
  disabled?: boolean;
  label?: string;
};

const HIGHLIGHT_TOGGLE_STYLE: Record<
  HighlightVisibilityToggleColor,
  {
    label: string;
    activeClass: string;
    activeTrackClass: string;
    activeDotClass: string;
  }
> = {
  orange: {
    label: 'Orange Highlight',
    activeClass: 'text-orange-200',
    activeTrackClass: 'bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.62)]',
    activeDotClass: 'bg-orange-300 shadow-[0_0_6px_rgba(253,186,116,0.95)]',
  },
  magenta: {
    label: 'Magenta Highlight',
    activeClass: 'text-fuchsia-200',
    activeTrackClass: 'bg-fuchsia-500 shadow-[0_0_12px_rgba(224,64,251,0.62)]',
    activeDotClass: 'bg-fuchsia-300 shadow-[0_0_6px_rgba(224,64,251,0.95)]',
  },
};

export function HighlightVisibilityToggle({
  checked,
  onChange,
  color,
  className = '',
  disabled = false,
  label,
}: HighlightVisibilityToggleProps) {
  const style = HIGHLIGHT_TOGGLE_STYLE[color];

  return (
    <IpaVisibilityToggle
      checked={checked}
      onChange={onChange}
      label={label ?? style.label}
      activeClass={style.activeClass}
      activeTrackClass={style.activeTrackClass}
      activeDotClass={style.activeDotClass}
      className={`w-full flex justify-between text-[10px] sm:text-xs mt-2 ${className}`}
      disabled={disabled}
    />
  );
}

export default HighlightVisibilityToggle;

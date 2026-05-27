import React from 'react';

type IpaVisibilityToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  activeClass?: string;
  activeTrackClass?: string;
  activeDotClass?: string;
  className?: string;
  disabled?: boolean;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function IpaVisibilityToggle({
  checked,
  onChange,
  label = 'IPA',
  activeClass = 'text-cyan-200',
  activeTrackClass = 'bg-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.6)]',
  activeDotClass = 'bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]',
  className = '',
  disabled = false,
}: IpaVisibilityToggleProps) {
  return (
    <label
      className={cx(
        'inline-flex items-center gap-3 group',
        disabled ? 'cursor-not-allowed opacity-55' : 'cursor-pointer',
        className,
      )}
    >
      <span
        className={cx(
          'font-mono text-xs sm:text-sm tracking-widest text-white/55 uppercase transition-colors',
          checked ? activeClass : !disabled && 'group-hover:text-cyan-100',
        )}
      >
        {label}
      </span>
      <span className="relative flex items-center">
        <input
          type="checkbox"
          role="switch"
          aria-label={`${label} visibility`}
          className="sr-only peer"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span
          className={cx(
            'block h-6 w-12 rounded-full transition-all duration-300',
            checked
              ? activeTrackClass
              : 'border-2 border-white/20 bg-[#1a1f24]',
          )}
        />
        <span
          className={cx(
            'absolute left-[3px] top-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full transition-transform duration-300',
            checked ? 'translate-x-6 bg-[#101414] shadow-md' : 'translate-x-0 bg-white/40',
          )}
        >
          <span
            className={cx(
              'rounded-full transition-all duration-300',
              checked ? cx('h-[10px] w-[10px]', activeDotClass) : 'h-0 w-0 bg-transparent',
            )}
          />
        </span>
      </span>
    </label>
  );
}

export default IpaVisibilityToggle;

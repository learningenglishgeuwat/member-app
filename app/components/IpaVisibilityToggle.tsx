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
  gestureTarget?: 'ipa' | 'none';
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function IpaVisibilityToggle({
  checked,
  onChange,
  label,
  activeClass = 'text-cyan-200',
  activeTrackClass = 'bg-[#00f0ff] shadow-[0_0_6px_rgba(0,240,255,0.6)]',
  activeDotClass = 'bg-[#00f0ff] shadow-[0_0_3px_#00f0ff]',
  className = '',
  disabled = false,
  gestureTarget,
}: IpaVisibilityToggleProps) {
  const displayLabel = label ?? (checked ? 'Sembunyikan IPA' : 'Tampilkan IPA');
  const isIpaGestureTarget =
    gestureTarget === 'ipa' ||
    (gestureTarget !== 'none' && /\b(ipa|phonetic|phonetics)\b/i.test(displayLabel));

  return (
    <label
      data-control-center-ipa-toggle-label={isIpaGestureTarget ? displayLabel : undefined}
      className={cx(
        'inline-flex items-center gap-1 group',
        disabled ? 'cursor-not-allowed opacity-55' : 'cursor-pointer',
        className,
      )}
    >
      <span
        className={cx(
          'font-mono text-[7px] sm:text-[8.5px] tracking-wider text-white/55 uppercase transition-colors',
          checked ? activeClass : !disabled && 'group-hover:text-cyan-100',
        )}
      >
        {displayLabel}
      </span>
      <span className="relative flex items-center shrink-0">
        <input
          type="checkbox"
          role="switch"
          aria-label={`${typeof displayLabel === 'string' ? displayLabel : 'IPA'} visibility`}
          className="sr-only peer"
          checked={checked}
          disabled={disabled}
          data-control-center-ipa-toggle={isIpaGestureTarget ? 'true' : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span
          className={cx(
            'block h-3 w-6 rounded-full transition-all duration-300',
            checked
              ? activeTrackClass
              : 'border border-white/20 bg-[#1a1f24]',
          )}
        />
        <span
          className={cx(
            'absolute left-[1.5px] top-[1.5px] flex h-[9px] w-[9px] items-center justify-center rounded-full transition-transform duration-300',
            checked ? 'translate-x-3 bg-[#101414] shadow-sm' : 'translate-x-0 bg-white/40',
          )}
        >
          <span
            className={cx(
              'rounded-full transition-all duration-300',
              checked ? cx('h-[4px] w-[4px]', activeDotClass) : 'h-0 w-0 bg-transparent',
            )}
          />
        </span>
      </span>
    </label>
  );
}

export default IpaVisibilityToggle;

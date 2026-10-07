interface IconProps {
  size?: number;
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function ArrowIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" strokeWidth={1.8} {...base}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function CheckIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" strokeWidth={2} {...base}>
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}

export function CrossIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" strokeWidth={2} {...base}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

export function BulbIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" strokeWidth={1.6} {...base}>
      <circle cx="8" cy="7" r="4.5" />
      <path d="M6.5 13.5h3" />
    </svg>
  );
}

export function ReplayIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" strokeWidth={1.8} {...base}>
      <path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v3h-3" />
    </svg>
  );
}

export function CursorIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={1.6} {...base}>
      <path d="M5 3l14 7-6 2-2 6L5 3z" />
    </svg>
  );
}

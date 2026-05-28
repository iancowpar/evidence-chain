type Props = {
  size?: number;
  strokeWidth?: number;
  title?: string;
};

export function TraceMark({ size = 22, strokeWidth = 2, title }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="4" cy="12" r="1.7" fill="currentColor" />
      <circle cx="8" cy="20" r="1.7" fill="currentColor" />
      <circle cx="13" cy="14" r="1.7" fill="currentColor" />
      <path
        d="M13,16 L26,16"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M22,11 L27,16 L22,21"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

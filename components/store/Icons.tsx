import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement>;
export function Arrow(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      {...props}
    >
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}
export function Bag(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      {...props}
    >
      <path d="M5 7h14l1 14H4L5 7Z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </svg>
  );
}
export function Close(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      {...props}
    >
      <path d="m6 6 12 12M6 18 18 6" />
    </svg>
  );
}
export function Spark(props: Props) {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true" {...props}>
      <path d="m20 0 4 13 12-7-7 12 11 2-11 4 7 12-12-7-4 11-4-11-12 7 7-12L0 20l11-2L4 6l12 7Z" />
    </svg>
  );
}

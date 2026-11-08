import type { SVGProps } from "react";

const paths = {
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4",
  flame:
    "M12 2.5c.6 3.6 5.5 5.6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.8 1.5-4.6 2.8-5.7.1 2 1 3.2 2.3 3.5C11.2 8.7 10.9 5.6 12 2.5z",
  smoke:
    "M3 8c2.5-2 4.5 2 7 0s4.5-2 7 0c1.2 1 2.5 1 4 0 M3 13c2.5-2 4.5 2 7 0s4.5-2 7 0c1.2 1 2.5 1 4 0 M5 18c2.5-2 4.5 2 7 0s4.5-2 7 0",
  aiCheck:
    "M4 8V5a1 1 0 0 1 1-1h3 M16 4h3a1 1 0 0 1 1 1v3 M20 16v3a1 1 0 0 1-1 1h-3 M8 20H5a1 1 0 0 1-1-1v-3 M8.5 12l2.5 2.5 4.5-5",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6 M16 4.3a3.5 3.5 0 0 1 0 6.4 M18.5 14.4c1.8.9 3 2.8 3 5.6",
  shieldCheck:
    "M12 3l7.5 3v5.5c0 4.6-3.1 8-7.5 9.9-4.4-1.9-7.5-5.3-7.5-9.9V6L12 3z M8.8 12.2l2.2 2.2 4.2-4.4",
  locate:
    "M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  plus: "M12 5v14 M5 12h14",
  minus: "M5 12h14",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3.5 2",
  camera:
    "M3 8.5A1.5 1.5 0 0 1 4.5 7h2.8l1.7-2.5h6l1.7 2.5h2.8A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  pin: "M12 21.5s-7-6.2-7-11.8a7 7 0 0 1 14 0c0 5.6-7 11.8-7 11.8z M12 12.2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  phone:
    "M5 3.5h3.5l2 5-2.6 1.6a11.5 11.5 0 0 0 5.9 5.9l1.6-2.6 5 2v3.5a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2z",
  list: "M9 6h12 M9 12h12 M9 18h12 M4 6h.5 M4 12h.5 M4 18h.5",
  map: "M9 4L3 6.2v13.8l6-2.2 6 2.2 6-2.2V4l-6 2.2L9 4z M9 4v13.8 M15 6.2V20",
  sliders: "M4 6h9 M17 6h3 M4 12h3 M11 12h9 M4 18h11 M19 18h1 M15 4v4 M9 10v4 M17 16v4",
  chevronRight: "M9 6l6 6-6 6",
  chevronLeft: "M15 6l-6 6 6 6",
  x: "M6 6l12 12 M18 6L6 18",
  share: "M12 3.5v11 M7.5 8L12 3.5 16.5 8 M5 13.5v5.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5.5",
  flag: "M5 21V4 M5 4h12l-2.5 4.5L17 13H5",
  layers: "M12 3l9 5-9 5-9-5 9-5z M3 12.5l9 5 9-5 M3 16.5l9 5 9-5",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M15.8 8.2l-2.3 5.3-5.3 2.3 2.3-5.3 5.3-2.3z",
  alert:
    "M10.3 4.2L2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z M12 9.5v4 M12 17h.01",
  check: "M5 12.5l4.5 4.5L19 7.5",
  lock: "M6.5 11h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-7A1.5 1.5 0 0 1 6.5 11z M8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5.5 M12 7.8h.01",
  menu: "M4 7h16 M4 12h16 M4 17h16",
  inbox:
    "M4 13.5l2.5-8A1.5 1.5 0 0 1 8 4.5h8a1.5 1.5 0 0 1 1.5 1l2.5 8v5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z M4 13.5h4.5l1.5 2.5h4l1.5-2.5H20",
  arrowRight: "M4 12h16 M14 6l6 6-6 6",
} as const;

export type IconName = keyof typeof paths;

type Props = SVGProps<SVGSVGElement> & { name: IconName; size?: number; strokeWidth?: number };

export function Icon({ name, size = 20, strokeWidth = 2, className, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}

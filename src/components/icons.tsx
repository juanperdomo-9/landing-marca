import type { SVGProps } from "react";
import { LuChefHat, LuScissors } from "react-icons/lu";
import type { ProductoId } from "../config";

/** Pelota de fútbol con el mismo trazo que los íconos de Lucide. */
export function IconoPelota({ size = 20, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m12 7.5 4.3 3.1-1.6 5h-5.4l-1.6-5z" />
      <path d="M12 7.5V2.3M16.3 10.6l4.9-1.6M14.7 15.6l3 4.2M9.3 15.6l-3 4.2M7.7 10.6 2.8 9" />
    </svg>
  );
}

export function IconoProducto({ id, size = 20 }: { id: ProductoId; size?: number }) {
  if (id === "cancha") return <IconoPelota size={size} />;
  if (id === "pelu") return <LuScissors size={size} aria-hidden="true" />;
  return <LuChefHat size={size} aria-hidden="true" />;
}

import logoColor from "@/assets/brasilab-logo.webp";
import logoWhite from "@/assets/brasilab-logo-white.webp";
import symbol from "@/assets/brasilab-symbol.png";
import symbolWhite from "@/assets/brasilab-symbol-white.png";
import { cn } from "@/lib/utils";

type LogoVariant = "color" | "white" | "symbol" | "symbol-white";

interface BrasilabLogoProps {
  variant?: LogoVariant;
  className?: string;
}

const SOURCES: Record<LogoVariant, string> = {
  color: logoColor,
  white: logoWhite,
  symbol,
  "symbol-white": symbolWhite,
};

/**
 * Componente único do logotipo oficial da Brasilab.
 * Nunca recolorir, distorcer ou substituir o arquivo original.
 * As variantes brancas utilizam os arquivos oficiais — nunca filtros CSS.
 */
export function BrasilabLogo({ variant = "color", className }: BrasilabLogoProps) {
  return (
    <img
      src={SOURCES[variant]}
      alt="Brasilab"
      className={cn("h-8 w-auto select-none object-contain", className)}
      draggable={false}
    />
  );
}

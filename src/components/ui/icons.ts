import {
  Blinds,
  Building2,
  Cog,
  Layers,
  Moon,
  Package,
  Ruler,
  Sun,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/data/products";

export const categoryIcons: Record<CategoryId, LucideIcon> = {
  telas: Layers,
  sistemas: Cog,
  perfileria: Ruler,
  motorizacion: Zap,
  rieles: Blinds,
  accesorios: Package,
};

export const needIcons: LucideIcon[] = [Sun, Moon, Blinds, Zap, Building2];

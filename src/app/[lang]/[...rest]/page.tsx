import { notFound } from "next/navigation";

// Cualquier ruta desconocida dentro de un idioma muestra el 404 con header y footer
export default function CatchAll() {
  notFound();
}

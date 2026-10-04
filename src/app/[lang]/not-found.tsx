import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

// Se muestra para rutas inexistentes dentro de /es o /en
export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy pt-[var(--header-h)] text-cream">
      <div className="slats pointer-events-none absolute inset-0 text-cream/20" aria-hidden />
      <div className="container-x relative py-24 text-center">
        <Logo color="dorado" layout="icon" className="mx-auto h-auto w-20" alt="" />
        <p className="mt-8 font-display text-8xl font-bold text-gold sm:text-9xl">404</p>
        <h1 className="mt-4 text-3xl sm:text-4xl">Esta ventana está cerrada · This window is closed</h1>
        <p className="mt-4 text-cream/70">La página que buscas no existe o fue movida. · The page you are looking for does not exist.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/es" className="btn btn-gold">
            Volver al inicio
          </Link>
          <Link href="/en" className="btn btn-ghost-light">
            Back to home
          </Link>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gold" aria-hidden />
    </section>
  );
}

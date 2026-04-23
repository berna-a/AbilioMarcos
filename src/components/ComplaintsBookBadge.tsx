import { useT } from "@/i18n";

/**
 * Refined placeholder slot for the official "Livro de Reclamações" badge.
 * The real asset/link will replace the inner content when available.
 */
const ComplaintsBookBadge = () => {
  const t = useT();
  return (
    <a
      href="https://www.livroreclamacoes.pt/inicio"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.footer.complaintsBook}
      className="inline-flex items-center gap-3 border border-border bg-background/60 px-3.5 py-2.5 hover:border-brand-red/40 hover:bg-background transition-colors duration-300 group"
    >
      <span
        aria-hidden
        className="flex items-center justify-center w-7 h-7 border border-border text-[10px] tracking-[0.15em] uppercase text-foreground/55 group-hover:text-brand-red group-hover:border-brand-red/40 transition-colors"
      >
        LR
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
          {t.footer.legal}
        </span>
        <span className="text-[12px] text-foreground/80 group-hover:text-foreground transition-colors">
          {t.footer.complaintsBook}
        </span>
      </span>
    </a>
  );
};

export default ComplaintsBookBadge;

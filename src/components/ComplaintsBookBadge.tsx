import { useT } from "@/i18n";
import lrLogo from "@/assets/livro-reclamacoes.png";

/**
 * Official "Livro de Reclamações" link for the footer.
 * Uses the official PT logo asset.
 */
const ComplaintsBookBadge = () => {
  const t = useT();
  return (
    <a
      href="https://www.livroreclamacoes.pt/inicio"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.footer.complaintsBook}
      title={t.footer.complaintsBook}
      className="inline-flex items-center bg-white/95 hover:bg-white border border-white/10 px-3 py-2 rounded-sm transition-colors duration-300"
    >
      <img
        src={lrLogo}
        alt={t.footer.complaintsBook}
        className="h-9 w-auto select-none"
        draggable={false}
      />
    </a>
  );
};

export default ComplaintsBookBadge;

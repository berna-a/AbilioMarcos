import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useT } from "@/i18n";

const RAL_LIST_URL =
  "https://www.consumidor.gov.pt/parceiros/sistema-de-defesa-do-consumidor/entidades-de-resolucao-alternativa-de-litigios-de-consumo/ral-mapa-e-lista-de-entidades.aspx";
const PORTAL_URL = "https://www.consumidor.gov.pt";

const DisputeResolution = () => {
  const t = useT();

  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-20 md:pb-30 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[13px] tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t.legal.backToHome}
            </Link>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6">
              {t.legal.disputesTitle}
            </h1>

            <p className="text-[13px] tracking-[0.1em] text-muted-foreground mb-12">
              {t.legal.lastUpdated}
            </p>

            <div className="space-y-6 text-sm text-foreground/80 leading-[1.85]">
              <p>
                Em caso de litígio ou conflito, o consumidor pode recorrer à{" "}
                <span className="text-foreground">Resolução Alternativa de Litígios de Consumo</span>{" "}
                (vulgarmente designada <span className="italic">RAL</span>), que abrange a mediação,
                a conciliação e a arbitragem.
              </p>

              <p>
                Pode consultar a lista das entidades em{" "}
                <a
                  href={RAL_LIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors text-foreground break-words"
                >
                  consumidor.gov.pt — RAL: mapa e lista de entidades
                </a>
                .
              </p>

              <p>
                Mais informações em{" "}
                <a
                  href={PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors text-foreground"
                >
                  Portal do Consumidor — www.consumidor.gov.pt
                </a>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DisputeResolution;

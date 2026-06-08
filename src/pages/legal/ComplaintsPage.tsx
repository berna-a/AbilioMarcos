import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useT } from "@/i18n";

const ComplaintsPage = () => {
  const t = useT();
  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-20 md:pb-28 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-[13px] tracking-[0.1em] uppercase text-foreground hover:text-brand-red transition-colors duration-300 mb-8">
              <ArrowLeft className="w-3.5 h-3.5" /> {t.legal.backToHome}
            </Link>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-8">Livro de Reclamações</h1>

            <div className="space-y-6 text-sm md:text-base text-foreground leading-[1.8]">
              <p>
                Nos termos do Decreto-Lei n.º 156/2005, de 15 de setembro, este estabelecimento dispõe de
                <strong> Livro de Reclamações em formato eletrónico</strong>. Caso pretenda apresentar uma reclamação,
                pode fazê-lo de forma simples e gratuita através da plataforma oficial.
              </p>

              <a
                href="https://www.livroreclamacoes.pt/inicio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-red text-white px-6 py-3.5 text-[13px] tracking-[0.15em] uppercase font-medium hover:bg-brand-red-soft transition-colors"
              >
                Aceder ao Livro de Reclamações <ExternalLink className="w-4 h-4" />
              </a>

              <div className="border-t border-border pt-8 space-y-4">
                <h2 className="font-serif text-xl md:text-2xl font-light">Resolução Alternativa de Litígios</h2>
                <p>
                  Em caso de litígio de consumo, o consumidor pode recorrer a uma entidade de Resolução Alternativa de
                  Litígios de Consumo (RAL). A lista atualizada das entidades está disponível em{" "}
                  <a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener noreferrer" className="text-brand-red underline underline-offset-2">www.consumidor.gov.pt</a>.
                </p>
                <p>
                  Pode ainda utilizar a Plataforma Europeia de Resolução de Litígios em Linha (ODR):{" "}
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-brand-red underline underline-offset-2">ec.europa.eu/consumers/odr</a>.
                </p>
              </div>

              <div className="border-t border-border pt-8 space-y-2">
                <h2 className="font-serif text-xl md:text-2xl font-light">Contacto</h2>
                <p>Para esclarecimentos prévios, pode contactar-nos diretamente:</p>
                <p>
                  Abílio Marcos — <a href="mailto:marcos4011@gmail.com" className="text-brand-red underline underline-offset-2">marcos4011@gmail.com</a> · NIF 187556237
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ComplaintsPage;

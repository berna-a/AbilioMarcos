import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Section {
  number?: string;
  title: string;
  body: Array<
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "category"; label: string; title: string; paragraphs: string[] }
  >;
}

const sections: Section[] = [
  {
    number: "1",
    title: "O que são cookies",
    body: [
      {
        type: "p",
        text: "Cookies são pequenos ficheiros de texto armazenados no navegador ou dispositivo do utilizador quando visita um website.",
      },
      {
        type: "p",
        text: "Estes ficheiros permitem reconhecer o dispositivo do utilizador numa visita posterior, memorizar preferências, assegurar funcionalidades técnicas, melhorar a experiência de navegação e, em alguns casos, recolher informação estatística ou suportar ações de marketing digital.",
      },
    ],
  },
  {
    number: "2",
    title: "Para que servem os cookies",
    body: [
      { type: "p", text: "Os cookies podem ser utilizados para diferentes finalidades, incluindo:" },
      {
        type: "ul",
        items: [
          "assegurar o funcionamento técnico e seguro do website;",
          "memorizar preferências do utilizador;",
          "melhorar o desempenho e a experiência de navegação;",
          "recolher dados estatísticos sobre utilização do website;",
          "suportar funcionalidades de terceiros;",
          "permitir, quando aplicável e mediante consentimento, ações de medição, personalização ou marketing digital.",
        ],
      },
    ],
  },
  {
    number: "3",
    title: "Tipos de cookies utilizados",
    body: [
      { type: "p", text: "O website pode utilizar as seguintes categorias de cookies:" },
      {
        type: "category",
        label: "a)",
        title: "Cookies estritamente necessários",
        paragraphs: [
          "São cookies essenciais para o funcionamento do website e para a disponibilização de funcionalidades básicas, como navegação, segurança, gestão de sessão ou preferências essenciais.",
          "Sem estes cookies, o website poderá não funcionar corretamente.",
        ],
      },
      {
        type: "category",
        label: "b)",
        title: "Cookies funcionais ou de preferência",
        paragraphs: [
          "Permitem memorizar escolhas do utilizador, como idioma, preferências de navegação ou outras configurações que melhorem a experiência de utilização.",
        ],
      },
      {
        type: "category",
        label: "c)",
        title: "Cookies analíticos",
        paragraphs: [
          "Permitem recolher informação estatística sobre a forma como o website é utilizado, incluindo páginas visitadas, tempo de permanência, origem do tráfego, tipo de dispositivo e padrões gerais de navegação.",
          "Estes cookies ajudam a compreender o desempenho do website e a melhorá-lo continuamente.",
          "Sempre que legalmente exigido, estes cookies só serão utilizados após consentimento do utilizador.",
        ],
      },
      {
        type: "category",
        label: "d)",
        title: "Cookies de marketing",
        paragraphs: [
          "Podem ser utilizados para medir campanhas, criar audiências, personalizar comunicações ou suportar funcionalidades publicitárias em plataformas de terceiros.",
          "Sempre que legalmente exigido, estes cookies só serão utilizados após consentimento do utilizador.",
          "Caso estas ferramentas não estejam ativas num determinado momento, esta categoria poderá surgir apenas como estrutura de consentimento preparada para utilização futura.",
        ],
      },
    ],
  },
  {
    number: "4",
    title: "Cookies próprios e cookies de terceiros",
    body: [
      { type: "p", text: "Os cookies utilizados neste website podem ser:" },
      {
        type: "ul",
        items: [
          "cookies próprios, definidos diretamente pelo website;",
          "cookies de terceiros, definidos por serviços, plataformas ou funcionalidades externas integradas no website.",
        ],
      },
      { type: "p", text: "Esses terceiros podem incluir, por exemplo:" },
      {
        type: "ul",
        items: [
          "serviços de mapas;",
          "serviços de vídeo ou conteúdos incorporados;",
          "plataformas de análise estatística;",
          "plataformas de redes sociais;",
          "ferramentas de marketing e publicidade digital.",
        ],
      },
      {
        type: "p",
        text: "A utilização desses serviços pode implicar a aplicação das políticas de privacidade e cookies das respetivas entidades terceiras.",
      },
    ],
  },
  {
    number: "5",
    title: "Consentimento e gestão de preferências",
    body: [
      {
        type: "p",
        text: "Sempre que exigido por lei, o utilizador poderá escolher que categorias de cookies pretende aceitar ou rejeitar, através da plataforma de consentimento disponível no website.",
      },
      { type: "p", text: "O utilizador poderá, a qualquer momento:" },
      {
        type: "ul",
        items: [
          "aceitar cookies;",
          "rejeitar cookies não essenciais;",
          "alterar as suas preferências;",
          "retirar o consentimento anteriormente prestado.",
        ],
      },
      {
        type: "p",
        text: "A retirada do consentimento não compromete a licitude do tratamento efetuado até essa data.",
      },
    ],
  },
  {
    number: "6",
    title: "Como gerir cookies no navegador",
    body: [
      {
        type: "p",
        text: "Além das opções disponibilizadas no website, o utilizador pode também configurar o seu navegador para bloquear, permitir ou eliminar cookies.",
      },
      { type: "p", text: "A maioria dos navegadores permite:" },
      {
        type: "ul",
        items: [
          "visualizar os cookies armazenados;",
          "eliminar cookies individualmente ou em bloco;",
          "bloquear cookies de determinados websites;",
          "bloquear todos os cookies;",
          "apagar todos os cookies ao encerrar o navegador.",
        ],
      },
      {
        type: "p",
        text: "A desativação de cookies poderá afetar o funcionamento de determinadas funcionalidades do website.",
      },
    ],
  },
  {
    number: "7",
    title: "Ferramentas analíticas e publicitárias",
    body: [
      {
        type: "p",
        text: "Este website poderá, agora ou no futuro, recorrer a ferramentas de análise e marketing digital, sempre em conformidade com a legislação aplicável e, quando necessário, com base no consentimento do utilizador.",
      },
      {
        type: "p",
        text: "Essas ferramentas poderão incluir serviços de medição de desempenho, análise de tráfego, remarketing ou medição de campanhas.",
      },
      {
        type: "p",
        text: "Caso estejam ativas, a sua utilização deverá respeitar as preferências de cookies definidas pelo utilizador.",
      },
    ],
  },
  {
    number: "8",
    title: "Cookies e conteúdos de terceiros",
    body: [
      {
        type: "p",
        text: "Algumas funcionalidades ou conteúdos incorporados no website — como mapas, redes sociais, vídeos ou outros serviços externos — podem instalar cookies ou recorrer a tecnologias semelhantes.",
      },
      {
        type: "p",
        text: "O website de Abílio Marcos não controla integralmente os cookies utilizados por essas entidades terceiras, pelo que o utilizador deverá consultar as respetivas políticas de cookies e privacidade.",
      },
    ],
  },
  {
    number: "9",
    title: "Atualizações da Política de Cookies",
    body: [
      {
        type: "p",
        text: "A presente Política de Cookies poderá ser atualizada sempre que se revele necessário para refletir alterações legais, técnicas ou operacionais.",
      },
      { type: "p", text: "A versão mais recente estará sempre disponível neste website." },
    ],
  },
];

const CookiePolicy = () => {
  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-20 md:pb-32 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 mb-10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar ao Início
            </Link>

            {/* Header */}
            <header className="mb-14 md:mb-20">
              <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-5">
                Documento Legal
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mb-8">
                Política de Cookies
              </h1>
              <div className="w-12 h-px bg-foreground/30 mb-8" />
              <p className="text-base md:text-lg text-foreground/80 leading-[1.7] font-light">
                A presente Política de Cookies explica o que são cookies, como são utilizados no website
                de Abílio Marcos e de que forma o utilizador pode gerir as suas preferências.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-[1.7] mt-5 font-light">
                Ao continuar a navegar neste website, o utilizador poderá ser solicitado a aceitar,
                rejeitar ou configurar a utilização de determinadas categorias de cookies, nos termos
                legalmente aplicáveis.
              </p>
            </header>

            {/* Sections */}
            <article className="space-y-14 md:space-y-16">
              {sections.map((section) => (
                <section key={section.number} className="border-t border-border pt-10 md:pt-12">
                  <div className="flex items-baseline gap-4 mb-6">
                    {section.number && (
                      <span className="font-serif text-sm text-muted-foreground tabular-nums">
                        {section.number.padStart(2, "0")}
                      </span>
                    )}
                    <h2 className="font-serif text-xl md:text-2xl font-light leading-snug">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-5 md:pl-9">
                    {section.body.map((block, i) => {
                      if (block.type === "p") {
                        return (
                          <p
                            key={i}
                            className="text-[15px] text-foreground/80 leading-[1.85] font-light"
                          >
                            {block.text}
                          </p>
                        );
                      }
                      if (block.type === "ul") {
                        return (
                          <ul key={i} className="space-y-2.5">
                            {block.items.map((item, j) => (
                              <li
                                key={j}
                                className="text-[15px] text-foreground/80 leading-[1.75] font-light pl-5 relative"
                              >
                                <span className="absolute left-0 top-[0.7em] w-2 h-px bg-foreground/40" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      if (block.type === "category") {
                        return (
                          <div
                            key={i}
                            className="border-l border-border pl-5 py-1 space-y-3"
                          >
                            <div className="flex items-baseline gap-3">
                              <span className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
                                {block.label}
                              </span>
                              <h3 className="font-serif text-[17px] md:text-lg font-light text-foreground/90">
                                {block.title}
                              </h3>
                            </div>
                            {block.paragraphs.map((p, k) => (
                              <p
                                key={k}
                                className="text-[15px] text-foreground/80 leading-[1.85] font-light"
                              >
                                {p}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </section>
              ))}
            </article>

            {/* Footer note */}
            <div className="border-t border-border mt-16 pt-8">
              <p className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
                Última atualização: [INSERIR DATA FINAL]
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CookiePolicy;

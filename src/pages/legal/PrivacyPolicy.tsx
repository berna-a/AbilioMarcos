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
    | { type: "kv"; items: Array<{ label: string; value: string; note?: string }> }
  >;
}

const sections: Section[] = [
  {
    number: "1",
    title: "Responsável pelo Tratamento dos Dados",
    body: [
      {
        type: "kv",
        items: [
          { label: "Nome", value: "Abílio António Roussado Marcos" },
          { label: "NIF", value: "[CONFIRMAR — o número indicado anteriormente parece incompleto]" },
          { label: "Endereço", value: "Rua dos Serrados, 32 A – Maceira, 2715-654 Montelavar" },
          { label: "Email", value: "marcos4011@gmail.com" },
        ],
      },
      {
        type: "p",
        text: "Caso esta morada não seja a correta para efeitos legais/fiscais do website, deve ser substituída pela morada final a apresentar.",
      },
    ],
  },
  {
    number: "2",
    title: "Dados Pessoais Recolhidos",
    body: [
      {
        type: "p",
        text: "Este website pode recolher dados pessoais através de formulários preenchidos voluntariamente pelo utilizador, nomeadamente:",
      },
      {
        type: "ul",
        items: [
          "nome",
          "endereço de email",
          "número de telefone",
          "assunto da mensagem",
          "conteúdo da mensagem",
          "nome da empresa, quando aplicável",
        ],
      },
      { type: "p", text: "Poderão ainda ser recolhidos dados técnicos e de utilização, incluindo:" },
      {
        type: "ul",
        items: [
          "endereço IP",
          "tipo de dispositivo",
          "navegador",
          "idioma",
          "páginas visitadas",
          "origem da visita",
          "dados de interação com o website",
          "informações recolhidas através de cookies ou tecnologias semelhantes",
        ],
      },
      {
        type: "p",
        text: "No caso de subscrição da newsletter ou lista de colecionadores, poderão ser recolhidos os dados estritamente necessários para esse efeito, como o endereço de email.",
      },
    ],
  },
  {
    number: "3",
    title: "Finalidade do Tratamento",
    body: [
      { type: "p", text: "Os dados pessoais recolhidos são tratados para as seguintes finalidades:" },
      {
        type: "ul",
        items: [
          "responder a pedidos de contacto, aquisição de obras, encomendas, exposições, imprensa ou outros assuntos enviados pelo utilizador;",
          "enviar informações solicitadas pelo utilizador;",
          "gerir pedidos relacionados com obras de arte, disponibilidade, aquisições e acompanhamento comercial;",
          "enviar comunicações futuras, incluindo novidades, conteúdos editoriais, atualizações sobre obras e informações relacionadas com a atividade artística, quando exista consentimento para tal;",
          "assegurar o funcionamento técnico, a segurança e a melhoria contínua do website;",
          "cumprir obrigações legais e regulamentares aplicáveis.",
        ],
      },
      {
        type: "p",
        text: "Os dados recolhidos devem ser adequados, pertinentes e limitados ao que é necessário para as finalidades acima descritas.",
      },
    ],
  },
  {
    number: "4",
    title: "Fundamento de Licitude",
    body: [
      {
        type: "p",
        text: "O tratamento dos dados pessoais é efetuado com base em pelo menos um dos seguintes fundamentos:",
      },
      {
        type: "ul",
        items: [
          "consentimento do titular dos dados;",
          "diligências pré-contratuais ou execução de pedido do titular;",
          "cumprimento de obrigação jurídica;",
          "interesse legítimo do responsável pelo tratamento, designadamente para segurança, gestão do website e melhoria dos serviços, desde que não prevaleçam os direitos, liberdades e garantias do titular.",
        ],
      },
      {
        type: "p",
        text: "Sempre que o tratamento dependa do consentimento, o titular pode retirá-lo a qualquer momento, sem comprometer a licitude do tratamento efetuado até essa data.",
      },
    ],
  },
  {
    number: "5",
    title: "Conservação dos Dados",
    body: [
      {
        type: "p",
        text: "Os dados pessoais serão conservados apenas durante o período necessário para cumprir as finalidades que motivaram a sua recolha, sem prejuízo dos prazos legais aplicáveis.",
      },
      { type: "p", text: "Em regra:" },
      {
        type: "ul",
        items: [
          "dados enviados por formulários de contacto serão conservados pelo período necessário ao tratamento do pedido e ao eventual acompanhamento da relação;",
          "dados utilizados para comunicações futuras serão conservados até que o titular retire o consentimento ou solicite a sua eliminação;",
          "dados relacionados com obrigações legais, fiscais, contabilísticas ou contratuais poderão ser conservados pelo prazo legalmente exigido.",
        ],
      },
    ],
  },
  {
    number: "6",
    title: "Direitos do Titular dos Dados",
    body: [
      {
        type: "p",
        text: "Nos termos da legislação aplicável, o titular dos dados pode, a qualquer momento, exercer os seguintes direitos:",
      },
      {
        type: "ul",
        items: [
          "direito de acesso;",
          "direito de retificação;",
          "direito de apagamento;",
          "direito de limitação do tratamento;",
          "direito de oposição;",
          "direito de portabilidade, quando aplicável;",
          "direito de retirar o consentimento, quando o tratamento se baseie nesse fundamento;",
          "direito de apresentar reclamação junto da autoridade de controlo competente.",
        ],
      },
      {
        type: "p",
        text: "Para exercer qualquer destes direitos, o titular deverá contactar o responsável pelo tratamento através do email: marcos4011@gmail.com",
      },
      { type: "p", text: "O pedido deve identificar claramente o titular e indicar o direito que pretende exercer." },
    ],
  },
  {
    number: "7",
    title: "Segurança dos Dados",
    body: [
      {
        type: "p",
        text: "São adotadas medidas técnicas e organizativas adequadas para proteger os dados pessoais contra:",
      },
      {
        type: "ul",
        items: [
          "destruição, perda ou alteração acidental ou ilícita;",
          "divulgação ou acesso não autorizado;",
          "qualquer outra forma de tratamento ilícito.",
        ],
      },
      {
        type: "p",
        text: "O acesso aos dados é limitado às pessoas ou entidades que deles necessitem para as finalidades legítimas acima identificadas e que estejam sujeitas a deveres de confidencialidade.",
      },
    ],
  },
  {
    number: "8",
    title: "Comunicação de Dados a Terceiros",
    body: [
      { type: "p", text: "Os dados pessoais não são vendidos nem cedidos a terceiros para fins comerciais." },
      {
        type: "p",
        text: "No entanto, poderão ser comunicados a entidades terceiras que prestem serviços necessários ao funcionamento do website ou à atividade do responsável pelo tratamento, tais como:",
      },
      {
        type: "ul",
        items: [
          "serviços de alojamento e infraestrutura digital;",
          "plataformas de gestão de base de dados e formulários;",
          "serviços de email;",
          "serviços de análise estatística e desempenho do website;",
          "serviços de pagamento, quando aplicável;",
          "prestadores tecnológicos ou subcontratantes que atuem em nome do responsável pelo tratamento.",
        ],
      },
      {
        type: "p",
        text: "Sempre que tal ocorra, serão adotadas as medidas adequadas para assegurar que essas entidades oferecem garantias suficientes de proteção de dados e tratam os dados apenas de acordo com as instruções recebidas e nos termos legais aplicáveis.",
      },
    ],
  },
  {
    number: "9",
    title: "Websites e Serviços de Terceiros",
    body: [
      {
        type: "p",
        text: "O website pode conter ligações para websites, plataformas ou serviços de terceiros, incluindo redes sociais, mapas e serviços externos.",
      },
      {
        type: "p",
        text: "A presente Política de Privacidade não se aplica a esses websites ou serviços de terceiros. O utilizador deverá consultar as respetivas políticas de privacidade antes de fornecer quaisquer dados pessoais nesses contextos.",
      },
    ],
  },
  {
    number: "10",
    title: "Cookies",
    body: [
      {
        type: "p",
        text: "Este website utiliza cookies e tecnologias semelhantes para assegurar o seu funcionamento, melhorar a experiência de navegação e, quando aplicável, recolher dados estatísticos ou suportar funcionalidades adicionais.",
      },
      { type: "p", text: "Os cookies utilizados podem incluir, por exemplo:" },
      {
        type: "ul",
        items: [
          "cookies estritamente necessários, essenciais ao funcionamento do website;",
          "cookies funcionais ou de preferências, para memorizar escolhas do utilizador;",
          "cookies analíticos, para medir o desempenho e utilização do website;",
          "cookies de marketing, caso venham a ser utilizados serviços como plataformas publicitárias ou pixels de remarketing.",
        ],
      },
      {
        type: "p",
        text: "Sempre que legalmente exigido, os cookies não essenciais só serão utilizados após consentimento do utilizador, através da respetiva plataforma de gestão de consentimento.",
      },
      {
        type: "p",
        text: "O utilizador pode, a qualquer momento, alterar as suas preferências de cookies ou eliminar cookies através das definições do seu navegador.",
      },
    ],
  },
  {
    number: "11",
    title: "Ferramentas de Estatística e Marketing",
    body: [
      {
        type: "p",
        text: "Este website poderá utilizar ferramentas de análise estatística e desempenho, bem como integrações de marketing digital, sempre em conformidade com a legislação aplicável e, quando necessário, com base no consentimento do utilizador.",
      },
      {
        type: "p",
        text: "Caso estejam ativas, essas ferramentas poderão recolher informação agregada ou pseudonimizada sobre a utilização do website, nomeadamente páginas visitadas, origem do tráfego, tipo de dispositivo e interações efetuadas.",
      },
    ],
  },
  {
    number: "12",
    title: "Menores",
    body: [
      {
        type: "p",
        text: "Este website não se destina especificamente a menores e não recolhe intencionalmente dados pessoais de menores sem o devido enquadramento legal ou autorização de quem exerça as responsabilidades parentais, quando aplicável.",
      },
    ],
  },
  {
    number: "13",
    title: "Alterações à Política de Privacidade",
    body: [
      {
        type: "p",
        text: "O responsável pelo tratamento pode atualizar esta Política de Privacidade a qualquer momento, sempre que tal se revele necessário para refletir alterações legais, técnicas ou operacionais.",
      },
      { type: "p", text: "A versão mais recente estará sempre disponível neste website." },
    ],
  },
];

const PrivacyPolicy = () => {
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
                Política de Privacidade
              </h1>
              <div className="w-12 h-px bg-foreground/30 mb-8" />
              <p className="text-base md:text-lg text-foreground/80 leading-[1.7] font-light">
                A presente Política de Privacidade explica como são recolhidos, utilizados, conservados e
                protegidos os dados pessoais dos utilizadores do website de Abílio Marcos.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-[1.7] mt-5 font-light">
                Ao utilizar este website, o utilizador declara ter lido, compreendido e aceite os termos
                desta Política de Privacidade.
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
                      if (block.type === "kv") {
                        return (
                          <dl key={i} className="space-y-3 py-2">
                            {block.items.map((item, j) => (
                              <div
                                key={j}
                                className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-6"
                              >
                                <dt className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground pt-1">
                                  {item.label}
                                </dt>
                                <dd className="text-[15px] text-foreground/85 leading-[1.7] font-light">
                                  {item.value}
                                </dd>
                              </div>
                            ))}
                          </dl>
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

export default PrivacyPolicy;

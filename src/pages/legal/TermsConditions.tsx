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
    number: "0",
    title: "Preâmbulo",
    body: [
      {
        type: "p",
        text: "Os presentes Termos e Condições regulam o acesso, navegação e utilização do website de Abílio Marcos, bem como as compras de obras realizadas através do mesmo.",
      },
      { type: "p", text: "O website é operado por:" },
      {
        type: "kv",
        items: [
          { label: "Nome", value: "Abílio António Roussado Marcos" },
          { label: "NIF", value: "[CONFIRMAR — o número indicado anteriormente parece incompleto]" },
          { label: "Morada", value: "Rua dos Serrados, 32 A – Maceira, 2715-654 Montelavar" },
          { label: "Email", value: "marcos4011@gmail.com" },
          { label: "Website", value: "https://abiliomarcos.com" },
        ],
      },
      {
        type: "p",
        text: "Sempre que utilize este website ou efetue uma compra através do mesmo, o utilizador declara ter lido, compreendido e aceite os presentes Termos e Condições.",
      },
    ],
  },
  {
    number: "1",
    title: "Objeto e âmbito",
    body: [
      { type: "p", text: "Os presentes Termos e Condições regulam:" },
      {
        type: "ul",
        items: [
          "a navegação no website;",
          "a apresentação e disponibilização de obras de arte;",
          "os pedidos de informação e contacto;",
          "as compras realizadas através do checkout online;",
          "as condições de pagamento, envio, devolução e reclamação.",
        ],
      },
      {
        type: "p",
        text: "Estes Termos e Condições aplicam-se a todas as relações estabelecidas entre o titular do website e qualquer utilizador ou comprador.",
      },
    ],
  },
  {
    number: "2",
    title: "Produtos e informações disponibilizadas",
    body: [
      {
        type: "p",
        text: "O website apresenta obras de arte originais de Abílio Marcos, podendo algumas obras estar disponíveis para compra direta online e outras apenas mediante pedido de informação.",
      },
      {
        type: "p",
        text: "Cada obra é apresentada com a informação que se considere relevante, podendo incluir, entre outros elementos:",
      },
      {
        type: "ul",
        items: ["título;", "técnica;", "dimensões;", "disponibilidade;", "preço;", "imagens ilustrativas."],
      },
      {
        type: "p",
        text: "Sendo as obras bens artísticos e visuais, o utilizador reconhece que poderão existir pequenas diferenças de perceção de cor, textura, escala ou detalhe em função do dispositivo utilizado, da resolução do ecrã ou das condições de visualização.",
      },
    ],
  },
  {
    number: "3",
    title: "Processo de compra",
    body: [
      {
        type: "p",
        text: "A compra de uma obra disponível para aquisição online é efetuada através do processo de checkout disponibilizado no website.",
      },
      { type: "p", text: "Para concluir uma compra, o comprador deverá:" },
      {
        type: "ul",
        items: [
          "selecionar a obra pretendida, quando disponível para compra direta;",
          "fornecer os dados necessários à tramitação da encomenda;",
          "confirmar a compra e efetuar o pagamento através dos meios disponibilizados no checkout.",
        ],
      },
      {
        type: "p",
        text: "No caso de obras apresentadas apenas mediante contacto, o envio de um pedido de informação não constitui, por si só, uma encomenda nem uma obrigação de venda.",
      },
      {
        type: "p",
        text: "A encomenda só se considera concluída após confirmação do pagamento e aceitação da operação pelo sistema aplicável.",
      },
    ],
  },
  {
    number: "4",
    title: "Disponibilidade das obras",
    body: [
      { type: "p", text: "As obras disponibilizadas no website podem corresponder a peças únicas." },
      {
        type: "p",
        text: "Por esse motivo, a disponibilidade de cada obra está sempre sujeita a confirmação efetiva no momento da compra ou validação da encomenda.",
      },
      {
        type: "p",
        text: "Se, por motivo excecional, uma obra adquirida se encontrar indisponível, o comprador será informado com a maior brevidade possível, sendo-lhe proposto, consoante o caso:",
      },
      {
        type: "ul",
        items: [
          "o reembolso integral do montante pago; ou",
          "outra solução acordada entre as partes, quando aplicável.",
        ],
      },
    ],
  },
  {
    number: "5",
    title: "Preços",
    body: [
      { type: "p", text: "Os preços apresentados no website são indicados em euros." },
      {
        type: "p",
        text: "Salvo indicação expressa em contrário, os preços apresentados correspondem ao valor de venda da obra, não incluindo necessariamente custos adicionais de envio, acondicionamento especial, seguro, taxas alfandegárias ou outros encargos que sejam aplicáveis em função do destino.",
      },
      {
        type: "p",
        text: "Sempre que existam custos adicionais, os mesmos devem ser apresentados ao comprador antes da confirmação final da compra, na medida em que sejam determináveis nesse momento.",
      },
      {
        type: "p",
        text: "O titular do website reserva-se o direito de alterar preços ou informações comerciais a qualquer momento, sem prejuízo das encomendas já validamente concluídas.",
      },
    ],
  },
  {
    number: "6",
    title: "Pagamento",
    body: [
      {
        type: "p",
        text: "O pagamento das compras realizadas online é efetuado através do sistema de checkout disponibilizado no website, podendo os meios de pagamento disponíveis variar consoante o país, a configuração da plataforma de pagamento ou outros fatores técnicos.",
      },
      {
        type: "p",
        text: "Os pagamentos poderão ser processados por prestadores de serviços de pagamento terceiros, designadamente a plataforma de checkout utilizada no website.",
      },
      {
        type: "p",
        text: "O comprador garante que os dados fornecidos para efeitos de pagamento são verdadeiros, completos e legítimos.",
      },
    ],
  },
  {
    number: "7",
    title: "Faturação",
    body: [
      {
        type: "p",
        text: "A faturação será emitida com base nos dados fornecidos pelo comprador no momento da compra.",
      },
      {
        type: "p",
        text: "O comprador é responsável pela exatidão, completude e atualização dos dados de faturação comunicados.",
      },
      {
        type: "p",
        text: "Depois de emitido o documento fiscal, eventuais alterações ficarão sempre dependentes da possibilidade legal e fiscal aplicável.",
      },
    ],
  },
  {
    number: "8",
    title: "Entrega e envio",
    body: [
      {
        type: "p",
        text: "As entregas são efetuadas por transportadora ou operador logístico adequado ao destino da encomenda.",
      },
      {
        type: "p",
        text: "O website realiza envios para Portugal, Europa e outros destinos internacionais, sujeito a confirmação de viabilidade logística.",
      },
      {
        type: "p",
        text: "Os prazos de envio são meramente indicativos e poderão variar em função da obra, do destino, da transportadora, de formalidades aduaneiras ou de circunstâncias alheias ao titular do website.",
      },
      { type: "p", text: "Em regra, os prazos de referência são:" },
      {
        type: "ul",
        items: ["Portugal: até 1 semana;", "Europa: até 2 semanas;", "resto do mundo: até 3 semanas."],
      },
      {
        type: "p",
        text: "Em envios internacionais para fora da União Europeia, poderão ser devidos impostos, direitos aduaneiros ou outros encargos locais, que serão da responsabilidade do comprador, salvo indicação expressa em contrário.",
      },
    ],
  },
  {
    number: "9",
    title: "Direito de livre resolução",
    body: [
      {
        type: "p",
        text: "Quando aplicável nos termos da lei portuguesa sobre contratos celebrados à distância, o consumidor dispõe do direito de livre resolução no prazo de 14 dias de calendário, sem necessidade de indicar motivo.",
      },
      {
        type: "p",
        text: "O prazo conta-se, em regra, a partir do dia em que o consumidor, ou terceiro por si indicado que não seja o transportador, adquira a posse física do bem.",
      },
      {
        type: "p",
        text: "Para exercer esse direito, o consumidor deverá comunicar de forma inequívoca a sua decisão ao titular do website, através do email indicado no preâmbulo ou por outro meio escrito suscetível de prova.",
      },
      {
        type: "p",
        text: "Em caso de livre resolução válida, serão reembolsados os montantes pagos pelo consumidor, sem demora injustificada, podendo o reembolso ser diferido até receção do bem devolvido ou até prova bastante da sua devolução, consoante o que ocorrer primeiro.",
      },
      {
        type: "p",
        text: "Salvo quando a lei imponha solução diferente ou quando a devolução resulte de erro, dano ou falta de conformidade imputável ao vendedor, os custos diretos da devolução ficam a cargo do consumidor.",
      },
    ],
  },
  {
    number: "10",
    title: "Exceções ao direito de livre resolução",
    body: [
      {
        type: "p",
        text: "O direito de livre resolução não se aplica, entre outros casos legalmente previstos, a bens manifestamente personalizados ou produzidos de acordo com especificações do consumidor.",
      },
      {
        type: "p",
        text: "Assim, trabalhos realizados por encomenda específica, personalizados ou desenvolvidos segundo instruções particulares do cliente poderão ficar excluídos do direito de livre resolução, nos termos legais aplicáveis.",
      },
    ],
  },
  {
    number: "11",
    title: "Devoluções, danos e não conformidade",
    body: [
      {
        type: "p",
        text: "Sem prejuízo do direito de livre resolução quando aplicável, o comprador poderá contactar o titular do website em caso de:",
      },
      {
        type: "ul",
        items: [
          "dano de transporte;",
          "receção de obra incorreta;",
          "falta de conformidade;",
          "outro problema relacionado com a encomenda.",
        ],
      },
      {
        type: "p",
        text: "No caso de obras originais e únicas, uma troca por peça igual pode não ser possível, pelo que a solução adequada poderá consistir, consoante o caso, em:",
      },
      {
        type: "ul",
        items: [
          "reparação ou resolução prática do problema;",
          "substituição, quando possível;",
          "redução adequada do preço;",
          "reembolso, quando legalmente devido.",
        ],
      },
      {
        type: "p",
        text: "Recomenda-se que o comprador verifique a encomenda no momento da receção e comunique qualquer anomalia logo que possível, idealmente com registo fotográfico do estado da embalagem e da obra.",
      },
      {
        type: "p",
        text: "Os direitos legais do consumidor relativos à falta de conformidade dos bens mantêm-se nos termos da legislação aplicável.",
      },
    ],
  },
  {
    number: "12",
    title: "Propriedade intelectual",
    body: [
      {
        type: "p",
        text: "Todos os conteúdos do website, incluindo textos, imagens, fotografias, vídeos, design, grafismo, logótipos e demais elementos, estão protegidos por direitos de autor e/ou outros direitos de propriedade intelectual.",
      },
      {
        type: "p",
        text: "Salvo autorização escrita do respetivo titular, não é permitida a reprodução, distribuição, modificação, utilização comercial ou qualquer outra forma de exploração dos conteúdos do website.",
      },
      {
        type: "p",
        text: "A compra de uma obra não implica a transmissão dos direitos de autor sobre a mesma, salvo acordo escrito em contrário.",
      },
    ],
  },
  {
    number: "13",
    title: "Privacidade e cookies",
    body: [
      {
        type: "p",
        text: "O tratamento de dados pessoais é efetuado nos termos da Política de Privacidade e da Política de Cookies disponibilizadas no website.",
      },
      {
        type: "p",
        text: "A utilização do website pode implicar a recolha e tratamento de dados pessoais e a utilização de cookies, nos termos aí descritos.",
      },
    ],
  },
  {
    number: "14",
    title: "Reclamações e resolução de litígios",
    body: [
      {
        type: "p",
        text: "O utilizador pode apresentar reclamação através do Livro de Reclamações Eletrónico e pode igualmente recorrer às entidades de Resolução Alternativa de Litígios de Consumo competentes, nos termos da legislação aplicável.",
      },
      {
        type: "p",
        text: "As informações complementares sobre estes mecanismos podem ser disponibilizadas em secções próprias do website.",
      },
    ],
  },
  {
    number: "15",
    title: "Alterações aos Termos e Condições",
    body: [
      {
        type: "p",
        text: "O titular do website reserva-se o direito de atualizar ou modificar os presentes Termos e Condições a qualquer momento.",
      },
      {
        type: "p",
        text: "A versão mais recente estará sempre disponível no website e será aplicável a partir da sua publicação, sem prejuízo dos direitos já adquiridos pelos utilizadores relativamente a compras anteriormente concluídas.",
      },
    ],
  },
  {
    number: "16",
    title: "Lei aplicável",
    body: [
      { type: "p", text: "Os presentes Termos e Condições regem-se pela lei portuguesa." },
      {
        type: "p",
        text: "Sem prejuízo das normas imperativas de proteção do consumidor e dos mecanismos de resolução alternativa de litígios legalmente previstos, qualquer litígio será apreciado nos termos da lei aplicável.",
      },
    ],
  },
];

const TermsConditions = () => {
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
                Termos e Condições
              </h1>
              <div className="w-12 h-px bg-foreground/30 mb-8" />
              <p className="text-base md:text-lg text-foreground/80 leading-[1.7] font-light">
                Os presentes Termos e Condições regulam o acesso, a navegação e a utilização do website
                de Abílio Marcos, bem como as aquisições de obras realizadas através do mesmo.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-[1.7] mt-5 font-light">
                Ao utilizar este website ou efetuar uma compra através do mesmo, o utilizador declara ter
                lido, compreendido e aceite os presentes Termos e Condições.
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
                                <dd className="text-[15px] text-foreground/85 leading-[1.7] font-light break-words">
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

export default TermsConditions;

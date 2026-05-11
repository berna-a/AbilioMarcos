-- ============================================================
-- About page editable content
-- Apply manually in Supabase SQL Editor (project hbrvappgklorjxojyvqz)
-- ============================================================

create table if not exists public.about_content (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  title text not null,
  content text not null default '',
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists about_content_display_order_idx
  on public.about_content (display_order);

alter table public.about_content enable row level security;

drop policy if exists "Public can read about content" on public.about_content;
create policy "Public can read about content"
  on public.about_content for select
  using (true);

drop policy if exists "Authenticated can manage about content" on public.about_content;
create policy "Authenticated can manage about content"
  on public.about_content for all
  to authenticated
  using (true)
  with check (true);

create or replace function public.about_content_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists about_content_updated_at on public.about_content;
create trigger about_content_updated_at
  before update on public.about_content
  for each row execute function public.about_content_set_updated_at();

-- ============================================================
-- Seed initial content (idempotent: only inserts if table empty)
-- ============================================================
insert into public.about_content (section, title, content, display_order)
select * from (values
  ('biografia', 'Biografia',
'Natural de Sintra, Abílio Marcos pertence a uma geração de pintores portugueses que escolheu a abstracção como linguagem de rigor — e como forma de aproximar a pintura daquilo que, na vida, não pode ser dito de outro modo.

Desde criança revelou um talento natural para o desenho. Viveu em França entre os quatro e os catorze anos, num período em que um vizinho ilustrador de banda desenhada o reconheceu e o encorajou no caminho artístico — gesto que marcou, com discrição, toda a sua vida posterior.

O regresso a Portugal e, mais tarde, uma estadia nos Estados Unidos entre 2001 e 2003, ampliaram-lhe a sensibilidade visual e cultural. Destas experiências resulta uma prática atenta tanto à tradição europeia da pintura como à liberdade material das linguagens contemporâneas.

No início dos anos noventa, a pintura passou a ocupar o centro do seu trabalho. Desde então, tem desenvolvido uma obra coerente, marcada pela continuidade do atelier, pelo cuidado com a matéria e pela construção lenta de cada superfície — sem cedências ao efeito ou à moda.

Vive e trabalha em Portugal, onde mantém um atelier ativo. A pintura, para Marcos, permanece um exercício de presença: uma forma exigente de olhar, de demorar, de pertencer.', 10),

  ('pratica', 'A Obra',
'A pintura de Abílio Marcos move-se entre o gesto e a contenção. Cada quadro é construído por camadas sucessivas — aplicações, raspagens, retornos — até que a superfície adquire a espessura do tempo. A cor, densa e modulada, alterna entre a luz e a sombra, entre o silêncio e a vibração.

Sob a aparente abstracção habitam significados latentes. Símbolos pessoais, memórias, ressonâncias afectivas — nada se diz de forma literal, mas tudo permanece presente.

A matéria não é cenário: é pensamento. O empaste, a transparência, o sulco e o vazio constroem uma gramática própria, em que pintar e ver se confundem.

Trabalha sobretudo em grande formato e em séries, deixando que cada conjunto encontre o seu próprio ritmo — uma prática rara num tempo de pressa, mais próxima da meditação do que da produção.', 20),

  ('exposicoes_individuais', 'Exposições Individuais',
'2019 — Galeria do IGAS, Lisboa
2018 — Casual Lounge, «O Universo das formas e das cores», Lisboa
2016 — Galeria Beltrão Coelho, «Reflexos de luz», Lisboa
2015 — Galeria Kearte, Lisboa · Galeria Traço, Lisboa · Galeria M. Castelo de Pires, «A balada das cores», Loures
2014 — ARTEION SDR, Paris · CRÉDIT AGRICOLE S.A., Guyancourt · GROUPE BPI, Paris · LCL Garonne, Le Kremlin-Bicêtre · UNEO, Montrouge · IMCD France, Plaine Saint Denis
2013 — VEOLIA, Saint Denis · CUBIKS, Paris · EXL GROUP II, Paris · PACIFICA 2, Paris · LE BEARN RIE, Vanves · Amgen Mktg, Neuilly-sur-Seine · CATLIN França, Paris
2012 — Amgen Dept Med, Neuilly-sur-Seine · Galeria de Arte da Casa da Mutualidade, «Para além do sonho», Coimbra · CRÉDIT AGRICOLE Procession, Paris · Conselho Distrital da Ordem dos Advogados, «20 anos de criatividade», Lisboa · GRANT ALEXANDER, Paris · GARTNER France, Paris La Défense
2011 — Sambrinvest, Gosselies · Amgen, Neuilly-sur-Seine · GILEAD, Paris · Galeria de Arte do Picoas Plaza, Lisboa · Galeria Vieira Portuense, «A viagem das cores», Porto · MSD France, Courbevoie
2010 — CURTIS, MALLET-PREVOST, COLT & MOSLE, Paris · Dechert LLP, Bruxelas · Galeria Sílvia Soares, «Contemplações múltiplas», Vila Nova de Gaia · Willkie Farr & Gallagher, Bruxelas · Galeria Actual, «Simbolismo da cor», Lisboa
2009 — Puilaetco Bank, Gent · Taurus IN.V., Antwerpia · Galeria Saramy Arte, «Ondas de cor», Porto · Hospital da Luz, «Momentos de Cor», Lisboa · Amgen, Neuilly-sur-Seine · NOVO NORDISK, Paris La Défense · Marina Cruz, Lisboa
2008 — Espaço AmArte, Lisboa · Hospital Amadora-Sintra, «Momentos de cor» · Galeria do Posto de Turismo da Moita · ClubHouse Vila Sol Hotel, Vilamoura · Sara Lee, Grimbergen · SG Private Banking, Kortrijk
2005 — Galeria Fitares, Sintra · Galeria de Santa Rita, Colares, «Do imaginário» · Espaço AmArte, «Os caminhos da vida», Lisboa
2004 — GestArte Art Gallery, Lisboa · Galeria Aquárius, Guarda
2003 — Nona Gallery, West Hartford, EUA · International Art Promotion, Barcelona, Espanha
2002 — Fleet Bank, West Hartford, EUA
2001 — Belizarte, «Jogos de imagens», Lisboa · Goulé Arte, Ericeira
2000 — CASM, Miratejo · Galeria Cubismo, Tapada das Mercês · Galeria Pó d''Ouro, Lisboa · Galeria do IPJ Parque EXPO, Lisboa
1999 — Hotel Sheraton, Lisboa · Clubar, Lisboa · Atelier Anit, Coimbra · Galeria Vincent C. C. Colombo, Lisboa · Galeria M. Arruda dos Vinhos · Galeria da J. F. Agualva Cacém
1998 — Galeria Alexander, Caldas da Rainha · Galeria Arte Sã, Verdizela · Atelier Anit, Coimbra · Inventory Café C. C. Colombo, Lisboa · J. F. Algueirão, Mem Martins · Exposalão «Arte 98», Batalha', 30),

  ('exposicoes_colectivas', 'Exposições Colectivas',
'2022 — Galerias São Rafael, Artbox, Centro Comercial Colombo, Lisboa
2009 — Óscar''s Arte Contemporânea, Lisboa · Galeria Vieira Portuense, Porto · Hospital Garcia de Orta, Almada · Galerias São Rafael, Artbox, Lisboa
2008 — Galeria da Caixa de Crédito Agrícola, Lisboa
2007 — Hospital Amadora-Sintra
2006 — Espaço Groupama Arte, Lisboa · Galeria da Ordem dos Advogados, Setúbal · Galeria da DGAJ, Lisboa · Galeria Almedina, Coimbra
2005 — Galeria Estado das Artes, Torres Vedras · Galeria Alexandre Mateus, Lisboa · Galeria Hexalfa, Lisboa · Galeria Escudero, Lisboa · GestArte Art Gallery, Lisboa
2004 — Galeria Capitel, Leiria · Paço da Cultura, «Arte de mãos dadas», Guarda · 1ª Exposição Internacional de Artes Plásticas de Sesimbra · Galeria Exclusive, Carnaxide · Galeria Linhares, Lisboa · Galeria Espacio Trés, Málaga, Espanha
2003 — World Fine Art Gallery, Nova Iorque, EUA · Artes & Artes Galeria de Arte, Lisboa · Galeria Espaço d''Arte, Praia de S. Lourenço · Galeria Titara, Sobreiro, Mafra
2002 — Galeria Capitel, Leiria · Signature Gallery, West Hartford, EUA · Gallery on the Green, Canton, EUA
2001 — Goulé Arte, Ericeira · Belizarte, Lisboa
2000 — Galeria Maré d''Arte, Carvoeiro · «Inverno Cultural», CascaiShopping · Casa da Cultura D. Pedro V, Mafra · MAC 21 Feira Internacional de Arte Contemporânea, Marbella, Espanha · LCR Galeria de Arte, Sintra
1999 — Galeria da Biblioteca M. de Pombal · Galeria M. Ma Cristina Correia, Azambuja · Taguspark, Oeiras · ART 21 MGM GRAND CASINO, Las Vegas, EUA · Centro Cultural de Belém, Lisboa · Palácio Foz, Lisboa · Palácio Gorjão, Bombarral
1998 — Clube VilaFranquense · Casa da Cultura Jaime Lobo e Silva, Ericeira · Piramidal, Sintra · Galeria Tabu, Torres Vedras · Galeria Roca, Marinha Grande · Celeiro da Patriarcal, Vila Franca de Xira · Galeria Goulé Arte, Sintra
1997 — Galeria Boutique du Gourmet, Alenquer · Galeria Arte Sã, Verdizela · Exposalão «Arte 97», Batalha · Fórum Cultural da Chasa, Alverca
1996 — «Arte Jovem», Vila Franca de Xira · Grande Mostra de Pintura, Viseu · J.C.P. Pavilhão Carlos Lopes, Lisboa
1995 — Galeria l''Acropole Rouge, Amadora · Criativiarte 95, Reguengos de Monsaraz · Galeria M. Amadora, «Os Jovens e a Arte» · S.N.B.A., Lisboa · Jov''Arte, Loures
1994 — Galeria M. Amadora, «Os Jovens e a Arte» · S.N.B.A., Lisboa
1993 — Galeria M. Amadora, «Os Jovens e a Arte» · V Feira d''Arte, Caldas da Rainha
1992 — IV Feira d''Arte, Caldas da Rainha · Espaço Cultural do CascaiShopping', 40),

  ('representacao', 'Representação',
'Museus
Obras em acervos museológicos e instituições culturais portuguesas, integrando colecções de referência da pintura contemporânea nacional.

Acervos Municipais
Representação em colecções de câmaras municipais de várias regiões do país, sobretudo na zona oeste e na linha de Sintra.

Juntas de Freguesia
Presença em acervos de juntas de freguesia, reflectindo uma ligação próxima ao território e à comunidade.

Colecções Privadas
Centenas de obras em colecções particulares portuguesas e internacionais, em Portugal, Espanha, França, Bélgica e Estados Unidos.', 50)
) as v(section, title, content, display_order)
where not exists (select 1 from public.about_content);

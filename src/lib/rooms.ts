/**
 * Cenas de "Ver na parede" — fotos de interiores premium onde a obra é
 * sobreposta à escala real. Calibração por sala:
 *  - wallWidthCm: largura real (cm) representada pela largura total da foto.
 *  - centerXPct / centerYPct: centro do quadro (% da foto).
 *  - pt: salas portuguesas (a 1.ª foto de cada obra é sempre uma destas).
 *
 * Fotos 3:2 (1536×1024), câmara de frente. Obra W×H cm → larguraQuadro% = W / wallWidthCm * 100.
 */
export interface RoomScene {
  id: string;
  src: string;
  label: string;
  wallWidthCm: number;
  centerXPct: number;
  centerYPct: number;
  /** Casa portuguesa — usada como 1.ª foto. */
  pt?: boolean;
}

export const ROOM_SCENES: RoomScene[] = [
  // 🇵🇹 Portuguesas
  { id: "sala-costeira",   src: "/rooms/sala-costeira.jpg",   label: "Sala costeira",       wallWidthCm: 440, centerXPct: 42, centerYPct: 36, pt: true },
  { id: "sala-campo",      src: "/rooms/sala-campo.jpg",      label: "Casa de campo",       wallWidthCm: 470, centerXPct: 46, centerYPct: 34, pt: true },
  { id: "sala-terracota",  src: "/rooms/sala-terracota.jpg",  label: "Sala terracota",      wallWidthCm: 440, centerXPct: 48, centerYPct: 36, pt: true },
  { id: "sala-quente",     src: "/rooms/sala-quente.jpg",     label: "Sala quente",         wallWidthCm: 470, centerXPct: 50, centerYPct: 35, pt: true },
  { id: "sala-classica",   src: "/rooms/sala-classica.jpg",   label: "Apartamento clássico",wallWidthCm: 450, centerXPct: 50, centerYPct: 36, pt: true },
  // 🇪🇺 Europeias (contraste)
  { id: "sala-parisiense", src: "/rooms/sala-parisiense.jpg", label: "Apartamento parisiense", wallWidthCm: 460, centerXPct: 47, centerYPct: 37 },
  { id: "sala-verde",      src: "/rooms/sala-verde.jpg",      label: "Sala verde",          wallWidthCm: 460, centerXPct: 50, centerYPct: 40 },
  { id: "sala-escura",     src: "/rooms/sala-escura.jpg",     label: "Sala escura",         wallWidthCm: 460, centerXPct: 50, centerYPct: 37 },
];

const PT_SCENES = ROOM_SCENES.filter((r) => r.pt);

/** Hash estável (FNV-1a + finalizer) — bits bem espalhados para variar por obra. */
function seedFrom(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995) >>> 0;
  h ^= h >>> 15;
  return h >>> 0;
}

/**
 * Escolhe `count` salas para uma obra (determinístico por `seed`):
 * a 1.ª é SEMPRE uma sala portuguesa (rotativa entre as PT); as restantes
 * variam entre todas as outras. Usa bits diferentes do hash para a 1.ª e o resto.
 */
export function pickScenes(seed: string, count = 3): RoomScene[] {
  const h = seedFrom(seed);
  const pool = PT_SCENES.length ? PT_SCENES : ROOM_SCENES;
  const first = pool[h % pool.length];
  const rest = ROOM_SCENES.filter((r) => r.id !== first.id);
  const start = (h >>> 5) % rest.length;
  const others = Array.from(
    { length: Math.min(count - 1, rest.length) },
    (_, i) => rest[(start + i) % rest.length],
  );
  return [first, ...others];
}

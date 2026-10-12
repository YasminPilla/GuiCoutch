/* eslint-disable prettier/prettier */
/**
 * Poses dos exemplos animados, por slug do catálogo (exercise-demos.ts).
 * Convenções de ângulo em exercise-figure.ts. Cada exercício = pose A
 * (início) → pose B (execução) + ponto fixo + equipamentos + músculos.
 */
import type { FigureDef, Pose, Prop } from "./exercise-figure";

const FOOT = 191; // altura do tornozelo com o pé no chão
const STAND: ["ankle", number, number] = ["ankle", 120, FOOT];

// ── bases reutilizadas ──────────────────────────────────────────────────────
const lying: Pose = { torso: -90, leg: [75, -10] };                 // deitado no banco, cabeça à esquerda
const LYING_AT: ["hip", number, number] = ["hip", 150, 140];
const seated: Pose = { torso: 180, leg: [88, 2] };
const SEAT_AT: ["hip", number, number] = ["hip", 112, 148];
const SEAT: Prop = { k: "bench", x: 86, y: 160, w: 50 };
const incline: Pose = { torso: 220, leg: [85, 2] };
const INCLINE_AT: ["hip", number, number] = ["hip", 125, 152];
const frontSeated: Pose = { leg: [10, 0], reachLeg: [0.3, 1] };
const FRONT_SEAT_AT: ["hip", number, number] = ["hip", 120, 150];
const FRONT_SEAT: Prop = { k: "bench", x: 95, y: 160, w: 50 };
const bentOver = (torso: number): Pose => ({ torso, leg: [18, -8] });
const squatArms: Pose["arm"] = [-30, 160];                           // mãos segurando a barra nas costas
const crossed: Pose["arm"] = [15, 165];                              // braços cruzados no peito (relativo)

const P = (base: Pose, extra: Pose): Pose => ({ ...base, ...extra });

export const FIGURES: Record<string, FigureDef> = {
  // ── Peito ────────────────────────────────────────────────────────────────
  "supino-reto": {
    a: P(lying, { arm: [180, 180] }), b: P(lying, { arm: [22, 182] }),
    anchor: LYING_AT, props: [{ k: "backrest", len: 6 }, { k: "barbell" }], muscles: ["chest", "triceps", "delts"],
  },
  "supino-reto-halter": {
    a: P(lying, { arm: [180, 180] }), b: P(lying, { arm: [35, 178] }),
    anchor: LYING_AT, props: [{ k: "backrest", len: 6 }, { k: "dumbbell" }], muscles: ["chest", "triceps", "delts"],
  },
  "supino-inclinado": {
    a: P(incline, { arm: [180, 180] }), b: P(incline, { arm: [40, 190] }),
    anchor: INCLINE_AT, props: [{ k: "backrest", len: 6 }, { k: "bench", x: 100, y: 162, w: 40 }, { k: "barbell" }], muscles: ["chest", "delts", "triceps"],
  },
  "supino-inclinado-halter": {
    a: P(incline, { arm: [180, 180] }), b: P(incline, { arm: [55, 185] }),
    anchor: INCLINE_AT, props: [{ k: "backrest", len: 6 }, { k: "bench", x: 100, y: 162, w: 40 }, { k: "dumbbell" }], muscles: ["chest", "delts", "triceps"],
  },
  "supino-declinado": {
    a: { torso: -70, leg: [110, 20], arm: [180, 180] }, b: { torso: -70, leg: [110, 20], arm: [15, 182] },
    anchor: ["hip", 150, 128], props: [{ k: "backrest", len: 6 }, { k: "pad", at: "ankle", dx: 4, dy: -4 }, { k: "barbell" }], muscles: ["chest", "triceps"],
  },
  "supino-maquina": {
    a: P(seated, { arm: [90, 90] }), b: P(seated, { arm: [-55, 95] }),
    anchor: SEAT_AT, props: [SEAT, { k: "backrest" }, { k: "lever", from: [190, 40] }], muscles: ["chest", "triceps", "delts"],
  },
  "supino-smith": {
    a: P(lying, { arm: [180, 180] }), b: P(lying, { arm: [22, 182] }),
    anchor: LYING_AT, props: [{ k: "line", x1: 104, y1: 20, x2: 104, y2: 195, w: 3 }, { k: "backrest", len: 6 }, { k: "barbell" }], muscles: ["chest", "triceps", "delts"],
  },
  "crucifixo": {
    a: P(lying, { arm: [180, 180] }), b: P(lying, { arm: [176, 176], reachArm: [0.3, 0.3] }),
    anchor: LYING_AT, props: [{ k: "backrest", len: 6 }, { k: "dumbbell", single: true }], muscles: ["chest", "delts"],
  },
  "crucifixo-inclinado": {
    a: P(incline, { arm: [180, 180] }), b: P(incline, { arm: [178, 178], reachArm: [0.3, 0.3] }),
    anchor: INCLINE_AT, props: [{ k: "backrest", len: 6 }, { k: "bench", x: 100, y: 162, w: 40 }, { k: "dumbbell", single: true }], muscles: ["chest", "delts"],
  },
  "peck-deck": {
    view: "front",
    a: P(frontSeated, { arm: [90, 180] }), b: P(frontSeated, { arm: [90, 180], reachArm: [0.2, 1] }),
    anchor: FRONT_SEAT_AT, props: [FRONT_SEAT, { k: "pad", at: "elbow", r: 5 }], muscles: ["chest", "delts"],
  },
  "crossover": {
    view: "front",
    a: { arm: [125, 125] }, b: { arm: [-20, -25] },
    anchor: STAND, props: [{ k: "column", x: 214 }, { k: "column", x: 26 }, { k: "cable", from: [214, 24] }], muscles: ["chest", "delts"],
  },
  "flexao": {
    a: { torso: 112, leg: [-68, -68], foot: 10, arm: [0, 0] }, b: { torso: 93, leg: [-87, -87], foot: 10, arm: [-110, 0] },
    anchor: ["hand", 165, 190], props: [{ k: "mat", x: 30, w: 170 }], muscles: ["chest", "triceps", "delts"],
  },
  "paralelas": {
    a: { torso: 168, leg: [10, -50], arm: [0, 0] }, b: { torso: 150, leg: [-5, -80], arm: [-115, 0] },
    anchor: ["hand", 125, 100], props: [{ k: "line", x1: 95, y1: 103, x2: 170, y2: 103, w: 5 }, { k: "line", x1: 160, y1: 103, x2: 160, y2: 195, w: 4 }], muscles: ["chest", "triceps", "delts"],
  },
  "pullover": {
    a: P(lying, { arm: [180, 180] }), b: P(lying, { arm: [-100, -100] }),
    anchor: LYING_AT, props: [{ k: "backrest", len: 6 }, { k: "dumbbell", single: true }], muscles: ["chest", "back", "triceps"],
  },

  // ── Costas ───────────────────────────────────────────────────────────────
  "barra-fixa": {
    view: "front",
    a: { arm: [160, 175], leg: [0, -15] }, b: { arm: [65, 172], leg: [0, -15] },
    anchor: ["hand", 152, 26], props: [{ k: "bar", x: 120, y: 26, w: 150 }], muscles: ["back", "biceps"],
  },
  "barra-fixa-supinada": {
    view: "front",
    a: { arm: [172, 180], leg: [0, -15] }, b: { arm: [25, 178], leg: [0, -15] },
    anchor: ["hand", 140, 26], props: [{ k: "bar", x: 120, y: 26, w: 150 }], muscles: ["back", "biceps"],
  },
  "pulldown-aberto": {
    view: "front",
    a: P(frontSeated, { arm: [155, 172] }), b: P(frontSeated, { arm: [55, 172] }),
    anchor: FRONT_SEAT_AT, props: [FRONT_SEAT, { k: "pad", at: "knee", dy: -6 }, { k: "barbell" }, { k: "cable", from: [120, 4], single: true }], muscles: ["back", "biceps"],
  },
  "puxada-triangulo": {
    a: P(seated, { arm: [168, 172] }), b: P(seated, { torso: 190, arm: [-15, 160] }),
    anchor: SEAT_AT, props: [SEAT, { k: "pad", at: "knee", dy: -8 }, { k: "cable", from: [138, 6] }], muscles: ["back", "biceps"],
  },
  "puxada-supinada": {
    view: "front",
    a: P(frontSeated, { arm: [168, 178] }), b: P(frontSeated, { arm: [22, 176] }),
    anchor: FRONT_SEAT_AT, props: [FRONT_SEAT, { k: "pad", at: "knee", dy: -6 }, { k: "barbell" }, { k: "cable", from: [120, 4], single: true }], muscles: ["back", "biceps"],
  },
  "remada-curvada": {
    a: P(bentOver(130), { arm: [0, 0] }), b: P(bentOver(130), { arm: [-65, 20] }),
    anchor: STAND, props: [{ k: "barbell" }], muscles: ["back", "biceps", "rearDelts"],
  },
  "remada-curvada-supinada": {
    a: P(bentOver(130), { arm: [0, 0] }), b: P(bentOver(130), { arm: [-60, 25] }),
    anchor: STAND, props: [{ k: "barbell" }], muscles: ["back", "biceps"],
  },
  "remada-baixa": {
    a: { torso: 160, leg: [95, 82], arm: [90, 90] }, b: { torso: 185, leg: [95, 82], arm: [-50, 95] },
    anchor: ["hip", 80, 168], props: [{ k: "bench", x: 50, y: 178, w: 60 }, { k: "platform" }, { k: "cable", from: [228, 160] }], muscles: ["back", "biceps", "rearDelts"],
  },
  "serrote": {
    a: { torso: 100, leg: [8, 0], legF: [2, -90], arm: [0, 0], armF: [0, 0] }, b: { torso: 100, leg: [8, 0], legF: [2, -90], arm: [-75, 15], armF: [0, 0] },
    anchor: STAND, props: [{ k: "bench", x: 92, y: 160, w: 95 }, { k: "dumbbell", single: true }], muscles: ["back", "biceps", "rearDelts"],
  },
  "remada-cavalinho": {
    a: P(bentOver(135), { arm: [0, 0] }), b: P(bentOver(135), { arm: [-60, 25] }),
    anchor: STAND, props: [{ k: "lever", from: [40, 192] }, { k: "barbell" }], muscles: ["back", "biceps"],
  },
  "remada-maquina": {
    a: P(seated, { torso: 170, arm: [90, 90] }), b: P(seated, { torso: 175, arm: [-50, 95] }),
    anchor: SEAT_AT, props: [SEAT, { k: "line", x1: 150, y1: 80, x2: 150, y2: 130, w: 7 }, { k: "lever", from: [195, 150] }], muscles: ["back", "biceps", "rearDelts"],
  },
  "remada-alta": {
    view: "front",
    a: { arm: [-6, -8] }, b: { arm: [128, -100] },
    anchor: STAND, props: [{ k: "barbell" }], muscles: ["delts", "traps"],
  },
  "pulldown-braco-reto": {
    a: { torso: 165, leg: [8, -4], arm: [150, 150] }, b: { torso: 165, leg: [8, -4], arm: [12, 12] },
    anchor: STAND, props: [{ k: "column", x: 214 }, { k: "cable", from: [210, 22] }], muscles: ["back", "triceps"],
  },
  "deadlift": {
    a: { torso: 112, leg: [65, -22], arm: [-8, -8] }, b: { torso: 180, arm: [0, 0] },
    anchor: STAND, props: [{ k: "barbell" }], muscles: ["back", "glutes", "hamstrings", "lowerBack"],
  },
  "terra-sumo": {
    view: "front",
    a: { leg: [55, -12], arm: [-4, -4] }, b: { leg: [18, 18], arm: [-4, -4] },
    anchor: STAND, anchorB: [128, FOOT], props: [{ k: "barbell" }], muscles: ["glutes", "quads", "adductors", "back"],
  },
  "hiperextensao": {
    a: { torso: 15, leg: [-40, -40], foot: 50, arm: crossed, armRel: true }, b: { torso: 140, leg: [-40, -40], foot: 50, arm: crossed, armRel: true },
    anchor: ["hip", 125, 108], props: [{ k: "line", x1: 120, y1: 124, x2: 140, y2: 110, w: 8 }, { k: "line", x1: 130, y1: 118, x2: 130, y2: 195, w: 4 }, { k: "line", x1: 72, y1: 182, x2: 72, y2: 195, w: 4 }, { k: "pad", at: "ankle", dx: -4, dy: 6 }], muscles: ["lowerBack", "glutes", "hamstrings"],
  },
  "encolhimento": {
    view: "front",
    a: { arm: [3, 0] }, b: { arm: [3, 0], shrug: 8 },
    anchor: STAND, props: [{ k: "dumbbell" }], muscles: ["traps"],
  },

  // ── Ombro ────────────────────────────────────────────────────────────────
  "desenvolvimento-halter": {
    view: "front",
    a: P(frontSeated, { arm: [92, 178] }), b: P(frontSeated, { arm: [165, 178] }),
    anchor: FRONT_SEAT_AT, props: [FRONT_SEAT, { k: "dumbbell" }], muscles: ["delts", "triceps"],
  },
  "press-overhead": {
    a: { arm: [20, 170] }, b: { arm: [178, 178] },
    anchor: STAND, props: [{ k: "barbell" }], muscles: ["delts", "triceps"],
  },
  "desenvolvimento-maquina": {
    view: "front",
    a: P(frontSeated, { arm: [92, 178] }), b: P(frontSeated, { arm: [165, 178] }),
    anchor: FRONT_SEAT_AT, props: [FRONT_SEAT, { k: "lever", from: [190, 150] }], muscles: ["delts", "triceps"],
  },
  "desenvolvimento-arnold": {
    view: "front",
    a: P(frontSeated, { arm: [0, 180], reachArm: [0.35, 1] }), b: P(frontSeated, { arm: [165, 178] }),
    anchor: FRONT_SEAT_AT, props: [FRONT_SEAT, { k: "dumbbell" }], muscles: ["delts", "triceps"],
  },
  "elevacao-lateral": {
    view: "front",
    a: { arm: [10, 8] }, b: { arm: [88, 92] },
    anchor: STAND, props: [{ k: "dumbbell" }], muscles: ["delts"],
  },
  "elevacao-lateral-cabo": {
    view: "front",
    a: { arm: [-18, -22], armF: [5, 5] }, b: { arm: [88, 92], armF: [5, 5] },
    anchor: STAND, props: [{ k: "column", x: 30 }, { k: "cable", from: [34, 186], single: true }], muscles: ["delts"],
  },
  "elevacao-frontal": {
    a: { arm: [5, 5] }, b: { arm: [90, 90] },
    anchor: STAND, props: [{ k: "dumbbell" }], muscles: ["delts"],
  },
  "crucifixo-inverso": {
    a: P(bentOver(110), { arm: [0, 0] }), b: P(bentOver(110), { arm: [0, 0], reachArm: [0.3, 0.3] }),
    anchor: STAND, props: [{ k: "dumbbell", single: true }], muscles: ["rearDelts", "traps", "back"],
  },
  "voador-invertido": {
    view: "front",
    a: P(frontSeated, { arm: [90, 90], reachArm: [0.25, 0.25] }), b: P(frontSeated, { arm: [90, 90] }),
    anchor: FRONT_SEAT_AT, props: [FRONT_SEAT], muscles: ["rearDelts", "traps"],
  },
  "face-pull": {
    a: { arm: [92, 92] }, b: { arm: [110, 150], reachArm: [0.4, 1] },
    anchor: STAND, props: [{ k: "column", x: 220 }, { k: "cable", from: [216, 62] }], muscles: ["rearDelts", "traps"],
  },

  // ── Tríceps ──────────────────────────────────────────────────────────────
  "triceps-corda": {
    a: { torso: 172, arm: [5, 150] }, b: { torso: 172, arm: [3, 5] },
    anchor: STAND, props: [{ k: "column", x: 200 }, { k: "cable", from: [196, 18] }], muscles: ["triceps"],
  },
  "triceps-pulley": {
    a: { torso: 172, arm: [5, 140] }, b: { torso: 172, arm: [3, 5] },
    anchor: STAND, props: [{ k: "column", x: 200 }, { k: "cable", from: [196, 18] }], muscles: ["triceps"],
  },
  "triceps-frances": {
    a: { arm: [175, 175] }, b: { arm: [172, -20] },
    anchor: STAND, props: [{ k: "dumbbell", single: true }], muscles: ["triceps"],
  },
  "triceps-frances-corda": {
    a: { torso: 155, leg: [10, -10], legF: [-20, -15], arm: [140, -60] }, b: { torso: 155, leg: [10, -10], legF: [-20, -15], arm: [135, 135] },
    anchor: STAND, props: [{ k: "column", x: 30 }, { k: "cable", from: [34, 40] }], muscles: ["triceps"],
  },
  "triceps-testa": {
    a: P(lying, { arm: [180, 180] }), b: P(lying, { arm: [195, -70] }),
    anchor: LYING_AT, props: [{ k: "backrest", len: 6 }, { k: "barbell" }], muscles: ["triceps"],
  },
  "triceps-coice": {
    a: P(bentOver(115), { arm: [-65, 5] }), b: P(bentOver(115), { arm: [-65, -65] }),
    anchor: STAND, props: [{ k: "dumbbell", single: true }], muscles: ["triceps"],
  },
  "triceps-banco": {
    a: { torso: 180, leg: [62, 62], arm: [-12, -12] }, b: { torso: 180, leg: [80, 80], arm: [-100, -2] },
    anchor: ["hand", 92, 152], props: [{ k: "bench", x: 40, y: 158, w: 60 }], muscles: ["triceps"],
  },
  "supino-fechado": {
    a: P(lying, { arm: [180, 180] }), b: P(lying, { arm: [10, 182] }),
    anchor: LYING_AT, props: [{ k: "backrest", len: 6 }, { k: "barbell" }], muscles: ["triceps", "chest"],
  },

  // ── Bíceps ───────────────────────────────────────────────────────────────
  "rosca-direta": {
    a: { arm: [3, 3] }, b: { arm: [3, 150] },
    anchor: STAND, props: [{ k: "barbell" }], muscles: ["biceps", "forearms"],
  },
  "rosca-alternada": {
    a: { arm: [3, 3], armF: [3, 150] }, b: { arm: [3, 150], armF: [3, 3] },
    anchor: STAND, props: [{ k: "dumbbell" }], muscles: ["biceps", "forearms"],
  },
  "rosca-martelo": {
    a: { arm: [3, 3] }, b: { arm: [3, 150] },
    anchor: STAND, props: [{ k: "dumbbell" }], muscles: ["biceps", "forearms"],
  },
  "rosca-scott": {
    a: P(seated, { torso: 172, arm: [40, 40] }), b: P(seated, { torso: 172, arm: [40, 170] }),
    anchor: SEAT_AT, props: [SEAT, { k: "line", x1: 120, y1: 113, x2: 141, y2: 135, w: 9 }, { k: "line", x1: 141, y1: 135, x2: 141, y2: 195, w: 4 }, { k: "barbell" }], muscles: ["biceps"],
  },
  "rosca-concentrada": {
    a: P(seated, { torso: 150, leg: [80, 5], arm: [8, 8] }), b: P(seated, { torso: 150, leg: [80, 5], arm: [8, 160] }),
    anchor: SEAT_AT, props: [SEAT, { k: "dumbbell", single: true }], muscles: ["biceps"],
  },
  "rosca-cabo": {
    a: { arm: [3, 3] }, b: { arm: [3, 150] },
    anchor: STAND, props: [{ k: "column", x: 190 }, { k: "cable", from: [186, 188] }], muscles: ["biceps", "forearms"],
  },
  "rosca-inclinada": {
    a: P(incline, { arm: [-5, -5] }), b: P(incline, { arm: [-5, 140] }),
    anchor: INCLINE_AT, props: [{ k: "backrest", len: 6 }, { k: "bench", x: 100, y: 162, w: 40 }, { k: "dumbbell" }], muscles: ["biceps"],
  },
  "rosca-inversa": {
    a: { arm: [3, 3] }, b: { arm: [3, 150] },
    anchor: STAND, props: [{ k: "barbell" }], muscles: ["forearms", "biceps"],
  },

  // ── Pernas ───────────────────────────────────────────────────────────────
  "agachamento-livre": {
    a: { torso: 176, arm: squatArms }, b: { torso: 140, leg: [80, -30], arm: squatArms },
    anchor: STAND, props: [{ k: "barbell", at: "shoulder" }], muscles: ["quads", "glutes"],
  },
  "agachamento-frontal": {
    a: { torso: 178, arm: [110, -80] }, b: { torso: 158, leg: [85, -35], arm: [110, -80] },
    anchor: STAND, props: [{ k: "barbell" }], muscles: ["quads", "glutes"],
  },
  "agachamento-goblet": {
    a: { torso: 176, arm: [20, 160] }, b: { torso: 150, leg: [85, -32], arm: [20, 160] },
    anchor: STAND, props: [{ k: "kettlebell" }], muscles: ["quads", "glutes"],
  },
  "agachamento-smith": {
    a: { torso: 176, arm: squatArms }, b: { torso: 150, leg: [82, -22], arm: squatArms },
    anchor: ["ankle", 128, FOOT], props: [{ k: "line", x1: 118, y1: 14, x2: 118, y2: 195, w: 3 }, { k: "barbell", at: "shoulder" }], muscles: ["quads", "glutes"],
  },
  "agachamento-sumo": {
    view: "front",
    a: { leg: [20, 20], arm: [-12, -12] }, b: { leg: [58, -6], arm: [-12, -12] },
    anchor: STAND, anchorB: [125, FOOT], props: [{ k: "kettlebell" }], muscles: ["quads", "adductors", "glutes"],
  },
  "hack": {
    a: { torso: 200, leg: [12, 5], arm: [-20, 170] }, b: { torso: 200, leg: [85, -20], arm: [-20, 170] },
    anchor: ["ankle", 140, 182], props: [{ k: "backrest", len: 10 }, { k: "platform" }], muscles: ["quads", "glutes"],
  },
  "leg-press": {
    a: { torso: -125, leg: [165, 95], foot: 225, arm: [60, 60] }, b: { torso: -125, leg: [135, 135], foot: 225, arm: [60, 60] },
    anchor: ["hip", 85, 160], props: [{ k: "backrest", len: 6 }, { k: "line", x1: 70, y1: 168, x2: 110, y2: 168, w: 8 }, { k: "platform" }], muscles: ["quads", "glutes"],
  },
  "afundo": {
    a: { leg: [15, 0], legF: [-15, -15], footF: 60, arm: [2, 2] }, b: { leg: [80, -5], legF: [-8, -80], footF: 5, arm: [2, 2] },
    anchor: ["ankle", 145, FOOT], props: [{ k: "dumbbell" }], muscles: ["quads", "glutes"],
  },
  "agachamento-bulgaro": {
    a: { leg: [8, -2], legF: [-25, -115], footF: -40, arm: [2, 2] }, b: { leg: [70, -10], legF: [-5, -100], footF: -30, arm: [2, 2] },
    anchor: ["ankle", 150, FOOT], props: [{ k: "bench", x: 40, y: 150, w: 55 }, { k: "dumbbell" }], muscles: ["quads", "glutes"],
  },
  "cadeira-extensora": {
    a: P(seated, { torso: 172, leg: [88, 0], arm: [10, 60] }), b: P(seated, { torso: 172, leg: [88, 85], arm: [10, 60] }),
    anchor: SEAT_AT, props: [SEAT, { k: "backrest" }, { k: "pad", at: "ankle", dx: 7 }], muscles: ["quads"],
  },
  "mesa-flexora": {
    a: { torso: 90, leg: [-90, -90], arm: [20, 40] }, b: { torso: 90, leg: [-90, -175], arm: [20, 40] },
    anchor: ["hip", 110, 150], props: [{ k: "bench", x: 70, y: 160, w: 110 }, { k: "pad", at: "ankle", dx: -2, dy: -7 }], muscles: ["hamstrings"],
  },
  "cadeira-flexora": {
    a: P(seated, { torso: 172, leg: [88, 85], arm: [10, 60] }), b: P(seated, { torso: 172, leg: [88, -10], arm: [10, 60] }),
    anchor: SEAT_AT, props: [SEAT, { k: "backrest" }, { k: "pad", at: "knee", dy: -8 }, { k: "pad", at: "ankle", dx: -6 }], muscles: ["hamstrings"],
  },
  "stiff": {
    a: { arm: [0, 0] }, b: { torso: 100, leg: [14, -2], arm: [0, 0] },
    anchor: STAND, props: [{ k: "barbell" }], muscles: ["hamstrings", "glutes", "lowerBack"],
  },
  "terra-romeno": {
    a: { arm: [0, 0] }, b: { torso: 110, leg: [22, -8], arm: [0, 0] },
    anchor: STAND, props: [{ k: "barbell" }], muscles: ["hamstrings", "glutes", "lowerBack"],
  },
  "step-up": {
    a: { leg: [80, -10], legF: [-8, -8], arm: [2, 2] }, b: { leg: [0, 0], legF: [60, -20], arm: [2, 2] },
    anchor: ["ankle", 150, 160], props: [{ k: "box", x: 128, y: 167, w: 55, h: 28 }, { k: "dumbbell" }], muscles: ["quads", "glutes"],
  },
  "agachamento-peso-corporal": {
    a: { arm: [90, 90] }, b: { torso: 145, leg: [82, -30], arm: [85, 85] },
    anchor: STAND, muscles: ["quads", "glutes"],
  },

  // ── Glúteos ──────────────────────────────────────────────────────────────
  "elevacao-pelvica": {
    a: { torso: -115, leg: [140, 0], arm: [55, 75] }, b: { torso: -90, leg: [95, 0], arm: [80, 100] },
    anchor: ["ankle", 170, FOOT], props: [{ k: "bench", x: 40, y: 168, w: 66 }, { k: "barbell", at: "hip" }], muscles: ["glutes", "hamstrings"],
  },
  "ponte-gluteo": {
    a: { torso: -90, leg: [131, -25], arm: [90, 90] }, b: { torso: -62, leg: [100, -25], arm: [95, 95] },
    anchor: ["ankle", 165, FOOT], props: [{ k: "mat", x: 50, w: 140 }, { k: "barbell", at: "hip" }], muscles: ["glutes", "hamstrings"],
  },
  "cadeira-abdutora": {
    view: "front",
    a: P(frontSeated, { leg: [5, 0], reachLeg: [0.35, 1] }), b: P(frontSeated, { leg: [80, 15], reachLeg: [0.45, 1] }),
    anchor: FRONT_SEAT_AT, props: [FRONT_SEAT, { k: "pad", at: "knee", dx: 7 }], muscles: ["abductors", "glutes"],
  },
  "cadeira-adutora": {
    view: "front",
    a: P(frontSeated, { leg: [80, 15], reachLeg: [0.45, 1] }), b: P(frontSeated, { leg: [5, 0], reachLeg: [0.35, 1] }),
    anchor: FRONT_SEAT_AT, props: [FRONT_SEAT, { k: "pad", at: "knee", dx: -6 }], muscles: ["adductors"],
  },
  "gluteo-cabo": {
    a: { torso: 168, leg: [3, 0], arm: [70, 70] }, b: { torso: 162, leg: [-38, -30], arm: [70, 70] },
    anchor: ["ankleF", 110, FOOT], props: [{ k: "column", x: 200 }, { k: "cable", from: [196, 186], to: "ankle" }], muscles: ["glutes", "hamstrings"],
  },
  "gluteo-quatro-apoios": {
    a: { torso: 98, leg: [0, -90], legF: [0, -90], arm: [0, 0] }, b: { torso: 98, leg: [-115, -170], legF: [0, -90], arm: [0, 0] },
    anchor: ["kneeF", 95, 186], props: [{ k: "mat", x: 40, w: 150 }], muscles: ["glutes", "hamstrings"],
  },
  "bom-dia": {
    a: { arm: squatArms }, b: { torso: 100, leg: [14, -2], arm: squatArms },
    anchor: STAND, props: [{ k: "barbell", at: "shoulder" }], muscles: ["hamstrings", "glutes", "lowerBack"],
  },

  // ── Panturrilha ──────────────────────────────────────────────────────────
  "panturrilha-em-pe": {
    a: { foot: 112 }, b: { foot: 35 },
    anchor: ["toe", 132, 172], props: [{ k: "box", x: 118, y: 176, w: 48, h: 19 }], muscles: ["calves"],
  },
  "panturrilha-sentado": {
    a: P(seated, { leg: [90, 0], foot: 112, arm: [30, 120] }), b: P(seated, { leg: [90, 0], foot: 40, arm: [30, 120] }),
    anchor: ["toe", 165, 174], props: [{ k: "bench", x: 70, y: 158, w: 45 }, { k: "box", x: 150, y: 178, w: 34, h: 17 }, { k: "pad", at: "knee", dy: -9 }], muscles: ["calves"],
  },
  "panturrilha-leg-press": {
    a: { torso: -125, leg: [135, 135], foot: 225, arm: [60, 60] }, b: { torso: -125, leg: [135, 135], foot: 185, arm: [60, 60] },
    anchor: ["hip", 85, 160], props: [{ k: "backrest", len: 6 }, { k: "line", x1: 70, y1: 168, x2: 110, y2: 168, w: 8 }, { k: "platform" }], muscles: ["calves"],
  },

  // ── Abdômen ──────────────────────────────────────────────────────────────
  "abdominal-crunch": {
    a: { torso: -90, leg: [140, 15], arm: crossed, armRel: true }, b: { torso: -118, leg: [140, 15], arm: crossed, armRel: true },
    anchor: ["ankle", 172, FOOT], props: [{ k: "mat", x: 60, w: 140 }], muscles: ["abs"],
  },
  "prancha": {
    a: { torso: 100, leg: [-80, -80], foot: 10, arm: [0, 90] }, b: { torso: 101, leg: [-79, -79], foot: 10, arm: [0, 90] },
    anchor: ["elbow", 150, 186], props: [{ k: "mat", x: 30, w: 170 }], muscles: ["abs", "obliques"],
  },
  "abdominal-cabo": {
    a: { torso: 170, leg: [0, -90], arm: crossed, armRel: true }, b: { torso: 100, leg: [-20, -90], arm: crossed, armRel: true },
    anchor: ["knee", 120, 187], props: [{ k: "mat", x: 60, w: 120 }, { k: "column", x: 200 }, { k: "cable", from: [196, 16] }], muscles: ["abs"],
  },
  "abdominal-infra": {
    a: { torso: -90, leg: [80, 80], arm: [90, 90] }, b: { torso: -90, leg: [175, 175], arm: [90, 90] },
    anchor: ["hip", 125, 184], props: [{ k: "mat", x: 50, w: 150 }], muscles: ["abs"],
  },
  "elevacao-pernas-barra": {
    a: { arm: [180, 180], leg: [0, 0] }, b: { arm: [180, 180], leg: [95, 95] },
    anchor: ["hand", 120, 12], props: [{ k: "bar", x: 120, y: 12, w: 90 }], muscles: ["abs"],
  },
  "abdominal-obliquo": {
    a: { torso: -90, leg: [140, 15], arm: crossed, armRel: true }, b: { torso: -112, leg: [175, 80], legF: [140, 15], arm: crossed, armRel: true },
    anchor: ["ankleF", 172, FOOT], props: [{ k: "mat", x: 60, w: 140 }], muscles: ["obliques", "abs"],
  },
  "russian-twist": {
    view: "front",
    a: { torso: 174, leg: [10, 30], reachLeg: [0.35, 0.8], arm: [63, -46], armF: [-26, -78] }, b: { torso: 186, leg: [10, 30], reachLeg: [0.35, 0.8], arm: [-26, -78], armF: [63, -46] },
    anchor: ["hip", 120, 178], props: [{ k: "mat", x: 60, w: 120 }, { k: "kettlebell" }], muscles: ["obliques", "abs"],
  },
  "abdominal-remador": {
    a: { torso: -90, leg: [140, 15], arm: crossed, armRel: true }, b: { torso: -200, leg: [140, 15], arm: crossed, armRel: true },
    anchor: ["ankle", 172, FOOT], props: [{ k: "mat", x: 60, w: 140 }], muscles: ["abs"],
  },
  "escalador": {
    a: { torso: 112, leg: [-68, -68], legF: [55, -30], foot: 10, footF: 30, arm: [0, 0] }, b: { torso: 112, leg: [55, -30], legF: [-68, -68], foot: 30, footF: 10, arm: [0, 0] },
    anchor: ["hand", 165, 190], props: [{ k: "mat", x: 30, w: 170 }], muscles: ["abs", "quads"],
  },
};

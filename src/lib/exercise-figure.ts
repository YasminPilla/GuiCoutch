/* eslint-disable prettier/prettier */
/**
 * Boneco vetorial animado para os exemplos de exercício.
 *
 * Cada exercício é descrito só por dados (~300 bytes): duas poses (ângulos
 * das articulações), um ponto fixo (pé no chão, quadril no banco, mão na
 * barra…), os equipamentos e os músculos trabalhados. O desenho é gerado aqui
 * em SVG e animado interpolando os ângulos — mesma ideia do Lottie, mas sem
 * biblioteca, sem download e funcionando offline.
 *
 * Convenção de ângulos (graus, absolutos): 0 = para baixo, 90 = para frente
 * (direita da tela), 180 = para cima, -90 = para trás. O boneco olha para a
 * direita. Na vista "front" o braço/perna direitos usam o ângulo e os
 * esquerdos são espelhados (90 = para fora).
 */

export type Limb = [number, number];
export type Pt = [number, number];

export interface Pose {
  /** quadril → ombro. 180 = em pé, -90 = deitado de costas (cabeça à esquerda), 90 = de bruços */
  torso?: number;
  /** braço [ombro→cotovelo, cotovelo→mão]; armF = braço do fundo (side) ou esquerdo (front) */
  arm?: Limb;
  armF?: Limb;
  /** perna [quadril→joelho, joelho→tornozelo] */
  leg?: Limb;
  legF?: Limb;
  /** pé (tornozelo→ponta). Padrão: perpendicular à canela, para frente */
  foot?: number;
  footF?: number;
  /** ângulos do braço relativos ao tronco (180 = ao longo do tronco, para cima) */
  armRel?: boolean;
  /** encurtamento (0..1) quando o membro aponta para a câmera */
  reachArm?: Limb;
  reachLeg?: Limb;
  /** ombros elevados (px) — encolhimento */
  shrug?: number;
}

export type Joint =
  | "hip" | "shoulder" | "head"
  | "elbow" | "hand" | "knee" | "ankle" | "toe"
  | "elbowF" | "handF" | "kneeF" | "ankleF" | "toeF";

export type Prop =
  | { k: "barbell"; at?: Joint }
  | { k: "dumbbell"; at?: Joint; single?: boolean }
  | { k: "kettlebell"; at?: Joint }
  | { k: "cable"; from: Pt; to?: Joint; single?: boolean }
  | { k: "lever"; from: Pt; to?: Joint; single?: boolean }
  | { k: "pad"; at: Joint; r?: number; dx?: number; dy?: number }
  | { k: "bench"; x: number; y: number; w: number }
  | { k: "backrest"; len?: number }
  | { k: "bar"; x: number; y: number; w?: number }
  | { k: "box"; x: number; y: number; w: number; h: number }
  | { k: "platform"; far?: boolean }
  | { k: "mat"; x: number; w: number }
  | { k: "line"; x1: number; y1: number; x2: number; y2: number; w?: number }
  | { k: "column"; x: number };

export type Muscle =
  | "chest" | "back" | "traps" | "delts" | "rearDelts"
  | "biceps" | "triceps" | "forearms"
  | "abs" | "obliques" | "lowerBack"
  | "glutes" | "abductors" | "adductors" | "quads" | "hamstrings" | "calves";

export interface FigureDef {
  view?: "side" | "front";
  a: Pose;
  b: Pose;
  /** articulação que fica fixa na tela, e onde */
  anchor: [Joint, number, number];
  /** posição do ponto fixo na pose B, se ele se mover (ex: barra do smith) */
  anchorB?: Pt;
  props?: Prop[];
  muscles: Muscle[];
}

export interface FigureColors {
  body: string;
  bodyFar: string;
  prop: string;
  propDark: string;
  floor: string;
  muscle: string;
}

// ── dimensões (unidades do viewBox 240×200) ────────────────────────────────
export const VIEWBOX = "0 0 240 200";
export const FLOOR_Y = 195;
const L = { torso: 46, neck: 16, head: 10, ua: 28, fa: 25, th: 40, sh: 38, ft: 12 };
const SHOULDER_HALF = 15;
const HIP_HALF = 8;

const rad = (d: number) => (d * Math.PI) / 180;
const dir = (a: number, len = 1): Pt => [Math.sin(rad(a)) * len, Math.cos(rad(a)) * len];
const add = (p: Pt, q: Pt): Pt => [p[0] + q[0], p[1] + q[1]];
const sub = (p: Pt, q: Pt): Pt => [p[0] - q[0], p[1] - q[1]];
const mul = (p: Pt, k: number): Pt => [p[0] * k, p[1] * k];
const lerp = (x: number, y: number, t: number) => x + (y - x) * t;
const r1 = (n: number) => Math.round(n * 10) / 10;

interface Resolved {
  torso: number; arm: Limb; armF: Limb; leg: Limb; legF: Limb;
  foot: number; footF: number; reachArm: Limb; reachLeg: Limb; shrug: number;
}

function resolve(p: Pose, view: "side" | "front"): Resolved {
  const torso = p.torso ?? 180;
  const rel = (l: Limb): Limb => (p.armRel ? [l[0] + torso - 180, l[1] + torso - 180] : l);
  const arm = rel(p.arm ?? [5, 5]);
  const armF = p.armF ? rel(p.armF) : arm;
  const leg = p.leg ?? [0, 0];
  const legF = p.legF ?? leg;
  const footDefault = (l: Limb) => (view === "front" ? l[1] : l[1] + 90);
  return {
    torso, arm, armF, leg, legF,
    foot: p.foot ?? footDefault(leg),
    footF: p.footF ?? (p.legF ? footDefault(legF) : p.foot ?? footDefault(leg)),
    reachArm: p.reachArm ?? [1, 1],
    reachLeg: p.reachLeg ?? [1, 1],
    shrug: p.shrug ?? 0,
  };
}

function mix(a: Resolved, b: Resolved, t: number): Resolved {
  const l = (x: Limb, y: Limb): Limb => [lerp(x[0], y[0], t), lerp(x[1], y[1], t)];
  return {
    torso: lerp(a.torso, b.torso, t),
    arm: l(a.arm, b.arm), armF: l(a.armF, b.armF),
    leg: l(a.leg, b.leg), legF: l(a.legF, b.legF),
    foot: lerp(a.foot, b.foot, t), footF: lerp(a.footF, b.footF, t),
    reachArm: l(a.reachArm, b.reachArm), reachLeg: l(a.reachLeg, b.reachLeg),
    shrug: lerp(a.shrug, b.shrug, t),
  };
}

type Joints = Record<Joint, Pt> & { shoulderF: Pt; hipF: Pt };

/** posições relativas ao quadril (0,0) */
function joints(p: Resolved, view: "side" | "front"): Joints {
  const hip: Pt = [0, 0];
  const shoulderC = add(hip, dir(p.torso, L.torso));
  const head = add(shoulderC, dir(p.torso, L.neck));
  const front = view === "front";
  // na vista frontal o lado esquerdo é espelhado no eixo x
  const m = (a: number, mirror: boolean) => (mirror ? -a : a);
  const limb = (start: Pt, l: Limb, len1: number, len2: number, reach: Limb, mirror: boolean): [Pt, Pt] => {
    const mid = add(start, dir(m(l[0], mirror), len1 * reach[0]));
    return [mid, add(mid, dir(m(l[1], mirror), len2 * reach[1]))];
  };
  const shoulder: Pt = front ? add(shoulderC, [SHOULDER_HALF, -p.shrug]) : add(shoulderC, [0, -p.shrug]);
  const shoulderF: Pt = front ? add(shoulderC, [-SHOULDER_HALF, -p.shrug]) : shoulder;
  const hipN: Pt = front ? [HIP_HALF, 0] : hip;
  const hipF: Pt = front ? [-HIP_HALF, 0] : hip;
  const [elbow, hand] = limb(shoulder, p.arm, L.ua, L.fa, p.reachArm, false);
  const [elbowF, handF] = limb(shoulderF, p.armF, L.ua, L.fa, p.reachArm, front);
  const [knee, ankle] = limb(hipN, p.leg, L.th, L.sh, p.reachLeg, false);
  const [kneeF, ankleF] = limb(hipF, p.legF, L.th, L.sh, p.reachLeg, front);
  const toe = front ? add(ankle, [5, 3]) : add(ankle, dir(p.foot, L.ft));
  const toeF = front ? add(ankleF, [-5, 3]) : add(ankleF, dir(p.footF, L.ft));
  // na vista frontal "shoulder" é o centro dos ombros (ponto de ancoragem)
  return {
    hip, shoulder: front ? shoulderC : shoulder, head, elbow, hand, knee, ankle, toe,
    elbowF, handF, kneeF, ankleF, toeF, shoulderF, hipF,
  };
}

// ── SVG helpers ────────────────────────────────────────────────────────────
const line = (p: Pt, q: Pt, w: number, c: string) =>
  `<line x1="${r1(p[0])}" y1="${r1(p[1])}" x2="${r1(q[0])}" y2="${r1(q[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const circle = (p: Pt, r: number, fill: string, extra = "") =>
  `<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="${r}" fill="${fill}" ${extra}/>`;
const rect = (x: number, y: number, w: number, h: number, fill: string, rx = 2) =>
  `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}" fill="${fill}"/>`;
const poly = (pts: Pt[], fill: string) =>
  `<polygon points="${pts.map((p) => `${r1(p[0])},${r1(p[1])}`).join(" ")}" fill="${fill}" stroke="${fill}" stroke-width="6" stroke-linejoin="round"/>`;

/** elipse ao longo do segmento p→q; side 1/-1 desloca para um dos lados */
function segEllipse(p: Pt, q: Pt, tc: number, span: number, side: number, off: number, ry: number, c: string) {
  const d = sub(q, p);
  const len = Math.hypot(d[0], d[1]) || 1;
  const u: Pt = [d[0] / len, d[1] / len];
  const perp: Pt = mul([-u[1], u[0]], side);
  const c0 = add(add(p, mul(d, tc)), mul(perp, off));
  const ang = (Math.atan2(u[1], u[0]) * 180) / Math.PI;
  const rx = Math.max(3, (len * span) / 2);
  return `<ellipse cx="${r1(c0[0])}" cy="${r1(c0[1])}" rx="${r1(rx)}" ry="${ry}" transform="rotate(${r1(ang)} ${r1(c0[0])} ${r1(c0[1])})" fill="${c}"/>`;
}

function ellipseAt(c0: Pt, rx: number, ry: number, ang: number, c: string) {
  return `<ellipse cx="${r1(c0[0])}" cy="${r1(c0[1])}" rx="${rx}" ry="${ry}" transform="rotate(${r1(ang)} ${r1(c0[0])} ${r1(c0[1])})" fill="${c}"/>`;
}

// ── render ─────────────────────────────────────────────────────────────────

export function figureMarkup(def: FigureDef, t: number, colors: FigureColors): string {
  const view = def.view ?? "side";
  const front = view === "front";
  const pose = mix(resolve(def.a, view), resolve(def.b, view), t);
  const rel = joints(pose, view);
  const [aj, ax, ay] = def.anchor;
  const target: Pt = def.anchorB ? [lerp(ax, def.anchorB[0], t), lerp(ay, def.anchorB[1], t)] : [ax, ay];
  const offset = sub(target, rel[aj]);
  const J = (k: keyof Joints): Pt => add(rel[k], offset);
  const M = colors.muscle;
  const has = (m: Muscle) => def.muscles.includes(m);
  const props = def.props ?? [];
  const cx = J("hip")[0];
  const mirror = (p: Pt): Pt => [2 * cx - p[0], p[1]];
  const out: string[] = [];

  // chão
  out.push(line([6, FLOOR_Y + 1], [234, FLOOR_Y + 1], 2, colors.floor));

  // equipamentos de fundo
  for (const p of props) {
    if (p.k === "bench") {
      out.push(line([p.x + 8, p.y], [p.x + 8, FLOOR_Y], 4, colors.propDark));
      out.push(line([p.x + p.w - 8, p.y], [p.x + p.w - 8, FLOOR_Y], 4, colors.propDark));
      out.push(rect(p.x, p.y - 3, p.w, 8, colors.prop, 3));
    } else if (p.k === "box") {
      out.push(rect(p.x, p.y, p.w, p.h, colors.propDark, 3));
    } else if (p.k === "mat") {
      out.push(rect(p.x, FLOOR_Y - 2, p.w, 4, colors.propDark, 2));
    } else if (p.k === "column") {
      out.push(rect(p.x - 5, 12, 10, FLOOR_Y - 12, colors.propDark, 3));
    } else if (p.k === "line") {
      out.push(line([p.x1, p.y1], [p.x2, p.y2], p.w ?? 6, colors.prop));
    } else if (p.k === "bar") {
      const w = p.w ?? 120;
      out.push(line([p.x - w / 2, p.y], [p.x + w / 2, p.y], 4, colors.prop));
    } else if (p.k === "barbell" && !front && p.at === "shoulder") {
      // barra nas costas: anilha atrás do corpo para não esconder a cabeça
      const at = J("shoulder");
      out.push(circle(at, 16, colors.propDark, `stroke="${colors.prop}" stroke-width="2"`), circle(at, 3, colors.prop));
    } else if (p.k === "backrest") {
      const hip = J("hip"), sh = J("shoulder");
      const d = sub(sh, hip);
      const len = Math.hypot(d[0], d[1]) || 1;
      const u: Pt = [d[0] / len, d[1] / len];
      // "costas" do boneco: perpendicular oposta ao peito
      const back: Pt = front ? [0, 0] : [u[1], -u[0]];
      const ext = p.len ?? 0;
      const s = add(add(hip, mul(u, -8)), mul(back, 13));
      const e = add(add(sh, mul(u, 8 + ext)), mul(back, 13));
      const mid = add(s, mul(sub(e, s), 0.3));
      if (!front) out.push(line(mid, [mid[0], FLOOR_Y], 4, colors.propDark));
      out.push(line(s, e, 9, colors.prop));
    }
  }

  const drawLimb = (a: Pt, b: Pt, c: Pt, w1: number, w2: number, col: string) =>
    line(a, b, w1, col) + line(b, c, w2, col);

  if (!front) {
    const hip = J("hip"), sh = J("shoulder"), head = J("head");
    const td = sub(sh, hip);
    const tl = Math.hypot(td[0], td[1]) || 1;
    const tu: Pt = [td[0] / tl, td[1] / tl];
    const perp: Pt = [-tu[1], tu[0]]; // lado do peito
    const far = colors.bodyFar;

    // membros do fundo
    out.push(drawLimb(hip, J("kneeF"), J("ankleF"), 14, 11, far), line(J("ankleF"), J("toeF"), 6, far));
    out.push(drawLimb(sh, J("elbowF"), J("handF"), 10, 8, far), circle(J("handF"), 4.5, far));
    for (const p of props) if (p.k === "dumbbell" && !p.single) out.push(sideDumbbell(J("handF"), colors, true));

    // tronco + cabeça
    out.push(poly([add(hip, mul(perp, 9)), add(sh, mul(perp, 11)), add(sh, mul(perp, -10)), add(hip, mul(perp, -10))], colors.body));
    out.push(line(sh, head, 8, colors.body), circle(head, L.head, colors.body));

    // músculos do tronco
    if (has("chest")) out.push(segEllipse(hip, sh, 0.78, 0.34, 1, 8, 5, M));
    if (has("abs")) out.push(segEllipse(hip, sh, 0.42, 0.5, 1, 8, 3.5, M));
    if (has("obliques")) out.push(segEllipse(hip, sh, 0.42, 0.45, 1, 1, 4.5, M));
    if (has("back")) out.push(segEllipse(hip, sh, 0.62, 0.5, -1, 8, 5, M));
    if (has("lowerBack")) out.push(segEllipse(hip, sh, 0.25, 0.35, -1, 8, 3.5, M));
    if (has("traps")) out.push(segEllipse(hip, sh, 0.98, 0.25, -1, 6, 4, M));
    if (has("glutes")) out.push(ellipseAt(add(add(hip, mul(perp, -8)), mul(tu, -1)), 8, 7, Math.atan2(tu[1], tu[0]) * 180 / Math.PI, M));
    if (has("abductors")) out.push(circle(add(hip, mul(tu, 5)), 5.5, M));

    // perna da frente
    const knee = J("knee"), ankle = J("ankle");
    out.push(drawLimb(hip, knee, ankle, 14, 11, colors.body), line(ankle, J("toe"), 6, colors.body));
    if (has("quads")) out.push(segEllipse(hip, knee, 0.55, 0.75, -1, 3, 4.5, M));
    if (has("hamstrings")) out.push(segEllipse(hip, knee, 0.55, 0.7, 1, 3, 4, M));
    if (has("adductors")) out.push(segEllipse(hip, knee, 0.4, 0.55, 1, 0, 3.5, M));
    if (has("calves")) out.push(segEllipse(knee, ankle, 0.32, 0.5, 1, 2.5, 4, M));

    // braço da frente
    const elbow = J("elbow"), hand = J("hand");
    out.push(drawLimb(sh, elbow, hand, 10, 8, colors.body), circle(hand, 4.5, colors.body));
    if (has("delts")) out.push(segEllipse(sh, elbow, 0.12, 0.4, 1, 0, 6, M));
    if (has("rearDelts")) out.push(segEllipse(sh, elbow, 0.15, 0.35, 1, 2.5, 4.5, M));
    if (has("biceps")) out.push(segEllipse(sh, elbow, 0.58, 0.55, -1, 2, 3.2, M));
    if (has("triceps")) out.push(segEllipse(sh, elbow, 0.58, 0.55, 1, 2, 3.2, M));
    if (has("forearms")) out.push(segEllipse(elbow, hand, 0.35, 0.5, 1, 0, 3, M));
  } else {
    const hip = J("hip"), sc = J("shoulder"), head = J("head");
    const shR = add(sc, [SHOULDER_HALF, -pose.shrug]);
    const shL = add(sc, [-SHOULDER_HALF, -pose.shrug]);
    const hipR = add(hip, [HIP_HALF, 0]);
    const hipL = add(hip, [-HIP_HALF, 0]);
    const body = colors.body;
    // pernas
    for (const [h, k, a, tt] of [[hipL, J("kneeF"), J("ankleF"), J("toeF")], [hipR, J("knee"), J("ankle"), J("toe")]] as Pt[][]) {
      out.push(drawLimb(h, k, a, 14, 11, body), line(a, tt, 6, body));
    }
    // tronco
    out.push(poly([add(hip, [-11, 2]), add(sc, [-14, 0]), add(sc, [14, 0]), add(hip, [11, 2])], body));
    out.push(line(add(sc, [-6, 0]), shL, 9, body), line(add(sc, [6, 0]), shR, 9, body));
    out.push(line(sc, head, 8, body), circle(head, L.head, body));
    // músculos tronco/pernas
    const tAt = (k: number): Pt => add(hip, mul(sub(sc, hip), k));
    if (has("chest")) out.push(ellipseAt(add(tAt(0.8), [-7, 0]), 7, 5, 0, M), ellipseAt(add(tAt(0.8), [7, 0]), 7, 5, 0, M));
    if (has("abs")) out.push(ellipseAt(tAt(0.42), 5.5, 10, 0, M));
    if (has("obliques")) out.push(ellipseAt(add(tAt(0.4), [-10, 0]), 3, 8, 0, M), ellipseAt(add(tAt(0.4), [10, 0]), 3, 8, 0, M));
    if (has("back")) out.push(ellipseAt(add(tAt(0.62), [-13, 0]), 3.5, 9, -8, M), ellipseAt(add(tAt(0.62), [13, 0]), 3.5, 9, 8, M));
    if (has("lowerBack")) out.push(ellipseAt(tAt(0.2), 6, 4, 0, M));
    if (has("traps")) out.push(ellipseAt(add(sc, [-8, -3]), 6, 3, -20, M), ellipseAt(add(sc, [8, -3]), 6, 3, 20, M));
    if (has("glutes") || has("abductors")) out.push(ellipseAt(add(hipL, [-6, -2]), 4, 7, 0, M), ellipseAt(add(hipR, [6, -2]), 4, 7, 0, M));
    for (const [h, k, a, s] of [[hipL, J("kneeF"), J("ankleF"), 1], [hipR, J("knee"), J("ankle"), -1]] as [Pt, Pt, Pt, number][]) {
      if (has("quads") || has("hamstrings")) out.push(segEllipse(h, k, 0.55, 0.7, 1, 0, 4.5, M));
      if (has("adductors")) out.push(segEllipse(h, k, 0.38, 0.5, s, 4, 3, M));
      if (has("calves")) out.push(segEllipse(k, a, 0.32, 0.5, 1, 0, 4, M));
    }
    // braços
    for (const [s, e, h] of [[shL, J("elbowF"), J("handF")], [shR, J("elbow"), J("hand")]] as Pt[][]) {
      out.push(drawLimb(s, e, h, 10, 8, body), circle(h, 4.5, body));
      if (has("delts") || has("rearDelts")) out.push(circle(s, 6.5, M));
      if (has("biceps") || has("triceps")) out.push(segEllipse(s, e, 0.6, 0.55, 1, 0, 3.2, M));
      if (has("forearms")) out.push(segEllipse(e, h, 0.35, 0.5, 1, 0, 3, M));
    }
  }

  // equipamentos da frente
  for (const p of props) {
    if (p.k === "barbell") {
      if (front) {
        const h1 = J("hand"), h2 = J("handF");
        const y = (h1[1] + h2[1]) / 2;
        const xa = Math.min(h1[0], h2[0]) - 34, xb = Math.max(h1[0], h2[0]) + 34;
        out.push(line([xa, y], [xb, y], 3, colors.prop));
        out.push(rect(xa - 4, y - 16, 7, 32, colors.propDark, 2), rect(xb - 3, y - 16, 7, 32, colors.propDark, 2));
      } else if (p.at !== "shoulder") {
        const at = J(p.at ?? "hand");
        out.push(circle(at, 16, colors.propDark, `stroke="${colors.prop}" stroke-width="2"`), circle(at, 3, colors.prop));
      }
    } else if (p.k === "dumbbell") {
      if (front) {
        for (const h of p.single ? [J(p.at ?? "hand")] : [J("hand"), J("handF")]) {
          out.push(line([h[0] - 8, h[1]], [h[0] + 8, h[1]], 3, colors.prop));
          out.push(rect(h[0] - 11, h[1] - 6, 5, 12, colors.propDark, 1.5), rect(h[0] + 6, h[1] - 6, 5, 12, colors.propDark, 1.5));
        }
      } else {
        out.push(sideDumbbell(J(p.at ?? "hand"), colors, false));
      }
    } else if (p.k === "kettlebell") {
      const h = J(p.at ?? "hand");
      out.push(circle(add(h, [0, 9]), 8, colors.propDark, `stroke="${colors.prop}" stroke-width="2"`));
    } else if (p.k === "cable" || p.k === "lever") {
      const to = J(p.to ?? "hand");
      const pairs: [Pt, Pt][] = [[p.from, to]];
      if (front && !p.single) {
        const toF = J(((p.to ?? "hand") + "F") as Joint);
        pairs.push([mirror(p.from), toF]);
      }
      for (const [f, tt] of pairs) {
        if (p.k === "cable") out.push(line(f, tt, 1.6, colors.prop), circle(f, 4, colors.propDark, `stroke="${colors.prop}" stroke-width="1.5"`));
        else out.push(line(f, tt, 5, colors.prop), circle(f, 4.5, colors.propDark), circle(tt, 3, colors.prop));
      }
    } else if (p.k === "pad") {
      const pts = [J(p.at)];
      if (front) pts.push(J((p.at + "F") as Joint));
      for (const q of pts) out.push(circle(add(q, [p.dx ?? 0, p.dy ?? 0]), p.r ?? 6, colors.prop));
    } else if (p.k === "platform") {
      const a = J(p.far ? "ankleF" : "ankle"), tt = J(p.far ? "toeF" : "toe");
      const d = sub(tt, a);
      const len = Math.hypot(d[0], d[1]) || 1;
      const u: Pt = [d[0] / len, d[1] / len];
      const n: Pt = [-u[1], u[0]];
      const s = add(add(a, mul(u, -10)), mul(n, 6));
      const e = add(add(tt, mul(u, 10)), mul(n, 6));
      out.push(line(s, e, 5, colors.prop));
    }
  }
  return out.join("");
}

function sideDumbbell(h: Pt, colors: FigureColors, far: boolean) {
  return circle(h, 8, far ? colors.propDark : colors.prop, `stroke="${colors.propDark}" stroke-width="2"`) + circle(h, 2.5, colors.propDark);
}

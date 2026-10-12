/* eslint-disable prettier/prettier */
/**
 * Catálogo dos exemplos de exercício: nome, grupo, apelidos e passo a passo.
 * O desenho animado de cada um fica em exercise-figures-data.ts (mesmo slug).
 *
 * O nome do exercício no treino é texto livre digitado pelo coach, então a
 * busca é por apelidos: normaliza o nome (+ equipamento) e escolhe o apelido
 * mais longo que aparece nele. Ex: "Supino Inclinado" + "Halter" →
 * "supino inclinado halter".
 */

export interface ExerciseDemo {
  slug: string;
  name: string;
  group: string;
  aliases: string[];
  steps: string[];
}

export const EXERCISE_DEMOS: ExerciseDemo[] = [
  // ── Peito ────────────────────────────────────────────────────────────────
  { slug: "supino-reto", name: "Supino Reto", group: "Peito",
    aliases: ["supino reto", "supino reto barra", "supino", "bench press"],
    steps: ["Deite no banco com os pés firmes no chão e escápulas retraídas.", "Desça a barra controlando até a linha do peito.", "Empurre de volta até estender os braços, sem tirar o quadril do banco."] },
  { slug: "supino-reto-halter", name: "Supino Reto com Halter", group: "Peito",
    aliases: ["supino reto halter", "supino halter", "supino reto halteres", "supino halteres"],
    steps: ["Deite no banco com um halter em cada mão, na linha do peito.", "Empurre os halteres para cima, aproximando-os no topo.", "Desça devagar até sentir o alongamento do peitoral."] },
  { slug: "supino-inclinado", name: "Supino Inclinado", group: "Peito",
    aliases: ["supino inclinado", "supino inclinado barra", "incline bench"],
    steps: ["Banco inclinado entre 30° e 45°.", "Desça a barra até a parte alta do peito.", "Empurre para cima mantendo as escápulas retraídas."] },
  { slug: "supino-inclinado-halter", name: "Supino Inclinado com Halter", group: "Peito",
    aliases: ["supino inclinado halter", "supino inclinado halteres"],
    steps: ["Banco inclinado entre 30° e 45°, halteres na linha do peito.", "Empurre para cima aproximando os halteres.", "Desça controlando, cotovelos levemente abaixo da linha do ombro."] },
  { slug: "supino-declinado", name: "Supino Declinado", group: "Peito",
    aliases: ["supino declinado", "supino declinado barra"],
    steps: ["Prenda as pernas no apoio do banco declinado.", "Desça a barra até a parte baixa do peito.", "Empurre para cima sem travar os cotovelos."] },
  { slug: "supino-maquina", name: "Supino Máquina", group: "Peito",
    aliases: ["supino maquina", "supino articulado", "chest press", "supino reto maquina"],
    steps: ["Ajuste o banco para a pegada ficar na linha do peito.", "Empurre as alças até estender os braços.", "Volte devagar sem deixar a carga encostar."] },
  { slug: "supino-smith", name: "Supino no Smith", group: "Peito",
    aliases: ["supino smith", "supino reto smith"],
    steps: ["Posicione o banco para a barra descer na linha do peito.", "Destrave a barra e desça controlando.", "Empurre para cima e trave a barra ao final da série."] },
  { slug: "crucifixo", name: "Crucifixo", group: "Peito",
    aliases: ["crucifixo", "crucifixo reto", "crucifixo halter", "fly"],
    steps: ["Deitado, halteres acima do peito com cotovelos levemente flexionados.", "Abra os braços em arco até sentir o alongamento.", "Feche em arco como se fosse abraçar uma árvore."] },
  { slug: "crucifixo-inclinado", name: "Crucifixo Inclinado", group: "Peito",
    aliases: ["crucifixo inclinado"],
    steps: ["Banco inclinado, halteres acima do peito.", "Abra em arco mantendo o cotovelo levemente dobrado.", "Feche contraindo a parte alta do peitoral."] },
  { slug: "peck-deck", name: "Peck Deck (Voador)", group: "Peito",
    aliases: ["peck deck", "pec deck", "voador", "fly maquina", "crucifixo maquina", "butterfly"],
    steps: ["Sente com as costas apoiadas e braços na altura do peito.", "Feche os braços à frente contraindo o peitoral.", "Volte devagar até sentir o alongamento."] },
  { slug: "crossover", name: "Crossover", group: "Peito",
    aliases: ["crossover", "cross over", "crucifixo cabo", "crucifixo polia"],
    steps: ["Pegue as alças no alto com um pé à frente.", "Traga as mãos para baixo e à frente, cruzando na linha do quadril.", "Volte controlando, mantendo o tronco levemente inclinado."] },
  { slug: "flexao", name: "Flexão de Braço", group: "Peito",
    aliases: ["flexao", "flexao braco", "flexoes", "push up", "pushup"],
    steps: ["Mãos um pouco mais abertas que os ombros, corpo em linha reta.", "Desça o peito até perto do chão.", "Empurre de volta sem deixar o quadril cair."] },
  { slug: "paralelas", name: "Paralelas (Mergulho)", group: "Peito",
    aliases: ["paralelas", "paralela", "mergulho", "mergulho paralelas", "dips", "dip"],
    steps: ["Apoie-se nas barras com os braços estendidos.", "Incline o tronco à frente e desça até ~90° no cotovelo.", "Empurre de volta à posição inicial."] },
  { slug: "pullover", name: "Pullover", group: "Peito",
    aliases: ["pullover", "pull over", "pullover halter"],
    steps: ["Deitado no banco, segure um halter acima do peito com as duas mãos.", "Leve o halter para trás da cabeça com os braços quase estendidos.", "Retorne em arco até acima do peito."] },

  // ── Costas ───────────────────────────────────────────────────────────────
  { slug: "barra-fixa", name: "Barra Fixa", group: "Costas",
    aliases: ["barra fixa", "barra fixa pronada", "pull up", "pullup", "pull ups"],
    steps: ["Pegada pronada um pouco mais aberta que os ombros.", "Puxe até o queixo passar a barra, levando os cotovelos para baixo.", "Desça controlando até estender os braços."] },
  { slug: "barra-fixa-supinada", name: "Barra Fixa Supinada", group: "Costas",
    aliases: ["barra fixa supinada", "barra supinada", "chin up", "chinup"],
    steps: ["Pegada supinada (palmas para você) na largura dos ombros.", "Puxe até o queixo passar a barra.", "Desça devagar até a extensão completa."] },
  { slug: "pulldown-aberto", name: "Puxada Frontal Aberta", group: "Costas",
    aliases: ["pulldown", "pulldown aberto", "puxada", "puxada frontal", "puxada aberta", "puxada alta", "puxada pronada", "lat pulldown", "pull down"],
    steps: ["Sente com as coxas presas e pegada aberta.", "Puxe a barra até a parte alta do peito, peito para frente.", "Volte controlando até estender os braços."] },
  { slug: "puxada-triangulo", name: "Puxada com Triângulo", group: "Costas",
    aliases: ["puxada triangulo", "pulldown triangulo", "puxada fechada", "pulldown fechado", "puxada neutra"],
    steps: ["Use o triângulo e sente com as coxas presas.", "Puxe até o peito levando os cotovelos para baixo e para trás.", "Volte devagar alongando as costas."] },
  { slug: "puxada-supinada", name: "Puxada Supinada", group: "Costas",
    aliases: ["puxada supinada", "pulldown supinado"],
    steps: ["Pegada supinada na largura dos ombros.", "Puxe a barra até o peito.", "Volte controlando."] },
  { slug: "remada-curvada", name: "Remada Curvada", group: "Costas",
    aliases: ["remada curvada", "remada curvada barra", "remada barra"],
    steps: ["Incline o tronco à frente com joelhos levemente flexionados e coluna neutra.", "Puxe a barra até o abdômen, cotovelos próximos ao corpo.", "Desça controlando sem arredondar as costas."] },
  { slug: "remada-curvada-supinada", name: "Remada Curvada Supinada", group: "Costas",
    aliases: ["remada curvada supinada", "remada supinada"],
    steps: ["Pegada supinada, tronco inclinado e coluna neutra.", "Puxe a barra até a linha do umbigo.", "Desça devagar."] },
  { slug: "remada-baixa", name: "Remada Baixa", group: "Costas",
    aliases: ["remada baixa", "remada sentada", "remada cabo", "remada polia", "remada triangulo", "seated row"],
    steps: ["Sente com joelhos levemente flexionados e coluna ereta.", "Puxe o triângulo até o abdômen, juntando as escápulas.", "Estenda os braços devagar sem curvar as costas."] },
  { slug: "serrote", name: "Serrote (Remada Unilateral)", group: "Costas",
    aliases: ["serrote", "remada unilateral", "remada unilateral halter", "remada halter"],
    steps: ["Apoie joelho e mão do mesmo lado no banco.", "Puxe o halter até o quadril, cotovelo junto ao corpo.", "Desça alongando bem as costas."] },
  { slug: "remada-cavalinho", name: "Remada Cavalinho", group: "Costas",
    aliases: ["remada cavalinho", "cavalinho", "remada t", "t bar", "remada t bar"],
    steps: ["Pernas afastadas, tronco inclinado e coluna neutra.", "Puxe a pegada até o peito.", "Desça controlando."] },
  { slug: "remada-maquina", name: "Remada na Máquina", group: "Costas",
    aliases: ["remada maquina", "remada articulada", "remada sentada maquina"],
    steps: ["Peito apoiado no suporte, braços estendidos.", "Puxe as alças levando os cotovelos para trás.", "Volte devagar."] },
  { slug: "remada-alta", name: "Remada Alta", group: "Ombro",
    aliases: ["remada alta", "upright row"],
    steps: ["Em pé, barra à frente das coxas com pegada fechada.", "Puxe até a altura do peito, cotovelos acima das mãos.", "Desça devagar."] },
  { slug: "pulldown-braco-reto", name: "Pulldown Braço Reto", group: "Costas",
    aliases: ["pulldown braco reto", "pulldown braco estendido", "pullover cabo", "pullover polia", "puxada braco reto", "straight arm pulldown"],
    steps: ["Em pé, braços estendidos segurando a barra no alto.", "Traga a barra até as coxas sem dobrar os cotovelos.", "Volte controlando até a altura da cabeça."] },
  { slug: "deadlift", name: "Levantamento Terra (Deadlift)", group: "Costas",
    aliases: ["deadlift", "levantamento terra", "terra", "terra convencional"],
    steps: ["Pés na largura do quadril, barra sobre o meio do pé.", "Coluna neutra, empurre o chão e suba com a barra rente às pernas.", "Desça levando o quadril para trás, sem arredondar as costas."] },
  { slug: "terra-sumo", name: "Terra Sumô", group: "Pernas",
    aliases: ["terra sumo", "sumo deadlift", "levantamento terra sumo"],
    steps: ["Pés bem afastados e pontas para fora, mãos por dentro das pernas.", "Suba empurrando o chão com peito aberto.", "Desça controlando com a barra perto do corpo."] },
  { slug: "hiperextensao", name: "Hiperextensão Lombar", group: "Costas",
    aliases: ["hiperextensao", "hiperextensao lombar", "extensao lombar", "lombar banco", "banco romano"],
    steps: ["Apoie o quadril no banco e prenda os pés.", "Desça o tronco com a coluna neutra.", "Suba até alinhar o tronco com as pernas, sem hiperestender."] },
  { slug: "encolhimento", name: "Encolhimento", group: "Costas",
    aliases: ["encolhimento", "encolhimento halter", "encolhimento barra", "shrug", "trapezio"],
    steps: ["Em pé, halteres ao lado do corpo.", "Eleve os ombros em direção às orelhas.", "Segure 1s no topo e desça devagar."] },

  // ── Ombro ────────────────────────────────────────────────────────────────
  { slug: "desenvolvimento-halter", name: "Desenvolvimento com Halter", group: "Ombro",
    aliases: ["desenvolvimento", "desenvolvimento halter", "desenvolvimento halteres", "desenvolvimento sentado", "shoulder press"],
    steps: ["Sentado, halteres na altura das orelhas.", "Empurre para cima até quase estender os braços.", "Desça controlando até a altura das orelhas."] },
  { slug: "press-overhead", name: "Desenvolvimento Militar (Press Overhead)", group: "Ombro",
    aliases: ["press overhead", "overhead press", "desenvolvimento militar", "desenvolvimento barra", "militar", "desenvolvimento em pe"],
    steps: ["Em pé, barra apoiada na parte alta do peito.", "Empurre acima da cabeça, glúteos e abdômen contraídos.", "Desça a barra de volta ao peito controlando."] },
  { slug: "desenvolvimento-maquina", name: "Desenvolvimento na Máquina", group: "Ombro",
    aliases: ["desenvolvimento maquina", "desenvolvimento articulado"],
    steps: ["Ajuste o banco para as alças ficarem na altura dos ombros.", "Empurre para cima.", "Volte devagar."] },
  { slug: "desenvolvimento-arnold", name: "Desenvolvimento Arnold", group: "Ombro",
    aliases: ["arnold", "desenvolvimento arnold", "arnold press"],
    steps: ["Comece com halteres à frente do rosto, palmas para você.", "Gire as palmas para frente enquanto empurra para cima.", "Volte fazendo o giro inverso."] },
  { slug: "elevacao-lateral", name: "Elevação Lateral", group: "Ombro",
    aliases: ["elevacao lateral", "elevacao lateral halter", "lateral raise", "abducao ombro"],
    steps: ["Em pé, halteres ao lado do corpo e cotovelos levemente flexionados.", "Eleve os braços pelas laterais até a altura dos ombros.", "Desça devagar sem balançar o tronco."] },
  { slug: "elevacao-lateral-cabo", name: "Elevação Lateral no Cabo", group: "Ombro",
    aliases: ["elevacao lateral cabo", "elevacao lateral polia"],
    steps: ["Segure a alça da polia baixa com a mão oposta.", "Eleve o braço lateralmente até a linha do ombro.", "Volte controlando."] },
  { slug: "elevacao-frontal", name: "Elevação Frontal", group: "Ombro",
    aliases: ["elevacao frontal", "elevacao frontal halter", "front raise"],
    steps: ["Em pé, halteres à frente das coxas.", "Eleve os braços à frente até a altura dos ombros.", "Desça devagar."] },
  { slug: "crucifixo-inverso", name: "Crucifixo Inverso", group: "Ombro",
    aliases: ["crucifixo inverso", "crucifixo invertido", "posterior ombro", "deltoide posterior", "reverse fly"],
    steps: ["Incline o tronco à frente com halteres abaixo do peito.", "Abra os braços para os lados juntando as escápulas.", "Desça controlando."] },
  { slug: "voador-invertido", name: "Voador Invertido", group: "Ombro",
    aliases: ["voador invertido", "peck deck invertido", "pec deck invertido", "crucifixo inverso maquina"],
    steps: ["Sente de frente para a máquina, peito no apoio.", "Abra os braços para trás até a linha do corpo.", "Volte devagar."] },
  { slug: "face-pull", name: "Face Pull", group: "Ombro",
    aliases: ["face pull", "facepull", "puxada face"],
    steps: ["Corda na polia alta, na altura do rosto.", "Puxe em direção ao rosto abrindo os cotovelos.", "Volte controlando."] },

  // ── Tríceps ──────────────────────────────────────────────────────────────
  { slug: "triceps-corda", name: "Tríceps Corda", group: "Tríceps",
    aliases: ["triceps corda", "triceps pulley corda", "triceps polia corda"],
    steps: ["Cotovelos colados ao corpo, segurando a corda.", "Estenda os braços abrindo a corda no final.", "Volte até 90° sem mexer os cotovelos."] },
  { slug: "triceps-pulley", name: "Tríceps Pulley", group: "Tríceps",
    aliases: ["triceps pulley", "triceps polia", "triceps cabo", "triceps barra", "triceps barra reta", "pushdown", "triceps pushdown"],
    steps: ["Cotovelos junto ao corpo, segurando a barra.", "Empurre para baixo até estender os braços.", "Suba controlando sem afastar os cotovelos."] },
  { slug: "triceps-frances", name: "Tríceps Francês", group: "Tríceps",
    aliases: ["triceps frances", "frances", "triceps frances halter", "triceps nuca"],
    steps: ["Segure o halter com as duas mãos acima da cabeça.", "Desça atrás da cabeça dobrando só os cotovelos.", "Estenda os braços de volta."] },
  { slug: "triceps-frances-corda", name: "Tríceps Francês na Polia", group: "Tríceps",
    aliases: ["triceps frances corda", "triceps frances polia", "triceps frances cabo", "triceps overhead", "triceps acima cabeca"],
    steps: ["De costas para a polia, corda atrás da cabeça.", "Estenda os braços à frente e para cima.", "Volte controlando, cotovelos apontando para frente."] },
  { slug: "triceps-testa", name: "Tríceps Testa", group: "Tríceps",
    aliases: ["triceps testa", "testa", "skull crusher", "skullcrusher"],
    steps: ["Deitado, barra acima do peito com braços estendidos.", "Dobre os cotovelos levando a barra em direção à testa.", "Estenda os braços de volta sem abrir os cotovelos."] },
  { slug: "triceps-coice", name: "Tríceps Coice", group: "Tríceps",
    aliases: ["triceps coice", "coice", "triceps kickback", "kickback"],
    steps: ["Tronco inclinado, cotovelo colado ao corpo a 90°.", "Estenda o braço para trás.", "Volte devagar até 90°."] },
  { slug: "triceps-banco", name: "Tríceps Banco", group: "Tríceps",
    aliases: ["triceps banco", "mergulho banco", "bench dip"],
    steps: ["Mãos no banco atrás do corpo, pernas à frente.", "Desça dobrando os cotovelos até ~90°.", "Empurre de volta."] },
  { slug: "supino-fechado", name: "Supino Fechado", group: "Tríceps",
    aliases: ["supino fechado", "supino pegada fechada", "close grip"],
    steps: ["Pegada na largura dos ombros.", "Desça a barra com os cotovelos junto ao corpo.", "Empurre de volta."] },

  // ── Bíceps ───────────────────────────────────────────────────────────────
  { slug: "rosca-direta", name: "Rosca Direta", group: "Bíceps",
    aliases: ["rosca direta", "rosca direta barra", "rosca barra", "rosca w", "barbell curl"],
    steps: ["Em pé, barra com pegada supinada e cotovelos ao lado do corpo.", "Flexione os cotovelos levando a barra até o peito.", "Desça devagar sem balançar o tronco."] },
  { slug: "rosca-alternada", name: "Rosca Alternada", group: "Bíceps",
    aliases: ["rosca alternada", "rosca halter", "rosca direta halter", "rosca alternada halter"],
    steps: ["Em pé, um halter em cada mão.", "Suba um braço de cada vez girando a palma para cima.", "Desça controlando antes de trocar de braço."] },
  { slug: "rosca-martelo", name: "Rosca Martelo", group: "Bíceps",
    aliases: ["rosca martelo", "martelo", "hammer curl"],
    steps: ["Halteres com pegada neutra (palmas viradas para o corpo).", "Flexione os cotovelos mantendo a pegada.", "Desça devagar."] },
  { slug: "rosca-scott", name: "Rosca Scott", group: "Bíceps",
    aliases: ["rosca scott", "scott", "rosca banco scott", "preacher curl"],
    steps: ["Braços apoiados no banco Scott.", "Suba a barra contraindo o bíceps.", "Desça até quase estender, sem travar o cotovelo."] },
  { slug: "rosca-concentrada", name: "Rosca Concentrada", group: "Bíceps",
    aliases: ["rosca concentrada", "concentrada"],
    steps: ["Sentado, cotovelo apoiado na parte interna da coxa.", "Suba o halter até o ombro.", "Desça devagar."] },
  { slug: "rosca-cabo", name: "Rosca no Cabo", group: "Bíceps",
    aliases: ["rosca cabo", "rosca polia", "rosca direta cabo", "rosca direta polia"],
    steps: ["De frente para a polia baixa, cotovelos ao lado do corpo.", "Flexione os cotovelos até o peito.", "Desça controlando."] },
  { slug: "rosca-inclinada", name: "Rosca Inclinada", group: "Bíceps",
    aliases: ["rosca inclinada", "rosca banco inclinado"],
    steps: ["Sentado em banco inclinado, braços estendidos para baixo.", "Suba os halteres sem mover os cotovelos.", "Desça até alongar o bíceps."] },
  { slug: "rosca-inversa", name: "Rosca Inversa", group: "Bíceps",
    aliases: ["rosca inversa", "rosca pronada"],
    steps: ["Pegada pronada (palmas para baixo).", "Flexione os cotovelos até o peito.", "Desça devagar."] },

  // ── Pernas ───────────────────────────────────────────────────────────────
  { slug: "agachamento-livre", name: "Agachamento Livre", group: "Pernas",
    aliases: ["agachamento", "agachamento livre", "agachamento barra", "agachamento costas", "squat", "back squat"],
    steps: ["Barra apoiada no trapézio, pés na largura dos ombros.", "Desça levando o quadril para trás, joelhos na linha dos pés.", "Suba empurrando o chão com o peito aberto."] },
  { slug: "agachamento-frontal", name: "Agachamento Frontal", group: "Pernas",
    aliases: ["agachamento frontal", "front squat"],
    steps: ["Barra apoiada na frente dos ombros, cotovelos altos.", "Desça mantendo o tronco o mais vertical possível.", "Suba empurrando o chão."] },
  { slug: "agachamento-goblet", name: "Agachamento Goblet", group: "Pernas",
    aliases: ["agachamento goblet", "goblet", "goblet squat", "agachamento taca"],
    steps: ["Segure o peso junto ao peito.", "Agache mantendo o tronco ereto e cotovelos entre os joelhos.", "Suba empurrando o chão."] },
  { slug: "agachamento-smith", name: "Agachamento no Smith", group: "Pernas",
    aliases: ["agachamento smith", "smith"],
    steps: ["Barra no trapézio, pés levemente à frente do corpo.", "Destrave e desça até as coxas ficarem paralelas ao chão.", "Suba e trave a barra ao final."] },
  { slug: "agachamento-sumo", name: "Agachamento Sumô", group: "Pernas",
    aliases: ["agachamento sumo", "sumo", "plie", "agachamento plie"],
    steps: ["Pés bem afastados e pontas para fora, halter entre as pernas.", "Desça mantendo o tronco ereto.", "Suba contraindo glúteos e adutores."] },
  { slug: "hack", name: "Agachamento Hack", group: "Pernas",
    aliases: ["hack", "hack squat", "agachamento hack", "hack machine"],
    steps: ["Costas apoiadas e ombros sob as almofadas.", "Desça até ~90° no joelho.", "Empurre a plataforma para subir."] },
  { slug: "leg-press", name: "Leg Press 45°", group: "Pernas",
    aliases: ["leg press", "leg press 45", "leg 45", "leg press 45°", "legpress"],
    steps: ["Pés na plataforma na largura dos ombros.", "Desça até ~90° sem tirar o quadril do banco.", "Empurre sem travar os joelhos no topo."] },
  { slug: "afundo", name: "Afundo / Passada", group: "Pernas",
    aliases: ["afundo", "passada", "avanco", "lunge", "afundo halter", "passada halter"],
    steps: ["Dê um passo à frente com halteres ao lado do corpo.", "Desça até o joelho de trás quase tocar o chão.", "Empurre com a perna da frente para voltar."] },
  { slug: "agachamento-bulgaro", name: "Agachamento Búlgaro", group: "Pernas",
    aliases: ["agachamento bulgaro", "bulgaro", "split squat", "afundo bulgaro"],
    steps: ["Pé de trás apoiado no banco, halteres nas mãos.", "Desça na vertical até a coxa da frente ficar paralela.", "Suba empurrando com a perna da frente."] },
  { slug: "cadeira-extensora", name: "Cadeira Extensora", group: "Pernas",
    aliases: ["cadeira extensora", "extensora", "leg extension"],
    steps: ["Ajuste o apoio logo acima do tornozelo.", "Estenda os joelhos até as pernas ficarem retas.", "Desça devagar."] },
  { slug: "mesa-flexora", name: "Mesa Flexora", group: "Pernas",
    aliases: ["mesa flexora", "flexora", "flexora deitada", "leg curl"],
    steps: ["Deitado de bruços, apoio acima do calcanhar.", "Flexione os joelhos trazendo os pés aos glúteos.", "Desça controlando sem tirar o quadril do banco."] },
  { slug: "cadeira-flexora", name: "Cadeira Flexora", group: "Pernas",
    aliases: ["cadeira flexora", "flexora sentada"],
    steps: ["Sentado, apoio atrás do tornozelo e coxas presas.", "Flexione os joelhos para baixo.", "Volte devagar."] },
  { slug: "stiff", name: "Stiff", group: "Pernas",
    aliases: ["stiff", "stiff barra", "stiff halter", "stiff legged"],
    steps: ["Em pé, joelhos levemente flexionados.", "Desça a barra levando o quadril para trás, costas neutras.", "Suba contraindo glúteos e posteriores."] },
  { slug: "terra-romeno", name: "Levantamento Terra Romeno", group: "Pernas",
    aliases: ["terra romeno", "levantamento terra romeno", "romeno", "rdl", "romanian deadlift"],
    steps: ["Barra na altura do quadril, joelhos levemente flexionados.", "Empurre o quadril para trás deslizando a barra pelas coxas.", "Volte estendendo o quadril."] },
  { slug: "step-up", name: "Step Up (Subida no Banco)", group: "Pernas",
    aliases: ["step up", "subida banco", "subida caixa", "step"],
    steps: ["Halteres nas mãos, um pé sobre o banco.", "Suba empurrando com a perna de cima.", "Desça controlando e repita."] },
  { slug: "agachamento-peso-corporal", name: "Agachamento Peso Corporal", group: "Pernas",
    aliases: ["agachamento peso corporal", "agachamento livre peso corporal", "air squat"],
    steps: ["Pés na largura dos ombros, braços à frente.", "Agache levando o quadril para trás.", "Suba empurrando o chão."] },

  // ── Glúteos ──────────────────────────────────────────────────────────────
  { slug: "elevacao-pelvica", name: "Elevação Pélvica", group: "Glúteos",
    aliases: ["elevacao pelvica", "hip thrust", "elevacao quadril", "pelvica"],
    steps: ["Costas apoiadas no banco, barra sobre o quadril.", "Eleve o quadril até alinhar com o tronco.", "Contraia os glúteos no topo e desça devagar."] },
  { slug: "ponte-gluteo", name: "Ponte de Glúteo", group: "Glúteos",
    aliases: ["ponte", "ponte gluteo", "glute bridge", "ponte gluteos"],
    steps: ["Deitado no chão, joelhos dobrados e barra sobre o quadril.", "Eleve o quadril contraindo os glúteos.", "Desça devagar."] },
  { slug: "cadeira-abdutora", name: "Cadeira Abdutora", group: "Glúteos",
    aliases: ["cadeira abdutora", "abdutora", "abducao", "abducao quadril"],
    steps: ["Sente com as pernas fechadas contra os apoios.", "Abra as pernas para fora.", "Feche devagar."] },
  { slug: "cadeira-adutora", name: "Cadeira Adutora", group: "Pernas",
    aliases: ["cadeira adutora", "adutora", "aducao", "aducao quadril"],
    steps: ["Sente com as pernas abertas contra os apoios.", "Feche as pernas contraindo a parte interna da coxa.", "Abra devagar."] },
  { slug: "gluteo-cabo", name: "Glúteo no Cabo (Coice)", group: "Glúteos",
    aliases: ["gluteo cabo", "gluteo polia", "coice gluteo", "coice cabo", "coice polia", "kickback gluteo", "extensao quadril cabo"],
    steps: ["Tornozeleira na polia baixa, segure no aparelho.", "Leve a perna para trás contraindo o glúteo.", "Volte devagar sem arquear a lombar."] },
  { slug: "gluteo-quatro-apoios", name: "Glúteo 4 Apoios", group: "Glúteos",
    aliases: ["gluteo 4 apoios", "gluteo quatro apoios", "4 apoios", "quatro apoios", "coice 4 apoios"],
    steps: ["Em 4 apoios, mãos abaixo dos ombros.", "Eleve uma perna para trás e para cima.", "Volte sem deixar a lombar arquear."] },
  { slug: "bom-dia", name: "Good Morning (Bom Dia)", group: "Pernas",
    aliases: ["good morning", "bom dia"],
    steps: ["Barra no trapézio, joelhos levemente flexionados.", "Incline o tronco levando o quadril para trás.", "Volte contraindo glúteos e posteriores."] },

  // ── Panturrilha ──────────────────────────────────────────────────────────
  { slug: "panturrilha-em-pe", name: "Panturrilha em Pé", group: "Panturrilha",
    aliases: ["panturrilha", "panturrilha pe", "gemeos", "panturrilha maquina", "calf raise"],
    steps: ["Pontas dos pés no degrau, calcanhares para fora.", "Suba na ponta dos pés o máximo possível.", "Desça até alongar bem a panturrilha."] },
  { slug: "panturrilha-sentado", name: "Panturrilha Sentado", group: "Panturrilha",
    aliases: ["panturrilha sentado", "panturrilha sentada", "gemeos sentado", "solear"],
    steps: ["Sentado, apoio sobre as coxas e pontas dos pés no degrau.", "Eleve os calcanhares.", "Desça devagar até alongar."] },
  { slug: "panturrilha-leg-press", name: "Panturrilha no Leg Press", group: "Panturrilha",
    aliases: ["panturrilha leg press", "panturrilha leg", "panturrilha leg 45"],
    steps: ["Pontas dos pés na borda inferior da plataforma.", "Empurre estendendo os tornozelos.", "Volte devagar, joelhos sempre estendidos."] },

  // ── Abdômen ──────────────────────────────────────────────────────────────
  { slug: "abdominal-crunch", name: "Abdominal Crunch", group: "Abdômen",
    aliases: ["abdominal", "abdominal crunch", "crunch", "abdominal supra", "supra", "abdominal reto"],
    steps: ["Deitado, joelhos dobrados e mãos atrás da cabeça.", "Suba o tronco tirando as escápulas do chão.", "Desça devagar sem puxar o pescoço."] },
  { slug: "prancha", name: "Prancha Isométrica", group: "Abdômen",
    aliases: ["prancha", "prancha isometrica", "plank", "prancha frontal"],
    steps: ["Apoie antebraços e pontas dos pés no chão.", "Corpo em linha reta, abdômen e glúteos contraídos.", "Segure a posição pelo tempo indicado."] },
  { slug: "abdominal-cabo", name: "Abdominal no Cabo", group: "Abdômen",
    aliases: ["abdominal cabo", "abdominal polia", "abdominal corda", "crunch cabo"],
    steps: ["Ajoelhado, corda na polia alta ao lado da cabeça.", "Flexione o tronco levando os cotovelos aos joelhos.", "Volte devagar."] },
  { slug: "abdominal-infra", name: "Abdominal Infra", group: "Abdômen",
    aliases: ["abdominal infra", "infra", "elevacao pernas", "elevacao pernas banco"],
    steps: ["Deitado, mãos apoiadas ao lado do corpo ou no banco.", "Eleve as pernas estendidas até 90°.", "Desça devagar sem encostar no chão."] },
  { slug: "elevacao-pernas-barra", name: "Elevação de Pernas na Barra", group: "Abdômen",
    aliases: ["elevacao pernas barra", "elevacao pernas suspenso", "abdominal suspenso", "abdominal barra", "hanging leg raise"],
    steps: ["Pendurado na barra com braços estendidos.", "Eleve as pernas até a altura do quadril ou mais.", "Desça controlando sem balançar."] },
  { slug: "abdominal-obliquo", name: "Abdominal Oblíquo", group: "Abdômen",
    aliases: ["abdominal obliquo", "obliquo", "obliquos", "abdominal lateral"],
    steps: ["Deitado de lado com joelhos dobrados.", "Eleve o tronco lateralmente contraindo o oblíquo.", "Desça devagar."] },
  { slug: "russian-twist", name: "Russian Twist", group: "Abdômen",
    aliases: ["russian twist", "giro russo", "rotacao tronco"],
    steps: ["Sentado com tronco inclinado e pés elevados.", "Gire o tronco de um lado para o outro.", "Mantenha o abdômen contraído o tempo todo."] },
  { slug: "abdominal-remador", name: "Abdominal Completo (Sit-Up)", group: "Abdômen",
    aliases: ["sit up", "abdominal completo", "abdominal remador"],
    steps: ["Deitado, joelhos dobrados e pés presos.", "Suba o tronco até ficar sentado.", "Desça devagar."] },
  { slug: "escalador", name: "Escalador (Mountain Climber)", group: "Abdômen",
    aliases: ["escalador", "mountain climber", "mountain climbers", "alpinista"],
    steps: ["Posição de prancha alta, braços estendidos.", "Leve um joelho em direção ao peito.", "Alterne as pernas rapidamente."] },
];

// palavras que não ajudam a identificar o exercício
const STOPWORDS = new Set(["de", "da", "do", "das", "dos", "com", "no", "na", "nos", "nas", "em", "o", "a", "e"]);

export function normalizeExerciseName(s: string): string[] {
  return (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((t) => t && !STOPWORDS.has(t));
}

function containsSequence(haystack: string[], needle: string[]): boolean {
  if (!needle.length || needle.length > haystack.length) return false;
  outer: for (let i = 0; i <= haystack.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) continue outer;
    }
    return true;
  }
  return false;
}

// índice pré-calculado: [tokens do apelido, demo]
const ALIAS_INDEX: [string[], ExerciseDemo][] = EXERCISE_DEMOS.flatMap((d) =>
  [d.name, ...d.aliases].map((a) => [normalizeExerciseName(a), d] as [string[], ExerciseDemo])
);

/**
 * Encontra a demonstração para um exercício do treino. O equipamento (se
 * houver) entra no fim do nome para desempatar variações (barra × halter).
 * Retorna null quando nenhum apelido bate — nesse caso o botão não aparece.
 */
export function findExerciseDemo(name: string, equipment?: string | null): ExerciseDemo | null {
  const tokens = normalizeExerciseName(`${name || ""} ${equipment || ""}`);
  if (!tokens.length) return null;
  let best: ExerciseDemo | null = null;
  let bestLen = 0;
  for (const [alias, demo] of ALIAS_INDEX) {
    if (alias.length > bestLen && containsSequence(tokens, alias)) {
      best = demo;
      bestLen = alias.length;
    }
  }
  return best;
}

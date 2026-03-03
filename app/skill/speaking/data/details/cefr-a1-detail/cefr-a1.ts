import type { SpeakingGoalDetail } from '../../detailTypes';
import type { SpeakingGoalCard } from '../../types';
import { CEFR_A1_GOALS } from '../../goals/cefr-a1';
import {
  COHERENCE_SECTION_OVERRIDES,
  MANUAL_ROLEPLAY_DIALOGS,
  MANUAL_ROLEPLAY_DIALOGS_ID,
  getScenarioBMission,
} from './overrides';

const PARTNER_BY_DOMAIN: Record<SpeakingGoalCard['domain'], string> = {
  daily: 'teman latihan',
  public: 'petugas layanan',
  work: 'rekan kerja',
  emergency: 'petugas darurat',
  legal: 'petugas administrasi',
  finance: 'kasir',
};

const splitDialogLines = (dialogText: string): string[] =>
  dialogText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const joinDialogLines = (lines: string[]): string => lines.join('\n');

const ensureScenarioFlowMission = (scenarioIndex: number, mission: string): string => {
  if (scenarioIndex !== 1) return mission;

  const normalized = mission.toLowerCase();
  if (
    normalized.startsWith('lanjutan dari scenario a') ||
    normalized.startsWith('lanjutan dari skenario a')
  ) {
    return mission;
  }

  return `Lanjutan dari Scenario A: ${mission}`;
};

const resolveKeySentencePattern = (scenarioIndex: number): number[] =>
  scenarioIndex === 0 ? [0, 1, 3, 4] : [2, 1, 3, 4];

const normalizeRoleplayPair = (
  goal: SpeakingGoalCard,
  examples: [string, string],
  examplesId: [string, string] | undefined,
): { roleplayExamples: [string, string]; roleplayExamplesId: [string, string] | undefined } => {
  const keySentencesId = goal.keySentencesId ?? [];

  const normalizedExamples = examples.map((example, scenarioIndex) => {
    const lines = splitDialogLines(example);
    const keyPattern = resolveKeySentencePattern(scenarioIndex);
    let youTurnCounter = 0;

    return joinDialogLines(
      lines.map((line) => {
        if (!line.startsWith('You:')) return line;
        const keyIndex = keyPattern[Math.min(youTurnCounter, keyPattern.length - 1)] ?? 0;
        youTurnCounter += 1;
        return `You: ${goal.keySentences[keyIndex]}`;
      }),
    );
  }) as [string, string];

  if (!examplesId) {
    return {
      roleplayExamples: normalizedExamples,
      roleplayExamplesId: undefined,
    };
  }

  const normalizedExamplesId = examplesId.map((exampleId, scenarioIndex) => {
    const idLines = splitDialogLines(exampleId);
    const enLines = splitDialogLines(normalizedExamples[scenarioIndex]);
    const keyPattern = resolveKeySentencePattern(scenarioIndex);
    let youTurnCounter = 0;

    return joinDialogLines(
      enLines.map((enLine, lineIndex) => {
        const fallbackLine = idLines[lineIndex] ?? '';
        if (!enLine.startsWith('You:')) return fallbackLine;

        const keyIndex = keyPattern[Math.min(youTurnCounter, keyPattern.length - 1)] ?? 0;
        youTurnCounter += 1;
        const idContent = keySentencesId[keyIndex] ?? fallbackLine.replace(/^You:\s*/, '').trim();
        return idContent;
      }),
    );
  }) as [string, string];

  return {
    roleplayExamples: normalizedExamples,
    roleplayExamplesId: normalizedExamplesId,
  };
};

function buildDetail(goal: SpeakingGoalCard): SpeakingGoalDetail {
  const [core1, core2, core3, variation1, variation2] = goal.keySentences;
  const partnerRole = PARTNER_BY_DOMAIN[goal.domain];
  const manualRoleplay = MANUAL_ROLEPLAY_DIALOGS[goal.id];
  const manualRoleplayId = MANUAL_ROLEPLAY_DIALOGS_ID[goal.id];
  const sectionOverride = COHERENCE_SECTION_OVERRIDES[goal.id];

  if (!manualRoleplay) {
    throw new Error(`Missing manual roleplay dialog for goal: ${goal.id}`);
  }

  const defaultRoleplayScenarios = [
    {
      title: 'Scenario A - Main Situation',
      partnerRole,
      mission: `Latihan konteks utama: ${goal.situation.toLowerCase()} Gunakan opening yang jelas, lalu konfirmasi detail penting.`,
    },
    {
      title: 'Scenario B - Clarification Turn',
      partnerRole,
      mission: getScenarioBMission(goal),
    },
  ];

  const roleplayScenarios = (sectionOverride?.roleplayScenarios ?? defaultRoleplayScenarios).map(
    (scenario, scenarioIndex) => ({
      ...scenario,
      mission: ensureScenarioFlowMission(scenarioIndex, scenario.mission),
    }),
  );

  const sourceRoleplayExamples = (sectionOverride?.roleplayExamples ?? [
    manualRoleplay[0],
    manualRoleplay[1],
  ]) as [string, string];
  const sourceRoleplayExamplesId = sectionOverride?.roleplayExamplesId
    ? [sectionOverride.roleplayExamplesId[0], sectionOverride.roleplayExamplesId[1]]
    : manualRoleplayId
      ? [manualRoleplayId[0], manualRoleplayId[1]]
      : undefined;
  const { roleplayExamples, roleplayExamplesId } = normalizeRoleplayPair(
    goal,
    sourceRoleplayExamples,
    sourceRoleplayExamplesId as [string, string] | undefined,
  );

  return {
    id: goal.id,
    phaseId: goal.phaseId,
    goalOrder: goal.goalOrder,
    goalSnapshot:
      sectionOverride?.goalSnapshot ??
      `Goal ini melatih kamu menyelesaikan momen speaking: ${goal.goal.toLowerCase()} Fokusnya adalah bicara singkat, jelas, dan tetap bisa dipahami lawan bicara pada percobaan pertama.`,
    whyThisMatters:
      sectionOverride?.whyThisMatters ??
      `Dalam konteks nyata (${goal.situation.toLowerCase()}), learner Indonesia sering macet di tengah kalimat. Dengan pola kalimat inti + konfirmasi, kamu bisa menjaga alur dan menurunkan risiko salah paham.`,
    situationBreakdown:
      sectionOverride?.situationBreakdown ?? [
        `Open: mulai dengan kalimat inti pertama: "${core1}"`,
        `Clarify: gunakan kalimat klarifikasi/repair: "${core3}" atau "${variation1}"`,
        `Close: tutup dengan kalimat aksi atau konfirmasi akhir: "${variation2}"`,
      ],
    pronunciationNotes:
      sectionOverride?.pronunciationNotes ?? [
        'Tekankan kata kerja utama pada awal kalimat agar intent langsung terbaca.',
        'Beri jeda pendek sebelum kalimat konfirmasi supaya tidak terdengar tergesa.',
        `Latih dua kalimat ini sebagai anchor: "${core1}" dan "${variation2}"`,
      ],
    commonMistakes:
      sectionOverride?.commonMistakes ?? [
        {
          mistake: 'Membuka terlalu panjang sebelum menyebut maksud utama.',
          correction: `Mulai dengan kalimat pendek: "${core1}"`,
        },
        {
          mistake: 'Tidak mengecek pemahaman lawan bicara.',
          correction: `Tambahkan kalimat cek: "${variation1}"`,
        },
        {
          mistake: 'Percakapan selesai tanpa next step.',
          correction: `Akhiri dengan kalimat penutup jelas: "${variation2}"`,
        },
      ],
    guidedDrills: [
      {
        level: 'basic',
        title: 'Core Line Repetition',
        instruction: 'Ulang 3 kalimat inti dengan tempo stabil, fokus artikulasi kata kunci.',
        target: '18 repetisi total, 3 menit.',
      },
      {
        level: 'bridge',
        title: 'Open-Repair-Close Loop',
        instruction: 'Mainkan urutan open -> clarify -> close tanpa jeda panjang.',
        target: '6 set, 2 menit per set.',
      },
      {
        level: 'stretch',
        title: 'Noise and Pressure Roleplay',
        instruction: 'Simulasikan interupsi, lalu pakai repair phrase untuk mengambil alih alur lagi.',
        target: '4 ronde, 3 menit per ronde.',
      },
    ],
    roleplayScenarios,
    guidedDrillsExamples: [
      `Basic card: "${core1}" lalu "${core2}" dengan artikulasi penuh.`,
      `Bridge card: buka dengan "${core1}", repair memakai "${core3}", tutup dengan "${variation2}".`,
      `Stretch card: saat bingung, pakai "${variation1}" lalu kembali ke line inti.`,
    ],
    roleplayExamples,
    roleplayExamplesId,
    selfCheckExamples: [
      `Saya membuka dengan kalimat inti tanpa berputar: "${core1}".`,
      `Saya memakai minimal satu repair phrase: "${core3}".`,
      `Saya mengecek pemahaman dengan kalimat konfirmasi: "${variation1}".`,
      `Saya selalu menutup dengan line aksi jelas: "${variation2}".`,
    ],
    selfCheckExample:
      'Contoh evaluasi cepat: beri skor 1 untuk open jelas, 1 untuk clarify, 1 untuk close. Target minimal 3/3 per ronde.',
    nextActionExample:
      `Contoh next action: rekam 3 sesi x 2 menit. Tiap sesi 6 putaran dengan pola "${core1}" -> "${core3}" -> "${variation2}".`,
    selfCheck: [
      'Saya menyebut tujuan utama dalam 1 kalimat pertama.',
      'Saya menggunakan repair phrase saat tidak paham.',
      'Saya konfirmasi ulang detail penting sebelum menutup.',
      'Saya menutup percakapan dengan kalimat tindakan yang konkret.',
    ],
    nextAction:
      `Lakukan 3 sesi latihan (2 menit per sesi), masing-masing 6 ronde. Target minimal 85 persen ronde selesai dengan pola open-clarify-close yang utuh.`,
  };
}

export const CEFR_A1_DETAIL_LIST: SpeakingGoalDetail[] = CEFR_A1_GOALS.map(buildDetail);

export const CEFR_A1_DETAILS_MAP: Record<string, SpeakingGoalDetail> = Object.fromEntries(
  CEFR_A1_DETAIL_LIST.map((detail) => [detail.id, detail]),
);

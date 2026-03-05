const goalsMod = await import('../app/skill/speaking/data/goals/index.ts');
const detailsMod = await import('../app/skill/speaking/data/details/index.ts');
const ipaMod = await import('../app/skill/speaking/data/ipa-map.ts');

const pickExport = (mod, key) => mod[key] ?? mod.default?.[key] ?? mod['module.exports']?.[key];

const SPEAKING_GOALS = pickExport(goalsMod, 'SPEAKING_GOALS');
const SPEAKING_GOAL_DETAILS = pickExport(detailsMod, 'SPEAKING_GOAL_DETAILS');
const getSpeakingIpaByText = pickExport(ipaMod, 'getSpeakingIpaByText');

if (!SPEAKING_GOALS || !SPEAKING_GOAL_DETAILS || !getSpeakingIpaByText) {
  throw new Error('Unable to load speaking dataset exports for audit.');
}

const MOJIBAKE_PATTERN = /[ÃÂÐÑËÉÎÅ]/;
const THAT_TEXT_PATTERN = /\bthat\b/i;
const WEAK_THAT_IPA_PATTERN = /\u00F0\u0259t/;
const OCLOCK_TEXT_PATTERN = /o'clock/i;
const TEACHING_OCLOCK_IPA_PATTERN = /\u0259\u02C8kl\u0251k/;
const FRIED_RICE_TEXT_PATTERN = /fried rice/i;
const TEACHING_FRIED_RICE_IPA_PATTERN = /fra\u026Ad ra\u026As/;
const MAX_REPORT_LINES = 120;

const toContent = (line) => line.replace(/^(Partner|You):\s*/, '').trim();
const toLines = (value) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const phaseStats = {
  'cefr-a1-1': { goals: 0, missingIpa: 0, dialogIssues: 0, scenarioIssues: 0, styleIssues: 0 },
  'cefr-a1-2': { goals: 0, missingIpa: 0, dialogIssues: 0, scenarioIssues: 0, styleIssues: 0 },
  'cefr-a1-3': { goals: 0, missingIpa: 0, dialogIssues: 0, scenarioIssues: 0, styleIssues: 0 },
};

const missingIpa = [];
const dialogIssues = [];
const scenarioIssues = [];
const idMismatchIssues = [];
const styleIssues = [];

function pushStyleIssue(phaseId, scope, text, ipa, reason) {
  styleIssues.push(`${scope}: ${reason} -> "${text}" => ${ipa}`);
  phaseStats[phaseId].styleIssues += 1;
}

for (const goal of SPEAKING_GOALS) {
  const detail = SPEAKING_GOAL_DETAILS[goal.id];
  if (!detail) continue;

  phaseStats[goal.phaseId].goals += 1;

  for (const sentence of goal.keySentences) {
    const ipa = getSpeakingIpaByText(sentence);
    if (!ipa) {
      missingIpa.push(`${goal.id}: key missing IPA -> "${sentence}"`);
      phaseStats[goal.phaseId].missingIpa += 1;
      continue;
    }
    if (MOJIBAKE_PATTERN.test(ipa)) {
      missingIpa.push(`${goal.id}: key IPA mojibake -> "${sentence}" => ${ipa}`);
      phaseStats[goal.phaseId].missingIpa += 1;
    }
    if (THAT_TEXT_PATTERN.test(sentence) && WEAK_THAT_IPA_PATTERN.test(ipa)) {
      pushStyleIssue(goal.phaseId, `${goal.id} key`, sentence, ipa, 'weak-form "that" ditemukan');
    }
    if (OCLOCK_TEXT_PATTERN.test(sentence) && !TEACHING_OCLOCK_IPA_PATTERN.test(ipa)) {
      pushStyleIssue(goal.phaseId, `${goal.id} key`, sentence, ipa, "o'clock belum /\\u0259\\u02C8kl\\u0251k/");
    }
    if (FRIED_RICE_TEXT_PATTERN.test(sentence) && !TEACHING_FRIED_RICE_IPA_PATTERN.test(ipa)) {
      pushStyleIssue(
        goal.phaseId,
        `${goal.id} key`,
        sentence,
        ipa,
        'fried rice belum /fra\\u026Ad ra\\u026As/',
      );
    }
  }

  if (detail.roleplayScenarios.length < 2) {
    scenarioIssues.push(`${goal.id}: roleplayScenarios kurang dari 2.`);
    phaseStats[goal.phaseId].scenarioIssues += 1;
  } else {
    const scenarioA = detail.roleplayScenarios[0];
    const scenarioB = detail.roleplayScenarios[1];
    if (!/^scenario a/i.test(scenarioA.title)) {
      scenarioIssues.push(`${goal.id}: title Scenario A tidak konsisten -> "${scenarioA.title}"`);
      phaseStats[goal.phaseId].scenarioIssues += 1;
    }
    if (!/^scenario b/i.test(scenarioB.title)) {
      scenarioIssues.push(`${goal.id}: title Scenario B tidak konsisten -> "${scenarioB.title}"`);
      phaseStats[goal.phaseId].scenarioIssues += 1;
    }
    if (!/^lanjutan dari scenario a/i.test(scenarioB.mission)) {
      scenarioIssues.push(`${goal.id}: mission Scenario B belum terhubung ke Scenario A.`);
      phaseStats[goal.phaseId].scenarioIssues += 1;
    }
    if (scenarioA.partnerRole.trim().toLowerCase() !== scenarioB.partnerRole.trim().toLowerCase()) {
      scenarioIssues.push(`${goal.id}: partnerRole Scenario A/B tidak konsisten.`);
      phaseStats[goal.phaseId].scenarioIssues += 1;
    }
  }

  detail.roleplayExamples.forEach((example, index) => {
    const lines = toLines(example);
    if (lines.length < 6) {
      dialogIssues.push(`${goal.id} scenario ${index + 1}: dialog < 6 line.`);
      phaseStats[goal.phaseId].dialogIssues += 1;
    }

    const allPartnerOrYou = lines.every((line) => /^(Partner|You):\s+/.test(line));
    if (!allPartnerOrYou) {
      dialogIssues.push(`${goal.id} scenario ${index + 1}: format speaker tidak valid.`);
      phaseStats[goal.phaseId].dialogIssues += 1;
    }

    for (let i = 1; i < lines.length; i += 1) {
      const prevSpeaker = lines[i - 1].startsWith('Partner:') ? 'Partner' : 'You';
      const currSpeaker = lines[i].startsWith('Partner:') ? 'Partner' : 'You';
      if (prevSpeaker === currSpeaker) {
        dialogIssues.push(`${goal.id} scenario ${index + 1}: turn-taking tidak alternating di line ${i + 1}.`);
        phaseStats[goal.phaseId].dialogIssues += 1;
        break;
      }
    }

    const youLines = lines.filter((line) => line.startsWith('You:')).map(toContent);
    const reusedCount = youLines.filter((line) => goal.keySentences.includes(line)).length;
    if (reusedCount < 3) {
      dialogIssues.push(`${goal.id} scenario ${index + 1}: key sentence reuse ${reusedCount}/3.`);
      phaseStats[goal.phaseId].dialogIssues += 1;
    }

    for (const line of lines) {
      const content = toContent(line);
      const ipa = getSpeakingIpaByText(content);
      if (!ipa) {
        missingIpa.push(`${goal.id} scenario ${index + 1}: dialog missing IPA -> "${content}"`);
        phaseStats[goal.phaseId].missingIpa += 1;
        continue;
      }
      if (MOJIBAKE_PATTERN.test(ipa)) {
        missingIpa.push(`${goal.id} scenario ${index + 1}: dialog IPA mojibake -> "${content}" => ${ipa}`);
        phaseStats[goal.phaseId].missingIpa += 1;
      }
      if (THAT_TEXT_PATTERN.test(content) && WEAK_THAT_IPA_PATTERN.test(ipa)) {
        pushStyleIssue(
          goal.phaseId,
          `${goal.id} scenario ${index + 1}`,
          content,
          ipa,
          'weak-form "that" ditemukan',
        );
      }
      if (OCLOCK_TEXT_PATTERN.test(content) && !TEACHING_OCLOCK_IPA_PATTERN.test(ipa)) {
        pushStyleIssue(
          goal.phaseId,
          `${goal.id} scenario ${index + 1}`,
          content,
          ipa,
          "o'clock belum /\\u0259\\u02C8kl\\u0251k/",
        );
      }
      if (FRIED_RICE_TEXT_PATTERN.test(content) && !TEACHING_FRIED_RICE_IPA_PATTERN.test(ipa)) {
        pushStyleIssue(
          goal.phaseId,
          `${goal.id} scenario ${index + 1}`,
          content,
          ipa,
          'fried rice belum /fra\\u026Ad ra\\u026As/',
        );
      }
    }

    const idExample = detail.roleplayExamplesId?.[index];
    if (idExample) {
      const idLines = toLines(idExample);
      if (idLines.length !== lines.length) {
        idMismatchIssues.push(
          `${goal.id} scenario ${index + 1}: roleplayExamplesId line mismatch ${idLines.length}/${lines.length}.`,
        );
      }
    }
  });
}

const printList = (title, values) => {
  if (!values.length) return;
  console.log(`\n${title} (${values.length})`);
  console.log(values.slice(0, MAX_REPORT_LINES).join('\n'));
  if (values.length > MAX_REPORT_LINES) {
    console.log(`... ${values.length - MAX_REPORT_LINES} item lainnya disembunyikan`);
  }
};

console.log('Speaking Coherence Audit');
console.log('========================');
console.log(JSON.stringify(phaseStats, null, 2));

printList('Missing/Mojibake IPA', missingIpa);
printList('Dialog Issues', dialogIssues);
printList('Scenario Issues', scenarioIssues);
printList('EN-ID Line Mismatch', idMismatchIssues);
printList('IPA Style Issues', styleIssues);

const hasError =
  missingIpa.length > 0 ||
  dialogIssues.length > 0 ||
  scenarioIssues.length > 0 ||
  idMismatchIssues.length > 0 ||
  styleIssues.length > 0;

if (hasError) {
  console.error('\nAudit result: FAILED');
  process.exit(1);
}

console.log('\nAudit result: PASSED');

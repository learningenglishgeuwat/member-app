import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/daily-routines.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const DAILY_IPA = new Map([
  ['I wake up at six.', '/aɪ weɪk ʌp æt sɪks/'],
  ['She gets up early.', '/ʃi ɡɛts ʌp ˈɝli/'],
  ['He makes the bed every morning.', '/hi meɪks ðə bɛd ˈɛvri ˈmɔrnɪŋ/'],
  ['I brush my teeth after breakfast.', '/aɪ brʌʃ maɪ tiθ ˈæftɚ ˈbrɛkfəst/'],
  ['I wash my face before class.', '/aɪ wɑʃ maɪ feɪs bɪˈfɔr klæs/'],
  ['She takes a shower at seven.', '/ʃi teɪks ə ˈʃaʊɚ æt ˈsɛvən/'],
  ['He gets dressed quickly.', '/hi ɡɛts drɛst ˈkwɪkli/'],
  ['I comb my hair every morning.', '/aɪ koʊm maɪ hɛr ˈɛvri ˈmɔrnɪŋ/'],
  ['We have breakfast together.', '/wi hæv ˈbrɛkfəst təˈɡɛðɚ/'],
  ['My dad drinks coffee in the morning.', '/maɪ dæd drɪŋks ˈkɔfi ɪn ðə ˈmɔrnɪŋ/'],
  ['The kids go to school by bus.', '/ðə kɪdz ɡoʊ tə skul baɪ bʌs/'],
  ['I go to work at eight.', '/aɪ ɡoʊ tə wɝk æt eɪt/'],
  ['She takes the bus to campus.', '/ʃi teɪks ðə bʌs tə ˈkæmpəs/'],
  ['He drives to work every day.', '/hi draɪvz tə wɝk ˈɛvri deɪ/'],
  ['I start work at nine.', '/aɪ stɑrt wɝk æt naɪn/'],
  ['She checks email after lunch.', '/ʃi tʃɛks ˈiˌmeɪl ˈæftɚ lʌntʃ/'],
  ['We have lunch at noon.', '/wi hæv lʌntʃ æt nun/'],
  ['I study English at night.', '/aɪ ˈstʌdi ˈɪŋɡlɪʃ æt naɪt/'],
  ['He does homework after school.', '/hi dʌz ˈhoʊmˌwɝk ˈæftɚ skul/'],
  ['We clean the house on Sunday.', '/wi klin ðə haʊs ɑn ˈsʌndeɪ/'],
  ['I wash dishes after dinner.', '/aɪ wɑʃ ˈdɪʃɪz ˈæftɚ ˈdɪnɚ/'],
  ['My mom cooks dinner every day.', '/maɪ mɑm kʊks ˈdɪnɚ ˈɛvri deɪ/'],
  ['We eat dinner at seven.', '/wi it ˈdɪnɚ æt ˈsɛvən/'],
  ['I take a break at three.', '/aɪ teɪk ə breɪk æt θri/'],
  ['She exercises every morning.', '/ʃi ˈɛksɚˌsaɪzɪz ˈɛvri ˈmɔrnɪŋ/'],
  ['We go for a walk in the evening.', '/wi ɡoʊ fər ə wɔk ɪn ði ˈivnɪŋ/'],
  ['I call family every night.', '/aɪ kɔl ˈfæməli ˈɛvri naɪt/'],
  ['He reads a book before bed.', '/hi ridz ə bʊk bɪˈfɔr bɛd/'],
  ['My parents watch TV after dinner.', '/maɪ ˈpɛrənts wɑtʃ ˌtiˈvi ˈæftɚ ˈdɪnɚ/'],
  ['She listens to music while cooking.', '/ʃi ˈlɪsənz tə ˈmjuzɪk waɪl ˈkʊkɪŋ/'],
  ['The kids play games on weekends.', '/ðə kɪdz pleɪ ɡeɪmz ɑn ˈwikˌɛndz/'],
  ['I relax after work.', '/aɪ rɪˈlæks ˈæftɚ wɝk/'],
  ['My grandmother prays every morning.', '/maɪ ˈɡrænˌmʌðɚ preɪz ˈɛvri ˈmɔrnɪŋ/'],
  ['He takes a nap after lunch.', '/hi teɪks ə næp ˈæftɚ lʌntʃ/'],
  ['I do laundry every Saturday.', '/aɪ du ˈlɔndri ˈɛvri ˈsætɚdeɪ/'],
  ['She irons clothes in the evening.', '/ʃi ˈaɪɚnz kloʊðz ɪn ði ˈivnɪŋ/'],
  ['I water plants every morning.', '/aɪ ˈwɔtɚ plænts ˈɛvri ˈmɔrnɪŋ/'],
  ['He feeds the cat at six.', '/hi fidz ðə kæt æt sɪks/'],
  ['She feeds the dog before work.', '/ʃi fidz ðə dɔɡ bɪˈfɔr wɝk/'],
  ['We shop for groceries on Friday.', '/wi ʃɑp fər ˈɡroʊsəriz ɑn ˈfraɪdeɪ/'],
  ['I return home at five.', '/aɪ rɪˈtɝn hoʊm æt faɪv/'],
  ['We spend time with family on weekends.', '/wi spɛnd taɪm wɪð ˈfæməli ɑn ˈwikˌɛndz/'],
  ['I help my parents at home.', '/aɪ hɛlp maɪ ˈpɛrənts æt hoʊm/'],
  ['I set an alarm before sleeping.', '/aɪ sɛt ən əˈlɑrm bɪˈfɔr ˈslipɪŋ/'],
  ['The kids get ready for bed at nine.', '/ðə kɪdz ɡɛt ˈrɛdi fər bɛd æt naɪn/'],
  ['I go to bed at ten.', '/aɪ ɡoʊ tə bɛd æt tɛn/'],
  ['He falls asleep quickly.', '/hi fɔlz əˈslip ˈkwɪkli/'],
  ['I sleep for seven hours.', '/aɪ slip fɔr ˈsɛvən aʊɚz/'],
  ['She wakes up early every day.', '/ʃi weɪks ʌp ˈɝli ˈɛvri deɪ/'],
  ['I do not stay up late on weekdays.', '/aɪ du nɑt steɪ ʌp leɪt ɑn ˈwikˌdeɪz/'],
  ['I check the schedule every morning.', '/aɪ tʃɛk ðə ˈskɛdʒul ˈɛvri ˈmɔrnɪŋ/'],
  ['She packs her bag before school.', '/ʃi pæks hɚ bæɡ bɪˈfɔr skul/'],
  ['I leave home at seven-thirty.', '/aɪ liv hoʊm æt ˌsɛvənˈθɝti/'],
  ['He arrives at work at eight.', '/hi əˈraɪvz æt wɝk æt eɪt/'],
  ['She attends a meeting every Monday.', '/ʃi əˈtɛndz ə ˈmitɪŋ ˈɛvri ˈmʌndeɪ/'],
  ['I reply to messages after lunch.', '/aɪ rɪˈplaɪ tə ˈmɛsɪdʒɪz ˈæftɚ lʌntʃ/'],
  ['We finish work at five.', '/wi ˈfɪnɪʃ wɝk æt faɪv/'],
  ['He picks up the kids at school.', '/hi pɪks ʌp ðə kɪdz æt skul/'],
  ['I take out the trash every night.', '/aɪ teɪk aʊt ðə træʃ ˈɛvri naɪt/'],
  ['She sweeps the floor in the afternoon.', '/ʃi swips ðə flɔr ɪn ði ˌæftɚˈnun/'],
  ['We mop the floor on Saturday.', '/wi mɑp ðə flɔr ɑn ˈsætɚdeɪ/'],
  ['The children tidy the room before dinner.', '/ðə ˈtʃɪldrən ˈtaɪdi ðə rum bɪˈfɔr ˈdɪnɚ/'],
  ['My mother prepares breakfast every day.', '/maɪ ˈmʌðɚ prɪˈpɛrz ˈbrɛkfəst ˈɛvri deɪ/'],
  ['I pack lunch for work.', '/aɪ pæk lʌntʃ fər wɝk/'],
  ['He pays bills at the end of the month.', '/hi peɪz bɪlz æt ði ɛnd əv ðə mʌnθ/'],
  ['My grandmother takes medicine every day.', '/maɪ ˈɡrænˌmʌðɚ teɪks ˈmɛdɪsən ˈɛvri deɪ/'],
  ['I charge my phone before bed.', '/aɪ tʃɑrdʒ maɪ foʊn bɪˈfɔr bɛd/'],
  ['She sets tomorrow plan at night.', '/ʃi sɛts təˈmɑroʊ plæn æt naɪt/'],
  ['I turn off the lights before sleeping.', '/aɪ tɝn ɔf ðə laɪts bɪˈfɔr ˈslipɪŋ/'],
  ['He locks the door every night.', '/hi lɑks ðə dɔr ˈɛvri naɪt/'],
  ['I check the weather before leaving home.', '/aɪ tʃɛk ðə ˈwɛðɚ bɪˈfɔr ˈlivɪŋ hoʊm/'],
  ['My father reads the news every morning.', '/maɪ ˈfɑðɚ ridz ðə nuz ˈɛvri ˈmɔrnɪŋ/'],
  ['I make coffee at six-thirty.', '/aɪ meɪk ˈkɔfi æt ˌsɪksˈθɝti/'],
  ['She prepares lunch for her children.', '/ʃi prɪˈpɛrz lʌntʃ fər hɚ ˈtʃɪldrən/'],
  ['We eat snacks in the afternoon.', '/wi it snæks ɪn ði ˌæftɚˈnun/'],
  ['I refill my water bottle at work.', '/aɪ ˌriˈfɪl maɪ ˈwɔtɚ ˈbɑtəl æt wɝk/'],
  ['My mother takes vitamins every day.', '/maɪ ˈmʌðɚ teɪks ˈvaɪtəmɪnz ˈɛvri deɪ/'],
  ['I check homework after dinner.', '/aɪ tʃɛk ˈhoʊmˌwɝk ˈæftɚ ˈdɪnɚ/'],
  ['She reviews notes before class.', '/ʃi rɪˈvjuz noʊts bɪˈfɔr klæs/'],
  ['I practice speaking every night.', '/aɪ ˈpræktɪs ˈspikɪŋ ˈɛvri naɪt/'],
  ['He practices writing in English.', '/hi ˈpræktɪsɪz ˈraɪtɪŋ ɪn ˈɪŋɡlɪʃ/'],
  ['She joins online class at night.', '/ʃi dʒɔɪnz ˈɔnˌlaɪn klæs æt naɪt/'],
  ['I send report before five.', '/aɪ sɛnd rɪˈpɔrt bɪˈfɔr faɪv/'],
  ['He updates calendar every Monday.', '/hi ʌpˈdeɪts ˈkæləndɚ ˈɛvri ˈmʌndeɪ/'],
  ['I plan tomorrow before sleeping.', '/aɪ plæn təˈmɑroʊ bɪˈfɔr ˈslipɪŋ/'],
  ['She cleans the kitchen after dinner.', '/ʃi klinz ðə ˈkɪtʃən ˈæftɚ ˈdɪnɚ/'],
  ['I wipe the table after eating.', '/aɪ waɪp ðə ˈteɪbəl ˈæftɚ ˈitɪŋ/'],
  ['The kids wash hands before lunch.', '/ðə kɪdz wɑʃ hændz bɪˈfɔr lʌntʃ/'],
  ['He takes the elevator to the office.', '/hi teɪks ði ˈɛləˌveɪtɚ tə ði ˈɔfɪs/'],
  ['I walk to the station every morning.', '/aɪ wɔk tə ðə ˈsteɪʃən ˈɛvri ˈmɔrnɪŋ/'],
  ['She waits for the bus at seven.', '/ʃi weɪts fər ðə bʌs æt ˈsɛvən/'],
  ['I buy breakfast near the office.', '/aɪ baɪ ˈbrɛkfəst nɪr ði ˈɔfɪs/'],
  ['We buy dinner on busy days.', '/wi baɪ ˈdɪnɚ ɑn ˈbɪzi deɪz/'],
  ['He picks up groceries after work.', '/hi pɪks ʌp ˈɡroʊsəriz ˈæftɚ wɝk/'],
  ['I call a friend every weekend.', '/aɪ kɔl ə frɛnd ˈɛvri ˈwikˌɛnd/'],
  ['She chats with family at night.', '/ʃi tʃæts wɪð ˈfæməli æt naɪt/'],
  ['He plays with children after dinner.', '/hi pleɪz wɪð ˈtʃɪldrən ˈæftɚ ˈdɪnɚ/'],
  ['I help children study every evening.', '/aɪ hɛlp ˈtʃɪldrən ˈstʌdi ˈɛvri ˈivnɪŋ/'],
  ['She closes the window before bed.', '/ʃi ˈkloʊzɪz ðə ˈwɪndoʊ bɪˈfɔr bɛd/'],
  ['I open the window every morning.', '/aɪ ˈoʊpən ðə ˈwɪndoʊ ˈɛvri ˈmɔrnɪŋ/'],
]);

const wordsSource = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsSource.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);

const missingMapping = examples.filter((example) => !DAILY_IPA.has(example));
if (missingMapping.length) {
  throw new Error(`Missing IPA mappings: ${missingMapping.join(' | ')}`);
}

let source = fs.readFileSync(META_PATH, 'utf8');
const startMarker = 'export const VOCAB_EXAMPLE_IPA_BY_EN: Record<string, string> = {';
const start = source.indexOf(startMarker);
if (start < 0) {
  throw new Error('IPA map start not found');
}
const bodyStart = start + startMarker.length;
const end = source.indexOf('\n};', bodyStart);
if (end < 0) {
  throw new Error('IPA map end not found');
}

let body = source.slice(bodyStart, end);
const escapeNonAscii = (value) => value.replace(/[^\x00-\x7F]/g, (ch) => `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`);

for (const example of examples) {
  const ipaEscaped = escapeNonAscii(DAILY_IPA.get(example));
  const keyPattern = example.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lineRegex = new RegExp(`(\\n\\s*\"${keyPattern}\":\\s*\")([^\"]*)(\",?)`);
  if (lineRegex.test(body)) {
    body = body.replace(lineRegex, `$1${ipaEscaped}$3`);
  } else {
    body += `\n  ${JSON.stringify(example)}: ${JSON.stringify(ipaEscaped)},`;
  }
}

source = `${source.slice(0, bodyStart)}${body}${source.slice(end)}`;
fs.writeFileSync(META_PATH, source, 'utf8');
console.log(`Updated daily-routines IPA entries: ${examples.length}`);

export type TextMaterial = {
  id: string;
  title: string;
  focus: string;
  originParagraphs: string[];
  phoneticParagraphs: string[];
  subsections?: TextSubsection[];
};

export type TopicHighlightConfig = {
  keyTerms: string[];
  letterTerms: string[];
};

export type TextSubsection = {
  id: string;
  title: string;
  originParagraphs: string[];
  phoneticParagraphs: string[];
};

export const TOPIC_HIGHLIGHTS: Record<string, TopicHighlightConfig> = {
  'phonetic-symbols': {
    keyTerms: ['phonetic symbols', 'minimal pairs', 'vowel sound', 'dictionary audio'],
    letterTerms: [
      'sheep',
      'ship',
      'fool',
      'full',
      'cat',
      'cut',
      'cheap',
      'cup'
    ]
  },
  'final-sound-s-es': {
    keyTerms: ['final sound', 'final sound s/es', 'plural nouns', 'third-person verbs', 'grammar meaning'],
    letterTerms: [
      'S/ES',
      '/s/',
      '/z/',
      '/iz/',
      '-s',
      '-es',
      'cups',
      'books',
      'stops',
      'bags',
      'plays',
      'classes',
      'watches'
    ]
  },
  'final-sound-d-ed': {
    keyTerms: ['final sound', 'final sound d/ed', 'past endings', 'past tense', 'regular past endings'],
    letterTerms: [
      'D/ED',
      '/t/',
      '/d/',
      '/ɪd/',
      '/id/',
      '-ed',
      'watched',
      'helped',
      'washed',
      'cleaned',
      'played',
      'wanted',
      'needed'
    ]
  },
  'american-t': {
    keyTerms: ['american t', 'flap t', 'american pattern'],
    letterTerms: [
      'water',
      'city',
      'better',
      'button',
      'mountain',
      'bought',
      'at school',
      'hot dog',
      'not bad'
    ]
  }
};

export const MATERIALS: TextMaterial[] = [
  {
    id: 'phonetic-symbols',
    title: 'Phonetic Symbols',
    focus: 'Mencocokkan simbol IPA dengan bunyi kata secara tepat.',
    originParagraphs: [
      `In this Phonetic Symbols practice, Maya wanted to fix unclear vowel sounds in daily conversation. She often mixed similar words, so listeners needed extra time to understand. Her teacher gave a simple plan: learn the symbols, train with sound pairs, and apply them in real sentences.`,
      `First, she trained with minimal pairs such as sheep and ship, fool and full, and cat and cut. She said each pair slowly and listened to the vowel sound with full attention. This supporting detail gave her a strong base because she could hear sound differences clearly, not only spelling differences.`,
      `Second, she moved from single words to short daily sentences. She practiced lines like "I need a full cup" and "The ship is cheap." This was important because real communication happens in sentences, not isolated words. As she repeated these lines, her rhythm and breathing became more stable.`,
      `Third, she checked progress with dictionary audio and her own recording. She marked words that still sounded unclear and repeated only those target words. This made practice efficient because she focused on weak points and tracked improvement step by step.`,
      `In conclusion, Phonetic Symbols helped Maya build clearer speech in a practical way. Her friends understood her faster and asked her to repeat less often. She now sees phonetic symbols as a daily speaking tool, not just theory from class.`
    ],
    phoneticParagraphs: [
      '/st\u0251\u02d0t w\u026a\u00f0 \u02c8s\u026amb\u0259l pe\u0259z \u00f0\u0259t \u02c8l\u025c\u02d0n\u0259z \u02c8\u0252f\u0259n k\u0259n\u02c8fju\u02d0z\u0968 \u02c8f\u0254\u02d0 \u026a\u0261\u02c8z\u0251\u02d0mpl\u0968 \u0283i\u02d0p \u0259nd \u0283\u026ap\u0968 f\u028al \u0259nd fu\u02d0l\u0968/',
      '/ri\u02d0d \u00f0\u0259 w\u025c\u02d0dz \u026an \u0283\u0254\u02d0t \u02c8fre\u026az\u026az\u0968 n\u0252t \u0259z \u02c8a\u026as\u0259le\u026at\u026ad sa\u028andz\u0968 r\u026a\u02c8k\u0254\u02d0d j\u0254\u02d0 v\u0254\u026as\u0968 k\u0259m\u02c8pe\u0259 \u026at\u0968 \u0259nd r\u026a\u02c8pi\u02d0t\u0968/'
    ]
  },
  {
    id: 'final-sound-s-es',
    title: 'Final Sound S/ES',
    focus: 'Membedakan akhir /s/, /z/, dan /\u026az/ agar grammar terdengar jelas.',
    originParagraphs: [
      `In the Final Sound S/ES section, Rina learned that small endings carry big grammar meaning. She often dropped final sounds in fast speech, so some listeners misunderstood her message. Her teacher told her to keep S/ES endings clear in every practice line.`,
      `First, she practiced /s/ after voiceless sounds with words like cups, books, and stops. She read short lines and paused briefly at each ending. This supporting detail helped her feel the airflow and keep the final consonant audible.`,
      `Second, she practiced /z/ and /iz/ endings with words like bags, plays, classes, and watches. She noticed that /iz/ needs one extra syllable, so it cannot be rushed. This detail made her grammar meaning easier for listeners to catch.`,
      `Third, she used a paragraph drill and tapped once at every target ending. Then she repeated the same paragraph at normal speed to test control. This method helped her keep S/ES endings clear even when she felt nervous.`,
      `In conclusion, Final Sound S/ES practice made Rina's speaking more complete and accurate. Her classmates could understand her grammar faster in conversation. She now checks every key ending as part of her normal speaking habit.`
    ],
    phoneticParagraphs: [
      '/ɪn ðə ˈfaɪnəl saʊnd ɛs ˌiː ˈɛs ˈsɛkʃən, ˈriːnə lɝnd ðət smɔl ˈɛndɪŋz ˈkæri bɪɡ ˈɡræmɚ ˈmiːnɪŋ. ʃi ˈɔfən drɑpt ˈfaɪnəl saʊndz ɪn fæst spiːtʃ, soʊ səm ˈlɪsənɚz ˌmɪsəndɚˈstʊd hɚ ˈmɛsɪdʒ. hɚ ˈtiːtʃɚ toʊld hɚ tə kip ɛs ˌiː ˈɛs ˈɛndɪŋz klɪr ɪn ˈɛvri ˈpræktɪs laɪn./',
      '/fɝst, ʃi ˈpræktɪst s əfˈtɝ ˈvɔɪsləs saʊndz wɪð wɝdz laɪk kʌps, bʊks, ænd stɑps. ʃi rɛd ʃɔrt laɪnz ænd pɔzd ˈbrifli æt itʃ ˈɛndɪŋ. ðɪs ˈsʌpɔrtɪŋ dɪˈteɪl hɛlpt hɚ fil ði ˈɛrˌfloʊ ænd kip ðə ˈfaɪnəl ˈkɑnsənənt ˈɔdəbəl./',
      '/ˈsɛkənd, ʃi ˈpræktɪst z ænd ɪz ˈɛndɪŋz wɪð wɝdz laɪk bæɡz, pleɪz, ˈklæsɪz, ænd ˈwɑtʃɪz. ʃi ˈnoʊtɪst ðət ɪz nidz wʌn ˈɛkstrə ˈsɪləbəl, soʊ ɪt ˈkænɑt bi rʌʃt. ðɪs dɪˈteɪl meɪd hɚ ˈɡræmɚ ˈmiːnɪŋ ˈiziɚ fɚ ˈlɪsənɚz tə kætʃ./',
      '/θɝd, ʃi juːzd ə ˈpɛrəˌɡræf drɪl ænd tæpt wʌns æt ˈɛvri ˈtɑrɡɪt ˈɛndɪŋ. ðɛn ʃi rɪˈpitəd ðə seɪm ˈpɛrəˌɡræf æt ˈnɔrməl spiːd tə tɛst kənˈtroʊl. ðɪs ˈmɛθəd hɛlpt hɚ kip ɛs ˌiː ˈɛs ˈɛndɪŋz klɪr ˈivən wɛn ʃi fɛlt ˈnɝvəs./',
      '/ɪn kənˈkluʒən, ˈfaɪnəl saʊnd ɛs ˌiː ˈɛs ˈpræktɪs meɪd ˈriːnəz ˈspiːkɪŋ mɔr kəmˈplit ænd ˈækjərət. hɚ ˈklæsˌmeɪts kʊd ˌʌndɚˈstænd hɚ ˈɡræmɚ ˈfæstɚ ɪn ˌkɑnvɚˈseɪʃən. ʃi naʊ tʃɛks ˈɛvri ki ˈɛndɪŋ æz pɑrt əv hɚ ˈnɔrməl ˈspiːkɪŋ ˈhæbɪt./'
    ]
  },
  {
    id: 'final-sound-d-ed',
    title: 'Final Sound D/ED',
    focus: 'Membedakan akhir /t/, /d/, dan /\u026ad/ pada regular past tense.',
    originParagraphs: [
      `In the Final Sound D/ED topic, Arga found that his stories were unclear because he dropped -ed endings. He focused on ideas but ignored final sounds. His teacher reminded him that D/ED endings show past time and must be spoken clearly.`,
      `First, he practiced /t/ endings with watched, helped, and washed. He read short daily lines and stopped after each target word. This supporting detail helped him make the final consonant clear enough for listeners to hear the tense.`,
      `Second, he practiced /d/ and /id/ endings with cleaned, played, wanted, and needed. He learned that /id/ adds one extra syllable, so it needs a little more time. This gave him better control and improved past-tense accuracy in conversation.`,
      `Third, he moved to short storytelling. He read one paragraph, then retold the same message without looking at the text. This tested whether he could keep D/ED endings clear in spontaneous speaking, not only in reading practice.`,
      `In conclusion, Final Sound D/ED training improved Arga's speaking accuracy. Listeners could hear past events more clearly, and his stories became easier to follow. He now uses this routine regularly because it works in real daily speaking.`
    ],
    phoneticParagraphs: [
      '/ɪn ðə ˈfaɪnəl saʊnd diː iː diː ˈtɑpɪk, ˈɑrɡə faʊnd ðæt hɪz ˈstɔriz wɚ ʌnˈklɪr bɪˈkɔz hi drɑpt əd ˈɛndɪŋz. hi ˈfoʊkəst ɑn aɪˈdiːəz bʌt ɪɡˈnɔrd ˈfaɪnəl saʊndz. hɪz ˈtiːtʃɚ rɪˈmaɪndəd hɪm ðæt diː iː diː ˈɛndɪŋz ʃoʊ pæst taɪm ænd mʌst bi ˈspoʊkən ˈklɪrli./',
      '/fɝst, hi ˈpræktɪst t ˈɛndɪŋz wɪð wɑtʃt, hɛlpt, ænd wɑʃt. hi rɛd ʃɔrt ˈdeɪli laɪnz ænd stɑpt ˈæftɚ itʃ ˈtɑrɡɪt wɝd. ðɪs səˈpɔrtɪŋ dɪˈteɪl hɛlpt hɪm meɪk ðə ˈfaɪnəl ˈkɑnsənənt klɪr ɪˈnʌf fɚ ˈlɪsənɚz tə hɪr ðə tɛns./',
      '/ˈsɛkənd, hi ˈpræktɪst d ænd ɪd ˈɛndɪŋz wɪð kliːnd, pleɪd, ˈwɑntɪd, ænd ˈniːdɪd. hi lɝnd ðæt ɪd ædz wʌn ˈɛkstrə ˈsɪləbəl, soʊ ɪt nidz ə ˈlɪtəl mɔr taɪm. ðɪs ɡeɪv hɪm ˈbɛtɚ kənˈtroʊl ænd ɪmˈpruvd pæst tɛns ˈækjərəsi ɪn ˌkɑnvɚˈseɪʃən./',
      '/θɝd, hi muːvd tə ʃɔrt ˈstɔriˌtɛlɪŋ. hi rɛd wʌn ˈpɛrəˌɡræf, ðɛn riˈtoʊld ðə seɪm ˈmɛsɪdʒ wɪˈðaʊt ˈlʊkɪŋ æt ðə tɛkst. ðɪs ˈtɛstəd ˈwɛðɚ hi kʊd kiːp diː iː diː ˈɛndɪŋz klɪr ɪn spɑnˈteɪniəs ˈspiːkɪŋ, nɑt ˈoʊnli ɪn ˈriːdɪŋ ˈpræktɪs./',
      '/ɪn kənˈkluːʒən, ˈfaɪnəl saʊnd diː iː diː ˈtreɪnɪŋ ɪmˈpruvd ˈɑrɡəz ˈspiːkɪŋ ˈækjərəsi. ˈlɪsənɚz kʊd hɪr pæst ɪˈvɛnts mɔr ˈklɪrli, ænd hɪz ˈstɔriz bɪˈkeɪm ˈiːziɚ tə ˈfɑloʊ. hi naʊ ˈjuːzɪz ðɪs ruːˈtiːn ˈrɛɡjələrli bɪˈkɔz ɪt wɝks ɪn rɪəl ˈdeɪli ˈspiːkɪŋ./'
    ]
  },
  {
    id: 'american-t',
    title: 'American T',
    focus: 'Mengenali flap T /\u027e/ dan glottal stop pada aksen Amerika.',
    originParagraphs: [
      `In the American T lesson, Bimo discovered that many T sounds in real speech were softer than textbook examples. At first, he felt confused when hearing words like water and city in fast conversation. Later, he understood this was a normal American pattern.`,
      `First, he focused on flap T in words such as water, better, and city. The middle sound was quick and light, almost like a soft d. This supporting detail improved listening because he could recognize common words at natural speed.`,
      `Second, he learned about the stop before final n in words like button and mountain. In casual speech, many speakers do not release a full /t/ there. This helped him understand why some words sounded shorter and smoother than expected.`,
      `Third, he practiced with complete sentences, not isolated words. He used lines like "I bought water in the city center" and "That button is better." He also trained final T before consonants in phrases such as at school, hot dog, and not bad. This gave him training in sound and rhythm at the same time.`,
      `In conclusion, American T practice improved both Bimo's listening and speaking. His speech became smoother and less rigid in informal conversation. He now practices short daily lines to keep this pronunciation pattern active.`
    ],
    phoneticParagraphs: [
      '/ɪn ði əˈmɛrɪkən tiː ˈlɛsən, ˈbimoʊ dɪˈskʌvɚd ðæt ˈmɛni tiː saʊndz ɪn riːl spiːtʃ wɚ ˈsɔftɚ ðæn ˈtɛkstˌbʊk ɪɡˈzæmpəlz. æt fɝst, hi fɛlt kənˈfjuzd wɛn ˈhɪrɪŋ wɝdz laɪk ˈwɔɾɚ ænd ˈsɪɾi ɪn fæst ˌkɑnvɚˈseɪʃən. ˈleɪtɚ, hi ˌʌndɚˈstʊd ðɪs wəz ə ˈnɔrməl əˈmɛrɪkən ˈpætɚn./',
      '/fɝst, hi ˈfoʊkəst ɑn flæp tiː ɪn wɝdz sʌtʃ əz ˈwɔɾɚ, ˈbɛɾɚ, ænd ˈsɪɾi. ðə ˈmɪdəl saʊnd wəz kwɪk ænd laɪt, ˈɔlmoʊst laɪk ə sɔft diː. ðɪs səˈpɔrtɪŋ dɪˈteɪl ɪmˈpruvd ˈlɪsənɪŋ bɪˈkɔz hi kʊd ˈrɛkəɡˌnaɪz ˈkɑmən wɝdz æt ˈnætʃrəl spiːd./',
      '/ˈsɛkənd, hi lɝnd əˈbaʊt ðə stɑp bɪˈfɔr ˈfaɪnəl ɛn ɪn wɝdz laɪk ˈbʌʔn ænd ˈmaʊʔn. ɪn ˈkæʒuəl spiːtʃ, ˈmɛni ˈspikɚz du nɑt rɪˈlis ə fʊl tiː ðɛr. ðɪs hɛlpt hɪm ˌʌndɚˈstænd waɪ sʌm wɝdz ˈsaʊndɪd ˈʃɔrtɚ ænd ˈsmuðɚ ðæn ɪkˈspɛktɪd./',
      '/θɝd, hi ˈpræktɪst wɪð kəmˈplit ˈsɛntənsɪz, nɑt ˈaɪsəˌleɪtɪd wɝdz. hi juzd laɪnz laɪk aɪ bɔt ˈwɔɾɚ ɪn ðə ˈsɪɾi ˈsɛntɚ ænd ðæt ˈbʌʔn ɪz ˈbɛɾɚ. hi ˈɔlsoʊ treɪnd ˈfaɪnəl tiː bɪˈfɔr ˈkɑnsənənts ɪn ˈfreɪzɪz sʌtʃ əz æt skuːl, hɑt dɔɡ, ænd nɑt bæd. ðɪs ɡeɪv hɪm ˈtreɪnɪŋ ɪn saʊnd ænd ˈrɪðəm æt ðə seɪm taɪm./',
      '/ɪn kənˈkluʒən, əˈmɛrɪkən ti ˈpræktɪs ɪmˈpruvd boʊθ ˈbimoʊz ˈlɪsənɪŋ ænd ˈspikɪŋ. hɪz spiːtʃ bɪˈkeɪm ˈsmuðɚ ænd lɛs ˈrɪdʒɪd ɪn ɪnˈfɔrməl ˌkɑnvɚˈseɪʃən. hi naʊ ˈpræktɪsɪz ʃɔrt ˈdeɪli laɪnz tə kip ðɪs prəˌnʌnsiˈeɪʃən ˈpætɚn ˈæktɪv./'
    ]
  }
];



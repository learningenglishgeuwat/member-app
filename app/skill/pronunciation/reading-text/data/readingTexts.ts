export type ReadingTextMaterial = {
  id: string;
  title: string;
  text: string;
  phoneticText?: string;
};

export const READING_TEXT_MATERIALS: ReadingTextMaterial[] = [
  {
    id: 'introduction-to-pronunciation',
    title: 'Introduction to Pronunciation',
    text: `Many English learners focus only on vocabulary and grammar. However, they often forget the most basic part of a language: pronunciation. To speak English well, we must understand what pronunciation is and why it matters.

Pronunciation is the way we make the sounds of a language. It is not just about talking; it is about how we use our mouth, lips, and tongue to create specific noises. In English, one letter can have different sounds. For example, the "a" in "apple" is different from the "a" in "car." Understanding these sounds is the first step for every student.

The second point is the difference between writing and speaking. In many languages, we say a word exactly how we write it. But in English, the spelling can be confusing. Pronunciation helps students learn that "knowledge" starts with a "n" sound, not a "k" sound. This helps learners read and speak more accurately.

The final point is that pronunciation is a physical skill. It is like a sport for your mouth. To produce "Lax Vowels" or specific American sounds, students must train their facial muscles. If we do not move our mouth correctly, the sound will be wrong. This is why practicing the physical movement of the tongue is very important from the beginning.

In summary, pronunciation is the foundation of speaking. It is the study of sounds, the bridge between spelling and speech, and a physical exercise for the mouth. If a beginner understands these three things, learning English becomes much easier.`,
    phoneticText: `/ˈmɛni ˈɪŋɡlɪʃ ˈlɝnɚz ˈfoʊkəs ˈoʊnli ɑn voʊˈkæbjəˌlɛri ænd ˈɡræmɚ. haʊˈɛvɚ, ðeɪ ˈɔfən fɚˈɡɛt ðə moʊst ˈbeɪsɪk pɑrt əv ə ˈlæŋɡwɪdʒ: prəˌnʌnsiˈeɪʃən. tə spiːk ˈɪŋɡlɪʃ wɛl, wi mʌst ˌʌndɚˈstænd wʌt prəˌnʌnsiˈeɪʃən ɪz ænd waɪ ɪt ˈmætɚz./

/prəˌnʌnsiˈeɪʃən ɪz ðə weɪ wi meɪk ðə saʊndz əv ə ˈlæŋɡwɪdʒ. ɪt ɪz nɑt dʒʌst əˈbaʊt ˈtɔkɪŋ; ɪt ɪz əˈbaʊt haʊ wi juːz aʊɚ maʊθ, lɪps, ænd tʌŋ tə kriˈeɪt spəˈsɪfɪk ˈnɔɪzɪz. ɪn ˈɪŋɡlɪʃ, wʌn ˈlɛtɚ kæn hæv ˈdɪfrənt saʊndz. fɔr ɪɡˈzæmpəl, ði \"eɪ\" ɪn \"ˈæpəl\" ɪz ˈdɪfrənt frəm ði \"eɪ\" ɪn \"kɑr.\" ˌʌndɚˈstændɪŋ ðiz saʊndz ɪz ðə fɝst stɛp fɔr ˈɛvri ˈstudənt./

/ðə ˈsɛkənd pɔɪnt ɪz ðə ˈdɪfrəns bɪˈtwiːn ˈraɪtɪŋ ænd ˈspiːkɪŋ. ɪn ˈmɛni ˈlæŋɡwɪdʒɪz, wi seɪ ə wɝd ɪɡˈzæktli haʊ wi raɪt ɪt. bʌt ɪn ˈɪŋɡlɪʃ, ðə ˈspɛlɪŋ kæn bi kənˈfjuːzɪŋ. prəˌnʌnsiˈeɪʃən hɛlps ˈstudənts lɝn ðæt \"ˈnɑlɪdʒ\" stɑrts wɪð ə \"ɛn\" saʊnd, nɑt ə \"keɪ\" saʊnd. ðɪs hɛlps ˈlɝnɚz riːd ænd spiːk mɔr ˈækjɚətli./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt prəˌnʌnsiˈeɪʃən ɪz ə ˈfɪzɪkəl skɪl. ɪt ɪz laɪk ə spɔrt fɔr jɔr maʊθ. tə prəˈdus \"læks ˈvaʊəlz\" ɔr spəˈsɪfɪk əˈmɛrɪkən saʊndz, ˈstudənts mʌst treɪn ðɛr ˈfeɪʃəl ˈmʌsəlz. ɪf wi du nɑt muːv aʊɚ maʊθ kəˈrɛktli, ðə saʊnd wɪl bi rɔŋ. ðɪs ɪz waɪ ˈpræktəsɪŋ ðə ˈfɪzɪkəl ˈmuvmənt əv ðə tʌŋ ɪz ˈvɛri ɪmˈpɔrtənt frəm ðə bɪˈɡɪnɪŋ./

/ɪn ˈsʌmɚi, prəˌnʌnsiˈeɪʃən ɪz ðə faʊnˈdeɪʃən əv ˈspiːkɪŋ. ɪt ɪz ðə ˈstʌdi əv saʊndz, ðə brɪdʒ bɪˈtwiːn ˈspɛlɪŋ ænd spiːtʃ, ænd ə ˈfɪzɪkəl ˈɛksɚˌsaɪz fɔr ðə maʊθ. ɪf ə bɪˈɡɪnɚ ˌʌndɚˈstændz ðiz θriː θɪŋz, ˈlɝnɪŋ ˈɪŋɡlɪʃ bɪˈkʌmz mʌtʃ ˈiːziɚ./`,
  },
  {
    id: 'english-alphabet-and-sounds',
    title: 'The English Alphabet and Its Sounds',
    text: `The alphabet is the first thing every student learns in English. It has 26 letters, from A to Z. However, the alphabet is more than just a list of names. Here are three main points about why the alphabet is important for pronunciation.

The first point is that letters and sounds are different. In the English alphabet, we have 26 letters, but these letters can make more than 40 different sounds. For example, the letter "C" can sound like /k/ in "Cat" or /s/ in "City." Beginners must learn that the name of the letter is not always the sound it makes.

The second point is the division of letters into vowels and consonants. There are 5 vowels (A, E, I, O, U) and 21 consonants. Vowels are the most important part of pronunciation because every English word needs a vowel sound. Learning how to say vowels correctly is the "secret" to speaking clear English.

The final point is the importance of spelling. In daily life, we often need to spell our names, addresses, or email accounts. If a student knows the alphabet perfectly, they can give information accurately. This is a basic skill that builds a strong foundation for communication in the real world.

In conclusion, the alphabet is the starting point for every learner. By understanding the sounds, the vowels, and the spelling, students can start their English journey correctly. It is the door to good pronunciation and clear speaking.`,
    phoneticText: `/ði ˈælfəˌbɛt ɪz ðə fɝst θɪŋ ˈɛvri ˈstudənt lɝnz ɪn ˈɪŋɡlɪʃ. ɪt hæz ˈtwɛntiˌsɪks ˈlɛtɚz, frəm eɪ tə ziː. haʊˈɛvɚ, ði ˈælfəˌbɛt ɪz mɔr ðæn dʒʌst ə lɪst əv neɪmz. hɪr ɑr θriː meɪn pɔɪnts əˈbaʊt waɪ ði ˈælfəˌbɛt ɪz ɪmˈpɔrtənt fɔr prəˌnʌnsiˈeɪʃən./

/ðə fɝst pɔɪnt ɪz ðæt ˈlɛtɚz ænd saʊndz ɑr ˈdɪfrənt. ɪn ði ˈɪŋɡlɪʃ ˈælfəˌbɛt, wi hæv ˈtwɛntiˌsɪks ˈlɛtɚz, bʌt ðiz ˈlɛtɚz kæn meɪk mɔr ðæn ˈfɔrti ˈdɪfrənt saʊndz. fɔr ɪɡˈzæmpəl, ðə ˈlɛtɚ \"siː\" kæn saʊnd laɪk /k/ ɪn \"kæt\" ɔr /s/ ɪn \"ˈsɪɾi.\" bɪˈɡɪnɚz mʌst lɝn ðæt ðə neɪm əv ðə ˈlɛtɚ ɪz nɑt ˈɔlweɪz ðə saʊnd ɪt meɪks./

/ðə ˈsɛkənd pɔɪnt ɪz ðə dɪˈvɪʒən əv ˈlɛtɚz ˈɪntu ˈvaʊəlz ænd ˈkɑnsənənts. ðɛr ɑr faɪv ˈvaʊəlz (eɪ, iː, aɪ, oʊ, juː) ænd ˈtwɛntiˌwʌn ˈkɑnsənənts. ˈvaʊəlz ɑr ðə moʊst ɪmˈpɔrtənt pɑrt əv prəˌnʌnsiˈeɪʃən bɪˈkɔz ˈɛvri ˈɪŋɡlɪʃ wɝd nidz ə ˈvaʊəl saʊnd. ˈlɝnɪŋ haʊ tə seɪ ˈvaʊəlz kəˈrɛktli ɪz ðə \"ˈsiːkrət\" tə ˈspiːkɪŋ klɪr ˈɪŋɡlɪʃ./

/ðə ˈfaɪnəl pɔɪnt ɪz ði ɪmˈpɔrtəns əv ˈspɛlɪŋ. ɪn ˈdeɪli laɪf, wi ˈɔfən nidz tə spɛl aʊɚ neɪmz, əˈdrɛsɪz, ɔr ˈiːˌmeɪl əˈkaʊnts. ɪf ə ˈstudənt noʊz ði ˈælfəˌbɛt ˈpɝfɪktli, ðeɪ kæn ɡɪv ˌɪnfɚˈmeɪʃən ˈækjɚətli. ðɪs ɪz ə ˈbeɪsɪk skɪl ðæt bɪldz ə strɔŋ faʊnˈdeɪʃən fɔr kəˌmjunəˈkeɪʃən ɪn ðə riːl wɝld./

/ɪn kənˈkluːʒən, ði ˈælfəˌbɛt ɪz ðə ˈstɑrtɪŋ pɔɪnt fɔr ˈɛvri ˈlɝnɚ. baɪ ˌʌndɚˈstændɪŋ ðə saʊndz, ðə ˈvaʊəlz, ænd ðə ˈspɛlɪŋ, ˈstudənts kæn stɑrt ðɛr ˈɪŋɡlɪʃ ˈdʒɝni kəˈrɛktli. ɪt ɪz ðə dɔr tə ɡʊd prəˌnʌnsiˈeɪʃən ænd klɪr ˈspiːkɪŋ./`,
  },
  {
    id: 'power-of-phonetic-symbols',
    title: 'The Power of Phonetic Symbols',
    text: `Many students feel confused when they see a new English word because the spelling does not match the sound. To solve this problem, we use Phonetic Symbols. These are special signs that tell us exactly how to say a word. Here are three reasons why they are important.

The first point is that phonetic symbols act as a map. In English, the alphabet only has 26 letters, but there are many more sounds. Symbols like $/æ/$ or $/ɪ/$ help students understand the exact position of the mouth. When a student sees a symbol, they know exactly which sound to make, even if they have never heard the word before.

The second point is that symbols fix spelling mistakes. Some English words look the same but sound different, like "read" (present) and "read" (past). By looking at the phonetic symbols in a dictionary, a learner can see the difference clearly. This helps students speak more accurately and feel more professional.

The final point is independence. When a student understands phonetic symbols, they do not always need a teacher to tell them how to pronounce a word. They can use a dictionary or an app to learn by themselves. This makes learning faster because the student can practice anytime and anywhere.

In conclusion, phonetic symbols are a vital tool for every beginner. They provide a clear guide, solve spelling confusion, and make students independent. Learning these symbols is the best way to master English pronunciation quickly.`,
    phoneticText: `/ˈmɛni ˈstudənts fil kənˈfjuzd wɛn ðeɪ si ə nuː ˈɪŋɡlɪʃ wɝd bɪˈkɔz ðə ˈspɛlɪŋ dʌz nɑt mætʃ ðə saʊnd. tə sɑlv ðɪs ˈprɑbləm, wi juːz fəˈnɛtɪk ˈsɪmbəlz. ðiz ɑr ˈspɛʃəl saɪnz ðæt tɛl ʌs ɪɡˈzæktli haʊ tə seɪ ə wɝd. hɪr ɑr θriː ˈrizənz waɪ ðeɪ ɑr ɪmˈpɔrtənt./

/ðə fɝst pɔɪnt ɪz ðæt fəˈnɛtɪk ˈsɪmbəlz ækt æz ə mæp. ɪn ˈɪŋɡlɪʃ, ði ˈælfəˌbɛt ˈoʊnli hæz ˈtwɛntiˌsɪks ˈlɛtɚz, bʌt ðɛr ɑr ˈmɛni mɔr saʊndz. ˈsɪmbəlz laɪk /æ/ ɔr /ɪ/ hɛlp ˈstudənts ˌʌndɚˈstænd ði ɪɡˈzækt pəˈzɪʃən əv ðə maʊθ. wɛn ə ˈstudənt siz ə ˈsɪmbəl, ðeɪ noʊ ɪɡˈzæktli wɪtʃ saʊnd tə meɪk, ˈivən ɪf ðeɪ hæv ˈnɛvɚ hɝd ðə wɝd bɪˈfɔr./

/ðə ˈsɛkənd pɔɪnt ɪz ðæt ˈsɪmbəlz fɪks ˈspɛlɪŋ mɪˈsteɪks. sʌm ˈɪŋɡlɪʃ wɝdz lʊk ðə seɪm bʌt saʊnd ˈdɪfrənt, laɪk \"riːd\" (ˈprɛzənt) ænd \"rɛd\" (pæst). baɪ ˈlʊkɪŋ æt ðə fəˈnɛtɪk ˈsɪmbəlz ɪn ə ˈdɪkʃəˌnɛri, ə ˈlɝnɚ kæn si ðə ˈdɪfrəns ˈklɪrli. ðɪs hɛlps ˈstudənts spiːk mɔr ˈækjɚətli ænd fil mɔr prəˈfɛʃənəl./

/ðə ˈfaɪnəl pɔɪnt ɪz ˌɪndɪˈpɛndəns. wɛn ə ˈstudənt ˌʌndɚˈstændz fəˈnɛtɪk ˈsɪmbəlz, ðeɪ du nɑt ˈɔlweɪz nid ə ˈtiːtʃɚ tə tɛl ðɛm haʊ tə prəˈnaʊns ə wɝd. ðeɪ kæn juːz ə ˈdɪkʃəˌnɛri ɔr ən æp tə lɝn baɪ ðɛmˈsɛlvz. ðɪs meɪks ˈlɝnɪŋ ˈfæstɚ bɪˈkɔz ðə ˈstudənt kæn ˈpræktəs ˈɛniˌtaɪm ænd ˈɛniˌwɛr./

/ɪn kənˈkluːʒən, fəˈnɛtɪk ˈsɪmbəlz ɑr ə ˈvaɪtəl tul fɔr ˈɛvri bɪˈɡɪnɚ. ðeɪ prəˈvaɪd ə klɪr ɡaɪd, sɑlv ˈspɛlɪŋ kənˈfjuːʒən, ænd meɪk ˈstudənts ˌɪndɪˈpɛndənt. ˈlɝnɪŋ ðiz ˈsɪmbəlz ɪz ðə bɛst weɪ tə ˈmæstɚ ˈɪŋɡlɪʃ prəˌnʌnsiˈeɪʃən ˈkwɪkli./`,
  },
  {
    id: 'understanding-word-stress',
    title: 'Understanding Word Stress in English',
    text: `In English, we do not say every part of a word with the same power. We make one part louder and longer than the others. This is called Word Stress. It is like the music or the rhythm of the language. Here are three main points about stressing.

The first point is that stress makes a word clear. Every word with more than one part (syllable) has a "stressed" part. For example, in the word "Teacher," we stress the first part: TEA-cher. If we stress the wrong part, like tea-CHER, people might not understand us. Stressing helps listeners hear the most important part of the word.

The second point is that stress can change the meaning of a word. Sometimes, two words have the same letters but different stress. For example, "RE-cord" (noun) is a thing, but "re-CORD" (verb) is an action. By learning where to put the stress, students can use the same word in different ways correctly.

The final point is about natural rhythm. Native speakers use stress to create a flow in their speech. If a student says every sound with the same power, they will sound like a robot. Using word stress helps students sound more like a real person and less like a computer. It makes the conversation feel comfortable for everyone.

In conclusion, word stress is a key skill for speaking. It makes words clear, helps with meaning, and creates a natural rhythm. If a beginner practices stressing, their English will sound much better and more professional.`,
    phoneticText: `/ɪn ˈɪŋɡlɪʃ, wi du nɑt seɪ ˈɛvri pɑrt əv ə wɝd wɪð ðə seɪm ˈpaʊɚ. wi meɪk wʌn pɑrt ˈlaʊdɚ ænd ˈlɔŋɡɚ ðæn ði ˈʌðɚz. ðɪs ɪz kɔld wɝd strɛs. ɪt ɪz laɪk ðə ˈmjuzɪk ɔr ðə ˈrɪðəm əv ðə ˈlæŋɡwɪdʒ. hɪr ɑr θriː meɪn pɔɪnts əˈbaʊt ˈstrɛsɪŋ./

/ðə fɝst pɔɪnt ɪz ðæt strɛs meɪks ə wɝd klɪr. ˈɛvri wɝd wɪð mɔr ðæn wʌn pɑrt (ˈsɪləbəl) hæz ə ˈstrɛst pɑrt. fɔr ɪɡˈzæmpəl, ɪn ðə wɝd \"ˈtiːtʃɚ,\" wi strɛs ðə fɝst pɑrt: ˈtiː-tʃɚ. ɪf wi strɛs ðə rɔŋ pɑrt, laɪk tiˈtʃɚ, ˈpipəl maɪt nɑt ˌʌndɚˈstænd ʌs. ˈstrɛsɪŋ hɛlps ˈlɪsənɚz hɪr ðə moʊst ɪmˈpɔrtənt pɑrt əv ðə wɝd./

/ðə ˈsɛkənd pɔɪnt ɪz ðæt strɛs kæn tʃeɪndʒ ðə ˈmiːnɪŋ əv ə wɝd. ˈsʌmˌtaɪmz, tuː wɝdz hæv ðə seɪm ˈlɛtɚz bʌt ˈdɪfrənt strɛs. fɔr ɪɡˈzæmpəl, \"ˈrɛkɚd\" (naʊn) ɪz ə θɪŋ, bʌt \"rɪˈkɔrd\" (vɝb) ɪz æn ˈækʃən. baɪ ˈlɝnɪŋ wɛr tə pʊt ðə strɛs, ˈstudənts kæn juːz ðə seɪm wɝd ɪn ˈdɪfrənt weɪz kəˈrɛktli./

/ðə ˈfaɪnəl pɔɪnt ɪz əˈbaʊt ˈnætʃrəl ˈrɪðəm. ˈneɪtɪv ˈspikɚz juːz strɛs tə kriˈeɪt ə floʊ ɪn ðɛr spiːtʃ. ɪf ə ˈstudənt sɛz ˈɛvri saʊnd wɪð ðə seɪm ˈpaʊɚ, ðeɪ wɪl saʊnd laɪk ə ˈroʊˌbɑt. ˈjuːzɪŋ wɝd strɛs hɛlps ˈstudənts saʊnd mɔr laɪk ə riːl ˈpɝsən ænd lɛs laɪk ə kəmˈpjutɚ. ɪt meɪks ðə ˌkɑnvɚˈseɪʃən fil ˈkʌmftɚbəl fɔr ˈɛvriˌwʌn./

/ɪn kənˈkluːʒən, wɝd strɛs ɪz ə kiː skɪl fɔr ˈspiːkɪŋ. ɪt meɪks wɝdz klɪr, hɛlps wɪð ˈmiːnɪŋ, ænd kriˈeɪts ə ˈnætʃrəl ˈrɪðəm. ɪf ə bɪˈɡɪnɚ ˈpræktəsɪz ˈstrɛsɪŋ, ðɛr ˈɪŋɡlɪʃ wɪl saʊnd mʌtʃ ˈbɛtɚ ænd mɔr prəˈfɛʃənəl./`,
  },
  {
    id: 'melody-of-english-intonation',
    title: 'The Melody of English: Intonation',
    text: `When we speak, our voice goes up and down. This movement is called Intonation. It is not about what we say, but how we say it. Intonation is very important because it carries the feeling of the speaker. Here are three main points about intonation.

The first point is that intonation shows our emotions. For example, if our voice goes up at the end of a sentence, we might sound surprised or excited. If our voice is flat, we might sound bored or sad. By changing the melody of our voice, we can tell people if we are happy, angry, or confused without using extra words.

The second point is the difference between questions and statements. In English, we usually move our voice up at the end of a "Yes/No" question (like "Are you hungry?"). However, for a normal statement (like "I am hungry"), our voice usually goes down. This helps the listener know if we want an answer or if we are just giving information.

The final point is about understanding the message. Sometimes, a sentence can have two different meanings depending on the intonation. Good intonation helps avoid misunderstandings. It makes the conversation clear and helps the listener follow the story easily. Without intonation, English sounds very strange and difficult to follow.

In conclusion, intonation is the melody of the English language. It expresses feelings, separates questions from facts, and ensures clear communication. For every beginner, practicing the "up and down" of the voice is a great way to sound like a natural speaker.`,
    phoneticText: `/wɛn wi spiːk, aʊɚ vɔɪs ɡoʊz ʌp ænd daʊn. ðɪs ˈmuvmənt ɪz kɔld ˌɪntəˈneɪʃən. ɪt ɪz nɑt əˈbaʊt wʌt wi seɪ, bʌt haʊ wi seɪ ɪt. ˌɪntəˈneɪʃən ɪz ˈvɛri ɪmˈpɔrtənt bɪˈkɔz ɪt ˈkæriz ðə ˈfilɪŋ əv ðə ˈspikɚ. hɪr ɑr θriː meɪn pɔɪnts əˈbaʊt ˌɪntəˈneɪʃən./

/ðə fɝst pɔɪnt ɪz ðæt ˌɪntəˈneɪʃən ʃoʊz aʊɚ ɪˈmoʊʃənz. fɔr ɪɡˈzæmpəl, ɪf aʊɚ vɔɪs ɡoʊz ʌp æt ði ɛnd əv ə ˈsɛntəns, wi maɪt saʊnd sɚˈpraɪzd ɔr ɪkˈsaɪtɪd. ɪf aʊɚ vɔɪs ɪz flæt, wi maɪt saʊnd bɔrd ɔr sæd. baɪ ˈtʃeɪndʒɪŋ ðə ˈmɛlədi əv aʊɚ vɔɪs, wi kæn tɛl ˈpipəl ɪf wi ɑr ˈhæpi, ˈæŋɡri, ɔr kənˈfjuzd wɪˈðaʊt ˈjuːzɪŋ ˈɛkstrə wɝdz./

/ðə ˈsɛkənd pɔɪnt ɪz ðə ˈdɪfrəns bɪˈtwiːn ˈkwɛstʃənz ænd ˈsteɪtmənts. ɪn ˈɪŋɡlɪʃ, wi ˈjuːʒuəli muːv aʊɚ vɔɪs ʌp æt ði ɛnd əv ə \"jɛs/noʊ\" ˈkwɛstʃən (laɪk \"ɑr ju ˈhʌŋɡri?\"). haʊˈɛvɚ, fɔr ə ˈnɔrməl ˈsteɪtmənt (laɪk \"aɪ æm ˈhʌŋɡri\"), aʊɚ vɔɪs ˈjuːʒuəli ɡoʊz daʊn. ðɪs hɛlps ðə ˈlɪsənɚ noʊ ɪf wi wɑnt æn ˈænsɚ ɔr ɪf wi ɑr dʒʌst ˈɡɪvɪŋ ˌɪnfɚˈmeɪʃən./

/ðə ˈfaɪnəl pɔɪnt ɪz əˈbaʊt ˌʌndɚˈstændɪŋ ðə ˈmɛsɪdʒ. ˈsʌmˌtaɪmz, ə ˈsɛntəns kæn hæv tuː ˈdɪfrənt ˈmiːnɪŋz dɪˈpɛndɪŋ ɑn ðə ˌɪntəˈneɪʃən. ɡʊd ˌɪntəˈneɪʃən hɛlps əˈvɔɪd ˌmɪsʌndɚˈstændɪŋz. ɪt meɪks ðə ˌkɑnvɚˈseɪʃən klɪr ænd hɛlps ðə ˈlɪsənɚ ˈfɑloʊ ðə ˈstɔri ˈiːzəli. wɪˈðaʊt ˌɪntəˈneɪʃən, ˈɪŋɡlɪʃ saʊndz ˈvɛri streɪndʒ ænd ˈdɪfɪkəlt tə ˈfɑloʊ./

/ɪn kənˈkluːʒən, ˌɪntəˈneɪʃən ɪz ðə ˈmɛlədi əv ði ˈɪŋɡlɪʃ ˈlæŋɡwɪdʒ. ɪt ɪkˈsprɛsɪz ˈfilɪŋz, ˈsɛpəˌreɪts ˈkwɛstʃənz frəm fækts, ænd ɪnˈʃʊrz klɪr kəˌmjunəˈkeɪʃən. fɔr ˈɛvri bɪˈɡɪnɚ, ˈpræktəsɪŋ ði \"ʌp ænd daʊn\" əv ðə vɔɪs ɪz ə ɡreɪt weɪ tə saʊnd laɪk ə ˈnætʃrəl ˈspikɚ./`,
  },
  {
    id: 'rules-final-s-es',
    title: 'The Rules of Final -s and -es',
    text: `In English, we often add -s or -es to the end of words. This happens when we talk about more than one thing or when we use "he, she, it" in a sentence. However, this ending has three different sounds. Here are the three main points to understand these sounds.

The first point is the soft /s/ sound, like the sound of a snake. We use this sound after "voiceless" letters where our throat does not vibrate. For example, in words like "cats," "books," or "maps." The sound is short and sharp. If a student practices this sound, their English will sound very clean and accurate.

The second point is the vibrating /z/ sound, like a bee. This is the most common sound for -s. It happens after "voiced" letters where our throat moves. For example, in the words "dogs," "pens," or "trees." Many beginners make a mistake by using a hard /s/ sound here. Using the buzzing /z/ sound makes a student sound much more natural.

The final point is the extra syllable /ɪz/. We use this after specific sounds like /sh/, /ch/, or /x/. For example, the word "bus" becomes "bus-es" and "watch" becomes "watch-es." This sound adds a small extra beat to the word. It is important because if we forget the extra syllable, the listener might not know if the word is plural or singular.

In conclusion, the final -s/-es is not always the same. It can sound like a soft /s/, a buzzing /z/, or an extra /ɪz/. By learning these three rules, beginners can improve their grammar and pronunciation at the same time.`,
    phoneticText: `/ɪn ˈɪŋɡlɪʃ, wi ˈɔfən æd -s ɔr -əz tə ði ɛnd əv wɝdz. ðɪs ˈhæpənz wɛn wi tɔk əˈbaʊt mɔr ðæn wʌn θɪŋ ɔr wɛn wi juːz \"hi, ʃi, ɪt\" ɪn ə ˈsɛntəns. haʊˈɛvɚ, ðɪs ˈɛndɪŋ hæz θriː ˈdɪfrənt saʊndz. hɪr ɑr ðə θriː meɪn pɔɪnts tə ˌʌndɚˈstænd ðiz saʊndz./

/ðə fɝst pɔɪnt ɪz ðə sɔft /s/ saʊnd, laɪk ðə saʊnd əv ə sneɪk. wi juːz ðɪs saʊnd ˈæftɚ \"ˈvɔɪsləs\" ˈlɛtɚz wɛr aʊɚ θroʊt dʌz nɑt ˈvaɪbreɪt. fɔr ɪɡˈzæmpəl, ɪn wɝdz laɪk \"kæts,\" \"bʊks,\" ɔr \"mæps.\" ðə saʊnd ɪz ʃɔrt ænd ʃɑrp. ɪf ə ˈstudənt ˈpræktəsɪz ðɪs saʊnd, ðɛr ˈɪŋɡlɪʃ wɪl saʊnd ˈvɛri klin ænd ˈækjɚət./

/ðə ˈsɛkənd pɔɪnt ɪz ðə ˈvaɪbreɪtɪŋ /z/ saʊnd, laɪk ə biː. ðɪs ɪz ðə moʊst ˈkɑmən saʊnd fɔr -s. ɪt ˈhæpənz ˈæftɚ \"vɔɪst\" ˈlɛtɚz wɛr aʊɚ θroʊt muːvz. fɔr ɪɡˈzæmpəl, ɪn ðə wɝdz \"dɔɡz,\" \"pɛnz,\" ɔr \"triz.\" ˈmɛni bɪˈɡɪnɚz meɪk ə mɪˈsteɪk baɪ ˈjuːzɪŋ ə hɑrd /s/ saʊnd hɪr. ˈjuːzɪŋ ðə ˈbʌzɪŋ /z/ saʊnd meɪks ə ˈstudənt saʊnd mʌtʃ mɔr ˈnætʃrəl./

/ðə ˈfaɪnəl pɔɪnt ɪz ði ˈɛkstrə ˈsɪləbəl /ɪz/. wi juːz ðɪs ˈæftɚ spəˈsɪfɪk saʊndz laɪk /ʃ/, /tʃ/, ɔr /ks/. fɔr ɪɡˈzæmpəl, ðə wɝd \"bʌs\" bɪˈkʌmz \"ˈbʌsɪz\" ænd \"wɑtʃ\" bɪˈkʌmz \"ˈwɑtʃɪz.\" ðɪs saʊnd ædz ə smɔl ˈɛkstrə bit tə ðə wɝd. ɪt ɪz ɪmˈpɔrtənt bɪˈkɔz ɪf wi fɚˈɡɛt ði ˈɛkstrə ˈsɪləbəl, ðə ˈlɪsənɚ maɪt nɑt noʊ ɪf ðə wɝd ɪz ˈplʊrəl ɔr ˈsɪŋɡjələr./

/ɪn kənˈkluːʒən, ðə ˈfaɪnəl -s/-əz ɪz nɑt ˈɔlweɪz ðə seɪm. ɪt kæn saʊnd laɪk ə sɔft /s/, ə ˈbʌzɪŋ /z/, ɔr æn ˈɛkstrə /ɪz/. baɪ ˈlɝnɪŋ ðiz θriː rulz, bɪˈɡɪnɚz kæn ɪmˈpruv ðɛr ˈɡræmɚ ænd prəˌnʌnsiˈeɪʃən æt ðə seɪm taɪm./`,
  },
  {
    id: 'three-sounds-final-ed',
    title: 'The Three Sounds of Final -ed',
    text: `In English, we add -ed to the end of a verb to show that an action is finished. Many beginners think that we always say "ed" clearly, but that is not correct. In reality, this ending has three different sounds. Here are the three main points to remember.

The first point is the strong /t/ sound. We use this sound after "voiceless" letters like /p/, /k/, /s/, or /sh/. For example, the word "walked" sounds like "walk-t" and "washed" sounds like "wash-t." Even though we write "ed," we do not use our throat to make the sound. This is a very common rule in American English pronunciation.

The second point is the soft /d/ sound. This happens after "voiced" letters where our throat vibrates, such as /l/, /n/, /r/, or /v/. For example, "played" sounds like "play-d" and "cleaned" sounds like "clean-d." This sound is very smooth and blends with the word. Using the correct /d/ sound helps students sound more fluent and natural.

The final point is the extra syllable /ɪd/. We only use this when the word ends with the letters "t" or "d." For example, "wanted" becomes "wan-ted" and "needed" becomes "nee-ded." This is the only time we add an extra beat to the word. If a student says "walk-ed" instead of "walk-t," it can sound strange to a native speaker.

In summary, the final -ed can be pronounced as a strong /t/, a soft /d/, or an extra /ɪd/. Understanding these three rules is very helpful for beginners. If students practice these sounds, they will speak about the past with clarity and confidence.`,
    phoneticText: `/ɪn ˈɪŋɡlɪʃ, wi æd -d ɔr -əd tə ði ɛnd əv ə vɝb tə ʃoʊ ðæt æn ˈækʃən ɪz ˈfɪnɪʃt. ˈmɛni bɪˈɡɪnɚz θɪŋk ðæt wi ˈɔlweɪz seɪ \"ɛd\" ˈklɪrli, bʌt ðæt ɪz nɑt kəˈrɛkt. ɪn riˈæləti, ðɪs ˈɛndɪŋ hæz θriː ˈdɪfrənt saʊndz. hɪr ɑr ðə θriː meɪn pɔɪnts tə rɪˈmɛmbɚ./

/ðə fɝst pɔɪnt ɪz ðə strɔŋ /t/ saʊnd. wi juːz ðɪs saʊnd ˈæftɚ \"ˈvɔɪsləs\" ˈlɛtɚz laɪk /p/, /k/, /s/, ɔr /ʃ/. fɔr ɪɡˈzæmpəl, ðə wɝd \"wɔkt\" saʊndz laɪk \"wɔk-t\" ænd \"wɑʃt\" saʊndz laɪk \"wɑʃ-t.\" ˈivən ðoʊ wi raɪt \"ɛd,\" wi du nɑt juːz aʊɚ θroʊt tə meɪk ðə saʊnd. ðɪs ɪz ə ˈvɛri ˈkɑmən rul ɪn əˈmɛrɪkən ˈɪŋɡlɪʃ prəˌnʌnsiˈeɪʃən./

/ðə ˈsɛkənd pɔɪnt ɪz ðə sɔft /d/ saʊnd. ðɪs ˈhæpənz ˈæftɚ \"vɔɪst\" ˈlɛtɚz wɛr aʊɚ θroʊt ˈvaɪbreɪts, sʌtʃ əz /l/, /n/, /r/, ɔr /v/. fɔr ɪɡˈzæmpəl, \"pleɪd\" saʊndz laɪk \"pleɪ-d\" ænd \"klind\" saʊndz laɪk \"klin-d.\" ðɪs saʊnd ɪz ˈvɛri smuːð ænd blɛndz wɪð ðə wɝd. ˈjuːzɪŋ ðə kəˈrɛkt /d/ saʊnd hɛlps ˈstudənts saʊnd mɔr ˈfluːənt ænd ˈnætʃrəl./

/ðə ˈfaɪnəl pɔɪnt ɪz ði ˈɛkstrə ˈsɪləbəl /ɪd/. wi ˈoʊnli juːz ðɪs wɛn ðə wɝd ɛndz wɪð ðə ˈlɛtɚz \"t\" ɔr \"d.\" fɔr ɪɡˈzæmpəl, \"ˈwɑntɪd\" bɪˈkʌmz \"wɑn-tɪd\" ænd \"ˈniːdɪd\" bɪˈkʌmz \"niː-dɪd.\" ðɪs ɪz ði ˈoʊnli taɪm wi æd æn ˈɛkstrə bit tə ðə wɝd. ɪf ə ˈstudənt sɛz \"wɔk-ɛd\" ɪnˈstɛd əv \"wɔk-t,\" ɪt kæn saʊnd streɪndʒ tə ə ˈneɪtɪv ˈspikɚ./

/ɪn ˈsʌmɚi, ðə ˈfaɪnəl -d kæn bi prəˈnaʊnst æz ə strɔŋ /t/, ə sɔft /d/, ɔr æn ˈɛkstrə /ɪd/. ˌʌndɚˈstændɪŋ ðiz θriː rulz ɪz ˈvɛri ˈhɛlpfəl fɔr bɪˈɡɪnɚz. ɪf ˈstudənts ˈpræktəs ðiz saʊndz, ðeɪ wɪl spiːk əˈbaʊt ðə pæst wɪð ˈklɛrəti ænd ˈkɑnfɪdəns./`,
  },
  {
    id: 'released-t-sound',
    title: 'Understanding the Released T Sound',
    text: `In English, the letter "T" is a very important sound. When a "T" comes at the end of a word, we often let out a small puff of air. This is called a Released T. Here are three main points why this sound is important for every student.

The first point is that the Released T is like a small explosion. To make this sound, you put your tongue behind your top teeth and then release the air quickly. For example, in words like "Cat," "Hot," or "Stop it." This small "hiss" of air tells the listener that the word is finished. It makes your speaking sound very clear and sharp.

The second point is that it helps people hear the difference between similar words. If we do not release the "T," a word like "Hat" might sound like "Had" or "Ham." By releasing the "T" sound, you give a clear signal to the listener. This is a basic physical skill that prevents confusion during a conversation.

The final point is that we use the Released T most often when we speak slowly or when a word is at the end of a sentence. For example, if you say "The coffee is hot," the "T" in "hot" should be released. Practicing this sound helps beginners feel more professional because their words do not sound "cut off" or incomplete.

In conclusion, the Released T is a vital part of clear English. It creates a small explosion of air, separates words clearly, and is very useful for daily communication. If a beginner trains their tongue to release the "T," they will become much easier to understand.`,
    phoneticText: `/ɪn ˈɪŋɡlɪʃ, ðə ˈlɛtɚ \"tiː\" ɪz ə ˈvɛri ɪmˈpɔrtənt saʊnd. wɛn ə \"tiː\" kʌmz æt ði ɛnd əv ə wɝd, wi ˈɔfən lɛt aʊt ə smɔl pʌf əv ɛr. ðɪs ɪz kɔld ə rɪˈlist tiː. hɪr ɑr θriː meɪn pɔɪnts waɪ ðɪs saʊnd ɪz ɪmˈpɔrtənt fɔr ˈɛvri ˈstudənt./

/ðə fɝst pɔɪnt ɪz ðæt ðə rɪˈlist tiː ɪz laɪk ə smɔl ɪkˈsploʊʒən. tə meɪk ðɪs saʊnd, ju pʊt jɔr tʌŋ bɪˈhaɪnd jɔr tɑp tiːθ ænd ðɛn rɪˈlis ði ɛr ˈkwɪkli. fɔr ɪɡˈzæmpəl, ɪn wɝdz laɪk \"kæt,\" \"hɑt,\" ɔr \"stɑp ɪt.\" ðɪs smɔl hɪs əv ɛr tɛlz ðə ˈlɪsənɚ ðæt ðə wɝd ɪz ˈfɪnɪʃt. ɪt meɪks jɔr ˈspiːkɪŋ saʊnd ˈvɛri klɪr ænd ʃɑrp./

/ðə ˈsɛkənd pɔɪnt ɪz ðæt ɪt hɛlps ˈpipəl hɪr ðə ˈdɪfrəns bɪˈtwiːn ˈsɪmələr wɝdz. ɪf wi du nɑt rɪˈlis ðə \"tiː,\" ə wɝd laɪk \"hæt\" maɪt saʊnd laɪk \"hæd\" ɔr \"hæm.\" baɪ rɪˈlisɪŋ ðə \"tiː\" saʊnd, ju ɡɪv ə klɪr ˈsɪɡnəl tə ðə ˈlɪsənɚ. ðɪs ɪz ə ˈbeɪsɪk ˈfɪzɪkəl skɪl ðæt prɪˈvɛnts kənˈfjuːʒən ˈdʊrɪŋ ə ˌkɑnvɚˈseɪʃən./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt wi juːz ðə rɪˈlist tiː moʊst ˈɔfən wɛn wi spiːk ˈsloʊli ɔr wɛn ə wɝd ɪz æt ði ɛnd əv ə ˈsɛntəns. fɔr ɪɡˈzæmpəl, ɪf ju seɪ \"ðə ˈkɔfi ɪz hɑt,\" ðə \"tiː\" ɪn \"hɑt\" ʃʊd bi rɪˈlist. ˈpræktəsɪŋ ðɪs saʊnd hɛlps bɪˈɡɪnɚz fil mɔr prəˈfɛʃənəl bɪˈkɔz ðɛr wɝdz du nɑt saʊnd \"kʌt ɔf\" ɔr ˌɪnkəmˈplit./

/ɪn kənˈkluːʒən, ðə rɪˈlist tiː ɪz ə ˈvaɪtəl pɑrt əv klɪr ˈɪŋɡlɪʃ. ɪt kriˈeɪts ə smɔl ɪkˈsploʊʒən əv ɛr, ˈsɛpəˌreɪts wɝdz ˈklɪrli, ænd ɪz ˈvɛri ˈjuːsfəl fɔr ˈdeɪli kəˌmjunəˈkeɪʃən. ɪf ə bɪˈɡɪnɚ treɪnz ðɛr tʌŋ tə rɪˈlis ðə \"tiː,\" ðeɪ wɪl bɪˈkʌm mʌtʃ ˈiːziɚ tə ˌʌndɚˈstænd./`,
  },
  {
    id: 'released-t-at-the-end',
    title: 'Finishing the Word: Released T at the End',
    text: `In English, many words end with the letter "T." To speak clearly, we must often "release" this sound at the very end of a word or sentence. This means we let a small amount of air come out of our mouth. Here are three main points about using the Released T at the end.

The first point is that the Released T acts as a stopper. It tells the listener that the word is finished. For example, when we say "Wait," "Cat," or "Apartment," we release a tiny "puff" of air. Without this sound, the word might sound incomplete. This is a very important habit for beginners to build so they sound more accurate.

The second point is using the Released T at the end of a sentence. When a word with "T" is the last word we say, we usually release the sound to be extra clear. For instance, in the sentence "I am at bat," the last "T" is loud and clear. This helps the person listening to you understand exactly where your sentence stops.

The final point is that the Released T is a physical exercise. To make this sound correctly, your tongue must touch the top of your mouth and then move away quickly. This is what we call "Physical Movement." By practicing this movement, students train their mouth to be more active. This makes all of their English speaking sound stronger and more confident.

In conclusion, the Released T at the end is a simple but powerful skill. It helps finish words, creates clarity in sentences, and trains the mouth. If a learner focuses on this small sound, they will sound much more like a professional English speaker.`,
    phoneticText: `/ɪn ˈɪŋɡlɪʃ, ˈmɛni wɝdz ɛnd wɪð ðə ˈlɛtɚ \"tiː.\" tə spiːk ˈklɪrli, wi mʌst ˈɔfən rɪˈlis ðɪs saʊnd æt ðə ˈvɛri ɛnd əv ə wɝd ɔr ˈsɛntəns. ðɪs minz wi lɛt ə smɔl əˈmaʊnt əv ɛr kʌm aʊt əv aʊɚ maʊθ. hɪr ɑr θriː meɪn pɔɪnts əˈbaʊt ˈjuːzɪŋ ðə rɪˈlist tiː æt ði ɛnd./

/ðə fɝst pɔɪnt ɪz ðæt ðə rɪˈlist tiː ækts æz ə ˈstɑpɚ. ɪt tɛlz ðə ˈlɪsənɚ ðæt ðə wɝd ɪz ˈfɪnɪʃt. fɔr ɪɡˈzæmpəl, wɛn wi seɪ \"weɪt,\" \"kæt,\" ɔr \"əˈpɑrtmənt,\" wi rɪˈlis ə ˈtaɪni pʌf əv ɛr. wɪˈðaʊt ðɪs saʊnd, ðə wɝd maɪt saʊnd ˌɪnkəmˈplit. ðɪs ɪz ə ˈvɛri ɪmˈpɔrtənt ˈhæbɪt fɔr bɪˈɡɪnɚz tə bɪld soʊ ðeɪ saʊnd mɔr ˈækjɚət./

/ðə ˈsɛkənd pɔɪnt ɪz ˈjuːzɪŋ ðə rɪˈlist tiː æt ði ɛnd əv ə ˈsɛntəns. wɛn ə wɝd wɪð \"tiː\" ɪz ðə læst wɝd wi seɪ, wi ˈjuːʒuəli rɪˈlis ðə saʊnd tə bi ˈɛkstrə klɪr. fɔr ˈɪnstəns, ɪn ðə ˈsɛntəns \"aɪ æm æt bæt,\" ðə læst \"tiː\" ɪz laʊd ænd klɪr. ðɪs hɛlps ðə ˈpɝsən ˈlɪsənɪŋ tə ju ˌʌndɚˈstænd ɪɡˈzæktli wɛr jɔr ˈsɛntəns stɑps./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt ðə rɪˈlist tiː ɪz ə ˈfɪzɪkəl ˈɛksɚˌsaɪz. tə meɪk ðɪs saʊnd kəˈrɛktli, jɔr tʌŋ mʌst tʌtʃ ðə tɑp əv jɔr maʊθ ænd ðɛn muːv əˈweɪ ˈkwɪkli. ðɪs ɪz wʌt wi kɔl \"ˈfɪzɪkəl ˈmuvmənt.\" baɪ ˈpræktəsɪŋ ðɪs ˈmuvmənt, ˈstudənts treɪn ðɛr maʊθ tə bi mɔr ˈæktɪv. ðɪs meɪks ɔl əv ðɛr ˈɪŋɡlɪʃ ˈspiːkɪŋ saʊnd ˈstrɔŋɡɚ ænd mɔr ˈkɑnfɪdənt./

/ɪn kənˈkluːʒən, ðə rɪˈlist tiː æt ði ɛnd ɪz ə ˈsɪmpəl bʌt ˈpaʊɚfəl skɪl. ɪt hɛlps ˈfɪnɪʃ wɝdz, kriˈeɪts ˈklɛrəti ɪn ˈsɛntənsɪz, ænd treɪnz ðə maʊθ. ɪf ə ˈlɝnɚ ˈfoʊkəsɪz ɑn ðɪs smɔl saʊnd, ðeɪ wɪl saʊnd mʌtʃ mɔr laɪk ə prəˈfɛʃənəl ˈɪŋɡlɪʃ ˈspikɚ./`,
  },
  {
    id: 'held-t-and-glottal-stop',
    title: 'Understanding the Held T and Glottal Stop',
    text: `In natural English conversation, speakers do not always release the "T" sound with air. Sometimes, they stop the sound quickly. This is called a Held T or a Glottal Stop. It is very common in American English. Here are three main points to understand this sound.

The first point is that a Held T means we stop the air in our throat or with our tongue. Instead of letting the air out (like an explosion), we keep it inside. For example, in the word "Put" or "Eat," the sound ends very quickly. It sounds like the word is "cut short." This is a very natural way for native speakers to talk when they are speaking fast.

The second point is the Glottal Stop. This is a special way to stop the sound using only the throat. We often use this for words that end in "-t" or "-nt," like "Mountain," "Button," or even the word "Can't." It sounds like a tiny "catch" in your voice. Learning this helps students understand why native speakers sound different from a textbook.

The final point is that using a Held T helps students sound more natural. If you release every "T" sound at the end of every word, you might sound too formal or like a robot. By using a Held T in daily sentences, like "I forgot it," your English flows better. It makes your speaking feel smoother and easier for others to listen to.

In conclusion, the Held T and Glottal Stop are about stopping the sound instead of releasing it. It is a natural habit that makes English sound smooth and fluent. If a beginner learns how to "hold" their sounds, they will understand fast English much better.`,
    phoneticText: `/ɪn ˈnætʃrəl ˈɪŋɡlɪʃ ˌkɑnvɚˈseɪʃən, ˈspikɚz du nɑt ˈɔlweɪz rɪˈlis ðə \"tiː\" saʊnd wɪð ɛr. ˈsʌmˌtaɪmz, ðeɪ stɑp ðə saʊnd ˈkwɪkli. ðɪs ɪz kɔld ə hɛld tiː ɔr ə ˈɡlɑɾəl stɑp. ɪt ɪz ˈvɛri ˈkɑmən ɪn əˈmɛrɪkən ˈɪŋɡlɪʃ. hɪr ɑr θriː meɪn pɔɪnts tə ˌʌndɚˈstænd ðɪs saʊnd./

/ðə fɝst pɔɪnt ɪz ðæt ə hɛld tiː minz wi stɑp ði ɛr ɪn aʊɚ θroʊt ɔr wɪð aʊɚ tʌŋ. ɪnˈstɛd əv ˈlɛtɪŋ ði ɛr aʊt (laɪk æn ɪkˈsploʊʒən), wi kiːp ɪt ɪnˈsaɪd. fɔr ɪɡˈzæmpəl, ɪn ðə wɝd \"pʊt\" ɔr \"it,\" ðə saʊnd ɛndz ˈvɛri ˈkwɪkli. ɪt saʊndz laɪk ðə wɝd ɪz \"kʌt ʃɔrt.\" ðɪs ɪz ə ˈvɛri ˈnætʃrəl weɪ fɔr ˈneɪtɪv ˈspikɚz tə tɔk wɛn ðeɪ ɑr ˈspiːkɪŋ fæst./

/ðə ˈsɛkənd pɔɪnt ɪz ðə ˈɡlɑɾəl stɑp. ðɪs ɪz ə ˈspɛʃəl weɪ tə stɑp ðə saʊnd ˈjuːzɪŋ ˈoʊnli ðə θroʊt. wi ˈɔfən juːz ðɪs fɔr wɝdz ðæt ɛnd ɪn \"-t\" ɔr \"-nt,\" laɪk \"ˈmaʊʔn,\" \"ˈbʌʔn,\" ɔr ˈivən ðə wɝd \"kæʔnt.\" ɪt saʊndz laɪk ə ˈtaɪni kætʃ ɪn jɔr vɔɪs. ˈlɝnɪŋ ðɪs hɛlps ˈstudənts ˌʌndɚˈstænd waɪ ˈneɪtɪv ˈspikɚz saʊnd ˈdɪfrənt frəm ə ˈtɛkstˌbʊk./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt ˈjuːzɪŋ ə hɛld tiː hɛlps ˈstudənts saʊnd mɔr ˈnætʃrəl. ɪf ju rɪˈlis ˈɛvri \"tiː\" saʊnd æt ði ɛnd əv ˈɛvri wɝd, ju maɪt saʊnd tuː ˈfɔrməl ɔr laɪk ə ˈroʊˌbɑt. baɪ ˈjuːzɪŋ ə hɛld tiː ɪn ˈdeɪli ˈsɛntənsɪz, laɪk \"aɪ fɚˈɡɑt ɪt,\" jɔr ˈɪŋɡlɪʃ floʊz ˈbɛtɚ. ɪt meɪks jɔr ˈspiːkɪŋ fil ˈsmuðɚ ænd ˈiːziɚ fɔr ˈʌðɚz tə ˈlɪsən tu./

/ɪn kənˈkluːʒən, ðə hɛld tiː ænd ˈɡlɑɾəl stɑp ɑr əˈbaʊt ˈstɑpɪŋ ðə saʊnd ɪnˈstɛd əv rɪˈlisɪŋ ɪt. ɪt ɪz ə ˈnætʃrəl ˈhæbɪt ðæt meɪks ˈɪŋɡlɪʃ saʊnd smuːð ænd ˈfluːənt. ɪf ə bɪˈɡɪnɚ lɝnz haʊ tə \"hoʊld\" ðɛr saʊndz, ðeɪ wɪl ˌʌndɚˈstænd fæst ˈɪŋɡlɪʃ mʌtʃ ˈbɛtɚ./`,
  },
  {
    id: 'secret-of-silent-t',
    title: 'The Secret of the Silent T',
    text: `In English, we usually say every letter we see. However, sometimes the letter "T" is silent. This means we write the letter, but we do not make any sound. Understanding the Silent T is a great way to sound more like a native speaker. Here are three main points about this secret sound.

The first point is that the "T" often disappears when it comes after the letter N. In American English, many people do not say the "T" in words like "Internet," "Center," or "Twenty." Instead, they say "In-ner-net" or "Cen-ner." This happens because the "N" and "T" are in the same position in the mouth, so speakers skip the "T" to speak faster.

The second point is about fixed silent letters in old English words. Some words have a "T" that is always silent, no matter how slow you speak. For example, in the words "Listen," "Castle," and "Whistle." In these words, the "T" is completely quiet. Students must memorize these special words so they do not make mistakes when reading out loud.

The final point is that the Silent T helps with the flow of the language. English is a language that likes to move quickly from one sound to the next. By not saying the "T," the words become softer and easier to connect. This is part of "Natural Speech." When a student learns which "T" to keep and which "T" to hide, their English sounds much smoother.

In conclusion, the Silent T is an important part of English pronunciation. It often happens after the letter N, exists in fixed words, and helps the flow of speech. If a beginner understands these rules, they will find it much easier to understand movies and native speakers.`,
    phoneticText: `/ɪn ˈɪŋɡlɪʃ, wi ˈjuːʒuəli seɪ ˈɛvri ˈlɛtɚ wi siː. haʊˈɛvɚ, ˈsʌmˌtaɪmz ðə ˈlɛtɚ \"tiː\" ɪz ˈsaɪlənt. ðɪs minz wi raɪt ðə ˈlɛtɚ, bʌt wi du nɑt meɪk ˈɛni saʊnd. ˌʌndɚˈstændɪŋ ðə ˈsaɪlənt tiː ɪz ə ɡreɪt weɪ tə saʊnd mɔr laɪk ə ˈneɪtɪv ˈspikɚ. hɪr ɑr θriː meɪn pɔɪnts əˈbaʊt ðɪs ˈsiːkrət saʊnd./

/ðə fɝst pɔɪnt ɪz ðæt ðə \"tiː\" ˈɔfən ˌdɪsəˈpɪrz wɛn ɪt kʌmz ˈæftɚ ðə ˈlɛtɚ \"ɛn.\" ɪn əˈmɛrɪkən ˈɪŋɡlɪʃ, ˈmɛni ˈpipəl du nɑt seɪ ðə \"tiː\" ɪn wɝdz laɪk \"ˈɪntɚˌnɛt,\" \"ˈsɛntɚ,\" ɔr \"ˈtwɛni.\" ɪnˈstɛd, ðeɪ seɪ \"ˈɪnɚˌnɛt\" ɔr \"ˈsɛnɚ.\" ðɪs ˈhæpənz bɪˈkɔz ðə \"ɛn\" ænd \"tiː\" ɑr ɪn ðə seɪm pəˈzɪʃən ɪn ðə maʊθ, soʊ ˈspikɚz skɪp ðə \"tiː\" tə spiːk ˈfæstɚ./

/ðə ˈsɛkənd pɔɪnt ɪz əˈbaʊt fɪkst ˈsaɪlənt ˈlɛtɚz ɪn oʊld ˈɪŋɡlɪʃ wɝdz. sʌm wɝdz hæv ə \"tiː\" ðæt ɪz ˈɔlweɪz ˈsaɪlənt, noʊ ˈmætɚ haʊ sloʊ ju spiːk. fɔr ɪɡˈzæmpəl, ɪn ðə wɝdz \"ˈlɪsən,\" \"ˈkæsəl,\" ænd \"ˈwɪsəl.\" ɪn ðiz wɝdz, ðə \"tiː\" ɪz kəmˈplitli ˈkwaɪət. ˈstudənts mʌst ˈmɛmɚaɪz ðiz ˈspɛʃəl wɝdz soʊ ðeɪ du nɑt meɪk mɪˈsteɪks wɛn ˈriːdɪŋ aʊt laʊd./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt ðə ˈsaɪlənt tiː hɛlps wɪð ðə floʊ əv ðə ˈlæŋɡwɪdʒ. ˈɪŋɡlɪʃ ɪz ə ˈlæŋɡwɪdʒ ðæt laɪks tə muːv ˈkwɪkli frəm wʌn saʊnd tə ðə nɛkst. baɪ nɑt ˈseɪɪŋ ðə \"tiː,\" ðə wɝdz bɪˈkʌm ˈsɔftɚ ænd ˈiːziɚ tə kəˈnɛkt. ðɪs ɪz pɑrt əv \"ˈnætʃrəl spiːtʃ.\" wɛn ə ˈstudənt lɝnz wɪtʃ \"tiː\" tə kip ænd wɪtʃ \"tiː\" tə haɪd, ðɛr ˈɪŋɡlɪʃ saʊndz mʌtʃ ˈsmuðɚ./

/ɪn kənˈkluːʒən, ðə ˈsaɪlənt tiː ɪz æn ɪmˈpɔrtənt pɑrt əv ˈɪŋɡlɪʃ prəˌnʌnsiˈeɪʃən. ɪt ˈɔfən ˈhæpənz ˈæftɚ ðə ˈlɛtɚ \"ɛn,\" ɪɡˈzɪsts ɪn fɪkst wɝdz, ænd hɛlps ðə floʊ əv spiːtʃ. ɪf ə bɪˈɡɪnɚ ˌʌndɚˈstændz ðiz rulz, ðeɪ wɪl faɪnd ɪt mʌtʃ ˈiːziɚ tə ˌʌndɚˈstænd ˈmuviz ænd ˈneɪtɪv ˈspikɚz./`,
  },
  {
    id: 'american-flap-t',
    title: 'The American Flap T',
    text: `In American English, the letter "T" often changes its sound. When a "T" is between two vowel sounds, it does not sound like a sharp "T." Instead, it sounds like a very fast and light "D." This is called the Flap T. Here are three main points to understand this sound.

The first point is that the Flap T sounds like a soft "D". For example, in the word "Water," Americans do not say "Wa-Ter" with a sharp "T." They say "Wa-Der." Other common words are "Better," "City," and "Party." By changing the "T" to a light "D," the word becomes much easier and faster to say.

The second point is about the physical movement of the tongue. To make a Flap T, the tongue "flaps" or hits the top of the mouth very quickly. It is much softer than a regular "D." This is a physical skill that students must practice. It is like a quick bounce of the tongue. This movement helps the speaker move from one vowel to the next without stopping.

The final point is that the Flap T is the secret to a natural American accent. If you say "Com-pu-ter" with a very strong "T," people will understand you, but you will sound very formal. If you say "Com-pu-der," you sound more like a native speaker. Using the Flap T makes your English sound smooth and friendly, which is great for daily conversation.

In conclusion, the Flap T is a special sound that makes "T" sound like a soft "D". It depends on the tongue movement and is a key part of American English. If a beginner practices this sound, they will sound much more natural and fluent when they speak.`,
    phoneticText: `/ɪn əˈmɛrɪkən ˈɪŋɡlɪʃ, ðə ˈlɛtɚ \"tiː\" ˈɔfən ˈtʃeɪndʒɪz ɪts saʊnd. wɛn ə \"tiː\" ɪz bɪˈtwiːn tuː ˈvaʊəl saʊndz, ɪt dʌz nɑt saʊnd laɪk ə ʃɑrp \"tiː.\" ɪnˈstɛd, ɪt saʊndz laɪk ə ˈvɛri fæst ænd laɪt \"diː.\" ðɪs ɪz kɔld ðə flæp tiː. hɪr ɑr θriː meɪn pɔɪnts tə ˌʌndɚˈstænd ðɪs saʊnd./

/ðə fɝst pɔɪnt ɪz ðæt ðə flæp tiː saʊndz laɪk ə sɔft \"diː.\" fɔr ɪɡˈzæmpəl, ɪn ðə wɝd \"ˈwɔɾɚ,\" əˈmɛrɪkənz du nɑt seɪ \"wɔ-tɚ\" wɪð ə ʃɑrp \"tiː.\" ðeɪ seɪ \"ˈwɔɾɚ.\" ˈʌðɚ ˈkɑmən wɝdz ɑr \"ˈbɛɾɚ,\" \"ˈsɪɾi,\" ænd \"ˈpɑrɾi.\" baɪ ˈtʃeɪndʒɪŋ ðə \"tiː\" tə ə laɪt \"diː,\" ðə wɝd bɪˈkʌmz mʌtʃ ˈiːziɚ ænd ˈfæstɚ tə seɪ./

/ðə ˈsɛkənd pɔɪnt ɪz əˈbaʊt ðə ˈfɪzɪkəl ˈmuvmənt əv ðə tʌŋ. tə meɪk ə flæp tiː, ðə tʌŋ \"flæps\" ɔr hɪts ðə tɑp əv ðə maʊθ ˈvɛri ˈkwɪkli. ɪt ɪz mʌtʃ ˈsɔftɚ ðæn ə ˈrɛɡjələr \"diː.\" ðɪs ɪz ə ˈfɪzɪkəl skɪl ðæt ˈstudənts mʌst ˈpræktəs. ɪt ɪz laɪk ə kwɪk baʊns əv ðə tʌŋ. ðɪs ˈmuvmənt hɛlps ðə ˈspikɚ muːv frəm wʌn ˈvaʊəl tə ðə nɛkst wɪˈðaʊt ˈstɑpɪŋ./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt ðə flæp tiː ɪz ðə ˈsiːkrət tə ə ˈnætʃrəl əˈmɛrɪkən ˈæksɛnt. ɪf ju seɪ \"kəmˈpjuːtɚ\" wɪð ə ˈvɛri strɔŋ \"tiː,\" ˈpipəl wɪl ˌʌndɚˈstænd ju, bʌt ju wɪl saʊnd ˈvɛri ˈfɔrməl. ɪf ju seɪ \"kəmˈpjuːɾɚ,\" ju saʊnd mɔr laɪk ə ˈneɪtɪv ˈspikɚ. ˈjuːzɪŋ ðə flæp tiː meɪks jɔr ˈɪŋɡlɪʃ saʊnd smuːð ænd ˈfrɛndli, wɪtʃ ɪz ɡreɪt fɔr ˈdeɪli ˌkɑnvɚˈseɪʃən./

/ɪn kənˈkluːʒən, ðə flæp tiː ɪz ə ˈspɛʃəl saʊnd ðæt meɪks \"tiː\" saʊnd laɪk ə sɔft \"diː.\" ɪt dɪˈpɛndz ɑn ðə tʌŋ ˈmuvmənt ænd ɪz ə kiː pɑrt əv əˈmɛrɪkən ˈɪŋɡlɪʃ. ɪf ə bɪˈɡɪnɚ ˈpræktəsɪz ðɪs saʊnd, ðeɪ wɪl saʊnd mʌtʃ mɔr ˈnætʃrəl ænd ˈfluːənt wɛn ðeɪ spiːk./`,
  },
  {
    id: 'mystery-of-silent-letters',
    title: 'The Mystery of Silent Letters',
    text: `English spelling can be very confusing for beginners. One of the biggest challenges is Silent Letters. These are letters that we see in a word, but we do not say them at all. Here are three main points to help you understand why they exist and how to use them.

The first point is that many common words have hidden silent letters. For example, in the word "Walk," the letter "L" is silent. In the word "Know," the letter "K" is silent. Even the letter "B" can be silent, like in the word "Comb" or "Thumb." Students must learn to look at a word and know which letter to ignore so they can speak correctly.

The second point is about the origin of the language. Many years ago, people actually pronounced these letters. However, over time, the speaking style changed, but the writing stayed the same. This is why English spelling looks different from the sound. Understanding this helps students realize that silent letters are not "mistakes," but they are a part of the history of English.

The final point is that silent letters help you read and write accurately. Even though we do not say the letter, we still need to write it. For example, "Write" (menulis) and "Right" (benar) sound exactly the same, but the silent "W" tells us the meaning is about using a pen. Learning these letters helps students become better at both spelling and speaking at the same time.

In conclusion, Silent Letters are a "mystery" that every beginner must solve. They are hidden sounds, they have a long history, and they help with clear reading. If a student practices these special words, they will feel much more confident when talking to others.`,
    phoneticText: `/ˈɪŋɡlɪʃ ˈspɛlɪŋ kæn bi ˈvɛri kənˈfjuzɪŋ fɔr bɪˈɡɪnɚz. wʌn əv ðə ˈbɪɡəst ˈtʃælɪndʒɪz ɪz ˈsaɪlənt ˈlɛtɚz. ðiz ɑr ˈlɛtɚz ðæt wi si ɪn ə wɝd, bʌt wi du nɑt seɪ ðɛm æt ɔl. hɪr ɑr θriː meɪn pɔɪnts tə hɛlp ju ˌʌndɚˈstænd waɪ ðeɪ ɪɡˈzɪst ænd haʊ tə juːz ðɛm./

/ðə fɝst pɔɪnt ɪz ðæt ˈmɛni ˈkɑmən wɝdz hæv ˈhɪdən ˈsaɪlənt ˈlɛtɚz. fɔr ɪɡˈzæmpəl, ɪn ðə wɝd \"wɔk,\" ðə ˈlɛtɚ \"ɛl\" ɪz ˈsaɪlənt. ɪn ðə wɝd \"noʊ,\" ðə ˈlɛtɚ \"keɪ\" ɪz ˈsaɪlənt. ˈivən ðə ˈlɛtɚ \"biː\" kæn bi ˈsaɪlənt, laɪk ɪn ðə wɝd \"koʊm\" ɔr \"θʌm.\" ˈstudənts mʌst lɝn tə lʊk æt ə wɝd ænd noʊ wɪtʃ ˈlɛtɚ tə ɪɡˈnɔr soʊ ðeɪ kæn spiːk kəˈrɛktli./

/ðə ˈsɛkənd pɔɪnt ɪz əˈbaʊt ði ˈɔrɪdʒən əv ðə ˈlæŋɡwɪdʒ. ˈmɛni jɪrz əˈɡoʊ, ˈpipəl ˈækʧuəli prəˈnaʊnst ðiz ˈlɛtɚz. haʊˈɛvɚ, ˈoʊvɚ taɪm, ðə ˈspiːkɪŋ staɪl tʃeɪndʒd, bʌt ðə ˈraɪtɪŋ steɪd ðə seɪm. ðɪs ɪz waɪ ˈɪŋɡlɪʃ ˈspɛlɪŋ lʊks ˈdɪfrənt frəm ðə saʊnd. ˌʌndɚˈstændɪŋ ðɪs hɛlps ˈstudənts ˈriːəˌlaɪz ðæt ˈsaɪlənt ˈlɛtɚz ɑr nɑt mɪˈsteɪks, bʌt ðeɪ ɑr ə pɑrt əv ðə ˈhɪstɚi əv ˈɪŋɡlɪʃ./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt ˈsaɪlənt ˈlɛtɚz hɛlp ju riːd ænd raɪt ˈækjɚətli. ˈivən ðoʊ wi du nɑt seɪ ðə ˈlɛtɚ, wi stɪl nid tə raɪt ɪt. fɔr ɪɡˈzæmpəl, \"raɪt\" (məˈnulɪs) ænd \"raɪt\" (bəˈnɑr) saʊnd ɪɡˈzæktli ðə seɪm, bʌt ðə ˈsaɪlənt \"ˈdʌbəl juː\" tɛlz ʌs ðə ˈmiːnɪŋ ɪz əˈbaʊt ˈjuːzɪŋ ə pɛn. ˈlɝnɪŋ ðiz ˈlɛtɚz hɛlps ˈstudənts bɪˈkʌm ˈbɛtɚ æt boʊθ ˈspɛlɪŋ ænd ˈspiːkɪŋ æt ðə seɪm taɪm./

/ɪn kənˈkluːʒən, ˈsaɪlənt ˈlɛtɚz ɑr ə \"ˈmɪstɚi\" ðæt ˈɛvri bɪˈɡɪnɚ mʌst sɑlv. ðeɪ ɑr ˈhɪdən saʊndz, ðeɪ hæv ə lɔŋ ˈhɪstɚi, ænd ðeɪ hɛlp wɪð klɪr ˈriːdɪŋ. ɪf ə ˈstudənt ˈpræktəsɪz ðiz ˈspɛʃəl wɝdz, ðeɪ wɪl fil mʌtʃ mɔr ˈkɑnfɪdənt wɛn ˈtɔkɪŋ tə ˈʌðɚz./`,
  },
  {
    id: 'eight-pop-sounds',
    title: 'The 8 Pop Sounds in English',
    text: `In English pronunciation, there are 8 specific sounds where the air is blocked and then released like a small explosion. These are called "Plosives" or Pop Sounds. To master English, a student must understand how to control these 8 sounds. Here are three main points about them.

The first point is the Voiceless Pops. These sounds use only air, and your throat does not vibrate. They are [p] as in "Pick," [t] as in "Tall," [k] as in "Cook," and [tʃ] as in "Chips." These four sounds are very "airy." When you say them at the beginning of a word, you should feel a strong puff of air on your hand.

The second point is the Voiced Pops. These are the "partners" of the first group, but your throat vibrates when you say them. They are [b] as in "Big," [d] as in "Dog," [ɡ] as in "Go," and [dʒ] as in "Jump." Even though they are "pops," the explosion is softer because the energy comes from your voice box.

The final point is that these 8 sounds help separate words. Because these sounds "stop" the air, they create clear borders between words. If a student is too lazy to make these pop sounds, their English will sound "blurry" or difficult to hear. Practicing all 8 sounds ensures that every word you say is sharp and professional.

In conclusion, there are 8 Pop Sounds divided into Voiceless and Voiced groups. They are the building blocks of clear speech. By practicing the physical movement of these 8 sounds, beginners can speak English with better rhythm and clarity.`,
    phoneticText: `/ɪn ˈɪŋɡlɪʃ prəˌnʌnsiˈeɪʃən, ðɛr ɑr eɪt spəˈsɪfɪk saʊndz wɛr ði ɛr ɪz blɑkt ænd ðɛn rɪˈlist laɪk ə smɔl ɪkˈsploʊʒən. ðiz ɑr kɔld \"ˈploʊsɪvz\" ɔr pɑp saʊndz. tə ˈmæstɚ ˈɪŋɡlɪʃ, ə ˈstudənt mʌst ˌʌndɚˈstænd haʊ tə kənˈtroʊl ðiz eɪt saʊndz. hɪr ɑr θriː meɪn pɔɪnts əˈbaʊt ðɛm./

/ðə fɝst pɔɪnt ɪz ðə \"ˈvɔɪsləs pɑps.\" ðiz saʊndz juːz ˈoʊnli ɛr, ænd jɔr θroʊt dʌz nɑt ˈvaɪbreɪt. ðeɪ ɑr [p] æz ɪn \"pɪk,\" [t] æz ɪn \"tɔl,\" [k] æz ɪn \"kʊk,\" ænd [tʃ] æz ɪn \"tʃɪps.\" ðiz fɔr saʊndz ɑr ˈvɛri ˈɛri. wɛn ju seɪ ðɛm æt ðə bɪˈɡɪnɪŋ əv ə wɝd, ju ʃʊd fil ə strɔŋ pʌf əv ɛr ɑn jɔr hænd./

/ðə ˈsɛkənd pɔɪnt ɪz ðə \"vɔɪst pɑps.\" ðiz ɑr ðə \"ˈpɑrtnɚz\" əv ðə fɝst ɡrup, bʌt jɔr θroʊt ˈvaɪbreɪts wɛn ju seɪ ðɛm. ðeɪ ɑr [b] æz ɪn \"bɪɡ,\" [d] æz ɪn \"dɔɡ,\" [ɡ] æz ɪn \"ɡoʊ,\" ænd [dʒ] æz ɪn \"dʒʌmp.\" ˈivən ðoʊ ðeɪ ɑr \"pɑps,\" ði ɪkˈsploʊʒən ɪz ˈsɔftɚ bɪˈkɔz ði ˈɛnɚdʒi kʌmz frəm jɔr vɔɪs bɑks./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt ðiz eɪt saʊndz hɛlp ˈsɛpəˌreɪt wɝdz. bɪˈkɔz ðiz saʊndz stɑp ði ɛr, ðeɪ kriˈeɪt klɪr ˈbɔrdɚz bɪˈtwiːn wɝdz. ɪf ə ˈstudənt ɪz tuː ˈleɪzi tə meɪk ðiz pɑp saʊndz, ðɛr ˈɪŋɡlɪʃ wɪl saʊnd \"ˈblɝi\" ɔr ˈdɪfɪkəlt tə hɪr. ˈpræktəsɪŋ ɔl eɪt saʊndz ɪnˈʃʊrz ðæt ˈɛvri wɝd ju seɪ ɪz ʃɑrp ænd prəˈfɛʃənəl./

/ɪn kənˈkluːʒən, ðɛr ɑr eɪt pɑp saʊndz dɪˈvaɪdɪd ˈɪntu ˈvɔɪsləs ænd vɔɪst ɡrups. ðeɪ ɑr ðə ˈbɪldɪŋ blɑks əv klɪr spiːtʃ. baɪ ˈpræktəsɪŋ ðə ˈfɪzɪkəl ˈmuvmənt əv ðiz eɪt saʊndz, bɪˈɡɪnɚz kæn spiːk ˈɪŋɡlɪʃ wɪð ˈbɛtɚ ˈrɪðəm ænd ˈklɛrəti./`,
  },
  {
    id: 'linking-connecting-sounds',
    title: 'Linking Words by Connecting Sounds',
    text: `In English, we do not stop after every word. Instead, we "connect" the words together. This is called Linking. It is like building a chain where every part is touching. Here are three main points about how to connect your sounds perfectly.

The first point is the most important: joining a consonant to a vowel. When a word ends with a consonant sound and the next word begins with a vowel, the two sounds become one. For example, instead of saying "An... orange," we say "A-norange." It feels like the "N" moves to the next word. This connection makes your English sound very smooth and professional.

The second point is about removing the silence. Beginners often put a small "gap" or silence between words. But in natural speech, there is no space. For example, in the phrase "Keep_it," the lips close for the "P" and immediately open for the "I." By connecting these sounds without stopping, you create the "flow" that native speakers use every day.

The final point is that connecting words saves energy and time. When you connect sounds, your mouth does not have to restart for every word. This allows you to speak faster and more easily. It also helps your listening skills. When you hear a native speaker say "Hold_on," you will recognize it as "Hol-don" because you understand how the connection works.

In conclusion, connecting sounds is a vital skill for speaking. It joins consonants to vowels, removes silence, and saves energy. If a student practices connecting their words, they will stop sounding like a robot and start sounding like a natural speaker.`,
    phoneticText: `/ɪn ˈɪŋɡlɪʃ, wi du nɑt stɑp ˈæftɚ ˈɛvri wɝd. ɪnˈstɛd, wi kəˈnɛkt ðə wɝdz təˈɡɛðɚ. ðɪs ɪz kɔld ˈlɪŋkɪŋ. ɪt ɪz laɪk ˈbɪldɪŋ ə tʃeɪn wɛr ˈɛvri pɑrt ɪz ˈtʌtʃɪŋ. hɪr ɑr θriː meɪn pɔɪnts əˈbaʊt haʊ tə kəˈnɛkt jɔr saʊndz ˈpɝfɪktli./

/ðə fɝst pɔɪnt ɪz ðə moʊst ɪmˈpɔrtənt: ˈdʒɔɪnɪŋ ə ˈkɑnsənənt tə ə ˈvaʊəl. wɛn ə wɝd ɛndz wɪð ə ˈkɑnsənənt saʊnd ænd ðə nɛkst wɝd bɪˈɡɪnz wɪð ə ˈvaʊəl, ðə tuː saʊndz bɪˈkʌm wʌn. fɔr ɪɡˈzæmpəl, ɪnˈstɛd əv ˈseɪɪŋ \"æn... ˈɔrɪndʒ,\" wi seɪ \"ə ˈnɔrɪndʒ.\" ɪt filz laɪk ðə \"ɛn\" muːvz tə ðə nɛkst wɝd. ðɪs kəˈnɛkʃən meɪks jɔr ˈɪŋɡlɪʃ saʊnd ˈvɛri smuːð ænd prəˈfɛʃənəl./

/ðə ˈsɛkənd pɔɪnt ɪz əˈbaʊt rɪˈmuvɪŋ ðə ˈsaɪləns. bɪˈɡɪnɚz ˈɔfən pʊt ə smɔl ɡæp ɔr ˈsaɪləns bɪˈtwiːn wɝdz. bʌt ɪn ˈnætʃrəl spiːtʃ, ðɛr ɪz noʊ speɪs. fɔr ɪɡˈzæmpəl, ɪn ðə freɪz \"kip ɪt,\" ðə lɪps kloʊz fɔr ðə \"piː\" ænd ɪˈmidiətli ˈoʊpən fɔr ði \"aɪ.\" baɪ kəˈnɛktɪŋ ðiz saʊndz wɪˈðaʊt ˈstɑpɪŋ, ju kriˈeɪt ðə floʊ ðæt ˈneɪtɪv ˈspikɚz juːz ˈɛvri deɪ./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt kəˈnɛktɪŋ wɝdz seɪvz ˈɛnɚdʒi ænd taɪm. wɛn ju kəˈnɛkt saʊndz, jɔr maʊθ dʌz nɑt hæv tə riˈstɑrt fɔr ˈɛvri wɝd. ðɪs əˈlaʊz ju tə spiːk ˈfæstɚ ænd mɔr ˈiːzəli. ɪt ˈɔlsoʊ hɛlps jɔr ˈlɪsənɪŋ skɪlz. wɛn ju hɪr ə ˈneɪtɪv ˈspikɚ seɪ \"hoʊld ɑn,\" ju wɪl ˈrɛkəɡˌnaɪz ɪt æz \"ˈhoʊldɑn\" bɪˈkɔz ju ˌʌndɚˈstænd haʊ ðə kəˈnɛkʃən wɝks./

/ɪn kənˈkluːʒən, kəˈnɛktɪŋ saʊndz ɪz ə ˈvaɪtəl skɪl fɔr ˈspiːkɪŋ. ɪt dʒɔɪnz ˈkɑnsənənts tə ˈvaʊəlz, rɪˈmuvz ˈsaɪləns, ænd seɪvz ˈɛnɚdʒi. ɪf ə ˈstudənt ˈpræktəsɪz kəˈnɛktɪŋ ðɛr wɝdz, ðeɪ wɪl stɑp ˈsaʊndɪŋ laɪk ə ˈroʊˌbɑt ænd stɑrt ˈsaʊndɪŋ laɪk ə ˈnætʃrəl ˈspikɚ./`,
  },
  {
    id: 'linking-missing-sound-rule',
    title: 'Linking Words: The Missing Sound Rule',
    text: `In English, sometimes we "hide" a sound to speak faster. This happens when the end of one word and the start of the next word have the same consonant. Instead of saying the sound two times, we say it only once. Here are three main points to understand this rule.

The first point is about twin consonants. When two words meet and have the same letter, they become a team. For example, in the phrase "Red dress," we do not say "Red-Dress" with two 'D' sounds. We say "Re-dress." We skip the first 'D' and jump to the second one. This makes the transition between words very smooth and fast.

The second point is that we hold the sound a little longer. Even though we "miss" or skip one sound, we do not just delete it. We stay on that letter for a tiny extra second. For example, in "Social life," we connect the two 'L' sounds. It sounds like one long 'L'. This tells the listener that there are actually two words, but they are connected perfectly.

The final point is that this rule helps you avoid extra effort. It is very tiring for your mouth muscles to say the same sound twice in a row, like "Bad dog." By using the "missing sound" rule, your mouth can move more easily to the next part of the sentence. This is a key part of sounding natural in American English and not sounding like a beginner who is struggling.

In conclusion, linking by missing sounds is a smart way to speak. It uses twin consonants, involves holding the sound, and saves your energy. If a student learns to skip the first sound of a pair, their English will flow much better and sound more professional.`,
    phoneticText: `/ɪn ˈɪŋɡlɪʃ, ˈsʌmˌtaɪmz wi \"haɪd\" ə saʊnd tə spiːk ˈfæstɚ. ðɪs ˈhæpənz wɛn ði ɛnd əv wʌn wɝd ænd ðə stɑrt əv ðə nɛkst wɝd hæv ðə seɪm ˈkɑnsənənt. ɪnˈstɛd əv ˈseɪɪŋ ðə saʊnd tuː taɪmz, wi seɪ ɪt ˈoʊnli wʌns. hɪr ɑr θriː meɪn pɔɪnts tə ˌʌndɚˈstænd ðɪs rul./

/ðə fɝst pɔɪnt ɪz əˈbaʊt twɪn ˈkɑnsənənts. wɛn tuː wɝdz miːt ænd hæv ðə seɪm ˈlɛtɚ, ðeɪ bɪˈkʌm ə tim. fɔr ɪɡˈzæmpəl, ɪn ðə freɪz \"rɛd drɛs,\" wi du nɑt seɪ \"rɛd-drɛs\" wɪð tuː \"diː\" saʊndz. wi seɪ \"rɛ-drɛs.\" wi skɪp ðə fɝst \"diː\" ænd dʒʌmp tə ðə ˈsɛkənd wʌn. ðɪs meɪks ðə trænˈzɪʃən bɪˈtwiːn wɝdz ˈvɛri smuːð ænd fæst./

/ðə ˈsɛkənd pɔɪnt ɪz ðæt wi hoʊld ðə saʊnd ə ˈlɪtəl ˈlɔŋɡɚ. ˈivən ðoʊ wi \"mɪs\" ɔr skɪp wʌn saʊnd, wi du nɑt dʒʌst dɪˈlit ɪt. wi steɪ ɑn ðæt ˈlɛtɚ fɔr ə ˈtaɪni ˈɛkstrə ˈsɛkənd. fɔr ɪɡˈzæmpəl, ɪn \"ˈsoʊʃəl laɪf,\" wi kəˈnɛkt ðə tuː \"ɛl\" saʊndz. ɪt saʊndz laɪk wʌn lɔŋ \"ɛl.\" ðɪs tɛlz ðə ˈlɪsənɚ ðæt ðɛr ɑr ˈækʧuəli tuː wɝdz, bʌt ðeɪ ɑr kəˈnɛktɪd ˈpɝfɪktli./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt ðɪs rul hɛlps ju əˈvɔɪd ˈɛkstrə ˈɛfɚt. ɪt ɪz ˈvɛri ˈtaɪrɪŋ fɔr jɔr maʊθ ˈmʌsəlz tə seɪ ðə seɪm saʊnd twaɪs ɪn ə roʊ, laɪk \"bæd dɔɡ.\" baɪ ˈjuːzɪŋ ðə \"ˈmɪsɪŋ saʊnd\" rul, jɔr maʊθ kæn muːv mɔr ˈiːzəli tə ðə nɛkst pɑrt əv ðə ˈsɛntəns. ðɪs ɪz ə kiː pɑrt əv ˈsaʊndɪŋ ˈnætʃrəl ɪn əˈmɛrɪkən ˈɪŋɡlɪʃ ænd nɑt ˈsaʊndɪŋ laɪk ə bɪˈɡɪnɚ hu ɪz ˈstrʌɡəlɪŋ./

/ɪn kənˈkluːʒən, ˈlɪŋkɪŋ baɪ ˈmɪsɪŋ saʊndz ɪz ə smɑrt weɪ tə spiːk. ɪt ˈjuːzɪz twɪn ˈkɑnsənənts, ɪnˈvɑlvz hoʊldɪŋ ðə saʊnd, ænd seɪvz jɔr ˈɛnɚdʒi. ɪf ə ˈstudənt lɝnz tə skɪp ðə fɝst saʊnd əv ə pɛr, ðɛr ˈɪŋɡlɪʃ wɪl floʊ mʌtʃ ˈbɛtɚ ænd saʊnd mɔr prəˈfɛʃənəl./`,
  },
  {
    id: 'linking-adding-extra-sounds',
    title: 'Linking by Adding Extra Sounds',
    text: `Sometimes, English speakers add a "secret" sound between words. This happens when one word ends with a vowel and the next word starts with a vowel. To keep the voice moving, we add a tiny sound like a /w/ or a /j/. Here are three main points about adding sounds.

The first point is the hidden /w/ sound. We add this sound when the first word ends in a "round" vowel like /u/ or /o/. For example, in the phrase "Go out," we do not stop between the words. We add a small /w/ and say "Go-w-out." Another example is "Too often," which sounds like "Too-w-often." This helps the mouth move smoothly from one shape to the next.

The second point is the hidden /j/ sound (like the letter "Y"). We add this when the first word ends in a "wide" vowel like /i/ or /e/. For example, in the phrase "I am," we say "I-y-am." Or in "She always," it sounds like "She-y-always." By adding this tiny sound, we don't have to stop our breath. It makes the two words feel like one single piece of music.

The final point is about the perfect flow. In English, stopping your voice between vowels sounds very jumpy or strange. Adding these tiny sounds creates a "bridge." This is a key part of the American accent. When you add a /w/ or a /j/, your speaking becomes very soft and fluid. It shows that you have great control over your mouth and your breath.

In conclusion, adding sounds is a smart trick for better pronunciation. We use the hidden /w/ and the hidden /j/ to build a bridge between vowels. If a beginner practices these extra sounds, their English will sound much more natural and very professional.`,
    phoneticText: `/ˈsʌmˌtaɪmz, ˈɪŋɡlɪʃ ˈspikɚz æd ə \"ˈsiːkrət\" saʊnd bɪˈtwiːn wɝdz. ðɪs ˈhæpənz wɛn wʌn wɝd ɛndz wɪð ə ˈvaʊəl ænd ðə nɛkst wɝd stɑrts wɪð ə ˈvaʊəl. tə kip ðə vɔɪs ˈmuvɪŋ, wi æd ə ˈtaɪni saʊnd laɪk ə /w/ ɔr ə /j/. hɪr ɑr θriː meɪn pɔɪnts əˈbaʊt ˈædɪŋ saʊndz./

/ðə fɝst pɔɪnt ɪz ðə ˈhɪdən /w/ saʊnd. wi æd ðɪs saʊnd wɛn ðə fɝst wɝd ɛndz ɪn ə raʊnd ˈvaʊəl laɪk /u/ ɔr /oʊ/. fɔr ɪɡˈzæmpəl, ɪn ðə freɪz \"ɡoʊ aʊt,\" wi du nɑt stɑp bɪˈtwiːn ðə wɝdz. wi æd ə smɔl /w/ ænd seɪ \"ɡoʊ-w-aʊt.\" əˈnʌðɚ ɪɡˈzæmpəl ɪz \"tuː ˈɔfən,\" wɪtʃ saʊndz laɪk \"tuː-w-ˈɔfən.\" ðɪs hɛlps ðə maʊθ muːv ˈsmuðli frəm wʌn ʃeɪp tə ðə nɛkst./

/ðə ˈsɛkənd pɔɪnt ɪz ðə ˈhɪdən /j/ saʊnd (laɪk ðə ˈlɛtɚ \"waɪ\"). wi æd ðɪs wɛn ðə fɝst wɝd ɛndz ɪn ə waɪd ˈvaʊəl laɪk /i/ ɔr /eɪ/. fɔr ɪɡˈzæmpəl, ɪn ðə freɪz \"aɪ æm,\" wi seɪ \"aɪ-j-æm.\" ɔr ɪn \"ʃi ˈɔlweɪz,\" ɪt saʊndz laɪk \"ʃi-j-ˈɔlweɪz.\" baɪ ˈædɪŋ ðɪs ˈtaɪni saʊnd, wi doʊnt hæv tə stɑp aʊɚ brɛθ. ɪt meɪks ðə tuː wɝdz fil laɪk wʌn ˈsɪŋɡəl pis əv ˈmjuzɪk./

/ðə ˈfaɪnəl pɔɪnt ɪz əˈbaʊt ðə ˈpɝfɪkt floʊ. ɪn ˈɪŋɡlɪʃ, ˈstɑpɪŋ jɔr vɔɪs bɪˈtwiːn ˈvaʊəlz saʊndz ˈvɛri ˈdʒʌmpi ɔr streɪndʒ. ˈædɪŋ ðiz ˈtaɪni saʊndz kriˈeɪts ə brɪdʒ. ðɪs ɪz ə kiː pɑrt əv ði əˈmɛrɪkən ˈæksɛnt. wɛn ju æd ə /w/ ɔr ə /j/, jɔr ˈspiːkɪŋ bɪˈkʌmz ˈvɛri sɔft ænd ˈfluːɪd. ɪt ʃoʊz ðæt ju hæv ɡreɪt kənˈtroʊl ˈoʊvɚ jɔr maʊθ ænd jɔr brɛθ./

/ɪn kənˈkluːʒən, ˈædɪŋ saʊndz ɪz ə smɑrt trɪk fɔr ˈbɛtɚ prəˌnʌnsiˈeɪʃən. wi juːz ðə ˈhɪdən /w/ ænd ðə ˈhɪdən /j/ tə bɪld ə brɪdʒ bɪˈtwiːn ˈvaʊəlz. ɪf ə bɪˈɡɪnɚ ˈpræktəsɪz ðiz ˈɛkstrə saʊndz, ðɛr ˈɪŋɡlɪʃ wɪl saʊnd mʌtʃ mɔr ˈnætʃrəl ænd ˈvɛri prəˈfɛʃənəl./`,
  },
  {
    id: 'linking-merging-sounds',
    title: 'Linking by Merging Sounds',
    text: `In English, some letters are like chemicals. When they touch each other, they change and become a new sound. This often happens when a word ends with "D," "T," "S," or "Z" and the next word starts with the letter "Y." Here are three main points about merging sounds.

The first point is the most common merger. When a word ends with a "T" and the next word is "You," they join to make a "CH" sound. For example, "Meet you" sounds like "Mee-chu." If the first word ends with a "D," it joins with "You" to make a "J" sound. For example, "Did you" sounds like "Di-ju." This is a very natural way to speak in American English.

The second point is merging with "S" or "Z." When a word ends with an "S" and the next word starts with "Y," they make a "SH" sound. For example, "Bless you" sounds like "Ble-shu." If it ends with a "Z," it makes a vibrating "ZH" sound, like in "As you" (sounds like "A-zhoo"). This merger helps the mouth move faster between words.

The final point is that merging makes you sound natural and fast. Beginners often try to say every letter separately: "Did... You... Know?" But native speakers always merge them: "Di-ju-know?" If a student learns these "sound formulas," they will understand movies much better. It is a key secret for anyone who wants to speak English with a smooth flow.

In conclusion, merging sounds is a process where two letters become one new sound. It creates the CH, J, SH, and ZH sounds. By practicing these "mergers," students can transform their English from a textbook style to a real, natural American style.`,
    phoneticText: `/ɪn ˈɪŋɡlɪʃ, sʌm ˈlɛtɚz ɑr laɪk ˈkɛmɪkəlz. wɛn ðeɪ tʌtʃ itʃ ˈʌðɚ, ðeɪ tʃeɪndʒ ænd bɪˈkʌm ə nuː saʊnd. ðɪs ˈɔfən ˈhæpənz wɛn ə wɝd ɛndz wɪð \"diː,\" \"tiː,\" \"ɛs,\" ɔr \"ziː\" ænd ðə nɛkst wɝd stɑrts wɪð ðə ˈlɛtɚ \"waɪ.\" hɪr ɑr θriː meɪn pɔɪnts əˈbaʊt ˈmɝdʒɪŋ saʊndz./

/ðə fɝst pɔɪnt ɪz ðə moʊst ˈkɑmən ˈmɝdʒɚ. wɛn ə wɝd ɛndz wɪð ə \"tiː\" ænd ðə nɛkst wɝd ɪz \"juː,\" ðeɪ dʒɔɪn tə meɪk ə \"tʃ\" saʊnd. fɔr ɪɡˈzæmpəl, \"miːt ju\" saʊndz laɪk \"ˈmiːtʃu.\" ɪf ðə fɝst wɝd ɛndz wɪð ə \"diː,\" ɪt dʒɔɪnz wɪð \"juː\" tə meɪk ə \"dʒ\" saʊnd. fɔr ɪɡˈzæmpəl, \"dɪd ju\" saʊndz laɪk \"ˈdɪdʒu.\" ðɪs ɪz ə ˈvɛri ˈnætʃrəl weɪ tə spiːk ɪn əˈmɛrɪkən ˈɪŋɡlɪʃ./

/ðə ˈsɛkənd pɔɪnt ɪz ˈmɝdʒɪŋ wɪð \"ɛs\" ɔr \"ziː.\" wɛn ə wɝd ɛndz wɪð an \"ɛs\" ænd ðə nɛkst wɝd stɑrts wɪð \"waɪ,\" ðeɪ meɪk ə \"ʃ\" saʊnd. fɔr ɪɡˈzæmpəl, \"blɛs ju\" saʊndz laɪk \"ˈblɛʃu.\" ɪf ɪt ɛndz wɪð ə \"ziː,\" ɪt meɪks ə ˈvaɪbreɪtɪŋ \"ʒ\" saʊnd, laɪk ɪn \"æz ju\" (saʊndz laɪk \"ˈæʒu\"). ðɪs ˈmɝdʒɚ hɛlps ðə maʊθ muːv ˈfæstɚ bɪˈtwiːn wɝdz./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt ˈmɝdʒɪŋ meɪks ju saʊnd ˈnætʃrəl ænd fæst. bɪˈɡɪnɚz ˈɔfən traɪ tə seɪ ˈɛvri ˈlɛtɚ səˈpɛrətli: \"dɪd... ju... noʊ?\" bʌt ˈneɪtɪv ˈspikɚz ˈɔlweɪz mɝdʒ ðɛm: \"ˈdɪdʒə noʊ?\" ɪf ə ˈstudənt lɝnz ðiz saʊnd ˈfɔrmjəlz, ðeɪ wɪl ˌʌndɚˈstænd ˈmuviz mʌtʃ ˈbɛtɚ. ɪt ɪz ə kiː ˈsiːkrət fɔr ˈɛniˌwʌn hu wɑnts tə spiːk ˈɪŋɡlɪʃ wɪð ə smuːð floʊ./

/ɪn kənˈkluːʒən, ˈmɝdʒɪŋ saʊndz ɪz ə ˈprɑsɛs wɛr tuː ˈlɛtɚz bɪˈkʌm wʌn nuː saʊnd. ɪt kriˈeɪts ðə tʃ, dʒ, ʃ, ænd ʒ saʊndz. baɪ ˈpræktəsɪŋ ðiz \"ˈmɝdʒɚz,\" ˈstudənts kæn trænsˈfɔrm ðɛr ˈɪŋɡlɪʃ frəm ə ˈtɛkstˌbʊk staɪl tə ə riːl, ˈnætʃrəl əˈmɛrɪkən staɪl./`,
  },
  {
    id: 'contractions-writing',
    title: 'Using Contractions in Writing',
    text: `In English writing, contractions like "don't" or "it's" are very common. However, there are rules about when to use them depending on the situation. Knowing these rules helps a student write correctly for different people. Here are three main points about contractions in writing.

The first point is the difference between informal and formal styles. We use contractions in informal writing, such as emails to friends, social media posts, or personal stories. But in formal writing, like a job application or a serious essay, we usually do not use them. Instead of writing "I'm," we write "I am." This makes the writing look more professional and respectful.

The second point is the correct use of the apostrophe. In writing, the apostrophe ( ' ) takes the place of the missing letters. For example, in "Can't," the apostrophe shows that the letters "n" and "o" are gone. A common mistake for beginners is forgetting the mark or putting it in the wrong place. Writing carefully helps the reader understand your message without confusion.

The final point is about special words that look similar. A very common problem in writing is the difference between "It's" and "Its." "It's" with an apostrophe means "It is." But "Its" without a mark shows that something belongs to an object. By learning these small details in writing, students can avoid basic mistakes and become much better writers.

In conclusion, contractions in writing depend on the level of formality, the correct use of marks, and avoiding common mistakes. If a student knows when to use "do not" and when to use "don't," their writing will always be appropriate for the situation.`,
    phoneticText: `/ɪn ˈɪŋɡlɪʃ ˈraɪtɪŋ, kənˈtrækʃənz laɪk \"doʊnt\" ɔr \"ɪts\" ɑr ˈvɛri ˈkɑmən. haʊˈɛvɚ, ðɛr ɑr rulz əˈbaʊt wɛn tə juːz ðɛm dɪˈpɛndɪŋ ɑn ðə ˌsɪtʃuˈeɪʃən. ˈnoʊɪŋ ðiz rulz hɛlps ə ˈstudənt raɪt kəˈrɛktli fɔr ˈdɪfrənt ˈpipəl. hɪr ɑr θriː meɪn pɔɪnts əˈbaʊt kənˈtrækʃənz ɪn ˈraɪtɪŋ./

/ðə fɝst pɔɪnt ɪz ðə ˈdɪfrəns bɪˈtwiːn ˌɪnfɔrˈmæl ænd ˈfɔrməl staɪlz. wi juːz kənˈtrækʃənz ɪn ˌɪnfɔrˈmæl ˈraɪtɪŋ, sʌtʃ əz ˈiːˌmeɪlz tə frɛndz, ˈsoʊʃəl ˈmidiə poʊsts, ɔr ˈpɝsənəl ˈstɔriz. bʌt ɪn ˈfɔrməl ˈraɪtɪŋ, laɪk ə dʒɑb ˌæplɪˈkeɪʃən ɔr ə ˈsɪriəs ˈɛseɪ, wi ˈjuːʒuəli du nɑt juːz ðɛm. ɪnˈstɛd əv ˈraɪtɪŋ \"aɪm,\" wi raɪt \"aɪ æm.\" ðɪs meɪks ðə ˈraɪtɪŋ lʊk mɔr prəˈfɛʃənəl ænd rɪˈspɛktfəl./

/ðə ˈsɛkənd pɔɪnt ɪz ðə kəˈrɛkt juːs əv ði əˈpɑstrəfi. ɪn ˈraɪtɪŋ, ði əˈpɑstrəfi teɪks ðə pleɪs əv ðə ˈmɪsɪŋ ˈlɛtɚz. fɔr ɪɡˈzæmpəl, ɪn \"kænt,\" ði əˈpɑstrəfi ʃoʊz ðæt ðə ˈlɛtɚz \"ɛn\" ænd \"oʊ\" ɑr ɡɔn. ə ˈkɑmən mɪˈsteɪk fɔr bɪˈɡɪnɚz ɪz fɚˈɡɛtɪŋ ðə mɑrk ɔr ˈpʊtɪŋ ɪt ɪn ðə rɔŋ pleɪs. ˈraɪtɪŋ ˈkɛrfəli hɛlps ðə ˈridɚ ˌʌndɚˈstænd jɔr ˈmɛsɪdʒ wɪˈðaʊt kənˈfjuːʒən./

/ðə ˈfaɪnəl pɔɪnt ɪz əˈbaʊt ˈspɛʃəl wɝdz ðæt lʊk ˈsɪmələr. ə ˈvɛri ˈkɑmən ˈprɑbləm ɪn ˈraɪtɪŋ ɪz ðə ˈdɪfrəns bɪˈtwiːn \"ɪts\" ænd \"ɪts.\" \"ɪts\" wɪð ən əˈpɑstrəfi minz \"ɪt ɪz.\" bʌt \"ɪts\" wɪˈðaʊt ə mɑrk ʃoʊz ðæt ˈsʌmθɪŋ bɪˈlɔŋz tə æn ˈɑbdʒɛkt. baɪ ˈlɝnɪŋ ðiz smɔl ˈdiːteɪlz ɪn ˈraɪtɪŋ, ˈstudənts kæn əˈvɔɪd ˈbeɪsɪk mɪˈsteɪks ænd bɪˈkʌm mʌtʃ ˈbɛtɚ ˈraɪtɚz./

/ɪn kənˈkluːʒən, kənˈtrækʃənz ɪn ˈraɪtɪŋ dɪˈpɛnd ɑn ðə ˈlɛvəl əv fɔrˈmæləti, ðə kəˈrɛkt juːs əv mɑrks, ænd əˈvɔɪdɪŋ ˈkɑmən mɪˈsteɪks. ɪf ə ˈstudənt noʊz wɛn tə juːz \"du nɑt\" ænd wɛn tə juːz \"doʊnt,\" ðɛr ˈraɪtɪŋ wɪl ˈɔlweɪz bi əˈproʊpriət fɔr ðə ˌsɪtʃuˈeɪʃən./`,
  },
  {
    id: 'contractions-speaking',
    title: 'Speaking Naturally with Contractions',
    text: `In spoken English, we almost never say every word separately. We join words together to create a smooth sound. This is very common in American English. If you want to sound natural, you must use contractions when you speak. Here are three main points about using them in conversation.

The first point is that contractions help you save breath. In English, we focus on the most important words. By making small words shorter, like changing "I will" to "I'll," we can move quickly to the main idea. This creates the "rhythm" of English. It makes speaking feel less like a lot of work and more like a natural flow of air.

The second point is the use of informal contractions. In daily conversation, Americans often use words like "Gonna" (Going to), "Wanna" (Want to), or "Gotta" (Got to). These are not usually written in books, but everyone says them. Learning to say "I'm gonna go" instead of "I am going to go" will immediately make you sound more like a native speaker.

The final point is that contractions help the listener understand your focus. When you shorten "do not" to "don't," the listener can focus on the action word that follows. It makes your sentences easier to follow because the "grammar words" are small and the "meaning words" are big. This is a key skill for clear and effective communication in the real world.

In conclusion, using contractions in speaking is about rhythm, informal style, and clarity. They help you save energy and sound more friendly. For a beginner, practicing these short sounds is the best way to transform a "textbook accent" into a real, natural American accent.`,
    phoneticText: `/ɪn ˈspoʊkən ˈɪŋɡlɪʃ, wi ˈɔlmoʊst ˈnɛvɚ seɪ ˈɛvri wɝd səˈpɛrətli. wi dʒɔɪn wɝdz təˈɡɛðɚ tə kriˈeɪt ə smuːð saʊnd. ðɪs ɪz ˈvɛri ˈkɑmən ɪn əˈmɛrɪkən ˈɪŋɡlɪʃ. ɪf ju wɑnt tə saʊnd ˈnætʃrəl, ju mʌst juːz kənˈtrækʃənz wɛn ju spiːk. hɪr ɑr θriː meɪn pɔɪnts əˈbaʊt ˈjuːzɪŋ ðɛm ɪn ˌkɑnvɚˈseɪʃən./

/ðə fɝst pɔɪnt ɪz ðæt kənˈtrækʃənz hɛlp ju seɪv brɛθ. ɪn ˈɪŋɡlɪʃ, wi ˈfoʊkəs ɑn ðə moʊst ɪmˈpɔrtənt wɝdz. baɪ ˈmeɪkɪŋ smɔl wɝdz ˈʃɔrtɚ, laɪk ˈtʃeɪndʒɪŋ \"aɪ wɪl\" tə \"aɪl,\" wi kæn muːv ˈkwɪkli tə ðə meɪn aɪˈdiə. ðɪs kriˈeɪts ðə ˈrɪðəm əv ˈɪŋɡlɪʃ. ɪt meɪks ˈspiːkɪŋ fil lɛs laɪk ə lɑt əv wɝk ænd mɔr laɪk ə ˈnætʃrəl floʊ əv ɛr./

/ðə ˈsɛkənd pɔɪnt ɪz ðə juːs əv ˌɪnfɔrˈmæl kənˈtrækʃənz. ɪn ˈdeɪli ˌkɑnvɚˈseɪʃən, əˈmɛrɪkənz ˈɔfən juːz wɝdz laɪk \"ˈɡʌnə\" (ˈɡoʊɪŋ tə), \"ˈwɑnə\" (wɑnt tə), ɔr \"ˈɡɑɾə\" (ɡɑt tə). ðiz ɑr nɑt ˈjuːʒuəli ˈrɪtən ɪn bʊks, bʌt ˈɛvriˌwʌn sɛz ðɛm. ˈlɝnɪŋ tə seɪ \"aɪm ˈɡʌnə ɡoʊ\" ɪnˈstɛd əv \"aɪ æm ˈɡoʊɪŋ tə ɡoʊ\" wɪl ɪˈmidiətli meɪk ju saʊnd mɔr laɪk ə ˈneɪtɪv ˈspikɚ./

/ðə ˈfaɪnəl pɔɪnt ɪz ðæt kənˈtrækʃənz hɛlp ðə ˈlɪsənɚ ˌʌndɚˈstænd jɔr ˈfoʊkəs. wɛn ju ˈʃɔrtən \"du nɑt\" tə \"doʊnt,\" ðə ˈlɪsənɚ kæn ˈfoʊkəs ɑn ði ˈækʃən wɝd ðæt ˈfɑloʊz. ɪt meɪks jɔr ˈsɛntənsɪz ˈiːziɚ tə ˈfɑloʊ bɪˈkɔz ðə \"ˈɡræmɚ wɝdz\" ɑr smɔl ænd ðə \"ˈmiːnɪŋ wɝdz\" ɑr bɪɡ. ðɪs ɪz ə kiː skɪl fɔr klɪr ænd ɪˈfɛktɪv kəˌmjunəˈkeɪʃən ɪn ðə riːl wɝld./

/ɪn kənˈkluːʒən, ˈjuːzɪŋ kənˈtrækʃənz ɪn ˈspiːkɪŋ ɪz əˈbaʊt ˈrɪðəm, ˌɪnfɔrˈmæl staɪl, ænd ˈklɛrəti. ðeɪ hɛlp ju seɪv ˈɛnɚdʒi ænd saʊnd mɔr ˈfrɛndli. fɔr ə bɪˈɡɪnɚ, ˈpræktəsɪŋ ðiz ʃɔrt saʊndz ɪz ðə bɛst weɪ tə trænsˈfɔrm ə \"ˈtɛkstˌbʊk ˈæksɛnt\" ˈɪntu ə riːl, ˈnætʃrəl əˈmɛrɪkən ˈæksɛnt./`,
  },
];

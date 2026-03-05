export type TwisterItem = {
  id: string;
  label: string;
  text: string;
  ipaLines?: string[];
  focus: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
};

export const TONGUE_TWISTERS: TwisterItem[] = [
  {
    id: 'she-sells',
    label: 'She Sells Sea Shells',
    text:
      'She sells seashells by the seashore. The shells she sells are surely seashells. So if she sells shells on the seashore, I am sure she sells seashore shells.',
    ipaLines: [
      '/ʃiː sɛlz ˈsiːʃɛlz baɪ ðə ˈsiːʃɔːr/',
      '/ðə ʃɛlz ʃiː sɛlz ɑːr ˈʃʊrli ˈsiːʃɛlz/',
      '/soʊ ɪf ʃiː sɛlz ʃɛlz ɑn ðə ˈsiːʃɔːr, aɪ əm ʃʊr ʃiː sɛlz ˈsiːʃɔːr ʃɛlz/',
    ],
    focus: '/s/ vs /ʃ/',
    level: 'Beginner',
  },
  {
    id: 'peter-piper',
    label: 'Peter Piper',
    text:
      'Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where is the peck of pickled peppers Peter Piper picked?',
    ipaLines: [
      '/ˈpiːtər ˈpaɪpər pɪkt ə pɛk əv ˈpɪkəld ˈpɛpərz/',
      '/ə pɛk əv ˈpɪkəld ˈpɛpərz ˈpiːtər ˈpaɪpər pɪkt/',
      '/ɪf ˈpiːtər ˈpaɪpər pɪkt ə pɛk əv ˈpɪkəld ˈpɛpərz, wɛr ɪz ðə pɛk əv ˈpɪkəld ˈpɛpərz ˈpiːtər ˈpaɪpər pɪkt/',
    ],
    focus: '/p/ and /k/',
    level: 'Beginner',
  },
  {
    id: 'betty-botter',
    label: 'Betty Botter',
    text:
      'Betty Botter bought some butter, but she said the butter was bitter. If I put it in my batter, it will make my batter bitter. So Betty Botter bought a bit of better butter to make the bitter batter better.',
    ipaLines: [
      '/ˈbɛti ˈbɑtər bɔːt sʌm ˈbʌtər, bʌt ʃi sɛd ðə ˈbʌtər wəz ˈbɪtər/',
      '/ɪf aɪ pʊt ɪt ɪn maɪ ˈbætər, ɪt wɪl meɪk maɪ ˈbætər ˈbɪtər/',
      '/soʊ ˈbɛti ˈbɑtər bɔːt ə bɪt əv ˈbɛtər ˈbʌtər tə meɪk ðə ˈbɪtər ˈbætər ˈbɛtər/',
    ],
    focus: '/b/ and /t/',
    level: 'Intermediate',
  },
  {
    id: 'woodchuck',
    label: 'Woodchuck',
    text:
      'How much wood would a woodchuck chuck if a woodchuck could chuck wood? A woodchuck would chuck as much wood as a woodchuck could chuck if a woodchuck could chuck wood.',
    ipaLines: [
      '/haʊ mʌtʃ wʊd wʊd ə ˈwʊdtʃʌk tʃʌk ɪf ə ˈwʊdtʃʌk kʊd tʃʌk wʊd/',
      '/ə ˈwʊdtʃʌk wʊd tʃʌk æz mʌtʃ wʊd æz ə ˈwʊdtʃʌk kʊd tʃʌk ɪf ə ˈwʊdtʃʌk kʊd tʃʌk wʊd/',
    ],
    focus: '/w/ and /tʃ/',
    level: 'Advanced',
  },
  {
    id: 'red-lorry',
    label: 'Red Lorry Yellow Lorry',
    text:
      'Red lorry, yellow lorry. Red lorry, yellow lorry. Really rural, really rural. Red lorry, yellow lorry.',
    ipaLines: [
      '/rɛd ˈlɔːri, ˈjɛloʊ ˈlɔːri/',
      '/rɛd ˈlɔːri, ˈjɛloʊ ˈlɔːri/',
      '/ˈrɪəli ˈrʊrəl, ˈrɪəli ˈrʊrəl/',
      '/rɛd ˈlɔːri, ˈjɛloʊ ˈlɔːri/',
    ],
    focus: '/r/ and /l/',
    level: 'Intermediate',
  },
  {
    id: 'thirty-three-thieves',
    label: 'Thirty-Three Thieves',
    text:
      'Thirty-three thieves thought that they thrilled the throne throughout Thursday. They thought that Thursday was the day they would thrill the throne the most.',
    ipaLines: [
      '/ˈθɜːrti θriː θiːvz θɔːt ðæt ðeɪ θrɪld ðə θroʊn θruːˈaʊt ˈθɜːrzdeɪ/',
      '/ðeɪ θɔːt ðæt ˈθɜːrzdeɪ wəz ðə deɪ ðeɪ wʊd θrɪl ðə θroʊn ðə moʊst/',
    ],
    focus: '/θ/ and /ð/',
    level: 'Advanced',
  },
  {
    id: 'i-thought-a-thought',
    label: 'I Thought a Thought',
    text:
      'I thought a thought. But the thought I thought was not the thought I thought I thought. If the thought I thought I thought had been the thought I thought, I would not have thought so much.',
    ipaLines: [
      '/aɪ θɔːt ə θɔːt/',
      '/bʌt ðə θɔːt aɪ θɔːt wəz nɑt ðə θɔːt aɪ θɔːt aɪ θɔːt/',
      '/ɪf ðə θɔːt aɪ θɔːt aɪ θɔːt hæd bɪn ðə θɔːt aɪ θɔːt, aɪ wʊd nɑt hæv θɔːt soʊ mʌtʃ/',
    ],
    focus: '/θ/ and /t/',
    level: 'Intermediate',
  },
  {
    id: 'blue-blaze',
    label: 'Blue Blaze',
    text:
      'A big black bug bit a big black bear and made the big black bear bleed blood. The big black bear bled blue-black blood after the big black bug bit it.',
    focus: '/b/ clusters',
    level: 'Intermediate',
  },
  {
    id: 'irish-wristwatch',
    label: 'Irish Wristwatch',
    text:
      'Irish wristwatch, Swiss wristwatch. Irish wristwatch, Swiss wristwatch. Which wristwatches are Irish wristwatches and which wristwatches are Swiss wristwatches?',
    focus: '/r/ + /w/ clusters',
    level: 'Advanced',
  },
  {
    id: 'fuzzy-wuzzy',
    label: 'Fuzzy Wuzzy',
    text:
      'Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy was not very fuzzy, was he?',
    focus: '/f/ vs /w/ vs /z/',
    level: 'Beginner',
  },
  {
    id: 'sixth-sheikhs-sixth-sheep',
    label: "Sixth Sheikh's Sixth Sheep",
    text:
      "The sixth sick sheikh's sixth sheep's sick. The sixth sick sheikh says his sixth sheep is surely sick.",
    focus: '/s/ /ʃ/ and final clusters',
    level: 'Advanced',
  },
  {
    id: 'eleven-benevolent-elephants',
    label: 'Eleven Benevolent Elephants',
    text:
      'Eleven benevolent elephants. Eleven benevolent elephants. Eleven benevolent elephants are elegant and energetic.',
    focus: '/l/ /v/ and rhythm',
    level: 'Intermediate',
  },
  {
    id: 'truly-rural',
    label: 'Truly Rural',
    text:
      'Truly rural, truly rural, truly rural. Rory the rural warrior rarely worries about rural roads.',
    focus: '/r/ and /l/',
    level: 'Intermediate',
  },
  {
    id: 'toy-boat',
    label: 'Toy Boat',
    text: 'Toy boat, toy boat, toy boat. A noisy toy boat bobbed beside another tiny toy boat.',
    focus: '/t/ and /b/',
    level: 'Beginner',
  },
  {
    id: 'good-cook',
    label: 'Good Cook',
    text:
      'A good cook could cook as many cookies as a good cook who could cook cookies. If a good cook could cook cookies, how many cookies could a good cook cook?',
    focus: '/k/ and /uː/',
    level: 'Intermediate',
  },
  {
    id: 'black-bug-bled-black-blood',
    label: 'Black Bug Bled Black Blood',
    text:
      'Black bug bled black blood. Blue bug bled blue blood. Black bug bled black blood while blue bug bled blue blood.',
    focus: '/bl/ clusters',
    level: 'Intermediate',
  },
  {
    id: 'fred-fed-ted-bread',
    label: 'Fred Fed Ted Bread',
    text: 'Fred fed Ted bread and Ted fed Fred bread. Fred said Ted fed Fred fresh bread today.',
    focus: '/f/ /fr/ /br/',
    level: 'Beginner',
  },
  {
    id: 'four-furious-friends',
    label: 'Four Furious Friends',
    text: 'Four furious friends fought for the phone. Four furious friends found the phone finally.',
    focus: '/f/',
    level: 'Beginner',
  },
  {
    id: 'green-glass-globes',
    label: 'Green Glass Globes',
    text: 'Green glass globes glow greenly. Great green glass globes glow in the gray garden.',
    focus: '/g/ and /gl/',
    level: 'Intermediate',
  },
  {
    id: 'trick-track-truck',
    label: 'Trick Track Truck',
    text: 'A tricky truck track tricked the truck. The truck tracked the tricky track fast.',
    focus: '/tr/ and /k/',
    level: 'Intermediate',
  },
  {
    id: 'nine-nice-night-nurses',
    label: 'Nine Nice Night Nurses',
    text: 'Nine nice night nurses nursing nicely. Nine nice night nurses never nap at night.',
    focus: '/n/',
    level: 'Beginner',
  },
  {
    id: 'six-sticky-skeletons',
    label: 'Six Sticky Skeletons',
    text: 'Six sticky skeletons. Six sticky skeletons. Six sticky skeletons stick silently.',
    focus: '/s/ clusters',
    level: 'Advanced',
  },
  {
    id: 'proper-copper-coffee-pot',
    label: 'Proper Copper Coffee Pot',
    text:
      'A proper copper coffee pot. A proper copper coffee pot. A proper copper coffee pot for a proper coffee cook.',
    focus: '/k/ and /p/',
    level: 'Intermediate',
  },
  {
    id: 'can-you-can-a-can',
    label: 'Can You Can a Can',
    text: 'Can you can a can as a canner can can a can? A clever canner can can a can.',
    focus: '/k/ and weak forms',
    level: 'Intermediate',
  },
  {
    id: 'luke-luck-lake',
    label: 'Luke Luck Likes Lakes',
    text: 'Luke Luck likes lakes. Luke Luck licks lakes. Luke Luck likes lakes and licks lakes.',
    focus: '/l/ and /k/',
    level: 'Beginner',
  },
  {
    id: 'rolling-red-wagons',
    label: 'Rolling Red Wagons',
    text: 'Rolling red wagons roll around rough roads. Red wagons roll right round the road.',
    focus: '/r/ and /w/',
    level: 'Intermediate',
  },
  {
    id: 'quick-kitty-caught',
    label: 'Quick Kitty Caught',
    text: 'Quick kitty caught the kitten in the kitchen. The kitten quickly kicked the kitchen curtain.',
    focus: '/k/ and /kw/',
    level: 'Intermediate',
  },
  {
    id: 'three-free-throws',
    label: 'Three Free Throws',
    text: 'Three free throws. Three free throws. Theo threw three free throws on Thursday.',
    focus: '/θ/ and /f/',
    level: 'Advanced',
  },
  {
    id: 'which-witch',
    label: 'Which Witch',
    text:
      'Which witch wished which wicked wish? The witch wished a wicked wish wisely, but another witch wished a different wicked wish.',
    focus: '/w/ and /tʃ/',
    level: 'Beginner',
  },
  {
    id: 'thin-sticks-thick-bricks',
    label: 'Thin Sticks Thick Bricks',
    text: 'Thin sticks, thick bricks. Thick sticks, thin bricks. The thin sticks stack by thick bricks.',
    focus: '/θ/ and final clusters',
    level: 'Advanced',
  },
  {
    id: 'brisk-brine',
    label: 'Brisk Brave Brigadiers',
    text: 'Brisk brave brigadiers brandished broad bright blades. Broad bright blades blazed boldly.',
    focus: '/br/ /bl/',
    level: 'Advanced',
  },
  {
    id: 'krisp-crusts',
    label: 'Krisp Crusts',
    text: 'Krisp crusts crackle crunchily. Crunchy crusts crackle when Krisp crushes crusts.',
    focus: '/kr/ and /k/',
    level: 'Intermediate',
  },
  {
    id: 'jolly-jelly-jars',
    label: 'Jolly Jelly Jars',
    text: 'Jolly jelly jars jiggle gently. Jenny juggles jolly jelly jars joyfully.',
    focus: '/dʒ/ sounds',
    level: 'Beginner',
  },
  {
    id: 'vivid-violet-vases',
    label: 'Vivid Violet Vases',
    text: 'Vivid violet vases vibrate. Victor viewed vivid violet vases very vividly.',
    focus: '/v/',
    level: 'Intermediate',
  },
  {
    id: 'zany-zebras',
    label: 'Zany Zebras Zigzag',
    text: 'Zany zebras zigzag in the zoo. Zoe sees zany zebras zigzagging zealously.',
    focus: '/z/',
    level: 'Beginner',
  },
  {
    id: 'many-an-anemone',
    label: 'Many Anemones',
    text: 'Anemone, anemone, anemone. You know anemone, and many anemones know me.',
    focus: 'word stress and rhythm',
    level: 'Advanced',
  },
  {
    id: 'near-an-ear',
    label: 'Near an Ear',
    text: 'I need not your needles, they are needless to me. Needles near an ear are nearly needless.',
    focus: '/n/ /d/ and linking',
    level: 'Advanced',
  },
  {
    id: 'fresh-fried-fish',
    label: 'Fresh Fried Fish',
    text: 'Fresh fried fish, fish fresh fried, fried fish fresh, fish fried fresh.',
    focus: '/fr/ and /f/',
    level: 'Intermediate',
  },
  {
    id: 'leather-weather',
    label: 'Leather Weather',
    text:
      'Leather weather, weather leather. Whether the weather is hot or whether the weather is cold, we weather the weather, whatever the weather.',
    focus: '/θ/ /ð/ and /w/',
    level: 'Advanced',
  },
  {
    id: 'cheese-trees',
    label: 'Cheese Trees',
    text:
      'Through three cheese trees three free fleas flew. While these fleas flew, freezy breeze blew.',
    focus: '/tʃ/ /f/ /θ/',
    level: 'Advanced',
  },
  {
    id: 'swan-swims',
    label: 'Swift Swan Swims',
    text: 'A swift swan swims swiftly to the west. The swan swims swiftly while the wind whispers.',
    focus: '/sw/ clusters',
    level: 'Intermediate',
  },
  {
    id: 'tiny-tiger',
    label: 'Tiny Tiger',
    text:
      'Tiny tiger takes two taxis to town. Two tiny taxis take tiny tiger to the tower. The tiny tiger talks to the taxi driver all the way to town.',
    focus: '/t/',
    level: 'Beginner',
  },
  {
    id: 'rare-red-roses',
    label: 'Rare Red Roses',
    text:
      'Rare red roses run around rocky roads. Rory raises rare red roses rapidly. Rory really loves red roses in the rainy season.',
    focus: '/r/',
    level: 'Intermediate',
  },
  {
    id: 'lively-lilies',
    label: 'Lively Lilies',
    text:
      'Lively lilies line the long lake. Lily likes lively lilies along the lane. Lily lovingly looks at the lively lilies every late afternoon.',
    focus: '/l/',
    level: 'Beginner',
  },
];

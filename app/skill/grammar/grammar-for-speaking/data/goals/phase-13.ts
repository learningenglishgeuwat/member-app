import { createPhaseGoals, type GoalSeed } from './createPhaseGoals';

const seeds: GoalSeed[] = [
  {
    goal: 'Diskusi terms and conditions',
    situation: 'Saat membahas syarat layanan sebelum tanda tangan.',
    keySentence: 'Could we review the terms and conditions clause by clause?',
    drill: 'Latih pembacaan poin kontrak dengan bahasa lugas.',
    domain: 'legal',
    survivalPriority: 'high',
  },
  {
    goal: 'Menjelaskan klausul kontrak dasar',
    situation: 'Saat harus menjelaskan isi kontrak ke non-legal stakeholder.',
    keySentence: 'This clause defines the scope of services.',
    drill: 'Praktikkan penjelasan 5 klausul kontrak umum.',
    domain: 'legal',
  },
  {
    goal: 'Membahas liability secara sederhana',
    situation: 'Saat perlu klarifikasi batas tanggung jawab.',
    keySentence: 'Our liability is limited under this agreement.',
    drill: 'Latih kalimat liability dengan contoh praktis.',
    domain: 'legal',
  },
  {
    goal: 'Memberi pengingat compliance',
    situation: 'Saat memastikan tim mengikuti kebijakan wajib.',
    keySentence: 'Please make sure we stay compliant with company policy.',
    drill: 'Sampaikan 8 reminder compliance dengan tone profesional.',
    domain: 'legal',
  },
  {
    goal: 'Menyampaikan peringatan anti-fraud',
    situation: 'Saat ada indikasi transaksi mencurigakan.',
    keySentence: 'This transaction requires additional fraud verification.',
    drill: 'Latih warning anti-fraud dengan langkah tindak lanjut.',
    domain: 'finance',
  },
  {
    goal: 'Follow-up invoice dan pembayaran',
    situation: 'Saat invoice sudah jatuh tempo.',
    keySentence: "I'm following up on invoice INV-204, which is due today.",
    drill: 'Praktikkan follow-up invoice dengan data nomor dan tanggal.',
    domain: 'finance',
  },
  {
    goal: 'Debt collection sopan',
    situation: 'Saat menagih pembayaran tertunda secara profesional.',
    keySentence: 'Could you update us on the payment timeline?',
    drill: 'Latih penagihan sopan dengan opsi penyelesaian.',
    domain: 'finance',
  },
  {
    goal: 'Menangani dispute billing',
    situation: 'Saat ada perbedaan perhitungan tagihan.',
    keySentence: "Let's review the billing details together.",
    drill: 'Role-play penyelesaian sengketa tagihan berbasis data.',
    domain: 'finance',
  },
  {
    goal: 'Berkomunikasi saat audit',
    situation: 'Saat auditor meminta klarifikasi proses.',
    keySentence: 'Here is the supporting document for this transaction.',
    drill: 'Latih jawaban audit yang singkat dan berbukti.',
    domain: 'legal',
  },
  {
    goal: 'Eskalasi ke legal handoff',
    situation: 'Saat isu harus diteruskan ke tim legal khusus.',
    keySentence: 'This matter will be handled by our legal counsel.',
    drill: 'Praktikkan handoff legal dengan ringkasan netral dan presisi.',
    domain: 'legal',
  },
];

export const PHASE_13_GOALS = createPhaseGoals({
  phaseId: 'phase-13',
  phaseTitle: 'Legal, Compliance, Finance Professional',
  levelBand: 'professional',
  defaultKeySentence2: 'Please provide the supporting documents.',
  defaultKeySentence3: 'We will proceed once compliance is confirmed.',
  seeds,
});

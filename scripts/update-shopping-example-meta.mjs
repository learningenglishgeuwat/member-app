import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/shopping.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const SHOPPING_ROWS = [
  { en: 'I go shopping on Saturday.', id: 'Saya pergi belanja hari Sabtu.', ipa: '/aɪ ɡoʊ ˈʃɑpɪŋ ɑn ˈsætərdeɪ/' },
  { en: 'This shop opens at nine.', id: 'Toko ini buka jam sembilan.', ipa: '/ðɪs ʃɑp ˈoʊpənz æt naɪn/' },
  { en: 'The store is near my house.', id: 'Tokonya dekat rumah saya.', ipa: '/ðə stɔr ɪz nɪr maɪ haʊs/' },
  { en: 'We buy vegetables at the market.', id: 'Kami beli sayur di pasar.', ipa: '/wi baɪ ˈvɛdʒtəbəlz æt ðə ˈmɑrkət/' },
  { en: 'The mall is very crowded today.', id: 'Malnya sangat ramai hari ini.', ipa: '/ðə mɔl ɪz ˈvɛri ˈkraʊdəd təˈdeɪ/' },
  { en: 'She buys milk at the supermarket.', id: 'Dia membeli susu di supermarket.', ipa: '/ʃi baɪz mɪlk æt ðə ˈsupərˌmɑrkət/' },
  { en: 'There is a minimarket on this street.', id: 'Ada minimarket di jalan ini.', ipa: '/ðɛr ɪz ə ˈmɪniˌmɑrkət ɑn ðɪs strit/' },
  { en: 'I bought shoes at a department store.', id: 'Saya membeli sepatu di toserba.', ipa: '/aɪ bɔt ʃuz æt ə dɪˈpɑrtmənt stɔr/' },
  { en: 'She runs an online shop.', id: 'Dia menjalankan toko online.', ipa: '/ʃi rʌnz ən ˈɑnlaɪn ʃɑp/' },
  { en: 'The seller is very friendly.', id: 'Penjualnya sangat ramah.', ipa: '/ðə ˈsɛlər ɪz ˈvɛri ˈfrɛndli/' },
  { en: 'Every buyer gets a receipt.', id: 'Setiap pembeli mendapat struk.', ipa: '/ˈɛvri ˈbaɪər ɡɛts ə rɪˈsit/' },
  { en: 'Please pay at the cashier.', id: 'Silakan bayar di kasir.', ipa: '/pliz peɪ æt ðə kæˈʃɪr/' },
  { en: 'The customer asked for help.', id: 'Pelanggan itu meminta bantuan.', ipa: '/ðə ˈkʌstəmər æskt fɔr hɛlp/' },
  { en: 'This product is popular.', id: 'Produk ini populer.', ipa: '/ðɪs ˈprɑdəkt ɪz ˈpɑpjələr/' },
  { en: 'I need one more item.', id: 'Saya butuh satu barang lagi.', ipa: '/aɪ nid wʌn mɔr ˈaɪtəm/' },
  { en: 'This brand is affordable.', id: 'Merek ini terjangkau.', ipa: '/ðɪs brænd ɪz əˈfɔrdəbəl/' },
  { en: 'The quality is very good.', id: 'Kualitasnya sangat bagus.', ipa: '/ðə ˈkwɑləti ɪz ˈvɛri ɡʊd/' },
  { en: 'What is the price of this bag?', id: 'Berapa harga tas ini?', ipa: '/wʌt ɪz ðə praɪs əv ðɪs bæɡ/' },
  { en: 'This jacket is too expensive.', id: 'Jaket ini terlalu mahal.', ipa: '/ðɪs ˈdʒækət ɪz tu ɪkˈspɛnsɪv/' },
  { en: 'These shoes are cheap.', id: 'Sepatu ini murah.', ipa: '/ðiz ʃuz ɑr tʃip/' },
  { en: 'This store gives a big discount.', id: 'Toko ini memberi diskon besar.', ipa: '/ðɪs stɔr ɡɪvz ə bɪɡ ˈdɪsˌkaʊnt/' },
  { en: 'There is a weekend sale.', id: 'Ada obral akhir pekan.', ipa: '/ðɛr ɪz ə ˈwikˌɛnd seɪl/' },
  { en: 'The promo ends tonight.', id: 'Promonya berakhir malam ini.', ipa: '/ðə ˈproʊmoʊ ɛndz təˈnaɪt/' },
  { en: 'I used a voucher today.', id: 'Saya memakai voucher hari ini.', ipa: '/aɪ juzd ə ˈvaʊtʃər təˈdeɪ/' },
  { en: 'Do you have a coupon?', id: 'Apakah kamu punya kupon?', ipa: '/du ju hæv ə ˈkupɑn/' },
  { en: 'I will pay by card.', id: 'Saya akan bayar pakai kartu.', ipa: '/aɪ wɪl peɪ baɪ kɑrd/' },
  { en: 'Payment is successful.', id: 'Pembayarannya berhasil.', ipa: '/ˈpeɪmənt ɪz səkˈsɛsfəl/' },
  { en: 'I only have cash.', id: 'Saya cuma punya uang tunai.', ipa: '/aɪ ˈoʊnli hæv kæʃ/' },
  { en: 'Can I pay with a credit card?', id: 'Boleh saya bayar pakai kartu kredit?', ipa: '/kæn aɪ peɪ wɪð ə ˈkrɛdət kɑrd/' },
  { en: 'He paid using a debit card.', id: 'Dia membayar pakai kartu debit.', ipa: '/hi peɪd ˈjuzɪŋ ə ˈdɛbət kɑrd/' },
  { en: 'I use an e-wallet for payment.', id: 'Saya pakai dompet digital untuk pembayaran.', ipa: '/aɪ juz ən i ˈwɑlət fɔr ˈpeɪmənt/' },
  { en: 'Please keep the receipt.', id: 'Tolong simpan struknya.', ipa: '/pliz kip ðə rɪˈsit/' },
  { en: 'The invoice is in your email.', id: 'Fakturnya ada di emailmu.', ipa: '/ði ˈɪnvɔɪs ɪz ɪn jʊr ˈimeɪl/' },
  { en: 'I am ready for checkout.', id: 'Saya siap untuk checkout.', ipa: '/aɪ æm ˈrɛdi fɔr ˈtʃɛkˌaʊt/' },
  { en: 'Add this item to your cart.', id: 'Tambahkan barang ini ke keranjangmu.', ipa: '/æd ðɪs ˈaɪtəm tə jʊr kɑrt/' },
  { en: 'Take a basket at the entrance.', id: 'Ambil keranjang di pintu masuk.', ipa: '/teɪk ə ˈbæskət æt ði ˈɛntrəns/' },
  { en: 'Do you need a shopping bag?', id: 'Perlu tas belanja?', ipa: '/du ju nid ə ˈʃɑpɪŋ bæɡ/' },
  { en: 'Sorry, this item is out of stock.', id: 'Maaf, barang ini stoknya habis.', ipa: '/ˈsɑri ðɪs ˈaɪtəm ɪz aʊt əv stɑk/' },
  { en: 'This size is still available.', id: 'Ukuran ini masih tersedia.', ipa: '/ðɪs saɪz ɪz stɪl əˈveɪləbəl/' },
  { en: 'The black color is sold out.', id: 'Warna hitam sudah habis.', ipa: '/ðə blæk ˈkʌlər ɪz soʊld aʊt/' },
  { en: 'Do you have a larger size?', id: 'Ada ukuran yang lebih besar?', ipa: '/du ju hæv ə ˈlɑrdʒər saɪz/' },
  { en: 'This shirt fits me well.', id: 'Kemeja ini pas di saya.', ipa: '/ðɪs ʃɝt fɪts mi wɛl/' },
  { en: 'Can I try on this jacket?', id: 'Boleh saya coba jaket ini?', ipa: '/kæn aɪ traɪ ɑn ðɪs ˈdʒækət/' },
  { en: 'Can I get a refund?', id: 'Boleh saya minta pengembalian dana?', ipa: '/kæn aɪ ɡɛt ə ˈrifʌnd/' },
  { en: 'I want to return this product.', id: 'Saya ingin mengembalikan produk ini.', ipa: '/aɪ wɑnt tə rɪˈtɝn ðɪs ˈprɑdəkt/' },
  { en: 'Can I exchange this size?', id: 'Boleh tukar ukuran ini?', ipa: '/kæn aɪ ɪksˈtʃeɪndʒ ðɪs saɪz/' },
  { en: 'Delivery takes two days.', id: 'Pengirimannya butuh dua hari.', ipa: '/dɪˈlɪvəri teɪks tu deɪz/' },
  { en: 'The shipping fee is free today.', id: 'Ongkirnya gratis hari ini.', ipa: '/ðə ˈʃɪpɪŋ fi ɪz fri təˈdeɪ/' },
  { en: 'My order arrived this morning.', id: 'Pesanan saya sampai pagi ini.', ipa: '/maɪ ˈɔrdər əˈraɪvd ðɪs ˈmɔrnɪŋ/' },
  { en: 'You can track your order online.', id: 'Kamu bisa melacak pesananmu secara online.', ipa: '/ju kæn træk jʊr ˈɔrdər ˈɑnlaɪn/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(SHOPPING_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing SHOPPING_ROWS mappings for: ${missingRows.join(' | ')}`);
}

let source = fs.readFileSync(META_PATH, 'utf8');

const updateMapSection = (sectionName, valueFactory) => {
  const startMarker = `export const ${sectionName}: Record<string, string> = {`;
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Section start not found: ${sectionName}`);
  const bodyStart = start + startMarker.length;
  const end = source.indexOf('\n};', bodyStart);
  if (end < 0) throw new Error(`Section end not found: ${sectionName}`);
  let body = source.slice(bodyStart, end);

  for (const example of examples) {
    const row = rowMap.get(example);
    const value = valueFactory(row);
    const keyPattern = JSON.stringify(example).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lineRegex = new RegExp(`(\\n\\s*${keyPattern}:\\s*)\"(?:\\\\.|[^\"])*\"(,?)`);
    if (lineRegex.test(body)) {
      body = body.replace(lineRegex, `$1${JSON.stringify(value)}$2`);
    } else {
      body += `\n  ${JSON.stringify(example)}: ${JSON.stringify(value)},`;
    }
  }

  source = `${source.slice(0, bodyStart)}${body}${source.slice(end)}`;
};

updateMapSection('VOCAB_EXAMPLE_TRANSLATION_BY_EN', (row) => row.id);
updateMapSection('VOCAB_EXAMPLE_IPA_BY_EN', (row) => row.ipa);

fs.writeFileSync(META_PATH, source, 'utf8');
console.log(`Updated Shopping topic: ${examples.length} translations + IPA`);

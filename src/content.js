/**
 * Mock content for BacaKu demo.
 * Simulates AI-generated BIPA reading material about Indonesian traditional markets,
 * calibrated to CEFR B1 level with vocabulary annotations.
 */

export const ONBOARDING_OPTIONS = {
  languages: [
    { id: 'en', label: 'English', icon: 'language', flagCode: 'gb' },
    { id: 'zh', label: '中文', icon: 'language', flagCode: 'cn' },
    { id: 'ja', label: '日本語', icon: 'language', flagCode: 'jp' },
    { id: 'ko', label: '한국어', icon: 'language', flagCode: 'kr' },
    { id: 'ar', label: 'العربية', icon: 'language', flagCode: 'sa' },
    { id: 'nl', label: 'Nederlands', icon: 'language', flagCode: 'nl' },
    { id: 'de', label: 'Deutsch', icon: 'language', flagCode: 'de' },
    { id: 'fr', label: 'Français', icon: 'language', flagCode: 'fr' }
  ],
  levels: [
    { id: 'A1', label: 'A1 · Pemula', desc: 'Baru mulai belajar' },
    { id: 'A2', label: 'A2 · Dasar', desc: 'Memahami kalimat sederhana' },
    { id: 'B1', label: 'B1 · Menengah', desc: 'Bisa berkomunikasi sehari-hari' },
    { id: 'B2', label: 'B2 · Menengah Atas', desc: 'Bisa berdiskusi kompleks' },
    { id: 'C1', label: 'C1 · Mahir', desc: 'Memahami teks akademik' },
    { id: 'C2', label: 'C2 · Sangat Mahir', desc: 'Hampir seperti penutur asli' },
  ],
  interests: [
    { id: 'kuliner', label: 'Kuliner', icon: 'restaurant' },
    { id: 'budaya', label: 'Budaya', icon: 'festival' },
    { id: 'sejarah', label: 'Sejarah', icon: 'account_balance' },
    { id: 'alam', label: 'Alam', icon: 'eco' },
    { id: 'teknologi', label: 'Teknologi', icon: 'computer' },
    { id: 'olahraga', label: 'Olahraga', icon: 'sports_soccer' },
    { id: 'musik', label: 'Musik', icon: 'music_note' },
    { id: 'seni', label: 'Seni Rupa', icon: 'palette' },
  ],
};
export const TOPIC_SUGGESTIONS = [
  // Budaya
  { id: 'pasar', title: 'Pasar Tradisional di Indonesia', category: 'Budaya', icon: 'storefront', emoji: '🧺', color: '#F06292' },
  { id: 'wayang', title: 'Pertunjukan Wayang Kulit', category: 'Budaya', icon: 'theater_comedy', emoji: '🎭', color: '#F06292' },
  { id: 'gotong_royong', title: 'Tradisi Gotong Royong', category: 'Budaya', icon: 'handshake', emoji: '🤝', color: '#F06292' },
  { id: 'tari_kecak', title: 'Magisnya Tari Kecak Bali', category: 'Budaya', icon: 'groups', emoji: '🔥', color: '#F06292' },

  // Sosiologi
  { id: 'bali', title: 'Kehidupan di Desa Bali', category: 'Sosiologi', icon: 'groups', emoji: '🌾', color: '#4FC3F7' },
  { id: 'urbanisasi', title: 'Dampak Urbanisasi Jakarta', category: 'Sosiologi', icon: 'location_city', emoji: '🏙️', color: '#4FC3F7' },
  { id: 'pemuda', title: 'Peran Pemuda di Era Digital', category: 'Sosiologi', icon: 'smartphone', emoji: '📱', color: '#4FC3F7' },
  { id: 'toleransi', title: 'Toleransi Beragama di RI', category: 'Sosiologi', icon: 'diversity_3', emoji: '🕌', color: '#4FC3F7' },

  // Kuliner
  { id: 'kuliner', title: 'Kuliner Khas Jawa Barat', category: 'Kuliner', icon: 'restaurant', emoji: '🍜', color: '#FFB74D' },
  { id: 'rendang', title: 'Rendang: Masakan Terenak', category: 'Kuliner', icon: 'local_dining', emoji: '🥘', color: '#FFB74D' },
  { id: 'streetfood', title: 'Jajanan Kaki Lima Nusantara', category: 'Kuliner', icon: 'kebab_dining', emoji: '🍢', color: '#FFB74D' },
  { id: 'soto', title: 'Ragam Soto Nusantara', category: 'Kuliner', icon: 'soup_kitchen', emoji: '🍲', color: '#FFB74D' },

  // Sejarah
  { id: 'merdeka', title: 'Hari Kemerdekaan Indonesia', category: 'Sejarah', icon: 'history_edu', emoji: '🎆', color: '#E57373' },
  { id: 'majapahit', title: 'Kejayaan Kerajaan Majapahit', category: 'Sejarah', icon: 'account_balance', emoji: '👑', color: '#E57373' },
  { id: 'sumpah_pemuda', title: 'Makna Sumpah Pemuda', category: 'Sejarah', icon: 'campaign', emoji: '📢', color: '#E57373' },
  { id: 'sriwijaya', title: 'Kemaharajaan Maritim Sriwijaya', category: 'Sejarah', icon: 'sailing', emoji: '⛵', color: '#E57373' },

  // Seni Rupa
  { id: 'batik', title: 'Batik dan Maknanya', category: 'Seni Rupa', icon: 'palette', emoji: '🧵', color: '#BA68C8' },
  { id: 'lukisan', title: 'Pelukis Maestro Indonesia', category: 'Seni Rupa', icon: 'brush', emoji: '🎨', color: '#BA68C8' },
  { id: 'patung', title: 'Seni Patung Asmat', category: 'Seni Rupa', icon: 'museum', emoji: '🗿', color: '#BA68C8' },
  { id: 'tenun', title: 'Keindahan Kain Tenun Sumba', category: 'Seni Rupa', icon: 'texture', emoji: '🧣', color: '#BA68C8' },

  // Teknologi
  { id: 'ai', title: 'Perkembangan AI di RI', category: 'Teknologi', icon: 'smart_toy', emoji: '🤖', color: '#64B5F6' },
  { id: 'startup', title: 'Ekosistem Startup Lokal', category: 'Teknologi', icon: 'rocket_launch', emoji: '🚀', color: '#64B5F6' },
  { id: 'internet', title: 'Budaya Internet & Medsos', category: 'Teknologi', icon: 'wifi', emoji: '📶', color: '#64B5F6' },
  { id: 'fintech', title: 'Revolusi Dompet Digital', category: 'Teknologi', icon: 'account_balance_wallet', emoji: '💳', color: '#64B5F6' },

  // Musik
  { id: 'dangdut', title: 'Pesona Musik Dangdut', category: 'Musik', icon: 'speaker', emoji: '🎸', color: '#FFD54F' },
  { id: 'gamelan', title: 'Harmoni Gamelan Jawa', category: 'Musik', icon: 'music_note', emoji: '🎼', color: '#FFD54F' },
  { id: 'angklung', title: 'Alat Musik Bambu Angklung', category: 'Musik', icon: 'music_note', emoji: '🎵', color: '#FFD54F' },
  { id: 'keroncong', title: 'Sejarah Musik Keroncong', category: 'Musik', icon: 'library_music', emoji: '🎻', color: '#FFD54F' },

  // Geografi
  { id: 'gunung', title: 'Gunung Berapi di Indonesia', category: 'Geografi', icon: 'landscape', emoji: '🌋', color: '#81C784' },
  { id: 'khatulistiwa', title: 'Indonesia di Garis Khatulistiwa', category: 'Geografi', icon: 'public', emoji: '🌏', color: '#81C784' },
  { id: 'maritim', title: 'Negara Kepulauan Terbesar', category: 'Geografi', icon: 'water', emoji: '🌊', color: '#81C784' },
  { id: 'danau_toba', title: 'Keajaiban Danau Toba', category: 'Geografi', icon: 'water', emoji: '🏞️', color: '#81C784' },

  // Gaya Hidup
  { id: 'kopi', title: 'Kopi & Budaya Nongkrong', category: 'Gaya Hidup', icon: 'local_cafe', emoji: '☕', color: '#8D6E63' },
  { id: 'sepeda', title: 'Tren Bersepeda di Kota', category: 'Gaya Hidup', icon: 'directions_bike', emoji: '🚴', color: '#8D6E63' },
  { id: 'thrifting', title: 'Fenomena Belanja Thrifting', category: 'Gaya Hidup', icon: 'checkroom', emoji: '👕', color: '#8D6E63' },
  { id: 'minimalis', title: 'Gaya Hidup Minimalis', category: 'Gaya Hidup', icon: 'chair', emoji: '🛋️', color: '#8D6E63' },

  // Pariwisata
  { id: 'pantai', title: 'Pantai Indah di Lombok', category: 'Pariwisata', icon: 'sailing', emoji: '🏖️', color: '#26C6DA' },
  { id: 'borobudur', title: 'Kemegahan Candi Borobudur', category: 'Pariwisata', icon: 'tour', emoji: '🛕', color: '#26C6DA' },
  { id: 'raja_ampat', title: 'Pesona Bawah Laut Raja Ampat', category: 'Pariwisata', icon: 'scuba_diving', emoji: '🤿', color: '#26C6DA' },
  { id: 'komodo_trip', title: 'Berlayar ke Pulau Komodo', category: 'Pariwisata', icon: 'directions_boat', emoji: '🛳️', color: '#26C6DA' },

  // Infrastruktur
  { id: 'transportasi', title: 'Transportasi di Jakarta', category: 'Infrastruktur', icon: 'train', emoji: '🚆', color: '#90A4AE' },
  { id: 'ikn', title: 'Ibu Kota Nusantara (IKN)', category: 'Infrastruktur', icon: 'apartment', emoji: '🏗️', color: '#90A4AE' },
  { id: 'tol', title: 'Perkembangan Jalan Tol', category: 'Infrastruktur', icon: 'add_road', emoji: '🛣️', color: '#90A4AE' },
  { id: 'kereta_cepat', title: 'Kereta Cepat Whoosh', category: 'Infrastruktur', icon: 'speed', emoji: '🚅', color: '#90A4AE' },

  // Olahraga
  { id: 'silat', title: 'Olahraga Pencak Silat', category: 'Olahraga', icon: 'sports_martial_arts', emoji: '🥋', color: '#E53935' },
  { id: 'bulutangkis', title: 'Kejayaan Bulutangkis RI', category: 'Olahraga', icon: 'sports_tennis', emoji: '🏸', color: '#E53935' },
  { id: 'sepakbola', title: 'Antusiasme Sepakbola Lokal', category: 'Olahraga', icon: 'sports_soccer', emoji: '⚽', color: '#E53935' },
  { id: 'lari', title: 'Marathon & Tren Lari', category: 'Olahraga', icon: 'directions_run', emoji: '🏃', color: '#E53935' },

  // Alam
  { id: 'satwa', title: 'Satwa Liar di Papua', category: 'Alam', icon: 'pets', emoji: '🦜', color: '#AED581' },
  { id: 'komodo', title: 'Evolusi Biawak Komodo', category: 'Alam', icon: 'cruelty_free', emoji: '🦎', color: '#AED581' },
  { id: 'hutan', title: 'Hutan Hujan Tropis Kalimantan', category: 'Alam', icon: 'forest', emoji: '🌳', color: '#AED581' },
  { id: 'terumbu_karang', title: 'Keindahan Terumbu Karang', category: 'Alam', icon: 'water', emoji: '🪸', color: '#AED581' },

  // Cerita Rakyat
  { id: 'mitos', title: 'Mitos & Legenda Nusantara', category: 'Cerita Rakyat', icon: 'menu_book', emoji: '🐉', color: '#7986CB' },
  { id: 'malin_kundang', title: 'Kisah Malin Kundang', category: 'Cerita Rakyat', icon: 'sailing', emoji: '⛵', color: '#7986CB' },
  { id: 'sangkuriang', title: 'Legenda Sangkuriang', category: 'Cerita Rakyat', icon: 'volcano', emoji: '⛰️', color: '#7986CB' },
  { id: 'bawang_merah', title: 'Bawang Merah Bawang Putih', category: 'Cerita Rakyat', icon: 'diversity_2', emoji: '🧅', color: '#7986CB' },

  // Ekonomi
  { id: 'pasar_tradisional', title: 'Pasar Tradisional vs Modern', category: 'Ekonomi', icon: 'storefront', emoji: '🛒', color: '#4DB6AC' },
  { id: 'umkm', title: 'Peran UMKM bagi Negara', category: 'Ekonomi', icon: 'store', emoji: '🛍️', color: '#4DB6AC' },
  { id: 'ekspor', title: 'Komoditas Ekspor Andalan', category: 'Ekonomi', icon: 'local_shipping', emoji: '🚢', color: '#4DB6AC' },
  { id: 'investasi', title: 'Belajar Investasi Saham', category: 'Ekonomi', icon: 'trending_up', emoji: '📈', color: '#4DB6AC' },

  // Pendidikan
  { id: 'kurikulum', title: 'Kurikulum Merdeka Belajar', category: 'Pendidikan', icon: 'school', emoji: '🎒', color: '#F06292' },
  { id: 'literasi', title: 'Tingkat Literasi Digital', category: 'Pendidikan', icon: 'menu_book', emoji: '📚', color: '#F06292' },
  { id: 'beasiswa', title: 'Mencari Beasiswa LPDP', category: 'Pendidikan', icon: 'workspace_premium', emoji: '🎓', color: '#F06292' },
  { id: 'guru', title: 'Tantangan Guru di Pelosok', category: 'Pendidikan', icon: 'person_raised_hand', emoji: '👨‍🏫', color: '#F06292' },

  // Kesehatan
  { id: 'stunting', title: 'Pencegahan Stunting', category: 'Kesehatan', icon: 'health_and_safety', emoji: '👶', color: '#E57373' },
  { id: 'bpjs', title: 'Layanan BPJS Kesehatan', category: 'Kesehatan', icon: 'medical_services', emoji: '🏥', color: '#E57373' },
  { id: 'jamu', title: 'Khasiat Jamu Tradisional', category: 'Kesehatan', icon: 'emoji_food_beverage', emoji: '🍵', color: '#E57373' },
  { id: 'mental', title: 'Pentingnya Kesehatan Mental', category: 'Kesehatan', icon: 'psychology', emoji: '🧠', color: '#E57373' },

  // Sastra
  { id: 'puisi', title: 'Puisi Cinta Chairil Anwar', category: 'Sastra', icon: 'history_edu', emoji: '🖋️', color: '#7986CB' },
  { id: 'novel', title: 'Novel Bumi Manusia', category: 'Sastra', icon: 'book', emoji: '📖', color: '#7986CB' },
  { id: 'pantun', title: 'Berbalas Pantun Melayu', category: 'Sastra', icon: 'forum', emoji: '💬', color: '#7986CB' },
  { id: 'dongeng', title: 'Dongeng Si Kancil', category: 'Sastra', icon: 'auto_stories', emoji: '🦌', color: '#7986CB' },

  // Lingkungan
  { id: 'sampah', title: 'Masalah Sampah Plastik', category: 'Lingkungan', icon: 'delete', emoji: '♻️', color: '#81C784' },
  { id: 'deforestasi', title: 'Deforestasi Hutan', category: 'Lingkungan', icon: 'nature', emoji: '🪓', color: '#81C784' },
  { id: 'polusi', title: 'Polusi Udara Ibukota', category: 'Lingkungan', icon: 'air', emoji: '🌫️', color: '#81C784' },
  { id: 'mangrove', title: 'Reboisasi Hutan Mangrove', category: 'Lingkungan', icon: 'park', emoji: '🌱', color: '#81C784' },

  // Arsitektur
  { id: 'rumah_gadang', title: 'Uniknya Rumah Gadang', category: 'Arsitektur', icon: 'house', emoji: '🛖', color: '#FFB74D' },
  { id: 'joglo', title: 'Filosofi Rumah Joglo', category: 'Arsitektur', icon: 'gite', emoji: '🏡', color: '#FFB74D' },
  { id: 'masjid', title: 'Arsitektur Masjid Istiqlal', category: 'Arsitektur', icon: 'mosque', emoji: '🕌', color: '#FFB74D' },
  { id: 'kolonial', title: 'Bangunan Sisa Kolonial', category: 'Arsitektur', icon: 'account_balance', emoji: '🏛️', color: '#FFB74D' }
];

export const READING_CONTENT = {
  title: 'Pasar Tradisional di Indonesia',
  levelLabel: 'CEFR B1',
  interestLabel: 'Kuliner',
  sections: [
    {
      id: 'pendahuluan',
      title: 'Pendahuluan',
      paragraphs: [
        {
          text: 'Pasar tradisional adalah bagian penting dari kehidupan masyarakat Indonesia. Di pasar ini, orang-orang tidak hanya <v data-word="membeli">membeli</v> dan <v data-word="menjual">menjual</v> barang, tetapi juga bertemu teman, berbagi cerita, dan mempererat hubungan sosial. Pasar tradisional sudah ada sejak zaman kerajaan Hindu-Buddha di Nusantara.',
        },
        {
          text: 'Berbeda dengan supermarket modern, pasar tradisional memiliki suasana yang sangat hidup dan <v data-word="ramai">ramai</v>. Pedagang memanggil pembeli dengan suara keras, dan aroma makanan segar <v data-word="memenuhi">memenuhi</v> udara. Pengalaman <v data-word="berbelanja">berbelanja</v> di pasar tradisional adalah pengalaman budaya yang unik.',
        },
      ],
      culturalNote: {
        text: 'Tawar-menawar (bargaining) di pasar tradisional bukan sekadar transaksi ekonomi. Ini adalah interaksi sosial yang membangun hubungan antara pedagang dan pembeli. Pembeli biasanya menawar dengan sopan, mulai dari setengah harga yang ditawarkan pedagang.',
      },
      morphologyHighlight: {
        word: 'berbelanja',
        parts: [
          { text: 'ber-', type: 'prefix', meaning: 'melakukan aktivitas (prefiks intransitif)' },
          { text: 'belanja', type: 'root', meaning: 'shopping / pembelian barang' },
        ],
      },
      embeddedQuestion: {
        text: 'Menurut teks di atas, apa yang membedakan pasar tradisional dari supermarket modern?',
        options: [
          { text: 'Harga barang lebih murah', correct: false },
          { text: 'Suasana yang hidup dan interaksi sosial', correct: true },
          { text: 'Pedagang menggunakan mesin kasir', correct: false },
          { text: 'Barang dikemas dalam plastik', correct: false },
        ],
        feedback: 'Benar! Teks menyebutkan bahwa pasar tradisional memiliki suasana hidup dengan pedagang yang memanggil pembeli dan aroma makanan segar — sebuah pengalaman budaya yang unik.',
      },
    },
    {
      id: 'jenis-pasar',
      title: 'Jenis-Jenis Pasar Tradisional',
      paragraphs: [
        {
          text: 'Indonesia memiliki banyak jenis pasar tradisional. Pasar pagi (<v data-word="biasanya">biasanya</v> buka dari subuh hingga siang) adalah tempat terbaik untuk membeli sayuran, buah, ikan, dan daging segar. Para ibu rumah tangga sering <v data-word="mengunjungi">mengunjungi</v> pasar pagi untuk mendapatkan bahan makanan terbaik.',
        },
        {
          text: 'Ada juga pasar malam yang menjadi tempat <v data-word="hiburan">hiburan</v> bagi keluarga. Di pasar malam, pengunjung bisa menikmati berbagai jajanan khas daerah, bermain permainan, dan melihat pertunjukan. Pasar terapung di Kalimantan Selatan adalah contoh unik lainnya — pedagang <v data-word="menjajakan">menjajakan</v> barang dagangan dari atas perahu kecil yang disebut jukung.',
        },
      ],
      culturalNote: {
        text: 'Pasar terapung Lok Baintan di Banjarmasin sudah beroperasi sejak lebih dari 400 tahun. Pedagang, yang sebagian besar adalah perempuan Banjar, memulai aktivitas perdagangan mereka sejak subuh (sekitar pukul 05.00). Mereka menggunakan jukung (perahu kecil khas Banjar) untuk mengangkut hasil pertanian dari desa-desa di sepanjang Sungai Martapura.',
      },
      morphologyHighlight: {
        word: 'menjajakan',
        parts: [
          { text: 'meN-', type: 'prefix', meaning: 'prefiks aktif transitif (me- + j → menj-)' },
          { text: 'jaja', type: 'root', meaning: 'menawarkan barang dagangan keliling' },
          { text: '-kan', type: 'suffix', meaning: 'sufiks benefaktif / kausatif' },
        ],
      },
      embeddedQuestion: {
        text: 'Apa yang dimaksud dengan "jukung" dalam konteks pasar terapung?',
        options: [
          { text: 'Jenis sayuran khas Kalimantan', correct: false },
          { text: 'Perahu kecil yang digunakan pedagang', correct: true },
          { text: 'Nama lain untuk pasar terapung', correct: false },
          { text: 'Alat pembayaran tradisional', correct: false },
        ],
        feedback: 'Tepat! Jukung adalah perahu kecil khas Banjar yang digunakan pedagang di pasar terapung untuk mengangkut dan menjual barang dagangan mereka.',
      },
    },
    {
      id: 'kuliner',
      title: 'Kuliner di Pasar Tradisional',
      paragraphs: [
        {
          text: 'Bagi pecinta kuliner, pasar tradisional adalah surga makanan. Setiap daerah di Indonesia memiliki pasar dengan <v data-word="hidangan">hidangan</v> khas yang tidak bisa ditemukan di tempat lain. Di Pasar Beringharjo di Yogyakarta, pengunjung bisa <v data-word="mencicipi">mencicipi</v> gudeg, nasi kucing, dan wedang ronde yang hangat.',
        },
        {
          text: 'Di Pasar Badung di Bali, aroma bumbu dan rempah-rempah segar langsung menyambut pengunjung. Pedagang menjual berbagai bumbu khas Bali seperti base genep dan sambal matah. Sementara di Pasar Tanah Abang Jakarta, pedagang kaki lima <v data-word="menyajikan">menyajikan</v> soto betawi dan kerak telor yang <v data-word="menggugah">menggugah</v> selera.',
        },
      ],
      culturalNote: {
        text: 'Gudeg adalah masakan khas Yogyakarta yang terbuat dari nangka muda yang dimasak dengan santan dan gula merah selama berjam-jam. Proses memasak yang lama ini membuat gudeg memiliki rasa manis yang khas dan warna cokelat yang alami. Gudeg biasanya disajikan dengan nasi, telur, tahu, tempe, dan sambal krecek.',
      },
      morphologyHighlight: {
        word: 'menggugah',
        parts: [
          { text: 'meN-', type: 'prefix', meaning: 'prefiks aktif (me- + g → meng- + g → mengg-)' },
          { text: 'gugah', type: 'root', meaning: 'membangkitkan / menggerakkan' },
        ],
      },
      embeddedQuestion: {
        text: 'Dari teks, kita bisa menyimpulkan bahwa pasar tradisional di Indonesia...',
        options: [
          { text: 'Menjual makanan yang sama di seluruh Indonesia', correct: false },
          { text: 'Hanya menjual bahan makanan mentah', correct: false },
          { text: 'Memiliki hidangan khas yang berbeda di setiap daerah', correct: true },
          { text: 'Lebih mahal dari restoran modern', correct: false },
        ],
        feedback: 'Benar! Teks menjelaskan bahwa setiap daerah memiliki pasar dengan hidangan khas yang unik — dari gudeg di Yogyakarta hingga soto betawi di Jakarta.',
      },
    },
  ],
};

export const GLOSSARY = {
  membeli: {
    pos: 'verba (kata kerja)',
    definition: 'Mendapatkan barang dengan membayar uang.',
    translation: { en: 'to buy / to purchase', zh: '购买', ja: '買う', ko: '사다' },
    example: 'Ibu membeli sayuran segar di pasar.',
  },
  menjual: {
    pos: 'verba (kata kerja)',
    definition: 'Memberikan barang kepada orang lain dan menerima uang.',
    translation: { en: 'to sell', zh: '卖', ja: '売る', ko: '팔다' },
    example: 'Pedagang menjual ikan di pasar pagi.',
  },
  ramai: {
    pos: 'adjektiva (kata sifat)',
    definition: 'Penuh dengan orang dan aktivitas; tidak sepi.',
    translation: { en: 'crowded / bustling', zh: '热闹', ja: '賑やかな', ko: '붐비는' },
    example: 'Pasar sangat ramai pada hari Minggu.',
  },
  memenuhi: {
    pos: 'verba (kata kerja)',
    definition: 'Membuat penuh; mengisi seluruh ruang.',
    translation: { en: 'to fill / to pervade', zh: '充满', ja: '満たす', ko: '가득 채우다' },
    example: 'Aroma kopi memenuhi ruangan.',
  },
  berbelanja: {
    pos: 'verba (kata kerja)',
    definition: 'Melakukan kegiatan membeli barang-barang kebutuhan.',
    translation: { en: 'to shop / to go shopping', zh: '购物', ja: '買い物をする', ko: '쇼핑하다' },
    example: 'Kami berbelanja di pasar setiap Sabtu.',
  },
  biasanya: {
    pos: 'adverbia (kata keterangan)',
    definition: 'Pada umumnya; sesuai kebiasaan.',
    translation: { en: 'usually / normally', zh: '通常', ja: '普通は', ko: '보통' },
    example: 'Ibu biasanya memasak di pagi hari.',
  },
  mengunjungi: {
    pos: 'verba (kata kerja)',
    definition: 'Pergi ke suatu tempat untuk bertemu atau melihat.',
    translation: { en: 'to visit', zh: '参观 / 访问', ja: '訪問する', ko: '방문하다' },
    example: 'Turis mengunjungi Candi Borobudur.',
  },
  hiburan: {
    pos: 'nomina (kata benda)',
    definition: 'Sesuatu yang menghibur dan menyenangkan.',
    translation: { en: 'entertainment', zh: '娱乐', ja: '娯楽', ko: '오락' },
    example: 'Pasar malam menjadi hiburan bagi anak-anak.',
  },
  menjajakan: {
    pos: 'verba (kata kerja)',
    definition: 'Menawarkan barang dagangan kepada calon pembeli.',
    translation: { en: 'to peddle / to hawk', zh: '叫卖 / 兜售', ja: '行商する', ko: '행상하다' },
    example: 'Pedagang menjajakan kue dari rumah ke rumah.',
  },
  hidangan: {
    pos: 'nomina (kata benda)',
    definition: 'Makanan yang telah disiapkan dan disajikan.',
    translation: { en: 'dish / cuisine', zh: '菜肴', ja: '料理', ko: '음식 / 요리' },
    example: 'Hidangan ini khas Jawa Tengah.',
  },
  mencicipi: {
    pos: 'verba (kata kerja)',
    definition: 'Merasakan sedikit makanan atau minuman untuk mengetahui rasanya.',
    translation: { en: 'to taste / to try (food)', zh: '品尝', ja: '味見する', ko: '맛보다' },
    example: 'Saya ingin mencicipi rendang Padang.',
  },
  menyajikan: {
    pos: 'verba (kata kerja)',
    definition: 'Menghidangkan makanan atau minuman untuk orang lain.',
    translation: { en: 'to serve / to present', zh: '端上 / 提供', ja: '提供する', ko: '제공하다' },
    example: 'Restoran ini menyajikan makanan Sunda.',
  },
  menggugah: {
    pos: 'verba (kata kerja)',
    definition: 'Membangkitkan perasaan atau keinginan.',
    translation: { en: 'to arouse / to stimulate', zh: '唤起 / 激发', ja: '刺激する', ko: '자극하다' },
    example: 'Foto makanan itu menggugah selera.',
  },
};

export const SLIDES_CONTENT = [
  {
    heading: 'Apa Itu Pasar Tradisional?',
    body: [
      'Pusat jual-beli yang sudah ada sejak zaman kerajaan Nusantara',
      'Tempat interaksi sosial dan budaya masyarakat',
      'Berbeda dari supermarket — lebih hidup dan personal',
    ],
  },
  {
    heading: 'Ragam Pasar di Indonesia',
    body: [
      '<strong>Pasar pagi</strong> — bahan makanan segar (subuh–siang)',
      '<strong>Pasar malam</strong> — hiburan keluarga dan jajanan khas',
      '<strong>Pasar terapung</strong> — perdagangan di atas perahu (jukung)',
    ],
  },
  {
    heading: 'Surga Kuliner Nusantara',
    body: [
      '<strong>Yogyakarta</strong> — Gudeg, nasi kucing, wedang ronde',
      '<strong>Bali</strong> — Base genep, sambal matah',
      '<strong>Jakarta</strong> — Soto betawi, kerak telor',
    ],
  },
  {
    heading: 'Tradisi Tawar-Menawar',
    body: [
      'Bukan sekadar transaksi — ini interaksi sosial',
      'Membangun hubungan antara pedagang dan pembeli',
      'Tips: mulai menawar dari 50% harga yang ditawarkan',
    ],
  },
  {
    heading: 'Mengapa Pasar Tradisional Penting?',
    body: [
      'Melestarikan budaya dan tradisi lokal',
      'Mendukung ekonomi pedagang kecil dan petani',
      'Menyediakan pengalaman autentik bagi wisatawan',
    ],
  },
];

export const QUIZ_QUESTIONS = [
  {
    type: 'mcq',
    typeLabel: 'Pilihan Ganda',
    text: 'Apa fungsi utama pasar tradisional selain jual-beli?',
    options: [
      'Tempat olahraga masyarakat',
      'Pusat interaksi sosial dan budaya',
      'Tempat ibadah bersama',
      'Pusat pemerintahan desa',
    ],
    correct: 1,
  },
  {
    type: 'cloze',
    typeLabel: 'Isian Rumpang',
    text: 'Pedagang di pasar terapung menggunakan ___ untuk mengangkut barang dagangan.',
    answer: 'jukung',
  },
  {
    type: 'mcq',
    typeLabel: 'Pilihan Ganda',
    text: 'Gudeg adalah masakan khas dari daerah...',
    options: ['Jakarta', 'Bali', 'Yogyakarta', 'Kalimantan'],
    correct: 2,
  },
  {
    type: 'sequence',
    typeLabel: 'Urutan',
    text: 'Urutkan waktu operasi pasar dari yang paling pagi:',
    items: ['Pasar pagi (subuh)', 'Pasar siang (siang hari)', 'Pasar malam (sore-malam)'],
    correctOrder: [0, 1, 2],
  },
  {
    type: 'mcq',
    typeLabel: 'Pilihan Ganda',
    text: 'Dalam konteks tawar-menawar di pasar tradisional, pembeli biasanya memulai dengan menawar...',
    options: [
      'Dengan harga yang sama',
      'Sedikit lebih rendah dari harga pedagang',
      'Sekitar setengah dari harga yang ditawarkan',
      'Dengan harga yang sangat rendah',
    ],
    correct: 2,
  },
];

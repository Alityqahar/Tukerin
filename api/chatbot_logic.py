import re
from typing import Dict, List, Tuple, Optional
from enum import Enum

class Intent(Enum):
    """Kategori intent untuk klasifikasi pertanyaan"""
    # Ekonomi Sirkular
    CE_DEFINITION = "ce_definition"
    CE_PRINCIPLES = "ce_principles"
    CE_EXAMPLES = "ce_examples"
    CE_BENEFITS = "ce_benefits"
    CE_GENERAL = "ce_general"
    
    # Sustainability
    SUSTAINABILITY_GENERAL = "sustainability_general"
    PLASTIC_WASTE = "plastic_waste"
    RENEWABLE_ENERGY = "renewable_energy"
    CLIMATE_CHANGE = "climate_change"
    
    # Umum
    GREETING = "greeting"
    IDENTITY = "identity"
    CAPABILITY = "capability"
    THANKS = "thanks"
    TIPS = "tips"
    
    # Fallback
    UNKNOWN = "unknown"


class IntentClassifier:
    """Classifier untuk mendeteksi intent dari pertanyaan pengguna"""
    
    def __init__(self):
        self.intent_patterns = self._init_intent_patterns()
        
    def _init_intent_patterns(self) -> Dict:
        """Inisialisasi pola-pola untuk setiap intent"""
        return {
            Intent.GREETING: {
                'patterns': [
                    r'\b(halo|hai|hello|hi|hey|hola|assalamualaikum)\b',
                    r'\b(selamat pagi|selamat siang|selamat sore|selamat malam)\b',
                    r'\b(good morning|good afternoon|good evening)\b'
                ],
                'keywords': ['halo', 'hai', 'hello', 'hi', 'hey', 'selamat', 'pagi', 'siang', 'sore', 'malam'],
                'weight': 2.0
            },
            
            Intent.IDENTITY: {
                'patterns': [
                    r'\b(siapa|who).+(kamu|you|bot|kau)\b',
                    r'\b(kamu|you|bot).+(siapa|who)\b',
                    r'\b(nama|name).+(kamu|you|bot)\b',
                    r'\bperkenalkan\b',
                    r'\bapa itu ecobuddy\b'
                ],
                'keywords': ['siapa', 'kamu', 'nama', 'perkenalkan', 'ecobuddy', 'identitas'],
                'weight': 1.8
            },
            
            Intent.CAPABILITY: {
                'patterns': [
                    r'\b(bisa|dapat|bisa bantu).+(apa|what)\b',
                    r'\b(apa|what).+(bisa|dapat|mampu)\b',
                    r'\bkemampuan\b',
                    r'\bfitur\b',
                    r'\bbantu apa\b'
                ],
                'keywords': ['bisa apa', 'kemampuan', 'fitur', 'bantu apa', 'apa yang bisa', 'fungsi'],
                'weight': 1.5
            },
            
            Intent.THANKS: {
                'patterns': [
                    r'\b(terima kasih|thank you|thanks|makasih|thx|tengkyu)\b'
                ],
                'keywords': ['terima kasih', 'thank', 'thanks', 'makasih', 'thx'],
                'weight': 2.0
            },
            
            Intent.CE_DEFINITION: {
                'patterns': [
                    r'\b(apa itu|what is|pengertian|definisi|arti|maksud).+(ekonomi sirkular|circular economy)\b',
                    r'\b(jelaskan|explain|terangkan).+(ekonomi sirkular|circular economy)\b',
                    r'\bekonomi sirkular.+(apa|what|pengertian|definisi)\b',
                    r'\bcircular economy.+(definisi|definition|mean)\b'
                ],
                'keywords': ['ekonomi sirkular', 'circular economy', 'apa itu', 'pengertian', 'definisi', 'arti', 'jelaskan', 'maksud'],
                'weight': 2.5
            },
            
            Intent.CE_PRINCIPLES: {
                'patterns': [
                    r'\b(prinsip|principle|pilar|dasar|konsep).+(ekonomi sirkular|circular economy|3r|5r)\b',
                    r'\b(3r|5r|tiga r|lima r)\b',
                    r'\b(reduce|reuse|recycle|refuse|rot)\b',
                    r'\baturan.+(ekonomi sirkular)\b'
                ],
                'keywords': ['prinsip', 'pilar', 'dasar', '3r', '5r', 'reduce', 'reuse', 'recycle', 'refuse', 'rot', 'konsep utama'],
                'weight': 2.0
            },
            
            Intent.CE_EXAMPLES: {
                'patterns': [
                    r'\b(contoh|example|kasus|studi kasus).+(ekonomi sirkular|penerapan|implementasi)\b',
                    r'\b(penerapan|implementasi|aplikasi|praktik).+(ekonomi sirkular)\b',
                    r'\bbagaimana.+(diterapkan|menerapkan|implementasi)\b',
                    r'\b(perusahaan|industri|bisnis).+(ekonomi sirkular)\b'
                ],
                'keywords': ['contoh', 'penerapan', 'implementasi', 'praktik', 'aplikasi', 'studi kasus', 'industri', 'perusahaan'],
                'weight': 1.8
            },
            
            Intent.CE_BENEFITS: {
                'patterns': [
                    r'\b(manfaat|benefit|keuntungan|dampak positif).+(ekonomi sirkular)\b',
                    r'\bmengapa.+(penting|perlu).+(ekonomi sirkular)\b',
                    r'\bapa.+(untung|manfaat|keuntungan).+(ekonomi sirkular)\b',
                    r'\bekonomi sirkular.+(penting|menguntungkan)\b'
                ],
                'keywords': ['manfaat', 'keuntungan', 'dampak positif', 'mengapa penting', 'untung', 'benefit'],
                'weight': 1.8
            },
            
            Intent.CE_GENERAL: {
                'patterns': [
                    r'\bekonomi sirkular\b',
                    r'\bcircular economy\b',
                    r'\bsirkular\b'
                ],
                'keywords': ['ekonomi sirkular', 'circular economy', 'sirkular'],
                'weight': 1.0
            },
            
            Intent.SUSTAINABILITY_GENERAL: {
                'patterns': [
                    r'\b(apa itu|pengertian|definisi).+(sustainability|keberlanjutan|berkelanjutan)\b',
                    r'\bsustainability\b',
                    r'\bkeberlanjutan\b',
                    r'\bberkelanjutan\b'
                ],
                'keywords': ['sustainability', 'keberlanjutan', 'berkelanjutan', 'sustainable'],
                'weight': 1.5
            },
            
            Intent.PLASTIC_WASTE: {
                'patterns': [
                    r'\b(sampah|limbah|waste).+(plastik|plastic)\b',
                    r'\bplastik.+(sampah|limbah|bahaya|masalah)\b',
                    r'\bbahaya.+(plastik)\b'
                ],
                'keywords': ['sampah plastik', 'limbah plastik', 'plastik', 'bahaya plastik', 'masalah plastik'],
                'weight': 1.8
            },
            
            Intent.RENEWABLE_ENERGY: {
                'patterns': [
                    r'\b(energi|energy).+(terbarukan|renewable|hijau|green)\b',
                    r'\b(solar|surya|angin|wind|hydro|panas bumi|geothermal)\b',
                    r'\brendable.+(energy)\b'
                ],
                'keywords': ['energi terbarukan', 'renewable energy', 'energi hijau', 'solar', 'surya', 'angin'],
                'weight': 1.5
            },
            
            Intent.CLIMATE_CHANGE: {
                'patterns': [
                    r'\b(perubahan|change).+(iklim|climate)\b',
                    r'\b(global warming|pemanasan global)\b',
                    r'\biklim.+(berubah|perubahan)\b'
                ],
                'keywords': ['perubahan iklim', 'climate change', 'global warming', 'pemanasan global'],
                'weight': 1.5
            },
            
            Intent.TIPS: {
                'patterns': [
                    r'\b(tips|saran|cara|bagaimana).+(mulai|memulai|menerapkan)\b',
                    r'\b(bagaimana|how).+(hidup|gaya hidup|lifestyle).+(ramah lingkungan|eco)\b',
                    r'\bmulai dari mana\b',
                    r'\bapa yang (bisa|dapat).+(lakukan|dilakukan)\b'
                ],
                'keywords': ['tips', 'saran', 'cara', 'bagaimana memulai', 'mulai dari mana', 'langkah'],
                'weight': 1.5
            }
        }
    
    def _match_pattern(self, message: str, patterns: List[str]) -> bool:
        """Cek apakah pesan cocok dengan salah satu pattern regex"""
        for pattern in patterns:
            if re.search(pattern, message, re.IGNORECASE):
                return True
        return False
    
    def _calculate_keyword_score(self, message: str, keywords: List[str]) -> float:
        """Hitung skor berdasarkan kecocokan keyword"""
        score = 0.0
        words = message.split()
        
        for keyword in keywords:
            keyword_words = keyword.split()
            
            # Exact match (multi-word)
            if keyword in message:
                score += len(keyword_words) * 2.0
            # Partial match (single word)
            else:
                for kw in keyword_words:
                    if kw in words:
                        score += 0.5
        
        return score
    
    def classify(self, message: str) -> Tuple[Intent, float]:
        """
        Klasifikasi intent dari pesan pengguna
        Returns: (intent, confidence_score)
        """
        message = message.lower().strip()
        
        if not message:
            return Intent.UNKNOWN, 0.0
        
        best_intent = Intent.UNKNOWN
        best_score = 0.0
        
        for intent, config in self.intent_patterns.items():
            score = 0.0
            
            # Pattern matching (high priority)
            if self._match_pattern(message, config['patterns']):
                score += 10.0 * config['weight']
            
            # Keyword matching
            keyword_score = self._calculate_keyword_score(message, config['keywords'])
            score += keyword_score * config['weight']
            
            if score > best_score:
                best_score = score
                best_intent = intent
        
        # Normalize confidence (0-1)
        confidence = min(best_score / 20.0, 1.0)
        
        return best_intent, confidence


class EcoBuddyKnowledgeBase:
    """Knowledge base untuk chatbot edukatif EcoBuddy"""
    
    def __init__(self):
        self.responses = self._init_responses()
        
    def _init_responses(self) -> Dict[Intent, str]:
        """Inisialisasi respons untuk setiap intent"""
        return {
            Intent.GREETING: """Halo! 👋 Saya EcoBuddy, asisten edukasi Ekonomi Sirkular.

Saya bisa membantu Anda memahami:
• Ekonomi Sirkular & prinsipnya
• Sustainability & lingkungan
• Tips hidup ramah lingkungan

Silakan tanya apa saja! 😊""",

            Intent.IDENTITY: """Saya **EcoBuddy** 🌿, chatbot edukatif yang dirancang untuk membantu Anda memahami Ekonomi Sirkular dan keberlanjutan lingkungan.

Misi saya:
✓ Menjelaskan konsep ekonomi sirkular dengan sederhana
✓ Memberikan tips praktis hidup berkelanjutan
✓ Menjawab pertanyaan tentang lingkungan & sustainability

Saya di sini untuk membuat pembelajaran tentang lingkungan jadi lebih mudah dan menyenangkan! 🌍""",

            Intent.CAPABILITY: """Saya bisa membantu Anda dengan:

📚 **Edukasi Ekonomi Sirkular:**
• Pengertian & konsep dasar
• Prinsip 3R/5R
• Contoh penerapan
• Manfaat ekonomi sirkular

🌍 **Pengetahuan Sustainability:**
• Sampah plastik & solusinya
• Energi terbarukan
• Perubahan iklim
• Tips hidup ramah lingkungan

💡 **Tips Praktis:**
• Cara menerapkan di rumah
• Pilihan produk eco-friendly
• Kebiasaan berkelanjutan

Tanya saja apa yang ingin Anda ketahui! 😊""",

            Intent.THANKS: """Sama-sama! 😊 Senang bisa membantu.

Jika ada pertanyaan lain tentang ekonomi sirkular atau sustainability, jangan ragu untuk bertanya ya! 

Mari bersama-sama jaga bumi kita! 🌍💚""",

            Intent.CE_DEFINITION: """🔄 **Ekonomi Sirkular** adalah sistem ekonomi yang bertujuan mengurangi limbah dan memanfaatkan sumber daya secara maksimal.

Berbeda dengan ekonomi linear (ambil-buat-buang), ekonomi sirkular:
• Menjaga produk dan material tetap digunakan selama mungkin
• Memulihkan dan meregenerasi produk di akhir masa pakainya
• Meminimalkan limbah dengan desain yang lebih baik

Analogi sederhana: Seperti siklus air di alam - air tidak "dibuang" tapi terus berputar dan digunakan kembali! 💧

Mau tahu lebih dalam tentang prinsip atau contoh penerapannya?""",

            Intent.CE_PRINCIPLES: """🌱 **Prinsip Utama Ekonomi Sirkular:**

**1. Reduce (Kurangi)** - Minimalkan penggunaan sumber daya
   → Contoh: Beli produk tahan lama, hindari kemasan berlebihan

**2. Reuse (Gunakan Kembali)** - Pakai ulang produk tanpa proses rumit
   → Contoh: Botol kaca untuk tempat penyimpanan, tas belanja kain

**3. Recycle (Daur Ulang)** - Ubah limbah jadi produk baru
   → Contoh: Plastik → paving block, kertas bekas → kertas daur ulang

**4. Repair (Perbaiki)** - Perpanjang usia produk dengan memperbaiki
   → Contoh: Service elektronik, tambal pakaian

**5. Rethink & Redesign** - Pikirkan ulang cara produksi dan konsumsi
   → Contoh: Produk modular yang mudah diperbaiki

Ingat hierarki: Reduce > Reuse > Recycle! ♻️

Ada yang ingin ditanyakan lebih lanjut?""",

            Intent.CE_EXAMPLES: """💡 **Contoh Penerapan Ekonomi Sirkular:**

**Kehidupan Sehari-hari:**
• Kompos dari sisa makanan untuk pupuk tanaman
• Menggunakan tumbler/botol minum isi ulang
• Belanja di toko zero waste dengan wadah sendiri
• Donasi pakaian bekas ke yang membutuhkan
• Refill produk rumah tangga (sabun, shampoo)

**Industri:**
• **Fashion**: H&M & Zara - program take-back pakaian lama
• **Elektronik**: Apple - program trade-in dan daur ulang komponen
• **Otomotif**: Renault - daur ulang 95% komponen mobil
• **Kemasan**: Loop - sistem kemasan isi ulang premium
• **Furnitur**: IKEA - buyback & resell furnitur bekas

**Inovasi Menarik:**
• Adidas membuat sepatu dari plastik laut
• Too Good To Go - aplikasi selamatkan makanan surplus
• Patagonia memperbaiki produk secara gratis

Mulai dari hal kecil di rumah! 🏠 Mau tips praktis untuk memulai?""",

            Intent.CE_BENEFITS: """✨ **Manfaat Ekonomi Sirkular:**

**🌍 Lingkungan:**
• Mengurangi emisi gas rumah kaca hingga 45%
• Menghemat sumber daya alam yang terbatas
• Mengurangi pencemaran tanah, air, dan udara
• Melindungi keanekaragaman hayati

**💰 Ekonomi:**
• Hemat biaya produksi (gunakan material daur ulang)
• Ciptakan lapangan kerja baru (industri daur ulang, repair)
• Potensi ekonomi global USD 4.5 triliun pada 2030
• Tingkatkan daya saing bisnis

**👥 Sosial:**
• Memberdayakan komunitas lokal
• Meningkatkan kesehatan masyarakat
• Menciptakan pola konsumsi yang lebih bijak
• Membangun kesadaran lingkungan sejak dini

Indonesia bisa hemat Rp 593 triliun per tahun jika menerapkan ekonomi sirkular! 🇮🇩

Tertarik untuk mulai menerapkannya?""",

            Intent.CE_GENERAL: """🔄 **Ekonomi Sirkular** adalah sistem yang mengubah pola konsumsi dari "ambil-buat-buang" menjadi "gunakan-pulihkan-gunakan lagi".

Saya bisa jelaskan lebih detail tentang:
• Pengertian dan konsep dasar
• Prinsip-prinsip utama (3R/5R)
• Contoh penerapan nyata
• Manfaat bagi lingkungan dan ekonomi

Apa yang ingin Anda ketahui lebih lanjut? 😊""",

            Intent.SUSTAINABILITY_GENERAL: """🌏 **Sustainability (Keberlanjutan)** adalah kemampuan memenuhi kebutuhan saat ini tanpa mengorbankan kemampuan generasi masa depan.

**Tiga Pilar Sustainability:**
• **Planet** 🌱 - Jaga lingkungan & ekosistem
• **People** 👥 - Kesejahteraan sosial & keadilan
• **Profit** 💼 - Pertumbuhan ekonomi yang bertanggung jawab

Contoh: Menggunakan energi terbarukan (solar panel) adalah keberlanjutan karena tidak habis dan tidak merusak lingkungan untuk anak cucu kita.

Ekonomi sirkular adalah salah satu cara mencapai keberlanjutan! Mau tahu lebih lanjut?""",

            Intent.PLASTIC_WASTE: """🚫 **Fakta Sampah Plastik:**

**Masalah:**
• Indonesia produksi 7.2 juta ton sampah plastik/tahun
• Hanya 10% yang didaur ulang
• Plastik butuh 500-1000 tahun untuk terurai
• 1 juta burung laut & 100,000 mamalia laut mati tiap tahun akibat plastik

**Solusi:**
✓ Gunakan tas belanja kain
✓ Pakai botol minum & sedotan reusable
✓ Hindari kemasan plastik sekali pakai
✓ Pilih produk dengan kemasan ramah lingkungan
✓ Dukung program refill & zero waste

Setiap orang bisa membuat perbedaan! 💪

Butuh tips lebih praktis untuk mengurangi plastik?""",

            Intent.RENEWABLE_ENERGY: """☀️ **Energi Terbarukan** adalah energi dari sumber yang tidak habis dan dapat diperbaharui secara alami.

**Jenis-jenis:**
• **Surya** (Solar) - Panel surya tangkap sinar matahari
• **Angin** (Wind) - Turbin konversi angin jadi listrik
• **Air** (Hydro) - PLTA manfaatkan aliran air
• **Biomassa** - Energi dari bahan organik
• **Panas Bumi** (Geothermal) - Indonesia kaya sumber ini!

**Keuntungan:**
✓ Tidak habis & ramah lingkungan
✓ Kurangi emisi karbon
✓ Hemat biaya jangka panjang
✓ Ciptakan lapangan kerja

Indonesia target 23% energi terbarukan pada 2025! 🇮🇩

Mau tahu cara memanfaatkan energi terbarukan di rumah?""",

            Intent.CLIMATE_CHANGE: """🌡️ **Perubahan Iklim** adalah perubahan jangka panjang pola cuaca dan suhu bumi, terutama akibat aktivitas manusia.

**Penyebab Utama:**
• Pembakaran bahan bakar fosil (batu bara, minyak, gas)
• Deforestasi (penebangan hutan)
• Industri & transportasi
• Pertanian intensif

**Dampak:**
• Suhu bumi naik rata-rata 1.1°C sejak era pra-industri
• Es kutub mencair, permukaan laut naik
• Cuaca ekstrem lebih sering (banjir, kekeringan)
• Ancaman terhadap ekosistem & keanekaragaman hayati

**Apa yang Bisa Kita Lakukan:**
✓ Kurangi penggunaan kendaraan pribadi
✓ Hemat listrik & air
✓ Konsumsi lokal & kurangi daging
✓ Tanam pohon
✓ Dukung kebijakan ramah lingkungan

Setiap tindakan kecil berdampak besar! 🌱 Ekonomi sirkular bisa bantu kurangi dampak perubahan iklim, lho!""",

            Intent.TIPS: """💚 **Tips Memulai Gaya Hidup Sirkular:**

**Di Rumah:**
1. Bawa tas belanja & botol minum sendiri
2. Pisahkan sampah organik & anorganik
3. Buat kompos dari sisa makanan
4. Gunakan produk reusable (sedotan, food container)
5. Matikan listrik & air saat tidak dipakai

**Saat Belanja:**
1. Pilih produk dengan kemasan minimal
2. Beli seperlunya (avoid impulse buying)
3. Cari produk refill & isi ulang
4. Dukung brand berkelanjutan
5. Beli second-hand jika memungkinkan

**Prinsip Utama:**
• Mulai dari hal kecil & konsisten
• Ajak keluarga & teman
• Jangan perfeksionis - progress lebih penting!

Perubahan dimulai dari diri sendiri! 🌱 Ada area spesifik yang ingin Anda pelajari lebih dalam?""",

            Intent.UNKNOWN: """Maaf, saya belum memahami pertanyaan Anda. 🤔

Coba tanyakan tentang:
• "Apa itu ekonomi sirkular?"
• "Jelaskan prinsip 5R"
• "Contoh penerapan ekonomi sirkular"
• "Manfaat ekonomi sirkular"
• "Apa itu sustainability?"
• "Bahaya sampah plastik"
• "Tips hidup ramah lingkungan"

Atau ketik "bisa apa" untuk melihat kemampuan saya! 💡"""
        }
    
    def get_response(self, intent: Intent) -> str:
        """Dapatkan respons untuk intent tertentu"""
        # Fallback jika intent tidak ditemukan
        if intent not in self.responses:
            return """Maaf, saya belum memahami pertanyaan Anda. 🤔

Coba tanyakan tentang:
• "Apa itu ekonomi sirkular?"
• "Jelaskan prinsip 5R"
• "Contoh penerapan ekonomi sirkular"
• "Manfaat ekonomi sirkular"
• "Apa itu sustainability?"
• "Bahaya sampah plastik"
• "Tips hidup ramah lingkungan"

Atau ketik "bisa apa" untuk melihat kemampuan saya! 💡"""
        
        return self.responses[intent]


class CircularEconomyBot:
    """Chatbot edukatif untuk Ekonomi Sirkular dengan Intent Classification"""
    
    def __init__(self):
        self.classifier = IntentClassifier()
        self.kb = EcoBuddyKnowledgeBase()
        self.confidence_threshold = 0.3  # Minimal confidence untuk tidak fallback
        
    def get_response(self, message: str) -> str:
        """Generate respons chatbot dengan intent classification"""
        
        if not message or message.strip() == "":
            return "Silakan ketik pertanyaan Anda tentang ekonomi sirkular atau sustainability. 😊"
        
        try:
            # Klasifikasi intent
            intent, confidence = self.classifier.classify(message)
            
            # Debug info (bisa diaktifkan untuk development)
            # print(f"[DEBUG] Intent: {intent.value}, Confidence: {confidence:.2f}")
            
            # Jika confidence cukup tinggi, return respons sesuai intent
            if confidence >= self.confidence_threshold and intent != Intent.UNKNOWN:
                return self.kb.get_response(intent)
            
            # Fallback response dengan saran topik
            return self._get_fallback_response(message)
            
        except Exception as e:
            # Fallback jika terjadi error
            print(f"[ERROR] Exception in get_response: {e}")
            return """Maaf, terjadi kesalahan saat memproses pertanyaan Anda. 🙏

Silakan coba lagi atau tanyakan:
• "Apa itu ekonomi sirkular?"
• "Tips hidup ramah lingkungan"
• "Bisa apa" untuk melihat kemampuan saya

Jika masalah berlanjut, mohon laporkan ke tim kami."""
    
    def _get_fallback_response(self, message: str) -> str:
        """Respons fallback yang lebih contextual"""
        
        # Cek apakah ada kata kunci tertentu untuk memberikan hint
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['ekonomi', 'economy', 'sirkular', 'circular']):
            return """Sepertinya Anda ingin tahu tentang ekonomi sirkular! 🔄

Coba tanyakan:
• "Apa itu ekonomi sirkular?"
• "Jelaskan prinsip ekonomi sirkular"
• "Contoh penerapan ekonomi sirkular"
• "Manfaat ekonomi sirkular"

Atau ketik "bisa apa" untuk melihat topik yang bisa saya jelaskan! 💡"""
        
        elif any(word in message_lower for word in ['lingkungan', 'environment', 'sustainability', 'hijau', 'green']):
            return """Tertarik dengan topik lingkungan? 🌍

Saya bisa jelaskan tentang:
• Sustainability dan keberlanjutan
• Masalah sampah plastik & solusinya
• Energi terbarukan
• Perubahan iklim
• Tips hidup ramah lingkungan

Silakan tanyakan yang Anda ingin ketahui! 😊"""
        
        else:
            return """Maaf, saya belum memahami pertanyaan Anda. 🤔

Saya adalah EcoBuddy, asisten edukatif tentang:
✓ Ekonomi Sirkular
✓ Sustainability & Lingkungan
✓ Tips Hidup Ramah Lingkungan

Coba tanyakan:
• "Apa itu ekonomi sirkular?"
• "Bagaimana cara hidup lebih ramah lingkungan?"
• "Jelaskan tentang sampah plastik"

Atau ketik "bisa apa" untuk melihat kemampuan lengkap saya! 💡"""


# Instance global chatbot
_bot_instance = None

def get_bot_response(message: str) -> str:
    """Fungsi utama untuk mendapatkan respons bot (kompatibel dengan app.py)"""
    global _bot_instance
    
    if _bot_instance is None:
        _bot_instance = CircularEconomyBot()
    
    return _bot_instance.get_response(message)
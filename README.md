# 🌿 Tukerin - Platform Pertukaran Barang Bekas Berbasis Sekolah


Ringkasan singkat
-----------------
Tukerin adalah solusi digital untuk mengimplementasikan prinsip ekonomi sirkular di sekolah-sekolah Indonesia. Platform ini memfasilitasi pertukaran barang bekas layak pakai antar siswa dan sekolah, sekaligus memberikan edukasi tentang keberlanjutan lingkungan dan dampak nyata dari setiap transaksi.


Masalah yang Diselesaikan 
---------------------------------------
- Waste Management: Mengurangi sampah dengan memperpanjang siklus hidup barang-barang sekolah
- Environmental Awareness: Meningkatkan kesadaran siswa tentang dampak lingkungan melalui visualisasi CO₂ yang dikurangi
- Accessibility: Menyediakan akses ke barang berkualitas dengan biaya terjangkau atau sistem poin
- Education: Memberikan pembelajaran praktis tentang ekonomi sirkular dan sustainability.

Value Proposition
---------------------------------------
🌱 Real-time Impact Tracking: Setiap transaksi diterjemahkan menjadi eco-score dan CO₂ yang dikurangi
🤖 AI-Powered Assistant (EcoBuddy): Chatbot edukatif untuk konsultasi ekonomi sirkular
🏫 School Ecosystem: Sistem terintegrasi dengan koperasi dan perpustakaan sekolah
📊 Gamification: Leaderboard, badge, dan sertifikat untuk memotivasi partisipasi
🔒 Enterprise-grade Security: Email verification, role-based access, dan real-time data protection



🚀 Tech Stack
---------------
**Frontend**
- React 18.3.1 - UI library dengan hooks modern
- TypeScript 5.6.2 - Type-safe development
- Vite 6.0.1 - Lightning-fast build tool
- React Router 7.1.1 - Client-side routing
- GSAP 3.12.5 - Advanced animations
- Leaflet 1.9.4 - Interactive maps

**Backend & Database**
- Supabase - Backend-as-a-Service (PostgreSQL, Authentication, Real-time subscriptions)
- Supabase Auth - Email verification & role-based access control
- PostgreSQL - Relational database dengan Row Level Security (RLS)

**UI/UX Enhancement**
- SweetAlert2 - Beautiful modal notifications
- Bootstrap Icons & Font Awesome - Comprehensive icon libraries
- Custom CSS Modules - Scoped styling dengan responsive design

**AI & Integrations**
- Python Flask (Backend chatbot) - Intent classification & NLP
- Anthropic Claude API - AI-powered conversational interface

⚡ Performance Optimizations
---------------------------------------
1. Build & Bundle Optimization
- Code Splitting: Dynamic imports untuk route-based splitting
- Tree Shaking: Eliminasi unused code via Vite
- Asset Optimization: Image compression dan lazy loading
- CSS Modules: Scoped styles untuk menghindari global namespace pollution

2. Runtime Performance
- React Memo & Callbacks: Mencegah unnecessary re-renders
- Real-time Subscriptions: Efficient Supabase channel management dengan cleanup
- Animated Counters: Smooth number animations tanpa blocking UI thread
- Debounced Search: Mengurangi API calls pada pencarian produk

3. State Management
- Local State Strategy: useState untuk component-level state
- Real-time Updates: Supabase subscriptions untuk live data sync
- Cached Queries: Minimasi database hits dengan smart caching

4. Loading Experience
- Progressive Loading: Skeleton screens dan loading indicators
- Optimistic UI Updates: Instant feedback sebelum server response
- Error Boundaries: Graceful error handling tanpa crash
- Highlight Teknis
----------------


🔒 Security Features
---------------------------------------
1. Authentication & Authorization
✅ Email Verification - Wajib verifikasi sebelum akses penuh
✅ JWT Tokens - Secure session management via Supabase Auth
✅ Role-Based Access Control (RBAC) - Student, Teacher, Admin roles
✅ Protected Routes - Client-side route guards
✅ Secure Password Storage - Bcrypt hashing (handled by Supabase)
2. Database Security
✅ Row Level Security (RLS): Policies untuk akses data berdasarkan user_id dan role
✅ Prepared Statements: Supabase client mencegah SQL injection
✅ Data Validation: Input sanitization di frontend dan backend

3. API Security
✅ CORS Configuration: Restricted origin access
✅ Rate Limiting: Proteksi terhadap abuse (via Supabase built-in)
✅ Environment Variables: Sensitive keys tidak di-commit ke repository

4. Client-Side Security
✅ XSS Prevention: React's built-in escaping + CSP headers
✅ CSRF Protection: Token-based requests
✅ Secure Storage: Supabase handles token storage dengan HttpOnly cookies

5. Privacy & Compliance
✅ Data Minimization: Hanya collect data yang diperlukan
✅ User Consent: Clear privacy policy dan terms of service
✅ Data Encryption: HTTPS untuk semua komunikasi
✅ Audit Trails: Activity logging untuk tracking perubahan


📦 Installation
---------------------------------------
# Prerequisites
- bashNode.js >= 18.0.0
- npm >= 9.0.0

# Setup
- bash# Clone repository
- git clone https://github.com/yourusername/tukerin.git
- cd tukerin

# Install dependencies
- npm install

# Setup environment variables
- cp .env.example .env.local

# Run development server
npm run dev

# Environment Variables
VITE_SUPABASE_URL=https://iomvntpdynnunysctrdk.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_zzqYre7RREL12abtHIlU9g_uAYyFy_H

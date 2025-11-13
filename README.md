# AI Database Report Generator

AlmaLinux 9 + Plesk üzerinde çalışan, uzak MySQL veritabanlarından AI destekli rapor oluşturma uygulaması.

## Özellikler

- 🤖 OpenAI GPT-4 ile desteklenen akıllı sohbet arayüzü
- 🗄️ Uzak MySQL veritabanı bağlantısı
- 📊 Otomatik SQL sorgu oluşturma
- 📈 Veri analizi ve rapor oluşturma
- 🎨 Modern ve kullanıcı dostu arayüz (Claude AI benzeri)
- 🔒 Güvenli veritabanı bağlantı yönetimi

## Teknolojiler

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MySQL 2
- **AI/ML:** OpenAI GPT-4o-mini
- **Language:** TypeScript

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası oluşturun:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

### 4. Production Build

```bash
npm run build
npm start
```

## Plesk Kurulumu

### 1. Gereksinimler

- AlmaLinux 9
- Plesk Panel
- Node.js 18+ (Plesk Extensions'dan yükleyin)
- MySQL 8.0+

### 2. Plesk'te Uygulama Ayarları

1. Plesk'te yeni bir domain veya subdomain oluşturun
2. Node.js desteğini etkinleştirin
3. Node.js versiyonunu 18+ seçin
4. Application mode: `production`
5. Application startup file: `server.js` veya Next.js custom server
6. Ortam değişkenlerini Plesk panelinden ekleyin:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`

### 3. Deploy

```bash
# Git ile clone
git clone <repository-url>
cd <project-folder>

# Bağımlılıkları yükle
npm install

# Build
npm run build

# PM2 ile çalıştır (önerilen)
pm2 start npm --name "ai-report-generator" -- start
pm2 save
pm2 startup
```

## Kullanım

### 1. Veritabanı Bağlantısı

1. **Veritabanı Ayarları** sayfasına gidin
2. Uzak MySQL sunucunuzun bilgilerini girin:
   - Host/IP adresi
   - Port (varsayılan: 3306)
   - Kullanıcı adı
   - Şifre
3. **Bağlantıyı Test Et** butonuna tıklayın
4. Bağlantı başarılı olursa, veritabanı listesi görünecektir
5. Çalışmak istediğiniz veritabanını seçin
6. Seçilen veritabanının tabloları otomatik olarak listelenecektir

### 2. AI Chat ve Rapor Oluşturma

1. **Chat** sayfasına gidin
2. Veritabanınız hakkında Türkçe sorular sorun:
   - "Kaç müşteri var?"
   - "Son 30 günün satış raporu"
   - "En çok satan ürünleri listele"
   - "Aylık gelir analizi yap"
3. AI asistan:
   - Otomatik SQL sorguları oluşturur
   - Sorguları çalıştırır
   - Sonuçları analiz eder
   - Detaylı raporlar oluşturur

## Güvenlik Notları

⚠️ **Önemli Güvenlik Uyarıları:**

1. **Üretim Ortamında:**
   - `.env.local` dosyasını asla commit etmeyin
   - Güçlü veritabanı şifreleri kullanın
   - MySQL kullanıcısına sadece gerekli izinleri verin (SELECT önerilir)
   - HTTPS kullanın
   - Güvenlik duvarı ayarlarını yapın

2. **Veritabanı Kullanıcısı:**
   ```sql
   -- Sadece okuma yetkisi olan kullanıcı oluşturun
   CREATE USER 'ai_reporter'@'%' IDENTIFIED BY 'strong_password';
   GRANT SELECT ON your_database.* TO 'ai_reporter'@'%';
   FLUSH PRIVILEGES;
   ```

3. **Plesk Güvenlik:**
   - ModSecurity kurallarını kontrol edin
   - Fail2ban yapılandırması yapın
   - Düzenli güvenlik güncellemeleri yapın

## API Endpoints

### Database API

- `POST /api/database/test-connection` - Veritabanı bağlantısını test et
- `POST /api/database/get-tables` - Seçilen veritabanının tablolarını getir

### Chat API

- `POST /api/chat` - AI ile sohbet, SQL oluştur ve rapor al

## Yapı

```
├── app/
│   ├── api/
│   │   ├── chat/           # AI chat endpoint
│   │   └── database/       # Database endpoints
│   ├── database/           # Database settings page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Chat page
│   └── globals.css         # Global styles
├── components/
│   ├── ChatInterface.tsx   # Chat UI component
│   ├── DatabaseSettings.tsx # Database settings UI
│   └── Navigation.tsx      # Navigation component
├── lib/
│   ├── mysql.ts            # MySQL utilities
│   └── openai.ts           # OpenAI utilities
├── public/                 # Static files
├── .env.example            # Environment variables example
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Sorun Giderme

### MySQL Bağlantı Hatası

- MySQL sunucusunun uzak bağlantılara izin verdiğinden emin olun
- Güvenlik duvarı ayarlarını kontrol edin
- MySQL kullanıcısının uzak erişim izni olduğundan emin olun

### OpenAI API Hatası

- API anahtarınızın geçerli olduğundan emin olun
- API kotanızı kontrol edin
- İnternet bağlantınızı kontrol edin

### Plesk Deploy Sorunları

- Node.js versiyonunun uyumlu olduğundan emin olun
- npm install hatalarını kontrol edin
- Plesk error loglarını inceleyin: `/var/www/vhosts/system/yourdomain.com/logs/`

## Geliştirme

```bash
# Development mode
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## Lisans

Bu proje özel kullanım içindir.

## Destek

Sorun yaşıyorsanız issue açabilirsiniz.

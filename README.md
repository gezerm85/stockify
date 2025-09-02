<div align="center">

# 📦 Stockify - Stok Yönetimi ve Reçete Sistemi

**React, Firebase ve Material-UI ile Geliştirilmiş Modern Stok Yönetimi Uygulaması**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.2.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-6.4.1-0081CB?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[📱 Demo](#-demo) • [📋 Özellikler](#-özellikler) • [🛠️ Teknolojiler](#️-teknolojiler) • [🚀 Kurulum](#-kurulum)

</div>

---

## 📖 Hakkında

**Stockify**, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir stok yönetimi ve reçete sistemi uygulamasıdır. React, Firebase ve Material-UI ile oluşturulmuş olup, kullanıcılara güvenli, hızlı ve kullanıcı dostu stok yönetimi deneyimi sunmaktadır.

### 🎯 Projenin Amacı

- 📦 **Stok Yönetimi** - Ürün ekleme, düzenleme ve takip
- 📋 **Reçete Sistemi** - Reçete oluşturma ve yönetimi
- 📊 **Envanter Sayımı** - Fiziksel stok kontrolü
- 📈 **Excel Entegrasyonu** - Toplu veri yükleme
- 👥 **Rol Tabanlı Erişim** - Admin ve Worker rolleri
- 🔐 **Güvenli Kimlik Doğrulama** - Firebase Auth

---

## 🚀 Demo

**🔗 [Canlı Demo](https://your-demo-url.com)**

Uygulama şu anda geliştirme aşamasındadır. Demo linki yakında eklenecektir.

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** (v16 veya üzeri)
- **npm** veya **yarn**
- **Firebase Projesi** (Firestore ve Auth)

### Adım Adım Kurulum

1. **Depoyu klonlayın**
   ```bash
   git clone https://github.com/gezerm85/stockify.git
   cd stockify
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   # veya
   yarn install
   ```

3. **Firebase yapılandırması**
   ```bash
   # Firebase projesi oluşturun
   # firebase.js dosyasında config bilgilerini güncelleyin
   ```

4. **Uygulamayı başlatın**
   ```bash
   # Geliştirme sunucusunu başlat
   npm run dev
   
   # Build oluştur
   npm run build
   
   # Preview
   npm run preview
   ```

### Build Komutları

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Preview
npm run preview
```

---

## 📋 Geliştirdiğim Özellikler

### 📦 Stok Yönetimi Sistemi
- [x] **Ürün Ekleme** - Yeni ürün ekleme formu
- [x] **Ürün Düzenleme** - Mevcut ürünleri güncelleme
- [x] **Ürün Silme** - Ürünleri kaldırma
- [x] **Stok Listesi** - Tüm ürünleri görüntüleme
- [x] **Arama ve Filtreleme** - Ürün arama sistemi
- [x] **Birim Dönüşümü** - Gram/Kg, Ml/Lt dönüşümleri

### 📋 Reçete Yönetimi
- [x] **Reçete Oluşturma** - Yeni reçete ekleme
- [x] **Reçete Düzenleme** - Mevcut reçeteleri güncelleme
- [x] **Reçete Silme** - Reçeteleri kaldırma
- [x] **Reçete Listesi** - Tüm reçeteleri görüntüleme
- [x] **Malzeme Hesaplama** - Reçete bazlı malzeme hesaplama
- [x] **Çoklu Malzeme** - Ana ve ekstra malzemeler

### 📊 Envanter Sayımı
- [x] **Fiziksel Sayım** - Gerçek stok kontrolü
- [x] **Sayım Kaydetme** - Sayım sonuçlarını kaydetme
- [x] **Fark Analizi** - Sistem vs fiziksel fark
- [x] **Birim Dönüşümü** - Sayım birim dönüşümleri
- [x] **Toplu Güncelleme** - Sayım sonrası stok güncelleme

### 📈 Excel Entegrasyonu
- [x] **Excel Yükleme** - Drag & drop Excel yükleme
- [x] **Veri Önizleme** - Excel verilerini önizleme
- [x] **Toplu İçe Aktarma** - Excel'den toplu veri yükleme
- [x] **Hata Yönetimi** - Excel hata kontrolü
- [x] **Log Sistemi** - İşlem logları

### 👥 Kullanıcı Yönetimi
- [x] **Kimlik Doğrulama** - Firebase Auth entegrasyonu
- [x] **Rol Tabanlı Erişim** - Admin ve Worker rolleri
- [x] **Kullanıcı Kayıt** - Yeni kullanıcı kaydı
- [x] **Giriş/Çıkış** - Güvenli oturum yönetimi
- [x] **Yetki Kontrolü** - Sayfa bazlı yetki kontrolü

### 🎨 UI/UX Geliştirmeleri
- [x] **Material-UI** - Modern tasarım sistemi
- [x] **Responsive Design** - Mobil uyumlu tasarım
- [x] **Framer Motion** - Smooth animasyonlar
- [x] **Tab Navigation** - Sekme tabanlı navigasyon
- [x] **Loading States** - Kullanıcı dostu loading

### 🔧 Teknik Geliştirmeler
- [x] **Firebase Firestore** - NoSQL veritabanı
- [x] **Context API** - State management
- [x] **React Router** - Sayfa navigasyonu
- [x] **Custom Hooks** - Yeniden kullanılabilir logic
- [x] **Error Handling** - Kapsamlı hata yönetimi

---

## 🛠️ Teknolojiler

### Frontend Framework
- **React** `18.3.1` - Modern UI library
- **Vite** `6.0.5` - Fast build tool
- **React Router DOM** `7.1.3` - Client-side routing

### Backend & Database
- **Firebase** `11.2.0` - Backend as a Service
- **Firestore** - NoSQL database
- **Firebase Auth** - Authentication service

### UI & Styling
- **Material-UI** `6.4.6` - React component library
- **Emotion** `11.14.0` - CSS-in-JS library
- **Tailwind CSS** `4.0.8` - Utility-first CSS
- **Framer Motion** `12.4.7` - Animation library

### File Processing
- **XLSX** `0.18.5` - Excel file processing
- **React Dropzone** `14.3.5` - File upload

### Icons & Assets
- **React Icons** `5.5.0` - Icon library
- **Lucide React** `0.474.0` - Icon components
- **Radix UI Icons** `1.3.2` - Icon components

### Development Tools
- **ESLint** `9.17.0` - Code linting
- **Vite Plugin React** `4.3.4` - React support

---

## 🔧 Geliştirme

### Geliştirme Komutları

```bash
# Geliştirme sunucusunu başlat
npm run dev

# Build oluştur
npm run build

# Lint kontrolü
npm run lint

# Preview
npm run preview
```

### Firebase Yapılandırması

```javascript
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
```

### Firestore Koleksiyonları

```javascript
// Koleksiyon yapısı
{
  "urunler": {
    "productId": {
      "stockNumber": "string",
      "productName": "string", 
      "quantity": "number",
      "unit": "string"
    }
  },
  "recipes": {
    "recipeId": {
      "recipeName": "string",
      "mainIngredient": "object",
      "extras": "array"
    }
  },
  "users": {
    "userId": {
      "email": "string",
      "role": "admin" | "worker"
    }
  }
}
```

---

## 🚀 Deployment

### Vite Build

```bash
# Production build
npm run build

# Preview build
npm run preview
```

### Firebase Hosting

```bash
# Firebase CLI kurulumu
npm install -g firebase-tools

# Firebase'e giriş
firebase login

# Hosting başlatma
firebase init hosting

# Deploy
firebase deploy
```

---

## 🤝 Katkıda Bulunma

1. Bu depoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

### Geliştirme Kuralları
- React best practices'leri takip edin
- ESLint kurallarına uyun
- Firebase güvenlik kurallarını göz önünde bulundurun
- Responsive tasarım prensiplerini uygulayın
- Performance optimizasyonlarını göz önünde bulundurun

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👨‍💻 Geliştirici

**Bu projeyi geliştiren: Mehmet Çelebi Gezer**

Bu stok yönetimi uygulaması, modern web teknolojileri kullanılarak geliştirilmiştir. React, Firebase ve Material-UI ile oluşturulmuş olup, kullanıcı dostu arayüzü, güvenli kimlik doğrulama ve kapsamlı stok yönetimi özellikleri ile profesyonel bir işletme yönetimi deneyimi sunmaktadır.

### 🎯 Proje Detayları
- **Geliştirme Süresi:** [X] hafta/gün
- **Kullanılan Teknolojiler:** React, Firebase, Material-UI, Excel.js
- **Özellikler:** Stok yönetimi, Reçete sistemi, Envanter sayımı, Excel entegrasyonu
- **Platform:** Web (Responsive)

---

## 🙏 Teşekkürler

- [React](https://reactjs.org/) ekibine
- [Firebase](https://firebase.google.com/) ekibine
- [Material-UI](https://mui.com/) ekibine
- [Vite](https://vitejs.dev/) ekibine
- [XLSX](https://sheetjs.com/) ekibine
- Tüm açık kaynak katkıda bulunanlara

---

## 📞 İletişim

**Proje Hakkında Sorularınız İçin:**

- 📧 **E-posta:** [gezermcelebi@gmail.com](mailto:gezermcelebi@gmail.com)
- 💼 **LinkedIn:** [Mehmet Çelebi Gezer](https://www.linkedin.com/in/mehmet-%C3%A7elebi-gezer-605a38217/)
- 🐙 **GitHub:** [@gezerm85](https://github.com/gezerm85)

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ by **Mehmet Çelebi Gezer**

*Modern web teknolojileri ile geliştirilmiş profesyonel stok yönetimi uygulaması*

</div>
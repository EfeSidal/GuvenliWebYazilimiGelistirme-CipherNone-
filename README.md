# 🛡️ CipherNone: JWT "alg: none" Vulnerability & Hardening Lab

![Security CI](https://github.com/EfeSidal/GuvenliWebYazilimiGelistirme-CipherNone-/actions/workflows/security.yml/badge.svg)
![Semgrep](https://img.shields.io/badge/semgrep-p%2Fjwt-blue)
![npm audit](https://img.shields.io/badge/npm%20audit-high%20risk%20monitored-brightgreen)

[🇹🇷 Türkçe](#turkce) | [🇬🇧 English](#english)

---

<a id="turkce"></a>
## 🇹🇷 Türkçe

**CipherNone**, modern web mimarilerinde (REST API'ler) sıkça karşılaşılan kritik bir kimlik doğrulama zafiyetini (JWT Signature Bypass) uygulamalı olarak gösteren bir AppSec (Uygulama Güvenliği) laboratuvarıdır.

Bu projede saldırgan, JWT'nin header kısmındaki algoritmayı `alg: none` olarak değiştirip imza kısmını boş bırakarak yetki atlatma (Authentication Bypass) yapar. Proje, hem bu zafiyetin sömürülmesini (Exploitation) hem de mimari düzeyde nasıl yamalanacağını (Hardening) kanıtlarıyla sunar.

### 🚀 Proje İçeriği
* **`vulnerable_api.js` (Kurban):** Kasıtlı olarak "alg: none" kontrolünü yapmayan, imzasız token'ları kabul eden delik deşik bir Node.js API (Port: 3000).
* **`exploit.js` (Silah):** Herhangi bir kütüphane kullanmadan, tamamen sıfırdan sahte bir Base64Url JWT üreten ve kurban API'ye "Admin" yetkisiyle sızan saldırı scripti.
* **`secure_api.js` (Zırh):** Zero-Trust prensibiyle yazılmış, sadece `HS256` algoritmasını kabul eden ve sahte token'ları anında reddeden yamalı (Hardened) API (Port: 3001).

### 🛡️ Gelişmiş Güvenlik Özellikleri (Advanced Security Features)
* **Unit Tests**: Jest ve Supertest ile otomatik güvenlik doğrulama testleri entegre edildi.
* **Rate Limiting**: `express-rate-limit` ile Brute-Force saldırılarına karşı koruma katmanı eklendi.
* **HTTPS/TLS**: Tüm trafik Self-Signed SSL sertifikası ile uçtan uca şifrelendi.

### 📊 Test Kapsamı
Projede JWT güvenlik mekanizmalarını doğrulamak için Jest + Supertest ile 4 adet otomatik test yazıldı.

- ✅ Geçerli HS256 admin token ile /admin erişimi
- ✅ alg: none saldırısının tespiti ve engellenmesi
- ✅ Algorithm Confusion (RS256 alg + HS256 imza) saldırısının engellenmesi
- ✅ User rolü ile admin erişiminin reddedilmesi

![Security Test 1](screenshots/test1.png)
![Security Test 2](screenshots/test2.png)
![Security Test 3](screenshots/test3.png)
![Security Test 4 - Jest Summary](screenshots/test4.png)

### 🎬 Demo
Aşağıda, CipherNone laboratuvarının tüm özelliklerini içeren interaktif dashboard demosu yer almaktadır. Bu demo; zafiyetli API üzerindeki `alg:none` saldırısını, güvenli API'nin bu saldırıyı nasıl engellediğini ve Refresh Token rotasyonunu görsel olarak sunar.

![CipherNone Dashboard Demo](./demo/project-demo.webp)

---

## 🚀 Başlangıç (Getting Started)

### 📦 Kurulum (Installation)
```bash
git clone https://github.com/EfeSidal/GuvenliWebYazilimiGelistirme-CipherNone-.git
cd GuvenliWebYazilimiGelistirme-CipherNone-
npm install
```

### 🛠 Kullanım (PoC)

**1. Zafiyetli Sunucuyu Başlatın:**
```bash
node src/vulnerable_api.js
```

**2. Silahı Ateşleyin (Saldırı Aşaması):**
```bash
node src/exploit.js
```

**3. Güvenli Sunucuyu Test Edin (Savunma Aşaması):**
```bash
node src/secure_api.js
```

---

<a id="english"></a>
## 🇬🇧 English

**CipherNone** is an AppSec (Application Security) laboratory that practically demonstrates a critical authentication vulnerability commonly found in modern web architectures (REST APIs): the JWT Signature Bypass.

### 🚀 Project Contents
* **`vulnerable_api.js` (The Victim):** An intentionally flawed Node.js API that fails to check for "alg: none" and accepts unsigned tokens.
* **`exploit.js` (The Weapon):** An attack script that generates a forged Base64Url JWT entirely from scratch, bypassing the victim API.
* **`secure_api.js` (The Armor):** A hardened API built on Zero-Trust principles that strictly enforces the `RS256` algorithm.

### 📊 Test Coverage
- ✅ Accessing /admin with a valid HS256 admin token
- ✅ Detection and prevention of the alg: none attack
- ✅ Prevention of the Algorithm Confusion attack
- ✅ Rejection of admin access with the User role

![Security Test Coverage](screenshots/test4.png)

### 🎬 Demo
Below is a comprehensive demo of the interactive CipherNone Dashboard. It showcases the `alg:none` exploit on the vulnerable API, the defense mechanisms of the secure API, and the Refresh Token rotation flow.

![CipherNone Dashboard Demo](./demo/project-demo.webp)

---

## 🚀 Getting Started

### 📦 Installation
```bash
npm install
```

### 🛠 Usage (PoC)
**1. Start the Vulnerable Server:** `node src/vulnerable_api.js`
**2. Fire the Weapon:** `node src/exploit.js`
**3. Test the Secure Server:** `node src/secure_api.js`

---

## 📜 Governance & Links
- [📜 RoadMap](ROADMAP.md) - Project development plan and future goals.
- [🤝 Contributing](CONTRIBUTING.md) - Rules and process for contributing.
- [🔒 Security](SECURITY.md) - Security policy and vulnerability disclosure.
- [🛠 Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions.


*(Change the port in `exploit.js` to 3001 and attack again. Result: 403 Forbidden - Attack Blocked\!)*

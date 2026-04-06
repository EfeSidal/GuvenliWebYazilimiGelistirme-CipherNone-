# 🛡️ CipherNone: JWT "alg: none" Vulnerability & Hardening Lab

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

### 🧪 Güvenlik Testlerini Çalıştırma
Uygulamanın şifreleme ve yetki güvenliklerini denetleyen otomatik test takımını koşturmak için:
```bash
npm test
```
### 🛠 Kullanım (PoC)

**1. Zafiyetli Sunucuyu Başlatın:**
```bash
node vulnerable_api.js
````

**2. Silahı Ateşleyin (Saldırı Aşaması):**

```bash
node exploit.js
```

*(Sonuç: Kurban API sahte token'ı yutar ve Admin yetkisi verir.)*

**3. Güvenli Sunucuyu Test Edin (Savunma Aşaması):**

```bash
node secure_api.js
```

*(`exploit.js` içindeki portu 3001 yapıp tekrar saldırın. Sonuç: 403 Forbidden - Saldırı Engellendi\!)*

-----

<a id="english"></a>

## 🇬🇧 English

**CipherNone** is an AppSec (Application Security) laboratory that practically demonstrates a critical authentication vulnerability commonly found in modern web architectures (REST APIs): the JWT Signature Bypass.

In this project, an attacker performs an Authentication Bypass by changing the algorithm in the JWT header to `alg: none` and leaving the signature empty. The project provides evidence for both the exploitation of this vulnerability and how to patch it (Hardening) at the architectural level.

### 🚀 Project Contents

  * **`vulnerable_api.js` (The Victim):** An intentionally flawed Node.js API that fails to check for "alg: none" and accepts unsigned tokens (Port: 3000).
  * **`exploit.js` (The Weapon):** An attack script that generates a forged Base64Url JWT entirely from scratch without any external libraries, bypassing the victim API with "Admin" privileges.
  * **`secure_api.js` (The Armor):** A hardened API built on Zero-Trust principles that strictly enforces the `HS256` algorithm and instantly rejects forged tokens (Port: 3001).

### 🛡️ Advanced Security Features
* **Unit Tests**: Automated security validation tests integrated using Jest and Supertest.
* **Rate Limiting**: Brute-force protection layer added via `express-rate-limit`.
* **HTTPS/TLS**: All traffic is end-to-end encrypted using a Self-Signed SSL certificate.

### 🧪 Running Automated Tests
To run the automated security tests verifying JWT protections and logic:
```bash
npm test
```
### 🛠 Usage (PoC)

**1. Start the Vulnerable Server:**

```bash
node vulnerable_api.js
```

**2. Fire the Weapon (Exploitation Phase):**

```bash
node exploit.js
```

*(Result: The victim API swallows the forged token and grants Admin privileges.)*

**3. Test the Secure Server (Defense Phase):**

```bash
node secure_api.js
```

*(Change the port in `exploit.js` to 3001 and attack again. Result: 403 Forbidden - Attack Blocked\!)*

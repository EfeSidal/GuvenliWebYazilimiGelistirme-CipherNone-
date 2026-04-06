# Güvenlik Politikası / Security Policy

[🇹🇷 Türkçe](#turkce) | [🇬🇧 English](#english)

---

<a id="turkce"></a>
## 🇹🇷 Türkçe

**CipherNone**, bir uygulama güvenliği laboratuvarı ve eğitim projesidir. Proje kasıtlı olarak bazı zafiyetler içermektedir; ancak altyapımızda veya sistemimizde beklenmedik bir güvenlik açığı bulursanız, bunu bize bildirmenizi memnuniyetle karşılarız.

### 🛡️ Desteklenen Versiyonlar
Şu anda sadece ana dal (main branch) üzerindeki güncel versiyon için güvenlik desteği sağlanmaktadır.

| Versiyon | Destek Durumu |
| :--- | :--- |
| 1.x | ✅ Aktif Destek |
| < 1.0 | ❌ Desteklenmiyor |

### 🚨 Güvenlik Açığı Bildirimi
Eğer projenin kendisinde (kasıtlı bırakılanlar dışında) bir zafiyet tespit ederseniz:
1. Lütfen açığı halka açık bir Issue üzerinden **paylaşmayın**.
2. Bulgularınızı projenin ana geliştiricisine e-posta veya GitHub üzerinden özel mesaj yoluyla iletin.
3. Bildiriminize 48 saat içerisinde ilk yanıtı vermeyi ve sorunu en kısa sürede çözmeyi taahhüt ediyoruz.

### 🧪 Kasıtlı Bırakılan Zafiyetler
Bu proje bir eğitim materyali olduğu için aşağıdaki dosyalarda bilinen zafiyetler **kasıtlı** olarak bırakılmıştır:
- `src/vulnerable_api.js`: "alg: none" bypass ve imza kontrolü eksikliği.
- `src/exploit.js`: Saldırı vektörlerini göstermek için kullanılan script.

### ⚠️ Önemli Uyarı
Bu proje sadece **eğitim ve test amaçlıdır**. İçeriğindeki kodları veya zafiyetli sunucuları asla **production (canlı)** ortamlarında kullanmayın. Bu uygulama, internete açık bir sunucuda çalıştırılmak üzere tasarlanmamıştır.

---

<a id="english"></a>
## 🇬🇧 English

**CipherNone** is an application security laboratory and educational project. While the project intentionally contains certain vulnerabilities, we welcome the reporting of any unexpected security flaws in our infrastructure or code.

### 🛡️ Supported Versions
Security support is currently provided only for the latest version on the main branch.

| Version | Support Status |
| :--- | :--- |
| 1.x | ✅ Active Support |
| < 1.0 | ❌ Not Supported |

### 🚨 Reporting a Vulnerability
If you discover a vulnerability in the project (other than those left intentionally):
1. Please **do not** disclose the issue via a public GitHub Issue.
2. Send your findings privately to the project maintainer via email or GitHub private message.
3. We commit to providing an initial response within **48 hours** and resolving the issue as quickly as possible.

### 🧪 Intentional Vulnerabilities
As this is an educational project, the following files contain **intentional** security flaws for demonstration purposes:
- `src/vulnerable_api.js`: Missing signature validation and "alg: none" bypass.
- `src/exploit.js`: Script used to demonstrate attack vectors.

### ⚠️ Important Warning
This project is for **educational and testing purposes only**. Never use the code or vulnerable servers in this repository in **production** environments. This application is not designed to be run on an internet-facing server.

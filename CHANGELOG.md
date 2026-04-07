# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-04-07

### Added
- **Authentication**: Refresh token sistemi ve in-memory blacklist implementasyonu.
- **Testing**: JWT zafiyetleri için case-variation (NONE, NoNe, none+boşluk vb.) bypass testleri eklendi.
- **Documentation**: Proje yönetimi ve açık kaynak standartları için `CONTRIBUTING.md`, `SECURITY.md`, `TROUBLESHOOTING.md`, `ROADMAP.md` ve `CODE_OF_CONDUCT.md` dosyaları eklendi.
- **Templates**: GitHub repoları için Bug Report ve Feature Request şablonları (`.github/ISSUE_TEMPLATE/`) eklendi.

### Changed
- **JWT Architecture (Breaking Change)**: Şifreleme mimarisi tamamen değiştirilerek JWT algoritması HS256'dan (simetrik) RS256'ya (asimetrik anahtar çifti) yükseltildi. *Not: Bu köklü değişiklik, eski sürümlerle üretilmiş tüm token'ların geçersiz sayılmasına neden olacaktır.*

### Security
- **CI/CD**: Kod analizini otomatize etmek için Semgrep SAST (p/jwt ruleset) pipeline'a entegre edildi.

## [1.2.0] - 2026-04-06

### Added
- **Unit Tests**: Unit test suite for JWT bypass scenarios.
- **Rate Limiting**: Brute-force protection layer (Rate Limiting).
- **HTTPS/TLS**: End-to-end encryption with HTTPS/TLS.

### Changed
- **CI/CD**: Updated `security-scan.yml` pipeline to include automated testing.

## [1.1.0] - 2026-04-06

### Added
- **Docker Integration (Konteyner Mimarisi)**: `Dockerfile` ve `docker-compose.yml` eklendi. `vulnerable-api` (3000 port) ve `secure-api` (3001 port) servisleri tanımlandı.
- **CI/CD Pipeline**: `.github/workflows/security-scan.yml` dosyası oluşturuldu. DevSecOps standartlarına uygun olarak otomatik `npm audit` taraması entegre edildi.
- **Dokümantasyon Standartları**: Açık kaynak lisans gereksinimi için `LICENSE` (MIT) ve sürüm tarihçesi için bu `CHANGELOG.md` eklendi.

### Changed
- **Modüler Refactoring (Mimari)**: Ana dizindeki API servisleri (`vulnerable_api.js`, `secure_api.js`, `exploit.js`) `src/` klasörü altına taşındı.
- **Kod Kalitesi Artışı**: Konsol renk kodları ve loglama algoritmaları merkezi bir `src/logger.js` dosyasında birleştirilerek kod satır sayıları optimize edildi.
- **Geliştirici İyileştirmeleri**: Eksik olan JSDoc yorum blokları projeye eklendi ve tüm scriptlerin okunabilirliği artırıldı. `secure_api.js` ve `exploit.js` içlerine profesyonel TODO/FIXME yorumları gömüldü.
- **Konfigürasyon (package.json)**: `main` alanı artık index.js yerine `src/vulnerable_api.js` olarak güncellendi. `scripts` kısmına `start:vulnerable` ve `start:secure` komutları eklendi.

## [1.0.0] - 2026-04-05

### Added
- **Initial Release (İlk Sürüm)**: JWT "alg: none" zafiyetini (CWE-327) gösteren temel PoC (Proof of Concept) laboratuvar ortamı oluşturuldu.
- `vulnerable_api.js`: Kasıtlı olarak imzasız tokenleri kabul eden ve "admin" yetkisi veren zayıf API.
- `secure_api.js`: Zero-Trust mantığıyla sadece HS256 algoritmasını kabul eden yamalı API.
- `exploit.js`: Herhangi bir kütüphane kullanmadan sahte Base64Url JWT üreten PoC saldırı scripti.
- Laboratuvarın kullanımını açıklayan kapsamlı İngilizce ve Türkçe `README.md` dokümantasyonu.

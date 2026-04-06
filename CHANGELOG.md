# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

# Sorun Giderme Kılavuzu / Troubleshooting Guide

[🇹🇷 Türkçe](#turkce) | [🇬🇧 English](#english)

---

<a id="turkce"></a>
## 🇹🇷 Türkçe

Bu proje kurulumu veya çalıştırılması sırasında karşılaşabileceğiniz yaygın sorunların çözümlerini burada bulabilirsiniz.

### 📦 1. Bağımlılık Hataları (npm install)
- **Belirti**: `npm install` komutu sırasında hata mesajları veya eksik paket uyarıları.
- **Sebep**: Node.js sürüm uyumsuzluğu veya internet bağlantısı/proxy sorunları.
- **Çözüm**: 
    - Node.js sürümünüzün en az **v18+** olduğundan emin olun (`node -v`).
    - `node_modules` klasörünü ve `package-lock.json` dosyasını silip tekrar deneyin:
      ```bash
      rm -rf node_modules package-lock.json && npm install
      ```

### 🌐 2. Port Kullanımda Hatası (3000/3001)
- **Belirti**: `Error: listen EADDRINUSE: address already in use :::3000`.
- **Sebep**: Başka bir servis veya daha önce kapatılmamış bir örnek Port 3000 veya 3001'i kullanıyor.
- **Çözüm**: 
    - Portu kullanan işlemi bulun ve sonlandırın:
      ```powershell
      # Windows (PowerShell)
      netstat -ano | findstr :3000
      stop-process -Id <PID>
      ```
    - Veya Docker kullanıyorsanız `docker-compose down` komutunu çalıştırın.

### 🔑 3. Eksik Sertifika Dosyaları (PEM)
- **Belirti**: `Error: ENOENT: no such file or directory, .../certs/private.pem`.
- **Sebep**: `public.pem` veya `private.pem` dosyaları henüz oluşturulmamış veya silinmiş.
- **Çözüm**: 
    - `src/secure_api.js` dosyasını ilk kez çalıştırmadan önce `server.key` ve `server.cert` dosyalarından anahtarları çıkartmanız gerekir.
    - Proje kök dizininde `node -e "require('fs').copyFileSync('certs/server.key', 'certs/private.pem')"` komutunu deneyebilirsiniz (Detaylar README'de).

### 🔐 4. JWT Doğrulama Hatası (RS256 Key Mismatch)
- **Belirti**: Token doğrulanırken `JsonWebTokenError: invalid algorithm` veya `invalid signature`.
- **Sebep**: Yanlış anahtar çifti kullanımı veya algoritma uyuşmazlığı.
- **Çözüm**: 
    - `secure_api.js` dosyasının `public.pem` dosyasını okuduğundan emin olun.
    - Token'ın hangi algoritma (RS256) ile imzalandığını kontrol edin (jwt.io sitesini kullanabilirsiniz).

### 🧪 5. Test Başarısızlığı (npm test)
- **Belirti**: Jest testlerinde kırmızı "FAIL" mesajları.
- **Sebep**: API'ler çalışmıyor olabilir veya portlar çakışıyor olabilir.
- **Çözüm**: 
    - Testleri koşturmadan önce hiçbir API'nin çalışmadığından emin olun (Jest portları kendi yönetir).
    - Hata detaylarını görmek için `npm test -- --verbose` komutunu kullanın.

### 🐋 6. Docker Konteyner Hataları
- **Belirti**: `docker-compose up` sonrası konteynerlerin "Exited" durumuna düşmesi.
- **Sebep**: Docker imajının hatalı build edilmesi veya port çakışması.
- **Çözüm**: 
    - İmajları temizleyip tekrar build edin:
      ```bash
      docker-compose build --no-cache && docker-compose up
      ```
    - `docker logs ciphernone_secure` komutu ile hata loglarını inceleyin.

---

<a id="english"></a>
## 🇬🇧 English

Solutions to common problems you may encounter during the setup or execution of this project.

### 📦 1. Dependency Errors (npm install)
- **Symptom**: Error messages during `npm install` or warnings about missing packages.
- **Cause**: Node.js version mismatch or internet/proxy connectivity issues.
- **Solution**: 
    - Ensure your Node.js version is at least **v18+** (`node -v`).
    - Delete `node_modules` and `package-lock.json`, then try again:
      ```bash
      rm -rf node_modules package-lock.json && npm install
      ```

### 🌐 2. Port Already in Use (3000/3001)
- **Symptom**: `Error: listen EADDRINUSE: address already in use :::3000`.
- **Cause**: Another service or a previously hung instance is using Port 3000 or 3001.
- **Solution**: 
    - Find the process using the port and terminate it:
      ```powershell
      # Windows (PowerShell)
      netstat -ano | findstr :3000
      stop-process -Id <PID>
      ```
    - Or if using Docker, run `docker-compose down`.

### 🔑 3. Missing Certificate Files (PEM)
- **Symptom**: `Error: ENOENT: no such file or directory, .../certs/private.pem`.
- **Cause**: `public.pem` or `private.pem` files haven't been generated or were deleted.
- **Solution**: 
    - You must extract the keys from `server.key` and `server.cert` before running `src/secure_api.js` for the first time.
    - Try running `node -e "require('fs').copyFileSync('certs/server.key', 'certs/private.pem')"` in the project root (See README for details).

### 🔐 4. JWT Verification Error (RS256 Key Mismatch)
- **Symptom**: `JsonWebTokenError: invalid algorithm` or `invalid signature` during token verification.
- **Cause**: Use of incorrect key pairs or algorithm mismatch.
- **Solution**: 
    - Verify that `secure_api.js` is correctly reading the `public.pem` file.
    - Check which algorithm (RS256) is being used to sign the token (you can use jwt.io).

### 🧪 5. Testing Failures (npm test)
- **Symptom**: Red "FAIL" messages in Jest tests.
- **Cause**: APIs might be running manually or ports are conflicting.
- **Solution**: 
    - Ensure no APIs are running manually before starting tests (Jest manages ports internally).
    - Use `npm test -- --verbose` to see detailed error messages.

### 🐋 6. Docker Container Failures
- **Symptom**: Containers falling into "Exited" status after `docker-compose up`.
- **Cause**: Flawed Docker image build or port conflicts.
- **Solution**: 
    - Clean and rebuild images:
      ```bash
      docker-compose build --no-cache && docker-compose up
      ```
    - Inspect error logs using `docker logs ciphernone_secure`.

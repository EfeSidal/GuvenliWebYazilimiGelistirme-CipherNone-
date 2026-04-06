// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  CipherNone — Güvenli API (Hardened)                                      ║
// ║  ✅ JWT "alg: none" zafiyeti tamamen kapatılmıştır.                       ║
// ║  ✅ Zero-Trust: Yalnızca HS256 algoritması kabul edilir.                  ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// ─── Sabitler ────────────────────────────────────────────────────────────────
const PORT = 3001;
const SECRET_KEY = 'super_gizli_anahtar_123';
const ALLOWED_ALGORITHMS = ['HS256']; // Zero-Trust: Sadece bu algoritmaya güven

// ─── Logger Modülü ────────────────────────────────────────────────────────────
const { C, log } = require('./logger');

function banner() {
  console.log(`
${C.green}${C.bright}╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██████╗██╗██████╗ ██╗  ██╗███████╗██████╗                  ║
║  ██╔════╝██║██╔══██╗██║  ██║██╔════╝██╔══██╗                 ║
║  ██║     ██║██████╔╝███████║█████╗  ██████╔╝                 ║
║  ██║     ██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗                 ║
║  ╚██████╗██║██║     ██║  ██║███████╗██║  ██║                  ║
║   ╚═════╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝                 ║
║                      ${C.cyan}S E C U R E${C.green}                              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ${C.white}JWT Hardened API — "alg: none" Zafiyeti KAPATILDI${C.green}          ║
║  ${C.dim}${C.white}Siber Güvenlik Laboratuvarı (Güvenli Versiyon)${C.green}${C.bright}            ║
╚══════════════════════════════════════════════════════════════╝${C.reset}
  `);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENDPOINT 1: POST /login
// Standart JWT token üretir. Payload: { user: "guest", role: "user" }
// İmza algoritması: HS256 (sabit)
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/login', (req, res) => {
  log('🔑', C.cyan, '[LOGIN]', 'Giriş isteği alındı.');

  const payload = { user: 'guest', role: 'user' };

  const token = jwt.sign(payload, SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });

  log('✅', C.green, '[LOGIN]', 'Token başarıyla oluşturuldu.');
  log('📦', C.blue, '[LOGIN]', `Payload   → ${C.yellow}${JSON.stringify(payload)}${C.reset}`);
  log('🔐', C.blue, '[LOGIN]', `Algoritma → ${C.yellow}HS256${C.reset}`);
  log('📤', C.green, '[LOGIN]', 'Token gönderildi.');

  console.log(`${C.dim}${'─'.repeat(62)}${C.reset}`);

  return res.json({
    success: true,
    message: 'Giriş başarılı. Token aşağıda.',
    token,
    info: {
      user: payload.user,
      role: payload.role,
      algorithm: 'HS256',
      expiresIn: '1h',
    },
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GÜVENLİ MIDDLEWARE: verifyTokenSecure
//
// ✅ GÜVENLİK YAMALARI:
//   1. Manuel jwt.decode() KULLANILMIYOR — doğrudan jwt.verify().
//   2. algorithms: ['HS256'] ile SADECE beklenen algoritma kabul ediliyor.
//   3. "none", "None", "NONE", "nOnE" gibi tüm varyasyonlar otomatik reddedilir.
//   4. RS256 → HS256 (Key Confusion) saldırısı da engellenir.
//   5. Geçersiz/manipüle token → 403 + detaylı saldırı logu.
//
// NEDEN GÜVENLİ:
//   jwt.verify() fonksiyonu algorithms parametresi ile çağrıldığında,
//   token header'ındaki alg değerini İGNORE eder ve SADECE izin verilen
//   algoritma listesiyle doğrulama yapar. Bu, alg:none saldırısını
//   kökünden engeller çünkü:
//   - Token alg:none dese bile, sunucu HS256 ile verify etmeye çalışır
//   - İmza olmadığı için verify BAŞARISIZ olur → saldırı engellenir
// ═══════════════════════════════════════════════════════════════════════════════
// TODO: Rate limiting mekanizması (express-rate-limit) entegrasyonunu tamamla, brute-force koruması sağlansın.
// FIXME: Kimlik ve yetki rollerini daha merkezi bir policy module'üne taşı (Role-based erişim kontrolü).
/**
 * JSON Web Token (JWT) kimlik doğrulamasını sağlayan güvenli middleware.
 * @description Bu middleware imza doğrulaması için sadece `HS256` algoritmasına izin verir ve `alg: none` ataklarını otomatik reddeder.
 * 
 * @param {import('express').Request} req - Express istek nesnesi.
 * @param {import('express').Response} res - Express yanıt nesnesi.
 * @param {import('express').NextFunction} next - Sonraki middleware işlevi.
 * @returns {void}
 */
function verifyTokenSecure(req, res, next) {
  const authHeader = req.headers['authorization'];

  // ── Kontrol 1: Authorization header var mı? ───────────────────────────────
  if (!authHeader) {
    log('🚫', C.red, '[AUTH]', 'Authorization header bulunamadı!');
    return res.status(401).json({
      success: false,
      message: 'Erişim reddedildi. Token bulunamadı.',
    });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  // ── Kontrol 2: Token boş mu? ─────────────────────────────────────────────
  if (!token || token.trim() === '') {
    log('🚫', C.red, '[AUTH]', 'Boş token gönderildi!');
    return res.status(401).json({
      success: false,
      message: 'Erişim reddedildi. Token boş.',
    });
  }

  log('🔍', C.cyan, '[AUTH]', 'Token alındı, güvenli doğrulama yapılıyor...');

  // ─────────────────────────────────────────────────────────────────────────
  // ✅ GÜVENLİ DOĞRULAMA: jwt.verify() + algorithms whitelist
  //
  // Bu tek satır, aşağıdaki saldırıları engellemek için yeterlidir:
  //   ❌ alg: "none"   → İmza doğrulaması atlanamaz
  //   ❌ alg: "None"   → Büyük/küçük harf varyasyonları reddedilir
  //   ❌ alg: "RS256"  → Key Confusion saldırısı engellenir
  //   ❌ Sahte imza    → Kriptografik doğrulama başarısız olur
  //   ❌ Expire olmuş  → exp claim otomatik kontrol edilir
  // ─────────────────────────────────────────────────────────────────────────
  try {
    const verified = jwt.verify(token, SECRET_KEY, {
      algorithms: ALLOWED_ALGORITHMS, // ← KURŞUN GEÇİRMEZ: Sadece HS256!
    });

    log('✅', C.green, '[AUTH]',
      `Token doğrulandı! Kullanıcı: ${C.bright}${verified.user}${C.reset}, Rol: ${C.bright}${verified.role}${C.reset}`);
    log('🔐', C.green, '[AUTH]',
      `Algoritma whitelist kontrolü geçti: ${C.bright}${ALLOWED_ALGORITHMS.join(', ')}${C.reset}`);

    // ── Kontrol 3: Admin yetkisi var mı? ────────────────────────────────────
    if (verified.role !== 'admin') {
      log('🚫', C.yellow, '[AUTH]',
        `role: "${verified.role}" — Admin yetkisi yok. Erişim reddedildi.`);
      return res.status(403).json({
        success: false,
        message: `Yetersiz yetki. Rolünüz: "${verified.role}". Admin yetkisi gerekli.`,
      });
    }

    req.user = verified;
    return next();
  } catch (err) {
    // ─────────────────────────────────────────────────────────────────────────
    // 🛡️ SALDIRI ENGELLENDİ — Detaylı güvenlik logu
    //
    // jwt.verify() başarısız olduğunda buraya düşeriz.
    // Bu, aşağıdaki durumlardan birini gösterir:
    //   - alg:none saldırısı (imza yok)
    //   - Sahte/değiştirilmiş imza
    //   - Süresi dolmuş token
    //   - Formatı bozuk token
    // ─────────────────────────────────────────────────────────────────────────

    // Saldırı girişimini tespit etmek için token header'ını güvenli şekilde oku
    let attackInfo = '';
    try {
      const rawHeader = token.split('.')[0];
      const headerJson = JSON.parse(
        Buffer.from(rawHeader, 'base64').toString('utf-8')
      );
      attackInfo = `alg: "${headerJson.alg}", typ: "${headerJson.typ}"`;

      // alg:none saldırısı mı yoksa başka bir hata mı?
      if (headerJson.alg && headerJson.alg.toLowerCase() === 'none') {
        console.log();
        console.log(`${C.bgRed}${C.white}${C.bright}  ╔════════════════════════════════════════════════════════╗  ${C.reset}`);
        console.log(`${C.bgRed}${C.white}${C.bright}  ║  🛡️  SALDIRI TESPİT EDİLDİ VE ENGELLENDİ!            ║  ${C.reset}`);
        console.log(`${C.bgRed}${C.white}${C.bright}  ╠════════════════════════════════════════════════════════╣  ${C.reset}`);
        console.log(`${C.bgRed}${C.white}${C.bright}  ║  Saldırı Türü : JWT "alg: none" Bypass Girişimi       ║  ${C.reset}`);
        console.log(`${C.bgRed}${C.white}${C.bright}  ║  Durum        : ❌ BAŞARISIZ — Token reddedildi        ║  ${C.reset}`);
        console.log(`${C.bgRed}${C.white}${C.bright}  ║  Koruma       : algorithms whitelist (HS256 only)      ║  ${C.reset}`);
        console.log(`${C.bgRed}${C.white}${C.bright}  ╚════════════════════════════════════════════════════════╝  ${C.reset}`);
        console.log();
        log('🛡️', C.red, '[GÜVENLİK]',
          `${C.red}${C.bright}alg:"none" saldırısı ENGELLENDİ! Token: ${C.dim}${token.substring(0, 40)}...${C.reset}`);
      } else {
        log('⚠️', C.yellow, '[GÜVENLİK]',
          `Geçersiz token reddedildi. Header: ${attackInfo}`);
      }
    } catch {
      log('⚠️', C.yellow, '[GÜVENLİK]',
        'Token header parse edilemedi — bozuk format.');
    }

    log('❌', C.red, '[AUTH]', `Doğrulama hatası: ${C.dim}${err.message}${C.reset}`);

    console.log(`${C.dim}${'─'.repeat(62)}${C.reset}`);

    return res.status(403).json({
      success: false,
      message: 'Geçersiz veya manipüle edilmiş token!',
      error: err.message,
      security_note: 'Bu sunucu yalnızca HS256 ile imzalanmış tokenları kabul eder. alg:none desteklenmez.',
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENDPOINT 2: GET /admin  (verifyTokenSecure middleware ile korunuyor)
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/admin', verifyTokenSecure, (req, res) => {
  log('🏆', C.bgGreen + C.white, '[ADMIN]',
    `${C.green}${C.bright}Admin paneline erişim sağlandı (güvenli doğrulama ile)!${C.reset}`);
  log('👤', C.green, '[ADMIN]',
    `Kullanıcı: ${C.bright}${req.user.user}${C.reset}, Rol: ${C.bright}${req.user.role}${C.reset}`);

  console.log(`${C.dim}${'─'.repeat(62)}${C.reset}`);

  return res.json({
    success: true,
    message: '🎉 Admin paneline güvenli şekilde erişildi.',
    user_data: {
      user: req.user.user,
      role: req.user.role,
    },
    security_info: {
      algorithm: 'HS256',
      algorithm_whitelist: ALLOWED_ALGORITHMS,
      alg_none_protected: true,
      key_confusion_protected: true,
      verification_method: 'jwt.verify() with algorithms whitelist',
    },
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// YARDIMCI ENDPOINT: GET /  (API bilgisi)
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/', (req, res) => {
  return res.json({
    name: 'CipherNone — Secure API (Hardened)',
    version: '1.0.0',
    port: PORT,
    endpoints: {
      'POST /login': 'Standart JWT token al (HS256 ile imzalı)',
      'GET  /admin': 'Admin paneli (verifyTokenSecure middleware ile korunuyor)',
    },
    security_measures: [
      'jwt.verify() ile kriptografik doğrulama (jwt.decode KULLANILMIYOR)',
      'algorithms: ["HS256"] — Sadece beklenen algoritmaya güven',
      'alg:none saldırısı otomatik olarak engellenir',
      'Key Confusion (RS256→HS256) saldırısı engellenir',
      'Detaylı saldırı tespiti ve loglama',
    ],
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUNUCU BAŞLAT
// ═══════════════════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  banner();

  console.log(`${C.green}${C.bright}  ✅ Güvenli sunucu başlatıldı!${C.reset}`);
  console.log(`${C.cyan}  🌐 Adres: ${C.bright}http://localhost:${PORT}${C.reset}`);
  console.log();
  console.log(`${C.yellow}  📡 Mevcut Endpoint'ler:${C.reset}`);
  console.log(`${C.white}     POST ${C.bright}/login${C.reset}  → JWT token al (HS256)`);
  console.log(`${C.white}     GET  ${C.bright}/admin${C.reset}  → Korumalı admin paneli`);
  console.log();
  console.log(`${C.dim}  ──────────────────────────────────────────────────────────${C.reset}`);
  console.log(`${C.green}${C.bright}  🛡️  GÜVENLİK YAMALARI AKTİF:${C.reset}`);
  console.log(`${C.green}    ✅ jwt.verify() + algorithms whitelist kullanılıyor${C.reset}`);
  console.log(`${C.green}    ✅ alg: "none" saldırısı ENGELLENİR${C.reset}`);
  console.log(`${C.green}    ✅ Key Confusion saldırısı ENGELLENİR${C.reset}`);
  console.log(`${C.green}    ✅ Saldırı girişimleri loglanır${C.reset}`);
  console.log(`${C.dim}  ──────────────────────────────────────────────────────────${C.reset}`);
  console.log();
  console.log(`${C.dim}${'═'.repeat(62)}${C.reset}`);
  console.log();
});

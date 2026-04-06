// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  CipherNone — JWT "alg: none" Signature Bypass PoC                           ║
// ║  ⚠  Bu dosya kasıtlı olarak zafiyetli bir API barındırır.                    ║
// ║  ⚠  Yalnızca siber güvenlik laboratuvar ortamında kullanılmalıdır.           ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// ─── Sabitler ────────────────────────────────────────────────────────────────
const PORT = 3000;
const SECRET_KEY = 'super_gizli_anahtar_123';

// ─── Logger Modülü ────────────────────────────────────────────────────────────
const { C, log } = require('./logger');

function banner() {
  console.log(`
${C.red}${C.bright}╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██████╗██╗██████╗ ██╗  ██╗███████╗██████╗                  ║
║  ██╔════╝██║██╔══██╗██║  ██║██╔════╝██╔══██╗                 ║
║  ██║     ██║██████╔╝███████║█████╗  ██████╔╝                 ║
║  ██║     ██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗                 ║
║  ╚██████╗██║██║     ██║  ██║███████╗██║  ██║                  ║
║   ╚═════╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝                 ║
║                           ${C.yellow}N O N E${C.red}                            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ${C.white}JWT "alg: none" Signature Bypass — Vulnerable API${C.red}          ║
║  ${C.dim}${C.white}Siber Güvenlik Laboratuvarı (PoC)${C.red}${C.bright}                        ║
╚══════════════════════════════════════════════════════════════╝${C.reset}
  `);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENDPOINT 1: POST /login
// Standart JWT token üretir. Payload: { user: "guest", role: "user" }
// İmza algoritması: HS256
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/login', (req, res) => {
  log('🔑', C.cyan, '[LOGIN]', 'Giriş isteği alındı.');

  const payload = { user: 'guest', role: 'user' };

  const token = jwt.sign(payload, SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });

  log('✅', C.green, '[LOGIN]', `Token başarıyla oluşturuldu.`);
  log('📦', C.blue, '[LOGIN]', `Payload  → ${C.yellow}${JSON.stringify(payload)}${C.reset}`);
  log('🔐', C.blue, '[LOGIN]', `Algoritma → ${C.yellow}HS256${C.reset}`);
  log('📤', C.green, '[LOGIN]', `Token gönderildi.`);

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
// KRİTİK ZAFİYETLİ MIDDLEWARE: verifyToken
//
// BU MIDDLEWARE KASITLI OLARAK GÜVENLİK AÇIĞI İÇERİR:
//   → Eğer token header'ında alg === "none" ise, imza doğrulamasını
//     tamamen ATLAR ve yalnızca payload'daki "role" alanına bakarak
//     yetkilendirme kararı verir.
//
//   → Bu, bir saldırganın herhangi bir gizli anahtar bilmeden
//     token oluşturmasına ve admin yetkisi elde etmesine olanak tanır.
//
// GERÇEK DÜNYA ETKİSİ:
//   Saldırgan aşağıdaki adımları izleyerek sistemi bypass edebilir:
//   1. Base64URL( {"alg":"none","typ":"JWT"} )  → header
//   2. Base64URL( {"user":"hacker","role":"admin"} ) → payload
//   3. header.payload. (imza boş, sadece nokta) → sahte token
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * JSON Web Token (JWT) kimlik doğrulamasını işleyen middleware.
 * @warning DİKKAT: Gösterim amaçlı olarak bilinçli zafiyet içerir. `alg: none` başlık değerleri kontrol edilmez.
 * 
 * @param {import('express').Request} req - Express istek nesnesi.
 * @param {import('express').Response} res - Express yanıt nesnesi.
 * @param {import('express').NextFunction} next - Sonraki middleware işlevi.
 * @returns {void}
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

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

  log('🔍', C.cyan, '[AUTH]', 'Token alındı, analiz ediliyor...');

  // ──────────────────────────────────────────────────────────────────────────
  // ADIM 1: Token header'ını oku (imza DOĞRULAMADAN)
  // Bu adım kendi başına güvenli değildir çünkü jwt.decode() hiçbir
  // kriptografik doğrulama yapmaz — token'ı sadece parse eder.
  // ──────────────────────────────────────────────────────────────────────────
  const decoded = jwt.decode(token, { complete: true });

  if (!decoded || !decoded.header || !decoded.payload) {
    log('❌', C.red, '[AUTH]', 'Token decode edilemedi! Geçersiz veya bozuk token formatı.');
    return res.status(400).json({
      success: false,
      message: 'Bozuk token formatı. Token header veya payload okunamadı.',
    });
  }

  const headerAlg = decoded.header.alg;
  log('📋', C.yellow, '[AUTH]', `Token Header → alg: ${C.bright}${headerAlg}${C.reset}`);
  log('📋', C.yellow, '[AUTH]', `Token Payload → ${C.bright}${JSON.stringify(decoded.payload)}${C.reset}`);

  // ──────────────────────────────────────────────────────────────────────────
  // ⚠️  ÖLÜMCÜL MANTIK HATASI — ZAFİYETİN KALBİ
  // ──────────────────────────────────────────────────────────────────────────
  // Eğer alg === "none" ise, imza kontrolünü tamamen atlıyoruz.
  // Bu, saldırganın kendi oluşturduğu imzasız token ile
  // admin yetkisi elde etmesine izin verir.
  // ──────────────────────────────────────────────────────────────────────────
  if (headerAlg === 'none') {
    log('⚠️ ', C.bgRed + C.white, '[ZAFİYET]',
      `${C.red}${C.bright}alg: "none" tespit edildi! İmza doğrulaması ATLANIYOR!${C.reset}`);
    log('💀', C.red, '[ZAFİYET]',
      `Signature verification BYPASSED — saldırgan kontrolünde!`);

    // İmza doğrulaması YAPILMADI. Sadece payload okunuyor.
    const payload = decoded.payload;

    if (payload.role === 'admin') {
      log('🏴‍☠️', C.bgRed + C.white, '[ZAFİYET]',
        `${C.red}${C.bright}BYPASS BAŞARILI! role: "admin" kabul edildi (imzasız token ile)!${C.reset}`);

      req.user = payload;
      return next(); // ← Saldırgan admin paneline erişiyor!
    } else {
      log('🚫', C.red, '[AUTH]',
        `role: "${payload.role}" — admin değil. Erişim reddedildi.`);
      return res.status(403).json({
        success: false,
        message: `Yetersiz yetki. Rolünüz: "${payload.role}". Admin yetkisi gerekli.`,
      });
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // NORMAL AKIŞ: alg !== "none" ise standart jwt.verify() kullan
  // ──────────────────────────────────────────────────────────────────────────
  log('🔐', C.green, '[AUTH]', `Standart imza doğrulaması yapılıyor (alg: ${headerAlg})...`);

  try {
    const verified = jwt.verify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });

    log('✅', C.green, '[AUTH]', `Token doğrulandı! Kullanıcı: ${C.bright}${verified.user}${C.reset}, Rol: ${C.bright}${verified.role}${C.reset}`);

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
    log('❌', C.red, '[AUTH]', `Token doğrulama HATASI: ${err.message}`);
    return res.status(401).json({
      success: false,
      message: 'Token doğrulanamadı.',
      error: err.message,
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENDPOINT 2: GET /admin  (verifyToken middleware ile korunuyor)
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/admin', verifyToken, (req, res) => {
  log('🏆', C.bgGreen + C.white, '[ADMIN]',
    `${C.green}${C.bright}Admin paneline erişim sağlandı!${C.reset}`);
  log('👤', C.green, '[ADMIN]',
    `Kullanıcı: ${C.bright}${req.user.user}${C.reset}, Rol: ${C.bright}${req.user.role}${C.reset}`);

  console.log(`${C.dim}${'─'.repeat(62)}${C.reset}`);

  return res.json({
    success: true,
    message: '🎉 Tebrikler! Admin paneline başarıyla erişildi.',
    secret_data: {
      flag: 'FLAG{jwt_alg_none_bypass_successful}',
      admin_note: 'Bu gizli veriye yalnızca admin rolüyle erişilebilir.',
      accessed_by: req.user.user,
      accessed_role: req.user.role,
    },
    vulnerability_info: {
      type: 'JWT Algorithm None Attack',
      cwe: 'CWE-327: Use of a Broken or Risky Cryptographic Algorithm',
      description: 'Sunucu, alg: "none" olan token\'ları imza doğrulaması yapmadan kabul ediyor.',
      impact: 'Herhangi bir saldırgan, gizli anahtar bilmeden admin yetkisi elde edebilir.',
    },
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// YARDIMCI ENDPOINT: GET /  (API bilgisi)
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/', (req, res) => {
  return res.json({
    name: 'CipherNone — JWT alg:none PoC API',
    version: '1.0.0',
    endpoints: {
      'POST /login': 'Standart JWT token al (HS256 ile imzalı)',
      'GET  /admin': 'Admin paneli (verifyToken middleware ile korunuyor)',
    },
    exploitation_steps: [
      '1. POST /login ile bir token al',
      '2. Token\'ın header kısmını {"alg":"none","typ":"JWT"} olarak değiştir',
      '3. Payload kısmında role değerini "admin" yap',
      '4. İmza kısmını kaldır (son noktadan sonrasını sil, noktayı bırak)',
      '5. GET /admin endpoint\'ine Authorization: Bearer <sahte-token> ile istek at',
    ],
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUNUCU BAŞLAT
// ═══════════════════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  banner();

  console.log(`${C.green}${C.bright}  ✅ Sunucu başlatıldı!${C.reset}`);
  console.log(`${C.cyan}  🌐 Adres: ${C.bright}http://localhost:${PORT}${C.reset}`);
  console.log();
  console.log(`${C.yellow}  📡 Mevcut Endpoint'ler:${C.reset}`);
  console.log(`${C.white}     POST ${C.bright}/login${C.reset}  → JWT token al (HS256)`);
  console.log(`${C.white}     GET  ${C.bright}/admin${C.reset}  → Korumalı admin paneli`);
  console.log();
  console.log(`${C.dim}  ──────────────────────────────────────────────────────────${C.reset}`);
  console.log(`${C.red}${C.bright}  ⚠  DİKKAT: Bu API kasıtlı olarak zafiyetlidir!${C.reset}`);
  console.log(`${C.red}  💀 JWT "alg: none" saldırısına açıktır.${C.reset}`);
  console.log(`${C.dim}  ──────────────────────────────────────────────────────────${C.reset}`);
  console.log();
  console.log(`${C.magenta}  🧪 Exploitation Örneği:${C.reset}`);
  console.log(`${C.dim}  1. curl -X POST http://localhost:${PORT}/login${C.reset}`);
  console.log(`${C.dim}  2. Token header'ını alg:"none" olarak değiştir${C.reset}`);
  console.log(`${C.dim}  3. Payload'da role:"admin" yap, imzayı kaldır${C.reset}`);
  console.log(`${C.dim}  4. curl -H "Authorization: Bearer <token>" http://localhost:${PORT}/admin${C.reset}`);
  console.log();
  console.log(`${C.dim}${'═'.repeat(62)}${C.reset}`);
  console.log();
});

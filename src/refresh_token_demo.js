// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  CipherNone — Refresh Token Demo                                          ║
// ║  ✅ Access Token (Kısa ömürlü: 15 dk)                                     ║
// ║  ✅ Refresh Token (Uzun ömürlü: 7 gün)                                    ║
// ║  ✅ Blacklist (Logout sonrası geçersiz kılma)                             ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

const express = require('express');
const jwt = require('jsonwebtoken');
const { C, log } = require('./logger');

const app = express();
app.use(express.json());

// ─── Sabitler ve Sırlar ────────────────────────────────────────────────────────
const PORT = 3002;
const ACCESS_TOKEN_SECRET = 'cok_gizli_access_anahtari_987';
const REFRESH_TOKEN_SECRET = 'daha_da_gizli_refresh_anahtari_456';

// Logout yapılan refresh token'ları sistemden atmak için in-memory bir Set
const refreshTokenBlacklist = new Set();

/**
 * Yeni bir Access Token üretir (15 dakika geçerli)
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

/**
 * Yeni bir Refresh Token üretir (7 gün geçerli)
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENDPOINT 1: POST /login
// Kullanıcı girişi yapar ve iki adet token döner.
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/login', (req, res) => {
  log('🔑', C.cyan, '[LOGIN]', 'Giriş isteği alındı (Refresh Token Demo).');

  // Örnek kullanıcı verisi
  const payload = { user: 'guest', role: 'admin' };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  log('✅', C.green, '[LOGIN]', 'Token çifti başarıyla oluşturuldu.');
  log('📤', C.green, '[LOGIN]', 'Access ve Refresh token’lar gönderildi.');

  return res.json({
    success: true,
    message: 'Giriş başarılı.',
    accessToken,
    refreshToken,
    expiresIn: '15m (Access), 7d (Refresh)'
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ENDPOINT 2: POST /refresh
// Süresi dolan bir Access Token yerine yenisini almak için kullanılır.
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  log('🔄', C.yellow, '[REFRESH]', 'Yeni Access Token talebi alındı.');

  if (!refreshToken) {
    log('🚫', C.red, '[REFRESH]', 'Refresh Token bulunamadı!');
    return res.status(401).json({ success: false, message: 'Refresh token gerekli.' });
  }

  // 1. Blacklist kontrolü (Logout yapılmış mı?)
  if (refreshTokenBlacklist.has(refreshToken)) {
    log('🛡️', C.bgRed + C.white, '[REFRESH]', 'Bloklanmış (Blacklisted) token kullanımı reddedildi!');
    return res.status(401).json({ success: false, message: 'Bu token geçersiz (Logout yapılmış).' });
  }

  // 2. Kriptografik doğrulama
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Sadece gerekli alanları alarak yeni access token üret
    const newAccessToken = generateAccessToken({ user: decoded.user, role: decoded.role });

    log('✅', C.green, '[REFRESH]', 'Yeni Access Token başarıyla üretildi.');
    return res.json({ success: true, accessToken: newAccessToken });

  } catch (err) {
    log('❌', C.red, '[REFRESH]', `Refresh token geçersiz: ${err.message}`);
    return res.status(401).json({ success: false, message: 'Geçersiz refresh token.' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ENDPOINT 3: POST /logout
// Refresh token'ı blacklist'e ekleyerek bir daha /refresh yapılmasını engeller.
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/logout', (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    refreshTokenBlacklist.add(refreshToken);
    log('🚪', C.magenta, '[LOGOUT]', 'Refresh token blacklist’e eklendi. Oturum sonlandırıldı.');
  }

  return res.json({ success: true, message: 'Başarıyla çıkış yapıldı.' });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE: verifyAccessToken
// Access token'ın doğruluğunu her kütüphane isteğinde kontrol eder.
// ═══════════════════════════════════════════════════════════════════════════════
function verifyAccessToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token bulunamadı.' });
  }

  try {
    const verified = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    log('⚠️', C.yellow, '[AUTH]', `Erişim reddedildi: ${err.message}`);
    return res.status(403).json({ success: false, message: 'Geçersiz veya süresi dolmuş access token.' });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENDPOINT 4: GET /admin
// Sadece Access Token ile erişilebilen korumalı alan.
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/admin', verifyAccessToken, (req, res) => {
  log('🏆', C.bgGreen + C.white, '[ADMIN]', `Admin paneline erişim: ${req.user.user}`);

  return res.json({
    success: true,
    message: '🎉 Tebrikler! Refresh Token sistemi ile korunan admin paneline eriştiniz.',
    user: req.user
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUNUCU BAŞLAT
// ═══════════════════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`
${C.yellow}${C.bright}╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ${C.cyan}REFRESH TOKEN DEMO SERVER${C.yellow}                                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝${C.reset}
  `);
  console.log(`${C.green}  ✅ Sunucu başlatıldı! Port: ${C.bright}${PORT}${C.reset}`);
  console.log(`${C.dim}  ----------------------------------------------------------${C.reset}`);
  console.log(`${C.white}  POST ${C.bright}/login${C.reset}    → Token çifti al`);
  console.log(`${C.white}  POST ${C.bright}/refresh${C.reset}  → Yeni access token al`);
  console.log(`${C.white}  POST ${C.bright}/logout${C.reset}   → Refresh token’ı geçersiz kıl`);
  console.log(`${C.white}  GET  ${C.bright}/admin${C.reset}    → Korumalı alan (Access token gerekli)`);
  console.log(`${C.dim}  ----------------------------------------------------------${C.reset}\n`);
});

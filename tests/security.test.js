const request = require('supertest');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = require('../src/secure_api');

const fs = require('fs');
const path = require('path');

// Test sabitleri (Asimetrik anahtarları yükle)
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../certs/private.pem'));
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../certs/public.pem'));
const ADMIN_PAYLOAD = { user: 'testadmin', role: 'admin' };
const USER_PAYLOAD = { user: 'testuser', role: 'user' };

describe('Secure API - Security Mechanisms Tests', () => {

  // 1. Başarılı Giriş
  it('Başarılı Giriş: Geçerli ve yetkili (admin) bir RS256 tokenı ile /admin sayfasına erişilebilmelidir', async () => {
    // Admin yetkisine sahip geçerli bir RS256 token oluştur
    const token = jwt.sign(ADMIN_PAYLOAD, PRIVATE_KEY, { algorithm: 'RS256' });

    const response = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user_data.role).toBe('admin');
  });

  // 2. alg: none Saldırısı
  it('alg: none Saldırısı: Token headerı alg: none yapıldığında sistem 403 (Forbidden) döndürmelidir', async () => {
    // "alg: none" header ve admin payload ile manipüle edilmiş imzasız token oluştur
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify(ADMIN_PAYLOAD)).toString('base64url');
    
    // İmza kısmı boş bırakılan attack token
    const attackToken = `${header}.${payload}.`;

    const response = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${attackToken}`);

    // Sistemin algorithms: ['RS256'] whitelist koruması sayesinde 403 dönmesini bekliyoruz
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/Geçersiz veya manipüle edilmiş token/i);
  });

  // 3. Algoritma Confusion (HS256)
  it('Algoritma Confusion (HS256): Sisteme RS256 beklerken HS256 alg ile imzalanmış token gönderildiğinde reddedilmelidir', async () => {
    // Saldırgan, simetrik HS256 algoritmasını kullanarak admin payload içeren bir token imzalar
    // Genellikle public key'i secret key olarak kullanarak sunucuyu yanıltmaya çalışır
    const attackToken = jwt.sign(ADMIN_PAYLOAD, PUBLIC_KEY, { algorithm: 'HS256' });

    const response = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${attackToken}`);

    // Sistemin RS256 whitelist'i sayesinde farklı algoritma ile gelen tokenları reddetmesi gerekir
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  // 4. Eksik Yetki Tespiti
  it('Eksik Yetki: role: "user" olan geçerli bir RS256 tokenı ile admin sayfasına girilememelidir', async () => {
    // Normal bir kullanıcı (user yetkisi) için geçerli RS256 token oluştur
    const token = jwt.sign(USER_PAYLOAD, PRIVATE_KEY, { algorithm: 'RS256' });

    const response = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${token}`);

    // Doğrulama geçse de yetki (role) kontrolünden dolayı 403 dönmelidir
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/Yetersiz yetki/i);
  });

});

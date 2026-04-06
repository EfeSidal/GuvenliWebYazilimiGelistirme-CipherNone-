# Node.js 18-alpine tabanlı hafif imajı ana temel olarak kullanıyoruz
FROM node:18-alpine

# Konteyner içindeki çalışma dizinini ayarlıyoruz
WORKDIR /app

# Bağımlılık ağaçlarını (package.json ve package-lock.json) kopyalıyoruz
COPY package.json package-lock.json ./

# Temiz ve güvenilir bir kurulum için npm ci çalıştırıyor, sadece production bağımlılıklarını kuruyoruz
RUN npm ci --omit=dev

# Uygulama kodlarımızı içeren src klasörünü kopyalıyoruz
COPY src/ ./src/

# Vulnerable API (3000) ve Secure API (3001) portlarını dış dünyaya açıyoruz
EXPOSE 3000 3001

# Varsayılan başlangıç komutu olarak güvenli (secure) API'yi çalıştırıyoruz
CMD ["node", "src/secure_api.js"]

/**
 * @fileoverview Ortak loglama ve CLI renklendirme modülü.
 * Bu modül, tüm API'lerde (zayıf ve güvenli) kodu sadeleştirmek için kullanılır.
 * 
 * @module logger
 */

/**
 * Konsolda renkli çıktılar (CLI) oluşturmak için ANSI kaçış dizileri.
 * @constant {Object<string, string>}
 */
const C = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgCyan: '\x1b[46m',
};

/**
 * Konsola renkli, ikonlu ve zaman damgalı log mesajı yazdırır.
 * 
 * @function log
 * @param {string} icon - Log satırının başındaki ikon (örn. '🔑' veya '🔍')
 * @param {string} color - ANSI renk kodu (C objesinden, örn. C.cyan)
 * @param {string} label - Log satırının başlık etiketi (örn. '[LOGIN]' veya '[AUTH]')
 * @param {string} message - Konsola yazdırılacak ana mesaj metni
 * @returns {void}
 */
function log(icon, color, label, message) {
  const timestamp = new Date().toLocaleTimeString('tr-TR');
  console.log(
    `${C.dim}[${timestamp}]${C.reset} ${icon}  ${color}${C.bright}${label}${C.reset} ${message}`
  );
}

module.exports = {
  C,
  log,
};

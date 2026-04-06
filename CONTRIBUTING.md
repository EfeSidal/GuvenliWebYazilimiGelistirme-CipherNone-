# Katkıda Bulunma Rehberi / Contributing Guide

[🇹🇷 Türkçe](#turkce) | [🇬🇧 English](#english)

---

<a id="turkce"></a>
## 🇹🇷 Türkçe

**CipherNone** projesine katkıda bulunmak istediğiniz için teşekkürler! Bu proje, topluluk katkılarıyla daha güvenli ve eğitici hale gelmektedir.

### 🚀 Nasıl Katkı Sağlanır?
1.  Bu depoyu **fork** edin.
2.  Yeni bir **branch** oluşturun (İsimlendirme kurallarına uyun).
3.  Değişikliklerinizi yapın ve yerel olarak test edin.
4.  Değişikliklerinizi **commit** edin (Standartlara uygun mesajlarla).
5.  Branch'inizi fork'unuza **push** edin.
6.  Ana depoya bir **Pull Request (PR)** açın.

### 🌿 Branch İsimlendirme Kuralları
Branch isimleriniz şu öneklerden biriyle başlamalıdır:
-   `feat/`: Yeni bir özellik ekleme
-   `fix/`: Bir hatayı düzeltme
-   `docs/`: Dokümantasyon güncellemeleri
-   `test/`: Test ekleme veya düzenleme
-   `ci/`: GitHub Actions veya CI yapılandırma değişiklikleri

*Örnek: `feat/jwt-rs256-migration`*

### 💬 Commit Mesajı Standartı
Projemizde **Conventional Commits** standardı uygulanmaktadır:
-   `feat`: Yeni özellik
-   `fix`: Hata düzeltme
-   `docs`: Dokümantasyon
-   `style`: Kod formatı (CSS, boşluklar vb.)
-   `refactor`: Kod iyileştirme (mantık değişmeden)
-   `test`: Test ekleme
-   `chore`: Altyapı/bağımlılık güncellemeleri

*Örnek: `feat(auth): implement refresh token blacklisting`*

### 🧪 Test Zorunluluğu
Bir PR açmadan önce, tüm testlerin geçtiğinden emin olmalısınız:
```bash
npm test
```
**Not:** Testleri geçmeyen PR'lar değerlendirmeye alınmayacaktır.

### 📜 Kod Stili ve Davranış
-   Kodunuzun temiz, okunabilir ve mevcut stili korur nitelikte olduğundan emin olun.
-   İletişimde nazik ve profesyonel olun. Topluluk her türlü seviyedeki geliştiriciye açıktır.

---

<a id="english"></a>
## 🇬🇧 English

Thank you for your interest in contributing to **CipherNone**! This project grows and improves through community participation.

### 🚀 How to Contribute
1.  **Fork** this repository.
2.  Create a new **branch** (following our naming conventions).
3.  Implement your changes and test them locally.
4.  **Commit** your changes (following our message standards).
5.  **Push** your branch to your fork.
6.  Open a **Pull Request (PR)** to the main repository.

### 🌿 Branch Naming Conventions
Branch names must start with one of the following prefixes:
-   `feat/`: Adding a new feature
-   `fix/`: Fixing a bug
-   `docs/`: Documentation updates
-   `test/`: Adding or editing tests
-   `ci/`: GitHub Actions or CI configuration changes

*Example: `feat/jwt-rs256-migration`*

### 💬 Commit Message Standards
We follow the **Conventional Commits** standard:
-   `feat`: New feature
-   `fix`: Bug fix
-   `docs`: Documentation
-   `style`: Code formatting (spacing, etc.)
-   `refactor`: Code refactoring (no logic change)
-   `test`: Adding tests
-   `chore`: Infrastructure/dependency updates

*Example: `feat(auth): implement refresh token blacklisting`*

### 🧪 Required Testing
Before opening a PR, ensure that all tests pass:
```bash
npm test
```
**Note:** PRs that do not pass local tests will not be considered for merge.

### 📜 Code Style & Conduct
-   Ensure your code is clean, readable, and consistent with the existing codebase.
-   Be polite and professional in all communications. This community is open to developers of all skill levels.

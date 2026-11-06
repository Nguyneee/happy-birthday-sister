/**
 * Main Interaction Logic & UI Orchestration
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize 3D Three.js Scene
    const scene = new BirthdayScene('canvas-container');
    window.scene3d = scene;

    // 2. State & Personalization
    const defaultData = {
        sisterName: 'Chị Gái Yêu Quý',
        senderName: 'Em Của Chị',
        customWish: 'Chúc chị tuổi 31 luôn xinh đẹp rạng rỡ, sự nghiệp thăng hoa, tiền tài rủng rỉnh và luôn ngập tràn hạnh phúc!',
        customLetter: `Hôm nay là một ngày thật đặc biệt — sinh nhật tuổi 31 của người chị tuyệt vời, xinh đẹp và ấm áp nhất trên đời! ✨\n\nTuổi 31 — độ tuổi đẹp nhất của sự chín muồi, quyến rũ, bản lĩnh và độc lập. Cảm ơn chị vì đã luôn bao dung, che chở và chia sẻ mọi vui buồn cùng em. Dù đôi khi hai chị em có chí chóe, nhưng trong lòng em, chị luôn là thần tượng và là điểm tựa vững chãi nhất.\n\nBước sang tuổi 31, em chúc chị:\n🌸 Nhan sắc ngày càng thăng hạng, luôn trẻ trung và rạng ngời như tuổi đôi mươi.\n💼 Sự nghiệp thăng hoa rực rỡ, gặt hái được mọi ước mơ và dự định.\n💰 Tiền bạc rủng rỉnh, tài lộc hanh thông, tiêu xài không cần nhìn giá!\n💖 Luôn an yên, được yêu thương, chiều chuộng và hạnh phúc trọn vẹn mỗi ngày!\n\nEm luôn tự hào và biết ơn vì được làm em của chị! Chúc mừng sinh nhật tuổi 31 của chị yêu! 🎉🎂`
    };

    let userConfig = { ...defaultData };
    try {
        const saved = localStorage.getItem('hbd_sister_config');
        if (saved) {
            userConfig = { ...defaultData, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn('LocalStorage error:', e);
    }

    // Apply config to DOM
    function applyPersonalization() {
        document.querySelectorAll('.sister-name-display').forEach(el => el.textContent = userConfig.sisterName);
        document.querySelectorAll('.sender-name-display').forEach(el => el.textContent = userConfig.senderName);
        const letterBody = document.getElementById('letter-content-text');
        if (letterBody) {
            letterBody.innerHTML = userConfig.customLetter.replace(/\n/g, '<br>');
        }
    }
    applyPersonalization();

    // 3. Intro Welcome Overlay Handlers
    const introOverlay = document.getElementById('intro-overlay');
    const openGiftBtn = document.getElementById('btn-open-gift');
    const mainHud = document.getElementById('main-hud');

    openGiftBtn.addEventListener('click', () => {
        // Unlock Web Audio & Play Melody
        if (window.birthdayAudio) {
            window.birthdayAudio.startMelody();
        }

        // Play Pop sound
        if (window.birthdayAudio) window.birthdayAudio.playPop();

        // Animate overlay dismissal
        if (typeof gsap !== 'undefined') {
            gsap.to(introOverlay, {
                opacity: 0,
                scale: 1.05,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                    introOverlay.style.display = 'none';
                    mainHud.classList.remove('opacity-0');
                    mainHud.classList.add('opacity-100');
                }
            });
        } else {
            introOverlay.style.display = 'none';
            mainHud.classList.remove('opacity-0');
        }

        // Initial soft celebratory confetti
        fireConfetti(35);
    });

    // 4. Blow Candle Interaction
    const blowBtn = document.getElementById('btn-blow-candle');
    const celebrationBanner = document.getElementById('celebration-banner');
    const actionNavbar = document.getElementById('action-navbar');
    let hasBlownCandle = false;

    function handleBlowCandle() {
        if (hasBlownCandle) {
            // Relight candle option
            scene.relightCandle();
            hasBlownCandle = false;
            blowBtn.innerHTML = `
                <span class="btn-icon">🎂</span>
                <span class="btn-text">Ước một điều ước & Thổi nến 31</span>
            `;
            return;
        }

        hasBlownCandle = true;
        scene.blowCandle();

        // Audio fanfare
        if (window.birthdayAudio) {
            window.birthdayAudio.playFanfare();
        }

        // Massive 2D Confetti cannons
        fireBigConfetti();

        // Update button text
        blowBtn.innerHTML = `
            <span class="btn-icon">✨</span>
            <span class="btn-text">Thắp lại nến 31</span>
        `;

        // Reveal Celebration Banner
        celebrationBanner.classList.remove('hidden');
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(celebrationBanner, 
                { scale: 0.7, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.8)' }
            );
        }

        // Unlock Navigation Actions
        actionNavbar.classList.remove('pointer-events-none', 'opacity-0');
        actionNavbar.classList.add('opacity-100');

        // Automatically open the Letter after a brief celebration pause
        setTimeout(() => {
            openModal('modal-letter');
        }, 1800);
    }

    blowBtn.addEventListener('click', handleBlowCandle);

    // 5. Confetti Helper Functions
    function fireConfetti(count = 50) {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: count,
                spread: 70,
                origin: { y: 0.65 },
                colors: ['#ff4081', '#ffd700', '#ba68c8', '#00e5ff', '#ffffff']
            });
        }
    }

    function fireBigConfetti() {
        if (typeof confetti !== 'function') return;

        const duration = 3.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    }

    // 6. Modal Management
    const modals = {
        'modal-letter': document.getElementById('modal-letter'),
        'modal-vouchers': document.getElementById('modal-vouchers'),
        'modal-lantern': document.getElementById('modal-lantern'),
        'modal-memories': document.getElementById('modal-memories'),
        'modal-customize': document.getElementById('modal-customize')
    };

    function openModal(modalId) {
        const modal = modals[modalId];
        if (!modal) return;
        if (window.birthdayAudio) window.birthdayAudio.playPop();

        modal.classList.remove('hidden');
        const content = modal.querySelector('.modal-content');
        if (typeof gsap !== 'undefined' && content) {
            gsap.fromTo(content,
                { scale: 0.85, opacity: 0, y: 30 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
        }
    }

    function closeModal(modalId) {
        const modal = modals[modalId];
        if (!modal) return;
        modal.classList.add('hidden');
    }

    // Attach open triggers
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-open-modal');
            openModal(target);
        });
    });

    // Attach close triggers
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-backdrop');
            if (modal) modal.classList.add('hidden');
        });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // 7. Interactive Sister Privilege Vouchers (Scratch / Claim)
    document.querySelectorAll('.voucher-card').forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('claimed')) return;
            card.classList.add('claimed');
            if (window.birthdayAudio) window.birthdayAudio.playPop();
            fireConfetti(25);

            const stamp = card.querySelector('.voucher-stamp');
            if (stamp) {
                stamp.classList.remove('hidden');
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(stamp,
                        { scale: 2.2, opacity: 0, rotation: -20 },
                        { scale: 1, opacity: 1, rotation: -12, duration: 0.35, ease: 'back.out(2)' }
                    );
                }
            }
        });
    });

    // 8. 3D Wishing Sky Lantern Sender
    const lanternInput = document.getElementById('lantern-wish-input');
    const sendLanternBtn = document.getElementById('btn-send-lantern');
    const lanternSuccessMsg = document.getElementById('lantern-success-msg');

    // Quick suggestion chips
    document.querySelectorAll('.wish-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            if (lanternInput) {
                lanternInput.value = chip.textContent.trim();
                lanternInput.focus();
            }
        });
    });

    sendLanternBtn.addEventListener('click', () => {
        const wishText = lanternInput.value.trim() || 'Chúc chị gái luôn xinh đẹp, an yên và ngập tràn hạnh phúc!';

        // Spawn 3D glowing sky lantern right in the scene!
        const posX = (Math.random() - 0.5) * 3;
        scene.spawnSkyLantern(posX, 1.8, 4.5, 0.75, true);

        // Sound & celebratory feedback
        if (window.birthdayAudio) window.birthdayAudio.playChimeNote(659.25, window.birthdayAudio.ctx ? window.birthdayAudio.ctx.currentTime : 0, 1.5, 0.35);
        fireConfetti(30);

        lanternSuccessMsg.textContent = `🏮 Đèn nguyện ước: "${wishText}" đã bay lên trời đêm 3D! Chúc mọi ước mơ của chị sớm thành hiện thực! ✨`;
        lanternSuccessMsg.classList.remove('hidden');

        // Clear input after a moment
        setTimeout(() => {
            lanternInput.value = '';
        }, 1000);
    });

    // 9. Memory Polaroid Gallery - Photo Upload Feature
    const photoUploadInput = document.getElementById('photo-upload-input');
    const polaroidContainer = document.getElementById('polaroid-grid');

    if (photoUploadInput) {
        photoUploadInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newPolaroid = document.createElement('div');
                    newPolaroid.className = 'polaroid-card animate-pop';
                    newPolaroid.style.transform = `rotate(${(Math.random() - 0.5) * 10}deg)`;
                    newPolaroid.innerHTML = `
                        <div class="polaroid-tape"></div>
                        <div class="polaroid-img-wrapper">
                            <img src="${event.target.result}" alt="Kỷ niệm đẹp" />
                        </div>
                        <p class="polaroid-caption">Khoảnh khắc đáng nhớ 💖</p>
                    `;
                    polaroidContainer.prepend(newPolaroid);
                    fireConfetti(20);
                };
                reader.readAsDataURL(file);
            });
        });
    }

    // 10. Customization Modal Logic
    const inputSisterName = document.getElementById('cfg-sister-name');
    const inputSenderName = document.getElementById('cfg-sender-name');
    const inputLetter = document.getElementById('cfg-letter');
    const saveCfgBtn = document.getElementById('btn-save-cfg');
    const resetCfgBtn = document.getElementById('btn-reset-cfg');

    // Populate current values
    function fillCustomizerInputs() {
        if (inputSisterName) inputSisterName.value = userConfig.sisterName;
        if (inputSenderName) inputSenderName.value = userConfig.senderName;
        if (inputLetter) inputLetter.value = userConfig.customLetter;
    }
    fillCustomizerInputs();

    saveCfgBtn.addEventListener('click', () => {
        userConfig.sisterName = inputSisterName.value.trim() || defaultData.sisterName;
        userConfig.senderName = inputSenderName.value.trim() || defaultData.senderName;
        userConfig.customLetter = inputLetter.value.trim() || defaultData.customLetter;

        try {
            localStorage.setItem('hbd_sister_config', JSON.stringify(userConfig));
        } catch (e) {
            console.warn(e);
        }

        applyPersonalization();
        closeModal('modal-customize');
        fireConfetti(40);
        if (window.birthdayAudio) window.birthdayAudio.playFanfare();
    });

    resetCfgBtn.addEventListener('click', () => {
        userConfig = { ...defaultData };
        try {
            localStorage.removeItem('hbd_sister_config');
        } catch (e) {}
        fillCustomizerInputs();
        applyPersonalization();
    });

    // 11. Audio Toggle Button
    const musicBtn = document.getElementById('btn-toggle-music');
    const audioWaves = document.getElementById('audio-waves');
    let isMusicPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (!window.birthdayAudio) return;
        const state = window.birthdayAudio.togglePlay();
        isMusicPlaying = state;

        if (state) {
            musicBtn.classList.add('active');
            if (audioWaves) audioWaves.classList.remove('paused');
        } else {
            musicBtn.classList.remove('active');
            if (audioWaves) audioWaves.classList.add('paused');
        }
    });

    // 12. Camera Reset / Auto-Rotate Toggle
    const rotateToggleBtn = document.getElementById('btn-toggle-rotate');
    if (rotateToggleBtn) {
        rotateToggleBtn.addEventListener('click', () => {
            scene.autoRotate = !scene.autoRotate;
            rotateToggleBtn.classList.toggle('active', scene.autoRotate);
            if (window.birthdayAudio) window.birthdayAudio.playPop();
        });
    }

    const resetCamBtn = document.getElementById('btn-reset-cam');
    if (resetCamBtn) {
        resetCamBtn.addEventListener('click', () => {
            if (scene) {
                scene.updateCameraResponsive();
            }
            if (window.birthdayAudio) window.birthdayAudio.playPop();
        });
    }

    // 13. Background Theme Switcher
    const themeBtn = document.getElementById('btn-toggle-theme');
    const themes = [
        { id: 'theme-starry', fog: 0x130722, name: 'Dạ Tiệc Sao' },
        { id: 'theme-rose', fog: 0x240718, name: 'Hoa Hồng Lãng Mạn' },
        { id: 'theme-gold', fog: 0x1f1605, name: 'Vàng Kim Quý Phái' },
        { id: 'theme-aurora', fog: 0x05161f, name: 'Cực Quang Huyền Ảo' }
    ];
    let currentThemeIdx = 0;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentThemeIdx = (currentThemeIdx + 1) % themes.length;
            const newTheme = themes[currentThemeIdx];

            // Update body class
            themes.forEach(t => document.body.classList.remove(t.id));
            document.body.classList.add(newTheme.id);

            // Update 3D fog color
            if (scene && scene.scene && scene.scene.fog) {
                scene.scene.fog.color.setHex(newTheme.fog);
            }

            if (window.birthdayAudio) window.birthdayAudio.playPop();
            fireConfetti(15);
        });
    }
});

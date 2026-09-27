document.addEventListener('DOMContentLoaded', () => {

    // Always ensure page starts at top on refresh/navigation
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // System Preloader (Per-page custom animated text)
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'flex';
        preloader.classList.remove('fade-out');
        const preloaderText = preloader.querySelector('.preloader-text');

        if (preloaderText) {
            const pageTitle = document.title;
            let step1Text = 'СИСТЕМНЕ ПРОГРАМУВАННЯ';
            let step3Text = 'ГОТОВО [100%]';

            if (pageTitle.includes('Git')) {
                step1Text = 'GIT // СИСТЕМА КОНТРОЛЮ ВЕРСІЙ';
                step3Text = 'ЗАВАНТАЖЕННЯ РЕПОЗИТОРІЮ... [100%]';
            } else if (pageTitle.includes('Linux')) {
                step1Text = 'GNU/LINUX & BASH SHELL';
                step3Text = 'ІНІЦІАЛІЗАЦІЯ КЕРНЕЛА LINUX... [100%]';
            }

            preloaderText.textContent = step1Text;
            
            setTimeout(() => {
                preloaderText.textContent = 'Дмитро Самборик • 1-КТ-23';
            }, 350);

            setTimeout(() => {
                preloaderText.textContent = step3Text;
            }, 750);
        }

        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 400);
        }, 1150);
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            link.classList.add('active');
        } else if (currentPath === '' && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });

    const certImage = document.querySelector('.certificate-img');
    const certPlaceholder = document.getElementById('cert-placeholder');

    if (certImage && certPlaceholder) {

        certImage.addEventListener('load', () => {
            certPlaceholder.style.display = 'none';
            certImage.style.display = 'block';
        });

        certImage.addEventListener('error', () => {
            certImage.style.display = 'none';
            certPlaceholder.style.display = 'flex';
        });
    }

    // Mobile Sidebar Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('mobile-open') && 
                !sidebar.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // Copy to Clipboard feature for commands
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = '✓';
                    btn.classList.add('copied');
                    showToast(`Команду "${textToCopy}" скопійовано!`);
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Copy failed:', err);
                });
            }
        });
    });

    // Toast Notification System
    function showToast(message) {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // AI Chat Widget
    const chatToggle = document.getElementById('ai-chat-toggle');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatClose = document.getElementById('ai-chat-close');
    const chatFullscreen = document.getElementById('ai-chat-fullscreen');
    const chatInput = document.getElementById('ai-chat-input');
    const chatSend = document.getElementById('ai-chat-send');
    const chatMessages = document.getElementById('ai-chat-messages');

    if (chatToggle) {
        if (chatFullscreen) {
            chatFullscreen.addEventListener('click', () => {
                chatWindow.classList.toggle('fullscreen');
                if (chatWindow.classList.contains('fullscreen')) {
                    chatFullscreen.innerHTML = '🗗';
                    chatFullscreen.title = 'Згорнути';
                } else {
                    chatFullscreen.innerHTML = '⛶';
                    chatFullscreen.title = 'На весь екран';
                }
            });
        }
        chatToggle.addEventListener('click', () => {
            if (chatWindow.classList.contains('active')) {
                chatWindow.classList.remove('active');
                setTimeout(() => chatWindow.style.display = 'none', 300);
            } else {
                chatWindow.style.display = 'flex';
                // Trigger reflow for animation
                void chatWindow.offsetWidth;
                chatWindow.classList.add('active');
                chatInput.focus();
            }
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('active');
            setTimeout(() => chatWindow.style.display = 'none', 300);
        });

        const sendMessage = async () => {
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            chatInput.value = '';

            const loadingId = addTypingIndicator();

            try {
                const pageContext = document.title.includes('Git') ? 'Git' : (document.title.includes('Linux') ? 'Linux та BASH' : 'Системне програмування');
                const apiKey = 'AQ.Ab8RN6LCMamPxxBLP8egsm7mlkxnqbDchHbS0fINHABItdOewA';
                
                let reply = '';
                if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
                    const fetchGemini = async (retryCount = 1) => {
                        try {
                            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
                                method: 'POST',
                                headers: { 
                                    'Content-Type': 'application/json',
                                    'X-goog-api-key': apiKey
                                },
                                body: JSON.stringify({
                                    contents: [{
                                        parts: [{
                                            text: `Ти є ШІ-асистентом на навчальному сайті студента Дмитра Самборика. Тема: ${pageContext}. Відповідай українською мовою коротко та з форматуванням Markdown на запитання: ${text}`
                                        }]
                                    }]
                                })
                            });

                            if (response.ok) {
                                const data = await response.json();
                                if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                                    return data.candidates[0].content.parts.map(p => p.text).filter(Boolean).join('\n');
                                }
                            } else if (response.status === 503 && retryCount > 0) {
                                // 503 Service Unavailable is temporary; retry after 700ms delay
                                await new Promise(r => setTimeout(r, 700));
                                return await fetchGemini(retryCount - 1);
                            }
                        } catch (e) {
                            console.warn('Gemini API fetch issue:', e);
                        }
                        return '';
                    };

                    reply = await fetchGemini(1);
                }

                if (!reply) {
                    // Smart Offline AI Assistant Engine (Fallback)
                    reply = generateSmartAIResponse(text, pageContext);
                }

                updateMessage(loadingId, reply);
            } catch (error) {
                const reply = generateSmartAIResponse(text, document.title);
                updateMessage(loadingId, reply);
            }
        };

        // Smart AI Assistant Response Engine
        function generateSmartAIResponse(query, context) {
            const q = query.toLowerCase().trim();

            if (q.includes('привіт') || q.includes('вітаю') || q.includes('добрий день') || q.includes('hello') || q.includes('hi') || q.includes('здоров')) {
                return `**Привіт!** 👋 Я ваш навчальний AI-асистент. 

Я можу відповісти на ваші запитання з теми **${context}**, надати довідку по командах **Git** чи **Linux CLI**, розберемо BASH-скрипти або допоможемо з орієнтуванням у курсі. Про що ви хочете дізнатися?`;
            }

            if (q.includes('python') || q.includes('пайтон') || q.includes('питон')) {
                return `### 🐍 Розділ: **Python у Системному Програмуванні**
* **Статус розділу:** *Заплановано* ⏳
* **Ключові теми розділу:**
  - Системні модулі (\`sys\`, \`os\`, \`subprocess\`, \`shutil\`).
  - Міжпроцесна взаємодія (**IPC**) та сокети (\`socket\`, \`asyncio\`).
  - Розробка консольних CLI-утиліт та скриптів автоматизації.`;
            }

            if (q.includes('git') || q.includes('коміт') || q.includes('commit') || q.includes('push') || q.includes('pull') || q.includes('гілк') || q.includes('branch') || q.includes('clone') || q.includes('init') || q.includes('status') || q.includes('merge') || q.includes('checkout') || q.includes('switch')) {
                return `### 💡 Довідка з **Git (Системи контролю версій)**:
* **Основні команди:**
  - \`git init\` — ініціалізація нового репозиторію.
  - \`git clone <url>\` — клонування віддаленого репозиторію.
  - \`git status\` — перевірка стану робочого дерева.
  - \`git add .\` — додати всі зміни в індекс (Staging Area).
  - \`git commit -m "msg"\` — зафіксувати коміт.
  - \`git switch <branch>\` — перемкнутися на гілку.
  - \`git merge <branch>\` — об'єднати гілку з поточною.
  - \`git push origin main\` — відправити коміти на сервер.`;
            }

            if (q.includes('linux') || q.includes('bash') || q.includes('команд') || q.includes('термінал') || q.includes('pwd') || q.includes('ls') || q.includes('cd') || q.includes('mkdir') || q.includes('rm') || q.includes('cp') || q.includes('mv') || q.includes('echo') || q.includes('touch') || q.includes('history') || q.includes('дистрибутив') || q.includes('ubuntu') || q.includes('debian') || q.includes('arch')) {
                return `### 🐧 Довідка з **Linux CLI & BASH**:
* **10 Базових команд Linux:**
  - \`pwd\` — відобразити поточний каталог.
  - \`echo <text>\` — вивести текст або значення змінної.
  - \`ls -la\` — переглянути детальний вміст каталогу (включаючи приховані файли).
  - \`cd <path>\` — змінити робочу директорію.
  - \`touch <file>\` — створити порожній файл.
  - \`mkdir -p <path>\` — створити нову папку з ланцюжком батьківських папок.
  - \`cp -r <src> <dest>\` — скопіювати файл або папку.
  - \`mv <src> <dest>\` — перемістити або перейменувати файл.
  - \`rm -rf <path>\` — видалити файл/папку примусово.
  - \`history\` — список виконаних команд Shell.
* **Скрипт авторизації:** перегляньте інтерактивний термінал авторизації на сторінці **Linux & BASH**!`;
            }

            if (q.includes('хто викладав') || q.includes('хто створив') || q.includes('студент') || q.includes('автор') || q.includes('самборик') || q.includes('група')) {
                return `🎓 **Інформація про автора та курс:**
* **Студент:** Дмитро Самборик (Група 1-КТ-23)
* **Дисципліна:** *Системне програмування*
* **Призначення:** Академічне портфоліо навчальних матеріалів, лаб та сертифікацій.
* **Технології:** Розроблено з використанням **Google Gemini AntiGravity**.`;
            }

            if (q.includes('допомога') || q.includes('help') || q.includes('що ти вмієш') || q.includes('теми')) {
                return `### 🤖 Меню допомоги AI Асистента:
Я можу допомогти вам з наступних питань:
1. 📦 **Git:** пояснення команд, коміти, гілки, репозиторії.
2. 🐧 **Linux & BASH:** команди CLI, дистрибутиви, скрипти авторизації.
3. 🐍 **Python:** системне програмування та автоматизація.
4. 🎓 **Портфоліо:** інформація про студента та дисципліну.

Напишіть будь-яке запитання з цих тем!`;
            }

            return `### 🤖 AI Відповідь
Дякую за запитання стосовно **${context}**! 

Зараз у нас доступні розділи:
- **Git** (Системи контролю версій)
- **Linux & BASH** (ОС GNU/Linux та скрипти)
- **Python** (Заплановано)

Запитайте мене про конкретні команди, наприклад: \`git commit\`, \`ls -la\`, \`дистрибутиви\` або \`автор\`!`;
        }

        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        let messageCounter = 0;
        
        function addTypingIndicator() {
            const id = 'msg-' + messageCounter++;
            const msgDiv = document.createElement('div');
            msgDiv.id = id;
            msgDiv.className = `chat-message ai message-appear typing-indicator`;
            msgDiv.innerHTML = '<span></span><span></span><span></span>';
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return id;
        }

        function formatMarkdownFallback(text) {
            let html = text;
            html = html.replace(/### (.*?)\n/g, '<h4 style="color:var(--text-cyan);margin-bottom:0.4rem;">$1</h4>');
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
            html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
            html = html.replace(/^\* (.*?)$/gm, '• $1<br>');
            html = html.replace(/^- (.*?)$/gm, '• $1<br>');
            html = html.replace(/\n\n/g, '<br><br>');
            html = html.replace(/\n/g, '<br>');
            return html;
        }

        function addMessage(text, sender) {
            const id = 'msg-' + messageCounter++;
            const msgDiv = document.createElement('div');
            msgDiv.id = id;
            msgDiv.className = `chat-message ${sender} message-appear`;
            
            if (sender === 'ai') {
                if (window.marked && typeof window.marked.parse === 'function') {
                    msgDiv.innerHTML = marked.parse(text);
                } else {
                    msgDiv.innerHTML = formatMarkdownFallback(text);
                }
            } else {
                msgDiv.textContent = text;
            }
            
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return id;
        }

        function updateMessage(id, text) {
            const msgDiv = document.getElementById(id);
            if (msgDiv) {
                msgDiv.classList.remove('typing-indicator');
                if (window.marked && typeof window.marked.parse === 'function') {
                    msgDiv.innerHTML = marked.parse(text);
                } else {
                    msgDiv.innerHTML = formatMarkdownFallback(text);
                }
            }
        }
        
        setTimeout(() => {
            const pageContext = document.title.includes('Git') ? 'про Git' : (document.title.includes('Linux') ? 'про Linux та BASH' : 'про системне програмування');
            addMessage(`Привіт! Я AI-асистент. Запитуйте мене будь-що ${pageContext}.`, 'ai');
        }, 500);
    }

    // Interactive Terminal Simulator for Linux BASH Auth Script
    const termInput = document.getElementById('term-input');
    const termOutput = document.getElementById('term-output');
    const termPrompt = document.getElementById('term-prompt');
    const termBody = document.getElementById('terminal-body');

    if (termInput && termOutput && termPrompt) {
        let currentStep = 0; // 0 = prompt username, 1 = prompt password
        let enteredUsername = '';
        let attemptsLeft = 3;
        const VALID_USER = 'admin';
        const VALID_PASS = 'secret123';

        termBody.addEventListener('click', () => termInput.focus());

        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = termInput.value;
                termInput.value = '';

                if (currentStep === 0) {
                    enteredUsername = val.trim();
                    const line = document.createElement('div');
                    line.className = 'term-line';
                    line.textContent = `Введіть ім'я користувача: ${enteredUsername}`;
                    termOutput.appendChild(line);

                    termPrompt.textContent = 'Введіть пароль: ';
                    termInput.type = 'password';
                    currentStep = 1;
                } else if (currentStep === 1) {
                    const enteredPassword = val;
                    const linePass = document.createElement('div');
                    linePass.className = 'term-line';
                    linePass.textContent = `Введіть пароль: ********`;
                    termOutput.appendChild(linePass);

                    if (enteredUsername === VALID_USER && enteredPassword === VALID_PASS) {
                        const lineSuccess = document.createElement('div');
                        lineSuccess.className = 'term-line term-success';
                        lineSuccess.textContent = `[УСПІХ] Авторизація успішна! Ласкаво просимо, ${enteredUsername}.`;
                        termOutput.appendChild(lineSuccess);

                        const lineExit = document.createElement('div');
                        lineExit.className = 'term-line term-muted';
                        lineExit.textContent = `[Процес завершено з кодом 0]`;
                        termOutput.appendChild(lineExit);

                        termPrompt.textContent = 'bash-5.2$ ';
                        termInput.type = 'text';
                        termInput.disabled = true;
                    } else {
                        attemptsLeft--;
                        const lineErr = document.createElement('div');
                        lineErr.className = 'term-line term-error';
                        lineErr.textContent = `[ПОМИЛКА] Невірне ім'я користувача або пароль.`;
                        termOutput.appendChild(lineErr);

                        if (attemptsLeft > 0) {
                            const lineLeft = document.createElement('div');
                            lineLeft.className = 'term-line term-warning';
                            lineLeft.textContent = `Залишилось спроб: ${attemptsLeft}`;
                            termOutput.appendChild(lineLeft);

                            const lineSep = document.createElement('div');
                            lineSep.className = 'term-line term-muted';
                            lineSep.textContent = `------------------------------------------`;
                            termOutput.appendChild(lineSep);

                            termPrompt.textContent = 'Введіть ім\'я користувача: ';
                            termInput.type = 'text';
                            currentStep = 0;
                        } else {
                            const lineLock = document.createElement('div');
                            lineLock.className = 'term-line term-error';
                            lineLock.textContent = `[БЛОКУВАННЯ] Перевищено кількість спроб. Доступ заборонено.`;
                            termOutput.appendChild(lineLock);

                            const lineExit = document.createElement('div');
                            lineExit.className = 'term-line term-muted';
                            lineExit.textContent = `[Процес завершено з кодом 1]`;
                            termOutput.appendChild(lineExit);

                            termPrompt.textContent = 'bash-5.2$ ';
                            termInput.type = 'text';
                            termInput.disabled = true;
                        }
                    }
                }
                termBody.scrollTop = termBody.scrollHeight;
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {

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
                const pageContext = document.title.includes('Git') ? 'Git та системи контролю версій' : 'Системне програмування загалом';
                
                const apiKey = 'YOUR_API_KEY_HERE'; // TODO: Replace with actual API key or fetch securely
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Ти є ШІ-асистентом на навчальному сайті студента (Дмитро Самборик). Тема сторінки: ${pageContext}. Відповідай українською мовою коротко, змістовно та по суті на наступне запитання користувача: ${text}. Використовуй форматування Markdown для гарного вигляду.`
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    throw new Error(`Помилка API: ${response.status}`);
                }

                const data = await response.json();
                const reply = data.candidates[0].content.parts[0].text;
                
                updateMessage(loadingId, reply);
                
            } catch (error) {
                console.error('Chat error:', error);
                updateMessage(loadingId, 'Вибачте, сталася помилка під час з\'єднання з AI. Перевірте консоль або спробуйте пізніше.');
            }
        };

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

        function addMessage(text, sender) {
            const id = 'msg-' + messageCounter++;
            const msgDiv = document.createElement('div');
            msgDiv.id = id;
            msgDiv.className = `chat-message ${sender} message-appear`;
            
            if (sender === 'ai' && window.marked) {
                msgDiv.innerHTML = marked.parse(text);
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
                if (window.marked) {
                    msgDiv.innerHTML = marked.parse(text);
                } else {
                    msgDiv.textContent = text;
                }
                // Не прокручуємо до кінця, щоб користувач міг читати з початку великого повідомлення
            }
        }
        
        setTimeout(() => {
            const pageContext = document.title.includes('Git') ? 'про Git' : 'про системне програмування';
            addMessage(`Привіт! Я AI-асистент. Запитуйте мене будь-що ${pageContext}.`, 'ai');
        }, 500);
    }
});

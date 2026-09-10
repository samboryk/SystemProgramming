/* ==========================================================================
   Інтерактивна логіка сайту: Теми, Меню, Копіювання команд, Сертифікат
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Копіювання команд у буфер обміну
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const codeText = button.getAttribute('data-code');
      if (codeText) {
        navigator.clipboard.writeText(codeText).then(() => {
          const originalText = button.textContent;
          button.textContent = 'Скопійовано! ✓';
          button.style.backgroundColor = '#2ea44f';
          button.style.borderColor = '#2ea44f';
          button.style.color = '#ffffff';

          setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.borderColor = '';
            button.style.color = '';
          }, 2000);
        }).catch(err => {
          console.error('Не вдалося скопіювати:', err);
        });
      }
    });
  });

  // 2. Мобільне бічне меню (гамбургер)
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const sidebar = document.getElementById('sidebar');
  if (mobileToggleBtn && sidebar) {
    mobileToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Закриття меню при кліку на посилання на мобільному
    document.querySelectorAll('.subnav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          sidebar.classList.remove('open');
        }
      });
    });
  }

  // 3. Робота з темами (вибір та додавання нових)
  const topicsList = document.getElementById('topicsList');
  const btnAddTopic = document.getElementById('btnAddTopic');
  const modalAddTopic = document.getElementById('modalAddTopic');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const formAddTopic = document.getElementById('formAddTopic');
  const topicTitleInput = document.getElementById('topicTitleInput');

  const gitContainer = document.getElementById('gitTopicContainer');
  const customTopicContainer = document.getElementById('customTopicContainer');
  const currentTopicDisplayTitle = document.getElementById('currentTopicDisplayTitle');
  const currentTopicDesc = document.getElementById('currentTopicDesc');

  // Завантаження збережених тем із LocalStorage
  let customTopics = JSON.parse(localStorage.getItem('study_topics')) || [];

  function renderCustomTopics() {
    // Видаляємо всі раніше згенеровані кастомні теми зі списку (залишаючи першу - Git)
    const existingCustomItems = topicsList.querySelectorAll('.custom-topic-item');
    existingCustomItems.forEach(el => el.remove());

    customTopics.forEach((topic, index) => {
      const li = document.createElement('li');
      li.className = 'topic-item custom-topic-item';
      li.dataset.index = index;
      li.innerHTML = `
        <span class="topic-name">📖 ${escapeHtml(topic.title)}</span>
        <span class="topic-badge custom">Нова</span>
      `;

      li.addEventListener('click', () => {
        selectCustomTopic(index);
      });

      topicsList.appendChild(li);
    });
  }

  function setActiveTopicUI(element) {
    document.querySelectorAll('.topic-item').forEach(item => item.classList.remove('active'));
    if (element) {
      element.classList.add('active');
    }
  }

  // Вибір теми "Git" (головної)
  const gitTopicItem = document.getElementById('topicGitItem');
  if (gitTopicItem) {
    gitTopicItem.addEventListener('click', () => {
      setActiveTopicUI(gitTopicItem);
      gitContainer.style.display = 'block';
      customTopicContainer.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.innerWidth <= 900) sidebar.classList.remove('open');
    });
  }

  // Вибір користувацької теми
  function selectCustomTopic(index) {
    const topic = customTopics[index];
    if (!topic) return;

    const allCustomItems = topicsList.querySelectorAll('.custom-topic-item');
    setActiveTopicUI(allCustomItems[index]);

    gitContainer.style.display = 'none';
    customTopicContainer.style.display = 'block';
    currentTopicDisplayTitle.textContent = topic.title;
    currentTopicDesc.textContent = topic.description || 'Навчальні матеріали та лабораторні завдання до цієї теми перебувають на стадії опрацювання.';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.innerWidth <= 900) sidebar.classList.remove('open');
  }

  // Модальне вікно: відкриття / закриття
  if (btnAddTopic && modalAddTopic) {
    btnAddTopic.addEventListener('click', () => {
      modalAddTopic.classList.add('active');
      topicTitleInput.focus();
    });

    const closeModal = () => {
      modalAddTopic.classList.remove('active');
      formAddTopic.reset();
    };

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    // Закриття кліком поза вікном
    modalAddTopic.addEventListener('click', (e) => {
      if (e.target === modalAddTopic) {
        closeModal();
      }
    });

    // Додавання нової теми
    formAddTopic.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = topicTitleInput.value.trim();
      const description = document.getElementById('topicDescInput').value.trim();

      if (!title) return;

      const newTopic = {
        title,
        description: description || 'Матеріали до теми готуються.'
      };

      customTopics.push(newTopic);
      localStorage.setItem('study_topics', JSON.stringify(customTopics));

      renderCustomTopics();
      closeModal();

      // Автоматично вибираємо щойно додану тему
      selectCustomTopic(customTopics.length - 1);
    });
  }

  // Кнопка повернення до Git з блоку заглушки
  const btnBackToGit = document.getElementById('btnBackToGit');
  if (btnBackToGit && gitTopicItem) {
    btnBackToGit.addEventListener('click', () => {
      gitTopicItem.click();
    });
  }

  // 4. Функціонал сертифіката: завантаження власного зображення та редагування імені
  const certFileInput = document.getElementById('certFileInput');
  const certImagePreview = document.getElementById('certImagePreview');
  const certTemplateCard = document.getElementById('certTemplateCard');
  const btnResetCert = document.getElementById('btnResetCert');
  const btnEditCertName = document.getElementById('btnEditCertName');
  const certStudentName = document.getElementById('certStudentName');

  // Збережене ім'я студента
  const savedStudentName = localStorage.getItem('cert_student_name');
  if (savedStudentName && certStudentName) {
    certStudentName.textContent = savedStudentName;
  }

  if (btnEditCertName && certStudentName) {
    btnEditCertName.addEventListener('click', () => {
      const currentName = certStudentName.textContent;
      const newName = prompt('Введіть ваше прізвище та ім\'я для сертифіката:', currentName);
      if (newName && newName.trim() !== '') {
        certStudentName.textContent = newName.trim();
        localStorage.setItem('cert_student_name', newName.trim());
      }
    });
  }

  if (certFileInput) {
    certFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          certImagePreview.src = evt.target.result;
          certImagePreview.style.display = 'block';
          certTemplateCard.style.display = 'none';
          if (btnResetCert) btnResetCert.style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnResetCert) {
    btnResetCert.addEventListener('click', () => {
      certImagePreview.src = '';
      certImagePreview.style.display = 'none';
      certTemplateCard.style.display = 'block';
      certFileInput.value = '';
      btnResetCert.style.display = 'none';
    });
  }

  // Допоміжна функція для екранування тексту
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Первинний рендеринг збережених тем
  renderCustomTopics();
});

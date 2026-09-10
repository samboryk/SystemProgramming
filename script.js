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
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
});
document.querySelectorAll('section').forEach(section => observer.observe(section));

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const code = btn.nextElementSibling.innerText;
        navigator.clipboard.writeText(code).then(() => {
            btn.innerText = '已複製';
            setTimeout(() => btn.innerText = '複製', 1500);
        }).catch(err => {
            console.error('複製失敗', err);
        });
    });
});
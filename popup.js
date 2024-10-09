document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const emojiContainer = document.getElementById('emoji-container');
    const toast = document.getElementById('toast');

    // 초기 탭 및 이모지 로드
    loadEmojis('smileys');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-category');
            loadEmojis(category);
        });
    });

    function loadEmojis(category) {
        emojiContainer.innerHTML = ''; // 기존 이모지 비우기
        const emojis = emojiData[category];
        emojis.forEach(emoji => {
            const span = document.createElement('span');
            span.className = 'emoji';
            span.textContent = emoji;
            span.addEventListener('click', () => {
                copyToClipboard(emoji);
            });
            emojiContainer.appendChild(span);
        });
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast();
            }).catch(err => {
                console.error('클립보드 복사 실패:', err);
            });
        }
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});

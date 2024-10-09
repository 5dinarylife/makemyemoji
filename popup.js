document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const emojiContainer = document.getElementById('emoji-container');
    const frequentEmojisContainer = document.getElementById('frequent-emojis');
    const toast = document.getElementById('toast');

    // 초기 로딩 시 자주 쓰는 이모지 표시
    loadFrequentEmojis();
    loadEmojis('smileys');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-category');
            loadEmojis(category);
        });
    });

    function loadFrequentEmojis() {
        frequentEmojisContainer.innerHTML = '';
        const frequentEmojis = getFrequentEmojis();
        if (frequentEmojis.length > 0) {
            frequentEmojis.forEach(emoji => {
                const span = document.createElement('span');
                span.className = 'emoji';
                span.textContent = emoji;
                span.addEventListener('click', () => {
                    copyToClipboard(emoji);
                });
                frequentEmojisContainer.appendChild(span);
            });
        } else {
            frequentEmojisContainer.innerHTML = '<div class="no-frequent">등록된 자주 쓰는 이모지가 없습니다.</div>';
        }
    }

    function loadEmojis(category) {
        emojiContainer.innerHTML = ''; // 기존 이모지 비우기
        const emojis = emojiData[category];
        emojis.forEach(emoji => {
            const span = document.createElement('span');
            span.className = 'emoji';
            span.textContent = emoji;

            // 클릭 이벤트 (복사 기능)
            span.addEventListener('click', () => {
                copyToClipboard(emoji);
            });

            // 길게 클릭 (자주 쓰는 이모지 등록 기능)
            let pressTimer;
            span.addEventListener('mousedown', () => {
                pressTimer = setTimeout(() => {
                    addEmojiToFrequent(emoji);
                    showToast('이모지가 자주 쓰는 목록에 추가되었습니다!');
                }, 1000); // 1초 이상 눌렀을 때 등록
            });

            span.addEventListener('mouseup', () => {
                clearTimeout(pressTimer);
            });

            span.addEventListener('mouseleave', () => {
                clearTimeout(pressTimer);
            });

            emojiContainer.appendChild(span);
        });
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('이모지가 클립보드에 복사되었습니다!');
            }).catch(err => {
                console.error('클립보드 복사 실패:', err);
            });
        }
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function getFrequentEmojis() {
        const frequentEmojis = localStorage.getItem('frequentEmojis');
        return frequentEmojis ? JSON.parse(frequentEmojis) : [];
    }

    function addEmojiToFrequent(emoji) {
        let frequentEmojis = getFrequentEmojis();
        if (!frequentEmojis.includes(emoji)) {
            frequentEmojis.push(emoji);
            localStorage.setItem('frequentEmojis', JSON.stringify(frequentEmojis));
            loadFrequentEmojis(); // 자주 쓰는 이모지 새로고침
        }
    }
});

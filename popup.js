document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const emojiContainer = document.getElementById('emoji-container');
    const frequentEmojisContainer = document.getElementById('frequent-emojis');
    const clearButton = document.getElementById('clear-frequent');
    const toast = document.getElementById('toast');

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

    clearButton.addEventListener('click', () => {
        localStorage.removeItem('frequentEmojis');
        loadFrequentEmojis();
        showToast('모든 자주 쓰는 이모지가 삭제되었습니다!');
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

                // 길게 눌렀을 때 삭제
                let pressTimer;
                span.addEventListener('mousedown', () => {
                    pressTimer = setTimeout(() => {
                        removeEmojiFromFrequent(emoji);
                        showToast('이모지가 자주 쓰는 목록에서 삭제되었습니다!');
                    }, 1000); 
                });

                span.addEventListener('mouseup', () => {
                    clearTimeout(pressTimer);
                });

                span.addEventListener('mouseleave', () => {
                    clearTimeout(pressTimer);
                });

                frequentEmojisContainer.appendChild(span);
            });
        } else {
            frequentEmojisContainer.innerHTML = '<div class="no-frequent">등록된 자주 쓰는 이모지가 없습니다.</div>';
        }
    }

    function loadEmojis(category) {
        emojiContainer.innerHTML = ''; 
        const emojis = emojiData[category];
        emojis.forEach(emoji => {
            const span = document.createElement('span');
            span.className = 'emoji';
            span.textContent = emoji;

            span.addEventListener('click', () => {
                copyToClipboard(emoji);
            });

            let pressTimer;
            span.addEventListener('mousedown', () => {
                pressTimer = setTimeout(() => {
                    addEmojiToFrequent(emoji);
                    showToast('이모지가 자주 쓰는 목록에 추가되었습니다!');
                }, 1000); 
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
            loadFrequentEmojis();
        }
    }

    function removeEmojiFromFrequent(emoji) {
        let frequentEmojis = getFrequentEmojis();
        frequentEmojis = frequentEmojis.filter(e => e !== emoji);
        localStorage.setItem('frequentEmojis', JSON.stringify(frequentEmojis));
        loadFrequentEmojis();
    }
});

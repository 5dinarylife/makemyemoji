document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const emojiContainer = document.getElementById('emoji-container');
    const frequentEmojisContainer = document.getElementById('frequent-emojis');
    const clearButton = document.getElementById('clear-frequent');
    const toast = document.getElementById('toast');

    // 초기 탭을 'smileys'로 설정하고, 자주 쓰는 이모지를 로드합니다.
    loadFrequentEmojis();
    loadEmojis('smileys'); // 초기 로드 시 카테고리가 'smileys'로 설정된 부분

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-category');
            loadEmojis(category); // 카테고리에 맞는 이모지를 로드
        });
    });

    clearButton.addEventListener('click', () => {
        localStorage.removeItem('frequentEmojis');
        loadFrequentEmojis();
        showToast('등록된 모든 이모지가 삭제되었습니다!');
    });

   
    function loadFrequentEmojis() {
    const noFrequentMessage = document.getElementById('no-frequent-message');
    const frequentEmojis = getFrequentEmojis();

    if (frequentEmojis.length > 0) {
        frequentEmojisContainer.innerHTML = '';
        noFrequentMessage.style.display = 'none'; // 메시지 숨기기
        frequentEmojisContainer.style.display = 'grid'; // 그리드 표시

        frequentEmojis.forEach(emoji => {
            const span = document.createElement('span');
            span.className = 'emoji';
            span.textContent = emoji;
            span.addEventListener('click', () => {
                copyToClipboard(emoji);
            });

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
        frequentEmojisContainer.style.display = 'none';
        noFrequentMessage.style.display = 'flex'; // 메시지 표시
    }
}



    function loadEmojis(category) {
        emojiContainer.innerHTML = ''; 
        if (!emojiData[category]) {
            console.error(`카테고리 '${category}'에 해당하는 이모지가 없습니다.`);
            return;
        }

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
                    showToast('이모지가 목록에 등록되었습니다!');
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

// 이모지 검색 기능
document.getElementById('emoji-search').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const emojis = document.querySelectorAll('.emoji');
    
    emojis.forEach(emoji => {
        if (emoji.textContent.toLowerCase().includes(query)) {
            emoji.style.display = 'inline-block'; // 검색어에 맞는 이모지 표시
        } else {
            emoji.style.display = 'none'; // 검색어에 맞지 않는 이모지 숨김
        }
    });
});

// 번역 데이터
const translations = {
    ko: {
        title: "자주 쓰는 이모지",
        deleteButton: "모두 삭제",
        searchPlaceholder: "이모지 검색...",
    },
    en: {
        title: "Frequently Used Emojis",
        deleteButton: "Clear All",
        searchPlaceholder: "Search emoji...",
    },
    es: {
        title: "Emojis usados frecuentemente",
        deleteButton: "Borrar todo",
        searchPlaceholder: "Buscar emoji...",
    }
};

// 언어 변경 기능
document.getElementById('language-select').addEventListener('change', function () {
    const selectedLanguage = this.value;

    document.getElementById('frequent-title').textContent = translations[selectedLanguage].title;
    document.getElementById('clear-frequent').textContent = translations[selectedLanguage].deleteButton;
    document.getElementById('emoji-search').placeholder = translations[selectedLanguage].searchPlaceholder;
});


document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const emojiContainer = document.getElementById('emoji-container');
    const frequentEmojisContainer = document.getElementById('frequent-emojis');
    const clearButton = document.getElementById('clear-frequent');
    const toast = document.getElementById('toast');
    const searchInput = document.getElementById('emoji-search'); // 검색창

    // 기본 이모지 렌더링 함수
    function renderEmojis(emojis) {
        emojiContainer.innerHTML = ''; // 기존 내용을 비움
        emojis.forEach(emojiObj => {
            const emojiElement = document.createElement('span');
            emojiElement.classList.add('emoji');
            emojiElement.textContent = emojiObj.emoji; // `emoji` 속성을 사용하여 이모지 출력
            emojiElement.addEventListener('click', () => {
                copyToClipboard(emojiObj.emoji);
            });
            emojiContainer.appendChild(emojiElement);
        });
    }

    // 선택한 카테고리의 이모지를 로드하는 함수
    function loadEmojis(category) {
        if (!emojiData[category]) {
            console.error(`카테고리 '${category}'에 해당하는 이모지가 없습니다.`);
            return;
        }
        renderEmojis(emojiData[category]);
    }

    // 검색 기능
    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const allEmojis = Object.values(emojiData).flat(); // 모든 카테고리의 이모지를 배열로 병합
        const filteredEmojis = allEmojis.filter(emojiObj => 
            emojiObj.tags.some(tag => tag.includes(query))
        );
        renderEmojis(filteredEmojis); // 필터링된 이모지 렌더링
    });

    // 자주 쓰는 이모지를 로드하는 함수
    function loadFrequentEmojis() {
        const noFrequentMessage = document.getElementById('no-frequent-message');
        const frequentEmojis = getFrequentEmojis();

        if (frequentEmojis.length > 0) {
            frequentEmojisContainer.innerHTML = '';
            noFrequentMessage.style.display = 'none';
            frequentEmojisContainer.style.display = 'grid';

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
            noFrequentMessage.style.display = 'flex';
        }
    }

    // 클립보드에 이모지를 복사하는 함수
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

    // 탭 클릭 시 해당 카테고리 이모지를 불러오는 이벤트 추가
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            loadEmojis(category);

            // 탭 활성화 상태 업데이트
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // 기본으로 감정 이모지를 로드
    loadEmojis('smileys');
    loadFrequentEmojis();
});

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const emojiContainer = document.getElementById('emoji-container');
    const frequentEmojisContainer = document.getElementById('frequent-emojis');
    const clearButton = document.getElementById('clear-frequent');
    const toast = document.getElementById('toast');

    // 자주 쓰는 이모지 로드
    loadFrequentEmojis();

    // 카테고리 탭 클릭 이벤트
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            loadEmojis(category);
        });
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

    // 모두 삭제 버튼 클릭 이벤트
    clearButton.addEventListener('click', () => {
        localStorage.removeItem('frequentEmojis');
        loadFrequentEmojis();
        showToast('등록된 모든 이모지가 삭제되었습니다!');
    });

    // 자주 쓰는 이모지 로드 함수
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

                // 길게 눌러서 자주 쓰는 목록에서 제거
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

    // 이모지 카테고리 로드 함수
    function loadEmojis(category) {
        emojiContainer.innerHTML = ''; 
        if (!emojiData[category]) {
            console.error(`카테고리 '${category}'에 해당하는 이모지가 없습니다.`);
            return;
        }

        const emojis = emojiData[category];
        emojis.forEach(emojiObj => {
            const span = document.createElement('span');
            span.className = 'emoji';
            span.textContent = emojiObj.emoji; // 이모지 데이터에서 'emoji' 속성 사용

            span.addEventListener('click', () => {
                copyToClipboard(emojiObj.emoji);
            });

            // 길게 눌러서 자주 쓰는 목록에 추가
            let pressTimer;
            span.addEventListener('mousedown', () => {
                pressTimer = setTimeout(() => {
                    addEmojiToFrequent(emojiObj.emoji);
                    showToast('이모지가 자주 쓰는 목록에 등록되었습니다!');
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

    // 클립보드 복사 함수
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('이모지가 클립보드에 복사되었습니다!');
            }).catch(err => {
                console.error('클립보드 복사 실패:', err);
            });
        }
    }

    // 자주 쓰는 이모지 로드 함수
    function getFrequentEmojis() {
        const frequentEmojis = localStorage.getItem('frequentEmojis');
        return frequentEmojis ? JSON.parse(frequentEmojis) : [];
    }

    // 자주 쓰는 이모지에 추가
    function addEmojiToFrequent(emoji) {
        let frequentEmojis = getFrequentEmojis();
        if (!frequentEmojis.includes(emoji)) {
            frequentEmojis.push(emoji);
            localStorage.setItem('frequentEmojis', JSON.stringify(frequentEmojis));
            loadFrequentEmojis();
        }
    }

    // 자주 쓰는 이모지에서 제거
    function removeEmojiFromFrequent(emoji) {
        let frequentEmojis = getFrequentEmojis();
        frequentEmojis = frequentEmojis.filter(e => e !== emoji);
        localStorage.setItem('frequentEmojis', JSON.stringify(frequentEmojis));
        loadFrequentEmojis();
    }

    // 토스트 메시지 표시 함수
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});

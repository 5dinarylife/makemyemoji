document.addEventListener('DOMContentLoaded', function() {
    // 이모지 클릭 이벤트 처리
    document.querySelectorAll('.emoji').forEach(emoji => {
        emoji.addEventListener('click', function() {
            const emojiText = emoji.textContent;
            copyToClipboard(emojiText);
            alert('이모지가 클립보드에 복사되었습니다: ' + emojiText);
        });
    });

    // 클립보드 복사 기능
    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }
});

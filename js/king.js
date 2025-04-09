document.addEventListener('DOMContentLoaded', function() {
    const footnotes = document.querySelectorAll('.footref');

    footnotes.forEach(footnote => {
        const footnoteId = footnote.getAttribute('href').substring(1); // 获取脚注ID
        const footnoteContent = document.getElementById(footnoteId).nextElementSibling.innerText;

        // 创建预览元素
        const preview = document.createElement('div');
        preview.className = 'footnote-preview';
        preview.innerText = footnoteContent;

        // 将预览元素插入到脚注链接后面
        footnote.insertAdjacentElement('afterend', preview);

        // 设置预览元素的位置
        footnote.addEventListener('mousemove', function(e) {
            const rect = footnote.getBoundingClientRect();
            preview.style.top = `${e.clientY - rect.top + window.scrollY}px`;
            preview.style.left = `${e.clientX - rect.left + window.scrollX}px`;
        });
    });
});

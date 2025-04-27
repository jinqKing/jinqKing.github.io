console.log('folding')
document.addEventListener('DOMContentLoaded', function () {
    const headings = document.querySelectorAll('h3, h4');
    headings.forEach(function (heading) {
        // 添加折叠图标
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-chevron-down');
        heading.prepend(icon);
        heading.classList.add('collapsed');

        // 为标题添加点击事件
        heading.addEventListener('click', function () {
            const content = this.nextElementSibling;
            if (content.classList.contains('collapsible-content')) {
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    this.classList.remove('collapsed');
                    this.classList.add('expanded');
                } else {
                    content.style.display = 'none';
                    this.classList.remove('expanded');
                    this.classList.add('collapsed');
                }
            }
        });
    });
    console.log('folded')
});

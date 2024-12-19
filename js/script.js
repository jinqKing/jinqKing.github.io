

// 定义一个数组，包含所有需要加载的外部脚本
var scriptsToLoad = [
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    // 你可以在这里添加更多的脚本URL
];

// 定义一个函数来动态加载这些脚本
function loadScripts(scripts) {
    scripts.forEach(function(src) {
        var script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script);
    });
}

// 调用函数加载所有的脚本
loadScripts(scriptsToLoad);


function addSidenotes() {
  let references = document.querySelectorAll('.footref');
  references.forEach((ref) => {
    let sidenote = document.createElement('aside');
    let footdef = document.querySelector("#fn\\." + ref.innerText).closest('.footdef');
    let footnoteText = footdef.firstElementChild.innerText + ". " +
        footdef.lastElementChild.innerHTML;
    sidenote.classList.add('sidenote');
    sidenote.innerHTML = footnoteText.replace("\n", "");
    // ref.parentElement.nextElementSibling.after(sidenote);
  });
}

function tocBasicDisplay(){
    if (window.matchMedia("(max-width: 780px)").matches) {
    const toc = document.getElementById('table-of-contents');
    const textToc = document.getElementById('text-table-of-contents');
    toc.addEventListener('click', function() {
        if (textToc.style.display === 'block') {
            textToc.style.display = 'none';
            toc.style.width = '8%';
	    console.log("none");
        } else {
            textToc.style.display = 'block';
            toc.style.width = '80%';
	    console.log("block");
        }
    })}
}

function collapsePreAddHead() {
    const containers = document.querySelectorAll('.collapsible');
    containers.forEach(container => {
        // 检查是否已添加 header，避免重复添加
        if (!container.querySelector('.collapsible-header')) {
            // 创建并添加折叠按钮
            const header = document.createElement('div');
            header.className = 'collapsible-header';
            header.textContent = '点击展开/折叠 Expand/Collapse';
            container.insertBefore(header, container.firstChild);
        }
        // 确保内容被包裹在 .collapsible-content 中
        let content = container.querySelector('.collapsible-content');
        if (!content) {
            content = document.createElement('div');
            content.className = 'collapsible-content';
            while (container.childNodes.length > 1) {
                content.appendChild(container.childNodes[1]); // 移动所有子节点到 content 中
            }
            container.appendChild(content);
        }
        // 设置点击事件
        const header = container.querySelector('.collapsible-header');
        header.addEventListener('click', function () {
            const isOpen = container.classList.toggle('show');
            if (isOpen) {
                content.style.maxHeight = content.scrollHeight + 'px'; // 展开
            } else {
                content.style.maxHeight = null; // 折叠
            }
        });
    });
}

//  function collapsePreAddHead(){
//     const containers = document.querySelectorAll('.collapsible');
//         containers.forEach(container => {
//             // 创建并添加折叠按钮
//             const header = document.createElement('div');
//             header.className = 'collapsible-header';
//             header.textContent = '点击展开/折叠 Expand/Collapse';            
//             container.insertBefore(header, container.firstChild);
//             // 处理按钮点击事件
//             header.addEventListener('click', function() {
//                 const content = container.querySelector('.collapsible-content');
//                 container.classList.toggle('show');
//             });
//         });
// }

function updateCountdown() {
    // 获取目标日期（从data-target属性中读取）
    const countdownElement = document.querySelector('.ExamCountdown');
    const targetDate = new Date(countdownElement.getAttribute('data-target')).getTime();
    const now = new Date().getTime();
    const timeLeft = targetDate - now;
    // 计算剩余时间的天数、小时、分钟、秒
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    // 格式化时间，确保为两位数显示
    const formattedTime = `倒计时${days}天 ${String(hours).padStart(2, '0')}小时 ${String(minutes).padStart(2, '0')}分钟 ${String(seconds).padStart(2, '0')}秒`;
    countdownElement.textContent = formattedTime;
    // 如果时间结束，停止更新
    if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        countdownElement.textContent = "倒计时结束";
    }
}
// 每秒更新一次倒计时
const countdownInterval = setInterval(updateCountdown, 1000);


document.addEventListener("DOMContentLoaded", function() {
    // tocBasicDisplay();
    collapsePreAddHead();
    
    // var typed = new Typed('.title', {
    // 	stringsElement: '#typed-strings',
    // 	typeSpeed: 60
    // });

    addSidenotes();
});


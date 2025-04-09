// 定义一个数组，包含所有需要加载的外部脚本
var scriptsToLoad = [
    // 'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
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

function tocBasicDisplay(){    
    const toc = document.getElementById("table-of-contents");
    if (toc) {
	const tocToggle = document.createElement("button");
	tocToggle.id = "toc-toggle";
	tocToggle.textContent = "目 录";
	document.body.appendChild(tocToggle); // 将按钮添加到 body 中
	// const tocH2 = toc.querySelector('h2');
	tocToggle.addEventListener("click", function () {
	// tocH2.addEventListener("click", function () {
	    toc.classList.toggle("open");
	});  
    }
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
const examCountdownElements = document.querySelectorAll('.ExamCountdown');

// 判断是否存在该类元素，并获取数量
if (examCountdownElements.length > 0) {
    // 每秒更新一次倒计时
    const countdownInterval = setInterval(updateCountdown, 1000);
}
// else {
    // console.log('不存在 class 为 ExamCountdown 的元素');
// }

const copyLabel = "<i class='bx bx-copy-alt' ></i>";

async function copyCode(block, button) {
  let codes = block.querySelector('pre.src').childNodes;
  let text = '';
  codes.forEach((code) => {
    if (code.nodeType == 3) {
      text += code.data;
    } else if (code.className != 'linenr') {
      text += code.innerText;
    }
  });
  text = text.slice(0, -1);
  await navigator.clipboard.writeText(text);
  button.innerText = 'Copied';
  setTimeout(() => {
    button.innerHTML = copyLabel;
  }, 500);
}

function addCopyCodeButtons() {
  if (!navigator.clipboard) return;
  let blocks = document.querySelectorAll('.org-src-container');
  blocks.forEach((block) => {
    let button = document.createElement('button');
    button.innerHTML = copyLabel;
    button.classList.add('copy-code');
    block.append(button);
    button.addEventListener('click', async() => {
      await copyCode(block, button);
    });
  });
}


function foonotePreview(){
    const footnotes = document.querySelectorAll('.footref');
    footnotes.forEach(footnote => {
        const footnoteId = footnote.getAttribute('href').substring(1); // 获取脚注ID
	console.log(footnoteId);
        const footnoteContent = document.getElementById(footnoteId).parentNode.nextSibling.nextSibling.textContent;

        // 创建预览元素
        const preview = document.createElement('div');
        preview.className = 'footnote-preview';
        preview.innerText = footnoteContent;

        // 将预览元素插入到脚注链接后面
        footnote.insertAdjacentElement('afterend', preview);

         // 设置预览元素的位置
        const rect = footnote.getBoundingClientRect();
        preview.style.top = `${rect.bottom + window.scrollY}px`;
        preview.style.left = `${rect.left + window.scrollX}px`;

        // 鼠标悬停时显示预览
        footnote.addEventListener('mouseenter', () => {
            footnote.classList.add('footref-preview-active');
        });

        // 鼠标离开时隐藏预览
        footnote.addEventListener('mouseleave', () => {
            footnote.classList.remove('footref-preview-active');
        });
    });
}


document.addEventListener("DOMContentLoaded", function() {
    
    tocBasicDisplay();
    collapsePreAddHead();
    addCopyCodeButtons();
    foonotePreview();
    
});


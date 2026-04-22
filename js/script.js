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
	// console.log(footnoteId);
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

function tableExpand(){
  document.querySelectorAll("table").forEach((table) => {
    table.querySelectorAll("tr").forEach((row) => {
      row.addEventListener("click", function () {
        // 如果已经被隐藏，说明已经展开，直接返回
        if (row.style.display === "none") return;
        const cellCount = row.children.length;
        // 隐藏原始行（不删除）
        row.style.display = "none";
        // 构造展开块 tr
        const blockRow = document.createElement("tr");
        const blockCell = document.createElement("td");
        blockCell.colSpan = cellCount;
        const blockDiv = document.createElement("div");
        blockDiv.style.display = "flex";
        blockDiv.style.flexDirection = "column";
        blockDiv.style.border = "1px solid #ccc";
        blockDiv.style.padding = "10px";
        blockDiv.style.background = "#f9f9f9";
        blockDiv.style.position = "relative";
        // 添加收起按钮
        const closeBtn = document.createElement("button");
        closeBtn.innerText = "收起";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "5px";
        closeBtn.style.right = "10px";
        closeBtn.style.padding = "2px 6px";
        closeBtn.style.fontSize = "12px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.border = "1px solid #888";
        closeBtn.style.borderRadius = "4px";
        closeBtn.style.background = "#eee";
        blockDiv.appendChild(closeBtn);
        // 拷贝每个单元格内容为段落
        Array.from(row.children).forEach((cell) => {
          const p = document.createElement("p");
          p.style.margin = "0.5em 0";
          const cellContent = cell.cloneNode(true); // 深拷贝
          p.appendChild(cellContent);
          blockDiv.appendChild(p);
        });
        // 插入
        blockCell.appendChild(blockDiv);
        blockRow.appendChild(blockCell);
        row.parentNode.insertBefore(blockRow, row.nextSibling);
        // 收起按钮行为
        closeBtn.addEventListener("click", function (e) {
          e.stopPropagation(); // 阻止再次触发展开
          // 显示原始行
          row.style.display = "";
          // 移除展开块
          blockRow.remove();
        });
      });
    });
  });
}

function imgDisplay(){
    // 检查模态框是否已存在，避免重复创建
    if (document.getElementById('myModal')) return;

    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', '图片查看器');

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', '关闭');
    modal.appendChild(closeBtn);

    const modalImg = document.createElement('img');
    modalImg.className = 'modal-content';
    modalImg.id = 'modal-img';
    modalImg.alt = '放大查看';
    modal.appendChild(modalImg);

    document.body.appendChild(modal);

    // 点击关闭按钮
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      modal.style.display = 'none';
    });

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    // Esc 键关闭
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    });

    // 为图片添加点击事件，跳过小图标和装饰性图片
    document.querySelectorAll('img').forEach((img) => {
      const w = img.naturalWidth || 0;
      const h = img.naturalHeight || 0;
      // 跳过宽度小于 50px 或高度小于 50px 的小图标
      if (w < 50 && h < 50) return;
      // 跳过 src 为空或 data 图片
      if (!img.src || img.src.startsWith('data:')) return;
      // 跳过带 no-modal 类的图片
      if (img.classList.contains('no-modal')) return;

      img.style.cursor = 'pointer';
      img.title = '点击放大';
      img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = img.src;
      });
    });
}

document.addEventListener("DOMContentLoaded", function() {

    tocBasicDisplay();
    collapsePreAddHead();
    addCopyCodeButtons();
    foonotePreview();
    tableExpand();
    imgDisplay();
    filmFilterInit();

});

/* Film filter functionality */
function filmFilterInit() {
    const filmGrid = document.getElementById('film-grid');
    if (!filmGrid) return;

    const filmCards = filmGrid.querySelectorAll('.film-card');
    const filterCheckboxes = document.querySelectorAll('.film-filters input[type="checkbox"]');

    function filterFilms() {
        const checkedRatings = [];
        filterCheckboxes.forEach(cb => {
            if (cb.checked) {
                const rating = cb.id.replace('filter-', '');
                if (rating !== 'all') {
                    checkedRatings.push(parseInt(rating));
                }
            }
        });

        filmCards.forEach(card => {
            const cardRating = parseInt(card.getAttribute('data-rating'));
            if (checkedRatings.includes('all')) {
                card.classList.remove('hidden');
            } else if (checkedRatings.length === 0) {
                card.classList.add('hidden');
            } else if (checkedRatings.includes(cardRating)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    filterCheckboxes.forEach(cb => {
        cb.addEventListener('change', filterFilms);
    });
}


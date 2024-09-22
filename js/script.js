

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

function collapsePreAddHead(){
    const containers = document.querySelectorAll('.collapsible');
        containers.forEach(container => {
            // 创建并添加折叠按钮
            const header = document.createElement('div');
            header.className = 'collapsible-header';
            header.textContent = '点击展开/折叠 Expand/Collapse';            
            container.insertBefore(header, container.firstChild);
            // 处理按钮点击事件
            header.addEventListener('click', function() {
                const content = container.querySelector('.collapsible-content');
                container.classList.toggle('show');
            });
        });
}

document.addEventListener("DOMContentLoaded", function() {
    tocBasicDisplay();
    collapsePreAddHead();
    
    var typed = new Typed('.title', {
	stringsElement: '#typed-strings',
	typeSpeed: 60
    });

    addSidenotes();
});


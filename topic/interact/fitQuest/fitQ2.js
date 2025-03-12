// Function to dynamically load MathJax
const loadMathJax = () => {
    const script = document.createElement("script");
    script.src = "https://polyfill.io/v3/polyfill.min.js?features=es6";
    script.async = true;
    document.head.appendChild(script);
    const mathjaxScript = document.createElement("script");
    mathjaxScript.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    mathjaxScript.async = true;
    mathjaxScript.id = "MathJax-script";
    document.head.appendChild(mathjaxScript);
};
loadMathJax();

// Get HTML elements
const generateButton = document.getElementById('generateButton');
const plotButton = document.getElementById('plotButton');
const submitButton = document.getElementById('submitButton');
const errorOutput = document.getElementById('errorOutput');
const functionSelect = document.getElementById('functionSelect');
const parameterA = document.getElementById('parameterA');
const parameterB = document.getElementById('parameterB');
const parameterC = document.getElementById('parameterC');
const canvas = document.getElementById('curveCanvas');
const ctx = canvas.getContext('2d');
const timeCountOutput = document.getElementById('timeCountOutput');
const addFunctionButton = document.getElementById("addFunction");
const clearBt = document.getElementById("clearBt");
const cancelBt = document.getElementById("cancelBt");
const latexPreDiv = document.getElementById("latexPreDiv");
const difficultyLevel = document.getElementById("difficultySelect");
const savedResultsContainer = document.querySelector('.saved-fit-results');
const expressionInput = document.getElementById("expressionInput");
const latexPreviewDiv = document.getElementById("latexPreviewDiv");

// Canvas settings
canvas.width = 600;
canvas.height = 400;
const xMin = -10, xMax = 10;
const yMin = -5, yMax = 5;
const xScale = canvas.width / (xMax - xMin);
const yScale = canvas.height / (yMax - yMin);
const height = canvas.height; // 定义全局变量 height

// Global variables
let generatedFunction = null;
let userFunction = null;
let functions = [];
let originalValues = null;
let editingIndex = null;
let timer = null;
let startTime = null;
let savedStates = [];

// Error threshold
const ERROR_THRESHOLD = 1;
const MAX_ERROR = 10;
const functionColors = {
    linear: "black", 
    quadratic: "gray", 
    sin: "green",
    exp: "purple",
    log: "blue",
    C: "gold",

};

// Draw axes and grid
function drawAxesAndGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width, height = canvas.height;
    const centerX = -xMin * xScale;
    const centerY = yMax * yScale;

    // Draw grid lines
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 0.5;
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
        const screenX = (x - xMin) * xScale;
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, height);
        ctx.stroke();
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
        const screenY = height - (y - yMin) * yScale;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(width, screenY);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Add axis labels
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
        const screenX = (x - xMin) * xScale;
        ctx.fillText(x, screenX - 5, centerY + 15);
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
        const screenY = height - (y - yMin) * yScale;
        if (y !== 0) {
            ctx.fillText(y, centerX + 5, screenY + 5);
        }
    }
}

// Plot a function
function plotFunction(func, color = "blue") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    let firstPoint = true;
    for (let x = xMin; x <= xMax; x += 0.05) {
        const y = func(x);
        if (y < yMin || y > yMax) continue;

        const canvasX = (x - xMin) * xScale;
        const canvasY = height - (y - yMin) * yScale;

        if (firstPoint) {
            ctx.moveTo(canvasX, canvasY);
            firstPoint = false;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.stroke();
}

// Calculate error
function calculateError(trueFunc, userFunc) {
    let error = 0;
    const numPoints = 100;
    const step = 10 / numPoints;

    for (let i = 0; i <= numPoints; i++) {
        const x = -5 + i * step;
        const trueY = trueFunc(x);
        const userY = userFunc(x);
        error += (trueY - userY) ** 2;
    }
    return Math.sqrt(error / numPoints);
}

// Generate a random function based on difficulty
function generateRandomFunction(difficulty) {
    const functions = {
        beginner: ["linear", "quadratic"],
        intermediate: ["linear", "quadratic", "sin", "cos"],
        advanced: ["sin", "cos", "log", "exp", "quadratic"],
    };

    const coefficients = {
        beginner: [-1, 1],
        intermediate: [-2, 2],
        advanced: [-4, 4],
    };

    function getRandom(min, max, step = 0.1) {
        const range = (max - min) / step;
        return (Math.round(Math.random() * range) * step + min).toFixed(2);
    }

    const difficultyConfig = {
        beginner: { minCount: 1, maxCount: 2 },
        intermediate: { minCount: 2, maxCount: 3 },
        advanced: { minCount: 3, maxCount: 4 },
    };

    const { minCount, maxCount } = difficultyConfig[difficulty];
    const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

    const functionComponents = [];

    for (let i = 0; i < count; i++) {
        const type = functions[difficulty][Math.floor(Math.random() * functions[difficulty].length)];
        const a = getRandom(...coefficients[difficulty], 0.1);
        const b = getRandom(...coefficients[difficulty], 0.1);
        const c = getRandom(...coefficients[difficulty], 0.1);

        

        var matchPower = type.match(/^power-(\d+)$/);

        if (type.match(/^power-(\d+)$/)) {
            
            var power = parseInt(type.match(/^power-(\d+)$/)[1], 10);
            functionComponents.push(`${a} * x ** ${power}`);
        }
        if (type === "linear") {
            functionComponents.push(`(${a} * x + ${b})`);
        } else if (type === "quadratic") {
            functionComponents.push(`(${a} * x * x + ${b} * x + ${c})`);
        } else if (type === "sin") {
            functionComponents.push(`(${a} * Math.sin(${b} * x + ${c}))`);
        } else if (type === "cos") {
            functionComponents.push(`(${a} * Math.cos(${b} * x + ${c}))`);
        } else if (type === "log") { // 将 "ln" 改为 "log" 以表示一般对数
            // 使用换底公式实现一般对数 log_b(x) = ln(x) / ln(b)
            functionComponents.push(`(${a} * (Math.log( x + ${c}) + 1e-6) / Math.log(${b})))`);
        } else if (type === "exp") {
            functionComponents.push(`(${a} * Math.exp(${b} * x + ${c}))`);
        } else if (type === "C") {
            functionComponents.push(`${a}`);
        }
        

    }
    const functionString = functionComponents.join(" + ");
    return new Function("x", `return ${functionString};`);
}
// Plot user function
function plotUserFunction() {
    console.log("plot")
    userFunction = (x) => functions.reduce((sum, func) => {
        var matchPower = func.type.match(/^power-(\d+)$/);
        if (matchPower) {
            var power = parseInt(matchPower[1], 10);
            return sum + func.a * (x ** power);
        }
        switch (func.type) {
        case "linear":
            return sum + func.a * x + func.b;
        case "quadratic":
            return sum + func.a * x ** 2 + func.b * x + func.c;
        case "sin":
            return sum + func.a * Math.sin(func.b * x + func.c); // 修正为与生成函数逻辑一致
        case "cos":
            return sum + func.a * Math.cos(func.b * x + func.c);
        case "log": // 将 "ln" 改为 "log"
            // 使用换底公式实现一般对数 log_b(x) = ln(x) / ln(b)
            return sum + func.a * (Math.log(Math.abs(x + func.c) + 1e-6) / Math.log(func.b));
        case "exp":
            return sum + func.a * Math.exp(func.b * x + func.c);
        case "C":
            return sum + func.a;
        default:
            return sum;
        }
    }, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxesAndGrid();
    if (typeof generatedFunction === "function") {
        plotFunction(generatedFunction, "blue");
    }
    plotFunction(userFunction, "red");
}

// Update plot and error
function updatePlotAndError() {
    plotUserFunction();
    if (generatedFunction) {
        const error = calculateError(generatedFunction, userFunction);
        errorOutput.textContent = `误差 Error: ${error}`;
        checkErrorAndStopTimer(error);
        updateErrorColor(error);
    }
}

// Start timer
function startTimer() {
    startTime = Date.now();
    timer = setInterval(() => {
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
        timeCountOutput.textContent = `计时 Time: ${elapsedTime} 秒`;
    }, 100);
}
// Stop timer
function stopTimer() {
    clearInterval(timer);
    timer = null;
}

// Check error and stop timer
function checkErrorAndStopTimer(error) {
    if (error <= ERROR_THRESHOLD && timer !== null) {
        stopTimer();
        timeCountOutput.textContent += ' (完成！)';
        saveState();
        console.log('恭喜你，成功拟合函数！');
    }
}

// Get error color
function getErrorColor(value) {
    const normalized = Math.min(value / MAX_ERROR, 1);
    const r = Math.round(255 * normalized);
    const g = Math.round(200 * (1 - normalized));
    return `rgb(${r}, ${g}, 0)`;
}

// Update error color
function updateErrorColor(error) {
    const color = getErrorColor(error);
    errorOutput.style.color = color;
    errorOutput.style.fontWeight = 'bold';
}

// Render LaTeX
function renderLatex() {
    latexPreDiv.innerHTML = "";
    functions.forEach((func, index) => {
        const latexSpan = document.createElement("span");
        latexSpan.id = `function-${index}`;
        latexSpan.className = "latex-render";
        latexSpan.style.color = functionColors[func.type] || "black";
        latexSpan.innerHTML = `\\(\\left[ ${func.latex} \\right]\\)`;
        latexPreDiv.appendChild(latexSpan);

        if (index < functions.length - 1) {
            const plusSpan = document.createElement("span");
            plusSpan.className = "plus-symbol";
            plusSpan.innerHTML = " + ";
            latexPreDiv.appendChild(plusSpan);
        }
    });
    MathJax.typesetPromise([latexPreDiv]);
}
// Create LaTeX expression from 3 types(txt)
function createLatex(type, a, b, c) {
    var matchPower = type.match(/^power-(\d+)$/);
    if (matchPower) {
        var power = parseInt(matchPower[1], 10);
        return `${a}x^{${power}}`;
    }
    switch (type) {
    case "linear":
        return `${a}x + ${b}`;
    case "quadratic":
        return `${a}x^2 + ${b}x + ${c}`;
    case "sin":
        return `${a}\\sin(${b}x + ${c})`; // 修正为与生成函数逻辑一致
    case "cos":
        return `${a}\\cos(${b}x + ${c})`;
    case "log": // 将 "ln" 改为 "log"
        return `${a}\\log_{${b}}(x + ${c})`; // 修正为与生成函数逻辑一致
    case "exp":
        return `${a}e^{${b}x + ${c}}`;
    case "C":
        return `(${a})`;
    default:           
        return "";
    }
}

// Update button states
function updateButtonStates() {
    addFunctionButton.textContent = editingIndex !== null ? "确认 Confirm" : "添加 Add";
    cancelBt.textContent = editingIndex !== null ? "撤销 Undo" : "取消 Cancel";
    clearBt.textContent = editingIndex !== null ? "删除 Delete" : "清空 Clear";
}

// Reset editing state
function resetEditingState() {
    if (originalValues && editingIndex !== null) {
        functions[editingIndex] = { ...originalValues };
    }
    editingIndex = null;
    originalValues = null;

    updateButtonStates();
    
    updatePlotAndError();
    renderLatex();
}

function addFunL(){
    const type = functionSelect.value;
    const a = parseFloat(parameterA.value) || 0;
    const b = parseFloat(parameterB.value) || 0;
    const c = parseFloat(parameterC.value) || 0;

    if (editingIndex !== null) {
        functions[editingIndex] = { type, a, b, c, latex: createLatex(type, a, b, c) };
    } else {
        functions.push({ type, a, b, c, latex: createLatex(type, a, b, c) });
    }
    editingIndex = null;
    
    updatePlotAndError();
    updateButtonStates();
    renderLatex();
}

// Add/modify function
addFunctionButton.addEventListener("click", () => {
    addFunL();
});

// Clear or delete function
clearBt.addEventListener("click", () => {
    if (editingIndex !== null) {
        functions.splice(editingIndex, 1);
        editingIndex = null;
    } else {
        functions.length = 0;
    }
    
    updatePlotAndError();
    updateButtonStates();
    renderLatex();
});

// Double click to delete function
latexPreDiv.addEventListener("dblclick", (event) => {
    const clickedSpan = findParentSpan(event.target);
    if (clickedSpan?.classList.contains("latex-render")) {
        const index = parseInt(clickedSpan.id.split("-")[1], 10);
        functions.splice(index, 1);
        editingIndex = null;
        
        updatePlotAndError();
        renderLatex();
    }
    // resetEditingState();2
    updateButtonStates();
});

// Single click to enter edit mode
latexPreDiv.addEventListener("click", (event) => {
    const clickedSpan = findParentSpan(event.target);
    if (clickedSpan?.classList.contains("latex-render")) {
        document.querySelectorAll(".latex-render").forEach(span => span.classList.remove("highlighted"));
        clickedSpan.classList.add("highlighted");

        const index = parseInt(clickedSpan.id.split("-")[1], 10);
        const func = functions[index];
        originalValues = { ...func };
        editingIndex = index;

        functionSelect.value = func.type;
        // 卡片同步
        cards.forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.type === func.type) {
                card.classList.add('selected');
            }
        });
        parameterA.value = func.a;
        parameterB.value = func.b;
        parameterC.value = func.c;
        updateButtonStates();
    } else {
        document.querySelectorAll(".latex-render").forEach(span => span.classList.remove("highlighted"));   
        cards.forEach(card => {card.classList.remove('selected');})
        resetEditingState();
        updateButtonStates();
    }
});

// Helper function: find parent span
function findParentSpan(element) {
    while (element && element.tagName !== "SPAN") element = element.parentElement;
    return element;
}

// Save state
function saveState() {
    // 生成默认名称
    const defaultName = getDefaultStateName();

    // 计算误差，如果没有 generatedFunction 则设为 null
    let error = null;
    if (generatedFunction && userFunction) {
        error = calculateError(generatedFunction, userFunction);
    }

    const state = {
        generatedFunction,
        userFunction,
        error,
        name: defaultName,
        id: savedStates.length,
    };

    savedStates.push(state);

    // 创建独立的缩略图画布
    const thumbnail = createIndependentThumbnail();
    const stateContainer = document.createElement('div');
    stateContainer.classList.add('state-container');
    stateContainer.dataset.id = state.id;

    const stateInfo = document.createElement('p');
    stateInfo.textContent = error!== null? `Error: ${error}` : 'Error: N/A';
    const stateNameInput = document.createElement('input');
    stateNameInput.type = 'text';
    stateNameInput.value = defaultName;
    stateNameInput.classList.add('state-name');
    stateContainer.appendChild(stateInfo);
    stateContainer.appendChild(stateNameInput);

    stateContainer.appendChild(thumbnail);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(stateContainer.dataset.id, 10);
        savedStates = savedStates.filter((state) => state.id!== id);
        stateContainer.remove();
    });
    stateContainer.appendChild(deleteButton);

    stateContainer.addEventListener('click', () => {
        const id = parseInt(stateContainer.dataset.id, 10);
        const selectedState = savedStates.find((state) => state.id === id);

        if (selectedState) {
            generatedFunction = selectedState.generatedFunction;
            userFunction = selectedState.userFunction;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (generatedFunction) {
                plotFunction(generatedFunction, 'blue');
            }
            if (userFunction) {
                plotFunction(userFunction, 'red');
            }

            errorOutput.textContent = selectedState.error!== null? `Error: ${selectedState.error}` : 'Error: N/A';
        }
    });

    savedResultsContainer.appendChild(stateContainer);
    console.log('State saved!');
}

// 创建独立的缩略图画布
function createIndependentThumbnail() {
    const thumbnail = document.createElement('canvas');
    thumbnail.width = 120;
    thumbnail.height = 80;
    const thumbnailCtx = thumbnail.getContext('2d');

    // 绘制坐标轴
    const width = thumbnail.width;
    const height = thumbnail.height;
    const xMinThumb = -10;
    const xMaxThumb = 10;
    const yMinThumb = -5;
    const yMaxThumb = 5;
    const xScaleThumb = width / (xMaxThumb - xMinThumb);
    const yScaleThumb = height / (yMaxThumb - yMinThumb);

    // 绘制网格线
    thumbnailCtx.strokeStyle = "#ddd";
    thumbnailCtx.lineWidth = 0.5;
    for (let x = Math.ceil(xMinThumb); x <= Math.floor(xMaxThumb); x++) {
        const screenX = (x - xMinThumb) * xScaleThumb;
        thumbnailCtx.beginPath();
        thumbnailCtx.moveTo(screenX, 0);
        thumbnailCtx.lineTo(screenX, height);
        thumbnailCtx.stroke();
    }
    for (let y = Math.ceil(yMinThumb); y <= Math.floor(yMaxThumb); y++) {
        const screenY = height - (y - yMinThumb) * yScaleThumb;
        thumbnailCtx.beginPath();
        thumbnailCtx.moveTo(0, screenY);
        thumbnailCtx.lineTo(width, screenY);
        thumbnailCtx.stroke();
    }

    // 绘制坐标轴
    thumbnailCtx.strokeStyle = "#000";
    thumbnailCtx.lineWidth = 1.5;
    const centerXThumb = -xMinThumb * xScaleThumb;
    const centerYThumb = yMaxThumb * yScaleThumb;
    thumbnailCtx.beginPath();
    thumbnailCtx.moveTo(0, centerYThumb);
    thumbnailCtx.lineTo(width, centerYThumb);
    thumbnailCtx.stroke();
    thumbnailCtx.beginPath();
    thumbnailCtx.moveTo(centerXThumb, 0);
    thumbnailCtx.lineTo(centerXThumb, height);
    thumbnailCtx.stroke();
    // 绘制函数曲线
    if (generatedFunction) {
        thumbnailCtx.strokeStyle = 'blue';
        thumbnailCtx.lineWidth = 2;
        thumbnailCtx.beginPath();
        let firstPoint = true;
        for (let x = xMinThumb; x <= xMaxThumb; x += 0.05) {
            const y = generatedFunction(x);
            if (y < yMinThumb || y > yMaxThumb) continue;
            const canvasX = (x - xMinThumb) * xScaleThumb;
            const canvasY = height - (y - yMinThumb) * yScaleThumb;
            if (firstPoint) {
                thumbnailCtx.moveTo(canvasX, canvasY);
                firstPoint = false;
            } else {
                thumbnailCtx.lineTo(canvasX, canvasY);
            }
        }
        thumbnailCtx.stroke();
    }
    if (userFunction) {
        thumbnailCtx.strokeStyle = 'red';
        thumbnailCtx.lineWidth = 2;
        thumbnailCtx.beginPath();
        let firstPoint = true;
        for (let x = xMinThumb; x <= xMaxThumb; x += 0.05) {
            const y = userFunction(x);
            if (y < yMinThumb || y > yMaxThumb) continue;
            const canvasX = (x - xMinThumb) * xScaleThumb;
            const canvasY = height - (y - yMinThumb) * yScaleThumb;
            if (firstPoint) {
                thumbnailCtx.moveTo(canvasX, canvasY);
                firstPoint = false;
            } else {
                thumbnailCtx.lineTo(canvasX, canvasY);
            }
        }
        thumbnailCtx.stroke();
    }
    return thumbnail;
}

// Function to create a thumbnail of the canvas
function createThumbnail(canvas) {
    const thumbnail = document.createElement('canvas');
    thumbnail.width = 120;
    thumbnail.height = 80;
    const thumbnailCtx = thumbnail.getContext('2d');
    thumbnailCtx.drawImage(canvas, 0, 0, thumbnail.width, thumbnail.height);
    return thumbnail;
}

// Function to get default name with timestamp
function getDefaultStateName() {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    return `Fit ${timestamp}`;
}


const radioButtons = document.querySelectorAll('input[type="radio"]');
let previousCheckedRadio = document.querySelector('input[type="radio"]:checked');
let blinkInterval;
let revertTimer;
radioButtons.forEach(radio => {
    radio.addEventListener('change', function () {
                // 清除之前的定时器和闪烁效果
        clearInterval(blinkInterval);
        clearTimeout(revertTimer);
        generateButton.classList.remove('blinking');

        console.log('Chosen: ' + this.value);

                // 让按钮开始闪烁
        generateButton.classList.add('blinking');
        blinkInterval = setInterval(() => {
            generateButton.classList.toggle('blinking');
        }, 1000);

                // 设置定时器，如果用户在 5 秒内没有点击按钮，切换回之前的选择
        revertTimer = setTimeout(() => {
            previousCheckedRadio.checked = true;
            generateButton.classList.remove('blinking');
            clearInterval(blinkInterval);
        }, 5000);
    });
});


const cards = document.querySelectorAll('.card');

const powerUpButton = document.querySelector('.power-up-button');

const MAX_POWER = 6; // 最大幂次
let power = 1;

        // 更新标题和 data-type
function updatePowerFunction() {
    const powerFunctionTitle = document.querySelector('.power-function-title');
    if (power <= MAX_POWER) {
     const card = document.getElementById('power-card');
     power++;
     powerFunctionTitle.innerHTML = `幂 \\(ax^${power}\\)`;
     card.dataset.type = `power-${power}`;
     showMessage(`已升幂到 ${power} 次幂`);
     MathJax.typesetPromise([powerFunctionTitle]);
 }
 if (power === MAX_POWER) {
    showMessage('已达到最大幂次');
    power=0;
}
}
        // 显示提示信息
function showMessage(message) {
    const powerUpMessage = document.querySelector('.power-up-message');
    powerUpMessage.textContent = message;
    powerUpMessage.style.opacity = 1;
    setTimeout(() => {
        powerUpMessage.style.opacity = 0;
    }, 2000);
}
powerUpButton.addEventListener('click', () => {
    // if (power < MAX_POWER) {
        updatePowerFunction();
    // }
});


        // 初始化时根据下拉框选中项设置卡片选中状态
const initialSelectedValue = functionSelect.value;
cards.forEach(card => {
    if (card.dataset.type === initialSelectedValue) {
        card.classList.add('selected');
    }
});



        // 监听下拉框的变化
functionSelect.addEventListener('change', () => {
    const selectedValue = functionSelect.value;
            // 移除所有卡片的选中状态
    cards.forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.type === selectedValue) {
            card.classList.add('selected');
        }
    });
});

        // 监听卡片的点击事件
cards.forEach(card => {
    card.addEventListener('click', () => {
                // 移除所有卡片的选中状态
        cards.forEach(c => c.classList.remove('selected'));
                // 为当前点击的卡片添加选中状态
        card.classList.add('selected');
                // 更新下拉框的选中项
        const selectedType = card.dataset.type;

         let optionExists = false;
                const options = functionSelect.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === selectedType) {
                        optionExists = true;
                        break;
                    }
                }

                // 如果不存在，则添加新的 option
                if (!optionExists) {
                    const newOption = document.createElement('option');
                    newOption.value = selectedType;
                    newOption.text = selectedType; // 这里简单设置文本为 value，可根据需求修改
                    functionSelect.appendChild(newOption);
                }


        functionSelect.value = selectedType;
    });
    card.addEventListener('dblclick',() =>{
        cards.forEach(c => c.classList.remove('selected'));
                // 为当前点击的卡片添加选中状态
        card.classList.add('selected');
                // 更新下拉框的选中项
        const selectedType = card.dataset.type;
        functionSelect.value = selectedType;
        addFunL();
    })
});


        // 按钮点击事件
generateButton.addEventListener('click', () => {
            // 清除定时器和闪烁效果
    clearInterval(blinkInterval);
    clearTimeout(revertTimer);
    generateButton.classList.remove('blinking');

            // 获取当前选中的难度级别
    const difficultyLevel = document.querySelector('input[type="radio"]:checked');
            // 这里假设 generateRandomFunction、ctx、canvas 等已经定义
    generatedFunction = generateRandomFunction(difficultyLevel.value);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxesAndGrid();
    plotFunction(generatedFunction, 'blue');
    startTimer();
    console.log('新函数已生成！');

            // 更新之前选中的单选按钮
    previousCheckedRadio = document.querySelector('input[type="radio"]:checked');
});
plotButton.addEventListener('click', updatePlotAndError);

submitButton.addEventListener('click', saveState);

cancelBt.addEventListener("click", () => {
    resetEditingState();
    updateButtonStates();
});


        const sliderA = document.getElementById('sliderA');
        const sliderB = document.getElementById('sliderB');
        const sliderC = document.getElementById('sliderC');

        parameterA.addEventListener('input', function () {
            sliderA.value = this.value;
        });
        parameterB.addEventListener('input', function () {
            sliderB.value = this.value;
        });
        parameterC.addEventListener('input', function () {
            sliderC.value = this.value;
        });

        sliderA.addEventListener('input', function () {
            parameterA.value = this.value;
        });
        sliderB.addEventListener('input', function () {
            parameterB.value = this.value;
        });
        sliderC.addEventListener('input', function () {
            parameterC.value = this.value;
        });

// 实时更新绘图和误差，当参数输入变化时
[functionSelect, parameterA, parameterB, parameterC,sliderA,sliderB,sliderC].forEach(input => {
    console.log("有变化")
    input.addEventListener('input', () => {
        if (editingIndex !== null) {
            const type = functionSelect.value;
            const a = parseFloat(parameterA.value) || 0;
            const b = parseFloat(parameterB.value) || 0;
            const c = parseFloat(parameterC.value) || 0;

            functions[editingIndex] = {
                type,
                a,
                b,
                c,
                latex: createLatex(type, a, b, c)
            };
            
            updatePlotAndError();
            renderLatex();
        }
    });
});

// 高级输入面板 - 插入符号到输入框
const buttons = document.querySelectorAll('.insert-btn');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const symbol = button.getAttribute('data-insert');
        const cursorPosition = expressionInput.selectionStart;
        const currentText = expressionInput.value;
        const newText = currentText.slice(0, cursorPosition) + symbol + currentText.slice(cursorPosition);
        expressionInput.value = newText;
        expressionInput.selectionStart = expressionInput.selectionEnd = cursorPosition + symbol.length;
    });
});

// 高级输入面板 - 实时预览 LaTeX
document.addEventListener("DOMContentLoaded", () => {
    const latexPreview = document.createElement("div");
    latexPreview.id = "latexPreview";
    latexPreview.style.marginTop = "10px";
    latexPreview.style.fontSize = "1.2em";
    latexPreviewDiv.appendChild(latexPreview);

    const convertToLatex = (input) => {
        return input
           .replace(/\*/g, "\\times")
        .replace(/\//g, "\\div")
        .replace(/\^/g, "^?")
        .replace(/sq\((?![^\)]*\))/g, "\\sqrt{?}")
        .replace(/sq\(([^)]+)\)/g, "\\sqrt{$1}")
        .replace(/ln\((?![^\)]*\))/g, "\\ln{?}")
        .replace(/ln\(([^)]+)\)/g, "\\ln{$1}")
        .replace(/sin\((?![^\)]*\))/g, "\\sin{?}")
        .replace(/sin\(([^)]+)\)/g, "\\sin{\\left($1\\right)}")
        .replace(/cos\((?![^\)]*\))/g, "\\cos{?}")
        .replace(/cos\(([^)]+)\)/g, "\\cos{\\left($1\\right)}")
        .replace(/tan\((?![^\)]*\))/g, "\\tan{?}")
        .replace(/tan\(([^)]+)\)/g, "\\tan{\\left($1\\right)}");
    };

    expressionInput.addEventListener("input", () => {
        const userInput = expressionInput.value;
        const latexOutput = convertToLatex(userInput);
        latexPreview.innerHTML = `\\[ ${latexOutput} \\]`;
        if (window.MathJax) {
            MathJax.typesetPromise([latexPreview]);
        }
    });
});

// 初始化函数，在页面加载完成后执行一些操作
function init() {
    const elementToRemove = document.getElementById('canvasLoading');
    if (elementToRemove) {
                // 直接调用 remove() 方法删除元素
        elementToRemove.remove();
    }
    function exampleFunction(x) {
        return Math.sin(x) + Math.cos(2 * x);
    }
// 绘制曲线
    drawAxesAndGrid();
    plotFunction(exampleFunction);
    // 可以在这里添加更多初始化逻辑，比如默认状态设置等
}

window.addEventListener('load', init);
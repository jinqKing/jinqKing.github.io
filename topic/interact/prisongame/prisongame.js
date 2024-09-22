
DefectDefect = document.getElementById('DefectDefect').value;
DefectCooperate = document.getElementById('DefectCooperate').value;
CooperateDefect = document.getElementById('CooperateDefect').value;
CooperateCooperate = document.getElementById('CooperateCooperate').value;

const loadParams = () => {
    DefectDefect = document.getElementById('DefectDefect').value;
    DefectCooperate = document.getElementById('DefectCooperate').value;
    CooperateDefect = document.getElementById('CooperateDefect').value;
    CooperateCooperate = document.getElementById('CooperateCooperate').value;
    console.log(DefectDefect, DefectCooperate, CooperateDefect, CooperateCooperate);
};

const scoreTable = document.getElementById('scoreTable');
function updateScoreTable() {
    scoreTable.innerHTML = `
    <tr>
        <td>甲/乙</td>
        <td>合作</td>
        <td>背叛</td>
    </tr>
    <tr>
        <td>合作</td>
        <td id="tabCC">(${CooperateCooperate}, ${CooperateCooperate})</td>
        <td id="tabDC">(${DefectCooperate}, ${CooperateDefect})</td>
    </tr>
    <tr>
        <td>背叛</td>
        <td id="tabCD">(${CooperateDefect}, ${DefectCooperate})</td>
        <td id="tabDD">(${DefectDefect}, ${DefectDefect})</td>
    </tr>
    `;
}
updateScoreTable();
const loadParamsBut = document.getElementById('loadParamsBut');
loadParamsBut.addEventListener('click', function () {
    loadParams();
    updateScoreTable();
});
const restoreParamsBut = document.getElementById('restoreParamsBut');
restoreParamsBut.addEventListener('click', function () {
    document.getElementById('DefectDefect').value = 1;
    document.getElementById('DefectCooperate').value = 5;
    document.getElementById('CooperateDefect').value = 0;
    document.getElementById('CooperateCooperate').value = 3;
    loadParams();
    updateScoreTable();
});

function prisonGame(p1, p2) {
    if (p1 == 0 && p2 == 0) {
        return [DefectDefect, DefectDefect];
    } else if (p1 == 0 && p2 == 1) {
        return [DefectCooperate, CooperateDefect];
    } else if (p1 == 1 && p2 == 0) {
        return [CooperateDefect, DefectCooperate];
    } else {
        return [CooperateCooperate, CooperateCooperate];
    }
}

// 在scoreTable中相应位置加入 result 类改变颜色
const tabCC = document.getElementById('tabCC');
const tabCD = document.getElementById('tabCD');
const tabDC = document.getElementById('tabDC');
const tabDD = document.getElementById('tabDD');
function DisplayInScoreTable(choices = [$('#player1Choice').val(), $('#player2Choice').val()]) {
    console.log(choices);
    tabCC.classList.remove('result');
    tabCD.classList.remove('result');
    tabDC.classList.remove('result');
    tabDD.classList.remove('result');
    if (choices[0] == 1 && choices[1] == 1) {
        tabCC.classList.add('result');
    } else if (choices[0] == 1 && choices[1] == 0) {
        tabCD.classList.add('result');
    } else if (choices[0] == 0 && choices[1] == 1) {
        tabDC.classList.add('result');
    } else {
        tabDD.classList.add('result');
    }
}


function pgRandomChoice() {
    return Math.random() < 0.5 ? 1 : 0;
}


{
    const showSingleGameButton = document.getElementById('showSingleGameBut');
    showSingleGameButton.addEventListener('click', function () {
        const singleGame = document.getElementById('single-game-fun');
        singleGame.classList.remove('hidden');
        // 这里有问题
        singleGame.style.display = singleGame.style.display === 'none' ? 'block' : 'none';
        showSingleGameButton.textContent = singleGame.style.display === 'none' ? '显示单局游戏' : '隐藏单局游戏';
    });
    const checkboxPlayer2 = document.getElementById('player2Bcomputer-control');

    let player1Choice = 1;
    let player2Choice = 1;
    // const player1Choice = document.getElementById('player1Choice');
    const singleGameResultText = document.getElementById('result-text');
    function whenPlayerSelect4single_game(choice = 1) {
        playerBcomputer = document.getElementById('player2Bcomputer');
        if (playerBcomputer.checked) {
            player2Choice = pgRandomChoice();
            const result = prisonGame(choice, player2Choice);
            singleGameResultText.innerHTML = `
            你选择了${choice === 1 ? '合作' : '背叛'}，对方选择了${player2Choice === 1 ? '合作' : '背叛'}，
            你的得分是${result[0]}。`
                ;
        } else {
            // const player2Choice = document.getElementById('player2Choice');
            const result = prisonGame(player1Choice, player2Choice);
            singleGameResultText.innerHTML = `你选择了${player1Choice === 1 ? '合作' : '背叛'}，对方选择了${player2Choice === 1 ? '合作' : '背叛'}，你的得分是${result[0]}。`;
        }
        DisplayInScoreTable([player1Choice, player2Choice]);
    }

    // const player1Cooperate = document.getElementById('player1-cooperate');
    // const player1Defect = document.getElementById('player1-defect');
    // const player2Cooperate = document.getElementById('player2-cooperate');
    // const player2Defect = document.getElementById('player2-defect');
    document.getElementById('player1-cooperate').addEventListener('click', function () { player1Choice = 1; whenPlayerSelect4single_game(1); });
    document.getElementById('player1-defect').addEventListener('click', function () { player1Choice = 0; whenPlayerSelect4single_game(0); });
    document.getElementById('player2-cooperate').addEventListener('click', function () { player2Choice = 1; whenPlayerSelect4single_game(); });
    document.getElementById('player2-defect').addEventListener('click', function () { player2Choice = 0; whenPlayerSelect4single_game(); });
}

// 多局游戏
{
    var p1Strategy = pgTitForTat; var p2Strategy = pgTitForTat;
    // 拖拽逻辑
    {
        let source;
        // siderbar
        const strategiesBox = document.getElementById('multi-game-strategies');

        strategiesBox.ondragstart = (e) => {
            handleDragStart(e);
        };

        // 允许拖动并放置到左侧课程列表中
        strategiesBox.ondragover = (e) => {
            e.preventDefault();
        };

        // 处理拖动元素被放置到左侧课程列表的事件
        strategiesBox.ondrop = (e) => {
            e.preventDefault();
            if (source.dataset.effect === 'move') {
                source.parentNode.removeChild(source);
            }
        };

        const strategyBigBox = document.getElementById('strategies-choosen-div');
        // 处理拖动开始时在容器上触发的事件
        strategyBigBox.ondragstart = (e) => {
            handleDragStart(e);
        };

        // 允许拖动经过，以便可以在目标上放置
        strategyBigBox.ondragover = (e) => {
            e.preventDefault();
        };

        // 当拖动的元素进入目标时添加高亮样式
        strategyBigBox.ondragenter = (e) => {
            clearDropStyle();
            // console.log(e.target);
            const dropNode = getDropNode(e.target);
            if (!dropNode) {
                return;
            }
            if (e.dataTransfer.effectAllowed === dropNode.dataset.drop) {
                dropNode.classList.add('drop-over');
            }
        };

        strategyBigBox.ondrop = (e) => {
            e.preventDefault();
            clearDropStyle();
            const dropNode = getDropNode(e.target);
            if (!dropNode) {
                return;
            }
            if (dropNode !== source && dropNode.dataset.drop === 'copy') {
                // if (dropNode.tagName === 'TD') {
                {
                    // while (dropNode.firstChild) {
                    //     dropNode.removeChild(dropNode.firstChild);
                    // }
                    // 只移除 class 为 'strategy' 的节点
                    while (dropNode.querySelector('.strategy')) {
                        dropNode.removeChild(dropNode.querySelector('.strategy'));
                    }
                    // console.log('source:',source);                    console.log('dropNode',source.idName);
                    if (source.dataset.effect === 'copy') {
                        let clone = source.cloneNode(true);
                        clone.dataset.effect = 'move';
                        makeDraggable(clone);
                        dropNode.appendChild(clone);
                        toggleEditable(clone);
                    } else {
                        dropNode.appendChild(source);
                        toggleEditable(source);
                    }
                    // change the strategy to the new one
                    if (dropNode.id === 'multi-player1-strategy') {
                        p1Strategy = source.getAttribute('strategy');
                        selectP1.value = p1Strategy;
                    } else {
                        p2Strategy = source.getAttribute('strategy');
                        selectP2.value = p2Strategy;
                    }
                    // console.log(p1Strategy, p2Strategy);
                    // if (source.dataset.effect === 'move') {
                    //     dropNode.appendChild(source);
                    //     toggleEditable(source);
                    // } else if (source.dataset.effect === 'copy') {
                    //     let clone = source.cloneNode(true);
                    //     clone.dataset.effect = 'move';
                    //     makeDraggable(clone);
                    //     dropNode.appendChild(clone);
                    //     toggleEditable(clone);
                    // }
                }
            }
        };
        // 清除所有具有 'drop-over' 类的节点的样式
        function clearDropStyle() {
            const dropNodes = document.querySelectorAll('.drop-over');
            dropNodes.forEach((node) => {
                node.classList.remove('drop-over');
            });
        }
        // 根据传入的节点向上寻找具有 data-drop 属性的节点
        function getDropNode(node) {
            while (node) {
                if (node.dataset?.drop) {
                    return node;
                }
                node = node.parentNode;
            }
        }
        // 处理拖动开始时的事件，设置拖动效果和存储源元素
        function handleDragStart(e) {
            e.dataTransfer.effectAllowed = e.target.dataset.effect;
            source = e.target;
        }
        // 使元素可拖动，并在拖动开始时处理事件
        function makeDraggable(element) {
            element.draggable = true;
            element.ondragstart = handleDragStart;
        }

        // ???函数用于在双击时切换元素的可编辑状态
        function toggleEditable(element) {
            element.addEventListener('dblclick', function () {
                this.contentEditable = true;
                const range = document.createRange();
                range.selectNodeContents(this);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                this.addEventListener('blur', function () {
                    this.contentEditable = false;
                    this.innerHTML = this.textContent.trim() ? this.textContent : '&nbsp;';
                }, { once: true });
            });
        }
    }


    // 策略 pg...
    {
        function pgAlwaysCooperate() {
            return 1;
        }
        function pgAlwaysDefect() {
            return 0;
        }

        function pgTitForTat(historyActions = historyActions, myindex = 0) {
            if (historyActions.length === 0) {
                return 1;
            } else {
                return historyActions[historyActions.length - 1][1 - myindex];
            }
            // return p1Choice;
        }
    }

    // historyActions 为一个数组，存储了之前的选择, [[1, 0], [0, 1]]

    let historyActions = [];
    let historyP1Choices = [];
    let historyP2Choices = [];

    let currentAreaIndex = 0;
    function displayeveryResults(results) {
        const resultsDiv = document.getElementById('displayArea');
        // 不删除原来结果，类比换页，加入这一次的结果并显示，但显示“上一次”按钮、“下一次”按钮
        let cnt = 1;
        const newArea = document.createElement('div');
        newArea.id = `area-${currentAreaIndex}`;
        results.forEach((result) => {
            const div = document.createElement('div');
            // div.textContent = `甲乙：(${result[0]}, ${result[1]})`;
            div.textContent = `第${cnt++}局：甲：${result[0]}|乙: ${result[1]}`;
            newArea.appendChild(div);
        });
        resultsDiv.appendChild(newArea);
        // 隐藏其它区域
        document.querySelectorAll('#displayArea > div').forEach(area => area.style.display = 'none');
        const currentArea = document.getElementById(`area-${currentAreaIndex}`);
        if (currentArea) {
            currentArea.style.display = 'block';
        }
        currentAreaIndex++;
        const newButton = document.createElement('button');
        newButton.textContent = `第 ${currentAreaIndex} 次结果`;
        newButton.addEventListener('click', function () {
            // 隐藏当前区域
            document.querySelectorAll('#displayArea > div').forEach(area => area.style.display = 'none');
            // 显示指定区域
            newArea.style.display = 'block';
        });
        document.getElementById('buttonArea').appendChild(newButton);
    }
    // function displayfinalResults(results) {


    const selectP1 = document.getElementById('select-multi-player1-strategy');
    const selectP2 = document.getElementById('select-multi-player2-strategy');

    selectP1.addEventListener('change', function () {
        p1Strategy = this.value;
    });
    selectP2.addEventListener('change', function () {
        p2Strategy = this.value;
    });

    // var strategies = document.querySelectorAll('.strategy');
    function loadSelfStrategiesARefresh() {
        let strategies = document.querySelectorAll('.strategy');
        // 加入 select 选项
        selectP1.innerHTML = ''; selectP2.innerHTML = '';
        strategies.forEach((strategy) => {
            const option = document.createElement('option');
            option.value = strategy.getAttribute('strategy');
            option.textContent = strategy.getAttribute('strategy');
            selectP2.appendChild(option);
            const optio = option.cloneNode(true);
            selectP1.appendChild(optio);
        });
    }
    loadSelfStrategiesARefresh();
    const refreshStrategiesBut = document.getElementById('refresh-strategies');
    refreshStrategiesBut.addEventListener('click', function () {
        loadSelfStrategiesARefresh();
    });

    const multiGameStartButton = document.getElementById('multi-game-start');
    multiGameStartButton.addEventListener('click', function () {
        const rounds = document.getElementById('multi-game-rounds').value;

        const results = [];
        for (let i = 0; i < rounds; i++) {
            let p1Choice = 1;
            let p2Choice = 1;
            {
                if (p1Strategy === 'AlwaysCooperate') {
                    p1Choice = pgAlwaysCooperate();
                }
                else if (p1Strategy === 'AlwaysDefect') {
                    p1Choice = pgAlwaysDefect();
                }
                else if (p1Strategy === 'TitForTat') {
                    p1Choice = pgTitForTat(historyActions, 0);
                }
                else if (p1Strategy === 'RandomChoice') {
                    p1Choice = pgRandomChoice();
                }
            }

            {
                if (p2Strategy === 'RandomChoice') {
                    p2Choice = pgRandomChoice();
                }
                else if (p2Strategy === 'AlwaysCooperate') {
                    p2Choice = pgAlwaysCooperate();
                }
                else if (p2Strategy === 'AlwaysDefect') {
                    p2Choice = pgAlwaysDefect();
                }
                else if (p2Strategy === 'TitForTat') {
                    p2Choice = pgTitForTat(historyActions, 1);
                }
            }
            historyActions.push([p1Choice, p2Choice]);
            historyP1Choices.push(p1Choice);
            historyP2Choices.push(p2Choice);
            results.push(prisonGame(p1Choice, p2Choice));
        }
        console.log(historyActions);
        console.log(historyP1Choices);
        console.log(historyP2Choices);
        // console.log(results);
        console.log(p1Strategy, p2Strategy);
        displayeveryResults(results);
    }
    );

}
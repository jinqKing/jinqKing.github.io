
window.onbeforeunload = function (event) {
    event.returnValue = "Are you sure you want to leave?";
};


document.addEventListener('DOMContentLoaded', () => {
    const initializeLanguage = () => {
        let lang = navigator.language || navigator.userLanguage;
        if (!['zh', 'en', 'ja'].includes(lang)) {
            lang = 'zh';
        }
        return lang;
    };

    const setupChoiceContainers = () => {
        const containers = document.querySelectorAll('.choice_container');
        containers.forEach(container => {
            const correctNumber = container.getAttribute('answer');
            const numbers = container.querySelectorAll('.number');
            numbers.forEach(number => {
                number.addEventListener('click', () => handleNumberClick(number, correctNumber, container));
            });
        });
    };

    const handleNumberClick = (number, correctNumber, container) => {
        if (number.textContent.trim() === correctNumber) {
            number.classList.add('selected');
            number.style.pointerEvents = 'none';
            number.style.backgroundColor = 'lightseagreen';
            revealNextContainers(container.parentElement);
        } else {
            number.classList.add('shake');
            setTimeout(() => {
                number.classList.remove('shake');
            }, 500);
        }
    };

    const revealNextContainers = (container, storeChanges = true) => {
        const nextContainerIds = container.getAttribute('next');
        // 
        if (nextContainerIds) {
            const idsArray = nextContainerIds.split(',');
            idsArray.forEach(id => {
                const nextContainer = document.getElementById(id.trim());
                if (nextContainer) {
                    nextContainer.classList.remove('hidden');
                    // void nextContainer.offsetWidth;
                    nextContainer.classList.add('revealed');

                    if (storeChanges) {
                        const nextContainerId = nextContainer.getAttribute('id');
                        localStorage.setItem(`revealed-${nextContainerId}`, 'true');
                    }
                    // setTimeout(() => {
                    // nextContainer.classList.remove('revealingEffect');
                    // }, 500);
                    // nextContainer.style.display = 'block';
                }
            });
        }
    };

    const hidAllContainers = (container, checkStorage = false) => {
        const nextContainerIds = container.getAttribute('next');
        if (nextContainerIds) {
            const idsArray = nextContainerIds.split(',');
            idsArray.forEach(id => {
                const nextContainer = document.getElementById(id.trim());
                if (nextContainer) {
                    if (checkStorage) {
                        const nextContainerId = nextContainer.getAttribute('id');
                        const isRevealed = localStorage.getItem(`revealed-${nextContainerId}`);
                        // console.log('isRevealed', isRevealed, nextContainerId);
                        // if (isRevealed) {
                        //     // nextContainer.classList.add('revealed');
                        //     // nextContainer.classList.add('hidden');
                        //     // nextContainer.classList.remove('revealed');
                        //     continue;
                        // } else {
                        //     nextContainer.classList.add('hidden');
                        // }
                        if(isRevealed !== 'true'){
                            nextContainer.classList.add('hidden');
                            nextContainer.classList.remove('revealed');
                        }
                    } else {
                        nextContainer.classList.add('hidden');
                        nextContainer.classList.remove('revealed');
                    }
                    // nextContainer.classList.add('hidden');
                    // nextContainer.classList.remove('revealed');
                    // nextContainer.style.display = 'none';
                }
            });
        }
    };
    const setupTextTemplates = () => {
        const textTemplates = document.querySelectorAll('.text');
        textTemplates.forEach(textTemplate => {
            const enContent = textTemplate.querySelector('.en');
            const zhContent = textTemplate.querySelector('.zh');
            const jaContent = textTemplate.querySelector('.ja');
            const availableLanguages = [];
            if (enContent) availableLanguages.push({ code: 'en', element: enContent });
            if (zhContent) availableLanguages.push({ code: 'zh', element: zhContent });
            if (jaContent) availableLanguages.push({ code: 'ja', element: jaContent });

            if (availableLanguages.length === 0) return;

            const textId = textTemplate.getAttribute('id');
            const savedLanguage = localStorage.getItem(`language-${textId}`) || availableLanguages[0].code;

            const showLanguage = (languageCode) => {
                availableLanguages.forEach(({ code, element }) => {
                    element.style.display = (code === languageCode) ? 'block' : 'none';
                });
            };

            showLanguage(savedLanguage);

            const button = document.createElement('button');
            button.classList.add('toggle-button');
            button.textContent = savedLanguage;

            button.addEventListener('click', () => {
                const currentIndex = availableLanguages.findIndex(({ code }) => code === button.textContent);
                const nextIndex = (currentIndex + 1) % availableLanguages.length;
                const nextLanguage = availableLanguages[nextIndex].code;
                showLanguage(nextLanguage);
                button.textContent = nextLanguage;
                localStorage.setItem(`language-${textId}`, nextLanguage);
            });
            textTemplate.appendChild(button);
        });
    };


    let isHidden = true;let keepMemory = true;
    const changeDisplayLogics = () => {
        const testElements = document.querySelectorAll('.test');
            testElements.forEach(container => {
                // container.classList.remove('revealed');
                if (isHidden) {
                    // container.classList.remove('revealed');
                    revealNextContainers(container, false);
                    // console.log('revealed', container);
                } else {
                    // container.classList.add('hidden');
                    hidAllContainers(container, true);
                }
            });
            isHidden = !isHidden;
    }
    const setupToggleDisplayButton = () => {
        const toggleDisplayBut = document.getElementById('toogleDisplayBut');
        
        toggleDisplayBut.addEventListener('click', () => {
            changeDisplayLogics();
            toggleDisplayBut.textContent = isHidden ? '显示所有内容' : '恢复继续探索';
        });
    };

    const setupRestoreDisplayButton = () => {
        const restoreDisplayBut = document.getElementById('restoreDisplayBut');
        const toggleDisplayBut = document.getElementById('toogleDisplayBut');
        // 第一次点击，回到最开始，允许继续探索，第二次清除本地存储，回到最开始
        
        restoreDisplayBut.addEventListener('click', () => {
            // if (keepMemory) {
            //     const testElements = document.querySelectorAll('.test');
            //     testElements.forEach(container => {
            //         hidAllContainers(container, false);
            //         // container.classList.add('hidden');
            //         // container.classList.remove('revealed');
            //     });
            //     keepMemory = false;isHidden = true;
            //     changeDisplayLogics();
            //     toggleDisplayBut.textContent = '恢复继续探索';
            //     restoreDisplayBut.textContent = '重置本地进度';
            // } else {
                localStorage.clear();
                window.location.reload();
            // }
        });
    };

    const lang = initializeLanguage();
    setupChoiceContainers();
    setupTextTemplates();
    setupToggleDisplayButton();
    setupRestoreDisplayButton();
});


// document.addEventListener('DOMContentLoaded', () => {
//     const lang = navigator.language || navigator.userLanguage;
//     // 若不是中文、英文、日文，则默认为中文
//     if (!['zh', 'en', 'ja'].includes(lang)) {
//         lang = 'zh';
//     }

//     const containers = document.querySelectorAll('.choice_container');
//     containers.forEach(container => {
//         const correctNumber = container.getAttribute('answer');
//         const numbers = container.querySelectorAll('.number');
//         numbers.forEach(number => {
//             number.addEventListener('click', () => {
//                 if (number.textContent.trim() === correctNumber) {
//                     number.classList.add('selected'); number.style.pointerEvents = 'none'; number.style.backgroundColor = 'lightseagreen';
//                     const nextContainerIds = container.parentElement.getAttribute('next');
//                     if (nextContainerIds) {
//                         const idsArray = nextContainerIds.split(',');
//                         idsArray.forEach(id => {
//                             const nextContainer = document.getElementById(id.trim());
//                             if (nextContainer) {
//                                 nextContainer.classList.remove('hidden');
//                                 nextContainer.style.display = 'block';
//                             }
//                         });
//                     }
//                 } else {
//                     number.classList.add('shake');
//                     setTimeout(() => {
//                         number.classList.remove('shake');
//                     }, 500);
//                 }
//             });
//         });
//     });

//     const textTemplates = document.querySelectorAll('.text');

//     textTemplates.forEach(textTemplate => {
//         const enContent = textTemplate.querySelector('.en');
//         const zhContent = textTemplate.querySelector('.zh');
//         const jaContent = textTemplate.querySelector('.ja');

//         const availableLanguages = [];
//         if (enContent) availableLanguages.push({ code: 'en', element: enContent });
//         if (zhContent) availableLanguages.push({ code: 'zh', element: zhContent });
//         if (jaContent) availableLanguages.push({ code: 'ja', element: jaContent });

//         if (availableLanguages.length === 0) return;

//         const textId = textTemplate.getAttribute('id');
//         const savedLanguage = localStorage.getItem(`language-${textId}`) || availableLanguages[0].code;

//         const showLanguage = (languageCode) => {
//             availableLanguages.forEach(({ code, element }) => {
//                 element.style.display = (code === languageCode) ? 'block' : 'none';
//             });
//         };

//         showLanguage(savedLanguage);

//         const button = document.createElement('button');
//         button.classList.add('toggle-button');
//         button.textContent = savedLanguage;

//         button.addEventListener('click', () => {
//             const currentIndex = availableLanguages.findIndex(({ code }) => code === button.textContent);
//             const nextIndex = (currentIndex + 1) % availableLanguages.length;
//             const nextLanguage = availableLanguages[nextIndex].code;
//             showLanguage(nextLanguage);
//             button.textContent = nextLanguage;
//             localStorage.setItem(`language-${textId}`, nextLanguage);
//         });
//         textTemplate.appendChild(button);
//     });



//     const toogleDisplayBut = document.getElementById('toogleDisplayBut');
//     let isHidden = true;
//     toogleDisplayBut.addEventListener('click', () => {
//         const revealedElements = document.querySelectorAll('.hidden');
//         revealedElements.forEach(container => {
//             if (isHidden) {
//                 container.classList.remove('hidden');
//             } else {
//                 container.classList.add('hidden');
//             }
//         });
//         isHidden = !isHidden;
//         toogleDisplayBut.textContent = isHidden ? '显示所有' : '恢复探索';
//     });

//     // const restoreDisplayBut = document.getElementById('restoreDisplayBut');
//     // restoreDisplayBut.addEventListener('click', () => {
//     //     const revealedElements = document.querySelectorAll('.hidden');
//     //     revealedElements.forEach(container => {
//     //         container.classList.add('hidden');
//     //     });
//     //     toogleDisplayBut.textContent = '显示所有的元素';
//     // });


// });


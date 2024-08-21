function createCheckeredFlag(container) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 10; col++) {
        const box = document.createElement('div');
        box.className = 'box';
        box.style.width = '10%';
        box.style.height = '20%';
        box.style.backgroundColor = ((row + col) % 2 == 0) ? 'white' : 'black';
        container.appendChild(box);
        }
    }
}

function removeCheckeredFlag () {
    const elementsToRemove = document.querySelectorAll('.box');
    if (elementsToRemove.length > 0) {
        elementsToRemove.forEach((box) => {
            box.remove();
        });
    }
}

const flag_colors = new Map([['safe', 'green'],['danger', 'red'], ['hazard', 'yellow'], ['none', 'white'],['finished', 'checkered']]);

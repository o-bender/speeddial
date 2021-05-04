const createOverlay = () => {
    const modalWindowTemplate = document.querySelector('#modal-window').content;
    const modalWindow = modalWindowTemplate.cloneNode(true).querySelector('.overlay');
    modalWindow.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('overlay')) {
            document.body.removeChild(evt.target);
        }
    });
    modalWindow.addEventListener('submit', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        const url = modalWindow.querySelector('input[name="url"]').value;
        const name = modalWindow.querySelector('input[name="name"]').value;
        const logo = '';
        const backgroundColor = '';
        if (!localStorage.getItem(url)) {
            const tileData = {
                url,
                name,
                logo,
                backgroundColor,
            };
            localStorage.setItem(url, JSON.stringify(tileData));
            const tileElement = createTile(tileData);
            document.body.querySelector('.tiles-list').appendChild(tileElement);
        }
        document.body.removeChild(evt.target.closest('.overlay'));
    })

    document.body.appendChild(modalWindow);
}

const getSiteColor = () => {
    fetch('https://www.yandex.ru/', {mode: 'no-cors'})
        .then((response) => {
            console.log(response);
            if (response.ok) {
                return response.text();
            }
            throw 'hui';
        })
        .then((responseText) => {
            console.log(responseText);
        });
}

const createTile = (tileData) => {
    console.log(tileData);
    const tileTemplate = document.querySelector('#tile').content;
    const tileWrapperElement = tileTemplate.cloneNode(true).querySelector('.tile-wrapper');
    const tileElement = tileWrapperElement.querySelector('.tile');
    tileElement.style.backgroundColor = tileData['backgroundColor'];
    tileElement.href = tileData['url'];
    tileElement.querySelector('.tile-name').textContent = tileData['name'];
    tileElement.querySelector('.tile-url').textContent = tileData['url'].split('/')[2];
    tileElement.querySelector('.tile-logo').style.webkitMask = `url(${tileData['logo']}) center center no-repeat`;
    return tileWrapperElement
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (evt) => {
        const target = evt.target;
        const targetClassList = target.classList;
        if (targetClassList.contains('tile-add')) {
            createOverlay();
        }
    });


    // getSiteColor();
    for(let key in localStorage) {
        if (key.startsWith('http') && localStorage.hasOwnProperty(key)) {
            console.log(key);
            const e = createTile(JSON.parse(localStorage.getItem(key)));
            document.body.querySelector('.tiles-list').appendChild(e);
        }
    }
});
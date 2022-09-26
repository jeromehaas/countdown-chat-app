const io  = require('socket.io-client');

class Chat {

    constructor() {
        this.name = 'messages';
        this.baseUrl = 'http://localhost:3005',
        this.socket = null;
        this.elements = {
            container: document.querySelector('.chat .chat__container'),
            input: document.querySelector('.chat .controls__input'),
            button: document.querySelector('.chat .controls__button'),
        };
    };

    init = () => {
        if (!document.querySelector('.js-chat')) return; 
        this.setupSocketConenction();
        this.addEventListeners();
        this.openSocketListeners();
    };

    openSocketListeners = () => {
        this.socket.on('message', (message) => this.printMessages(message));
    };

    addEventListeners = () => {
        this.elements.button.addEventListener('click', (event) => {
            event.preventDefault();
            this.sendMessage();
            this.clearInput();
        });
    };

    clearInput = () => {
        this.elements.input.value = '';
    };
    
    setupSocketConenction = () => {
        this.socket = io(this.baseUrl);
        this.socket.on('connect', () => {
            console.log('⭐ SOCKET.IO: connected');
        });
    };

    sendMessage = () => {
        const value = this.elements.input.value;
        this.socket.emit('message', value);

    };

    printMessages = (message) => {
        let item;
        item = document.createElement('div')
        item.classList.add('container__item', 'message');
        let text;
        text = document.createElement("p");
        text.classList.add('message__text');
        text.innerHTML = message;
        item.appendChild(text);
        this.elements.container.appendChild(item);
    };  

};

module.exports = Chat;
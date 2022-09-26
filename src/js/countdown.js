const gsap = require('gsap');
const io  = require('socket.io-client');
const qrcode = require('qrcode');

class Countdown {

    constructor() {
        this.name = 'countdown';
        this.baseUrl =  'http://localhost:3005',
        this.dates = {
            current: {
                date: null,
                days: null,
                hours: null,
                minutes: null,
                seconds: null,
            },
            target: {
                date: null,
                days: null,
                hours: null,
                minutes: null,
                seconds: null,
            }
        };
        this.interval = null,
        this.elements = {
            title: document.querySelector('.countdown__title'),
            rings: {
                days: document.querySelector('.countdown__ring.ring--days'),
                hours: document.querySelector('.countdown__ring.ring--hours'),
                minutes: document.querySelector('.countdown__ring.ring--minutes'),
                seconds: document.querySelector('.countdown__ring.ring--seconds'),
            },
            messages: {
                container: document.querySelector('.messages__container'),
                qrCode: document.querySelector('.messages__qr-code'),
            },
        };
    };

    init = () => {
        if (!document.querySelector('.countdown')) return;
        this.initTargetDate();
        this.initCurrentDate();
        this.initRingPositions();
        this.initTitle();
        this.initInterval();
        this.setupSocketConenction();
        this.openSocketListeners();
        this.initQrCode();
    };

    initQrCode = () => {
        qrcode.toCanvas(this.elements.messages.qrCode, `${ this.baseUrl }/chat`, (error)  => {
            if (error) console.log(`🔥 QRCODE: error.message`);
        });
    };

    initTitle = () => {
        this.elements.title.innerText = this.dates.target.years + 1;
    };

    initTargetDate =  () => {
        const currentDate= new Date();
        const targetDate  =  new Date(currentDate.getFullYear(), 11, 31, 0, 0, 0);
        this.dates.target.date = targetDate;
        this.dates.target.years = targetDate.getFullYear();
        this.dates.target.hours = targetDate.getHours();
        this.dates.target.minutes = targetDate.getMinutes();
        this.dates.target.seconds = targetDate.getSeconds();
    };
    
    initCurrentDate  = () => {
        const currentDate= new Date();
        this.dates.current.date = currentDate;
        this.dates.current.years = currentDate.getFullYear();
        this.dates.current.days = this.calculateDaysBetweenNowAndDate();
        this.dates.current.hours = currentDate.getHours();
        this.dates.current.minutes = currentDate.getMinutes();
        this.dates.current.seconds = currentDate.getSeconds();
    };

    initRingPositions = () => {
        const seconds = (360 * (this.dates.target.seconds - this.dates.current.seconds) / 60);
        const minutes = (360 * (this.dates.target.minutes - this.dates.current.minutes) / 60);
        const hours = (360 * (this.dates.target.hours - this.dates.current.hours ) / 24);
        const days = (360 * (this.dates.target.days - this.dates.current.days) / 365);
        gsap.gsap.to(this.elements.rings.seconds, { rotate: seconds }); 
        gsap.gsap.to(this.elements.rings.minutes, { rotate: minutes }); 
        gsap.gsap.to(this.elements.rings.hours, { rotate: hours }); 
        gsap.gsap.to(this.elements.rings.days, { rotate: days }); 
    };
    
    initInterval = () => {
        this.interval = setInterval(() => {
            this.calculateTime();
            this.initCurrentDate();
        }, 1000);
    };
 
    calculateTime = () => {
        const currentDate  = new Date();
        if (this.dates.current.seconds < currentDate.getSeconds() || this.dates.current.seconds === 59) this.updateDots('seconds');
        if (this.dates.current.minutes < currentDate.getMinutes() || this.dates.current.minutes === 59) this.updateDots('minutes');
        if (this.dates.current.hours < currentDate.getHours() || this.dates.current.hours === 23) this.updateDots('hours');
        if (this.dates.current.days < this.calculateDaysBetweenNowAndDate()) this.updateDots('days');
    };

    updateDots = (unit) => {
        switch(unit) {
            case 'seconds': return gsap.gsap.to(this.elements.rings.seconds, { rotate: `-=${360 / 60}`, ease: 'none', duration: 1 }); 
            case 'minutes': return gsap.gsap.to(this.elements.rings.minutes, { rotate: `-=${360 / 60}`, ease: 'none', duration: 0.5 }); 
            case 'hours': return gsap.gsap.to(this.elements.rings.hours, { rotate: `-=${360 / 24}`, ease: 'none', duration: 0.5 }); 
            case 'days': return gsap.gsap.to(this.elements.rings.days, { rotate: `-=${360 / 365}`, ease: 'none', duration: 0.5 }); 
        };
    };

    calculateDaysBetweenNowAndDate = () => {
        const differenceInMiliseconds = this.dates.current.date.getTime() - this.dates.target.date.getTime();
        const differenceInDay = Math.ceil(differenceInMiliseconds / (1000 * 3600 * 24));
        return differenceInDay;
    };

    setupSocketConenction = () => {
        this.socket = io(this.baseUrl);
        this.socket.on('connect', () => {
            console.log('⭐ SOCKET.IO: connected');
        });
    };

    openSocketListeners = () => {
        this.socket.on('message', (message) => this.printMessages(message));
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
        this.elements.messages.container.appendChild(item);
    };  

    

};

module.exports = Countdown;
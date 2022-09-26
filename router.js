const express = require('express');
const Router = express.Router;
const router = new Router();
const Message = require('./schemas/message-schema');

router.get('/', async (req, res, next) => {
    const messages = await (await Message.find({})).map((item) => item.text);
    res.render('overview', { layout: 'skeleton', messages: messages });
});

router.get('/chat', async (req, res, next) => {
    const messages = await (await Message.find({})).map((item) => item.text);
    res.render('chat', { layout: 'skeleton', messages: messages });
});


module.exports = router;


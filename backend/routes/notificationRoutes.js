
const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

router.post('/send', (req, res) => {
    const { to, message } = req.body;

    client.messages.create({
        body: message,
        to: to,
        from: process.env.TWILIO_PHONE_NUMBER
    })
    .then((message) => res.status(200).send({ success: true, message: 'Notification sent!', sid: message.sid }))
    .catch((error) => res.status(500).send({ success: false, message: 'Failed to send notification', error }));
});

module.exports = router;

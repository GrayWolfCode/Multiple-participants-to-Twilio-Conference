const express = require('express');
const bodyParser = require('body-parser');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const twilio = require('twilio');
const app = express();
const accountSid = '';
const authToken = '';
const client = twilio(accountSid, authToken);
// Allowed numbers to start the conference
const allowedNumbers = ['+18126182967', '+15407265280'];
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/call', (req, res) => {
    const fromNumber = req.body.From;
    if (!allowedNumbers.includes(fromNumber)) {
        console.log('Unauthorized number attempted to start the conference:', fromNumber);
        return res.sendStatus(403);
    }
    const voiceResponse = new VoiceResponse();
    const conferenceName = 'myConference';
    const dial = voiceResponse.dial();
    dial.conference({ startConferenceOnEnter: true, endConferenceOnExit: true }, conferenceName);
    allowedNumbers.forEach((number) => {
        if (number !== fromNumber) {
            client.calls.create({
                from: '+18148015379',
                to: number,
                url: 'https://1d04-188-43-14-13.ngrok-free.app/joinConf/desk'
            });
        }
    });
    res.type('text/xml');
    res.send(voiceResponse.toString());
});
app.post('/joinConf/desk', (req, res) => {
    const conferenceName = 'myConference';
    const voiceResponse = new VoiceResponse();
    const dial = voiceResponse.dial();
    dial.conference({ startConferenceOnEnter: true, endConferenceOnExit: true }, conferenceName);
    res.type('text/xml');
    res.send(voiceResponse.toString());
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

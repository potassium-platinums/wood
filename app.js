const mqtt = require('mqtt');
const axios = require('axios');

const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('sensor/data'); // Topic you are interested in
});

mqttClient.on('message', (topic, message) => {
    let data = JSON.parse(message.toString());
    // console.log(data);
   axios.post('https://coffee.rndnakawa.com/insert.php', {
        id: "ojok",
        name: "okumu",
        email: "ronald"
    }).then(res => {
        console.log("Data sent to PHP");
    }).catch(err => {
        console.error("Error sending data to PHP", err);
    });


});

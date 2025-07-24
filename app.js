const mqtt = require('mqtt');
const axios = require('axios');


// mgtt user data
const brokerURL = 'mqtt://mqtt.koinsightug.com';
const username = 'gkfiqxkh';
const password = 'wtc48z8dSovj';

// Connection options
const options = {
    port: 1883,
    username: username,
    password: password
};

const mqttClient = mqtt.connect(brokerURL, options); 

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    // Subscribe to topics
    mqttClient.subscribe('woodCount/+/content', (err) => {
        if (!err) {
            // console.log(`Subscribed to topic`);
        }
    });
    mqttClient.subscribe('woodCount/+/state', (err) => {
        if (!err) {
            // console.log(`Subscribed to topic`);
        }
    });


});



// Global object to track state per device
let deviceStates = {};  // { device_id: status }

mqttClient.on('message', async (topic, message) => {
    try {
        let mqtt_data = JSON.parse(message.toString());
        // console.log(mqtt_data);
    
        let deviceID = mqtt_data.device_id;
        let deviceState = mqtt_data.status;
        let deviceCount = mqtt_data.count;
        let deviceDate = mqtt_data.date;
        let deviceTime = mqtt_data.time;
        let deviceLocation = mqtt_data.location;

        // Only proceed if deviceID is present
        if (!deviceID) return;

        // Update device state if provided
        if (deviceState !== undefined) {
            deviceStates[deviceID] = deviceState;
            // send other data
            axios.post('https://coffee.rndnakawa.com/api/insert_status.php', {
                id: deviceID,
                status: deviceState,
            }).then(res => {
                console.log("Data sent to PHP:", res.data);
            }).catch(err => {
                console.error("Error sending data to PHP", err);
            });
            
        }

        // If we received count, date, time, and location, proceed to update logic
        if (deviceCount !== undefined && deviceDate && deviceTime && deviceLocation) {

            // send other data
            axios.post('https://coffee.rndnakawa.com/api/insert_data.php', {
                id: deviceID,
                count: deviceCount,
                date: deviceDate,
                time: deviceTime,
                location: deviceLocation,
            }).then(res => {
                console.log("Data sent to PHP:", res.data);
            }).catch(err => {
                console.error("Error sending data to PHP", err);
            });
        }


    } catch (error) {
        console.error("Error handling MQTT message:", error);
    }
});

const mqtt = require('mqtt');
const mysql = require('mysql');

const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

// sql
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testdb",
});
connection.connect(function (err) {
    if (err) {
        console.log("connection erro");
        console.log(err);
    }else{
        console.log("connected to db");
        
    }
});

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('sensor/data'); // Topic you are interested in
});

mqttClient.on('message', (topic, message) => {
    let data = JSON.parse(message.toString());
    // console.log(data);
    connection.query("INSERT INTO `users`(`id`, `name`, `email`) VALUES (?,?,?)",["ojok","okumu","ronald"],(err, data)=>{
        if (err) throw err;
            console.log("row inserted");
            
    })

    
    


});

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const basicAuth = require('express-basic-auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// code fragment responsible for managing device states
const deviceStates = {};
const deviceTimeouts = {};

// Basic Auth authentication for HTTP
const authUsers = { 'admin': 'atu!3' };  // USER_LOGIN, USER_PASSWORD
app.use(basicAuth({
    users: authUsers,
    challenge: true,  // Causes a login dialog box to pop up
    realm: 'MQTTServer'
}));

// MQTT connection options with authentication
const mqttOptions = {
    host: '192.168.111.1',
    port: 1883,    // Port MQTT
    username: 'admin',
    password: 'atu!3'
};

// Connection to MQTT server
const mqttClient = mqtt.connect(mqttOptions);

mqttClient.on('connect', () => {
    console.log("Connected to MQTT broker");
    mqttClient.subscribe('#');
});

mqttClient.on('message', (topic, message) => {
    const parts = topic.split('/');
    const device = parts[0]; // 'Boiler' or 'Heating'
    const type = parts[1]; // 'Relay' or 'Temperature'
    const id = parts[2]; // 'relay1', 'relay2', or 'sensorId'
    const value = message.toString();

    if (!deviceStates[device]) {
        deviceStates[device] = {};
    }
    deviceStates[device][id] = { type, value };

    // Reset timeout
    clearTimeout(deviceTimeouts[device]);
    deviceTimeouts[device] = setTimeout(() => {
        console.log(`Removing inactive device: ${device}`);
        delete deviceStates[device];
        io.emit('removeDevice', { device });
    }, 180000); // 3 minutes

    io.emit('data', { device, type, id, value });
});

io.on('connection', (socket) => {
    console.log('A client connected');

    Object.keys(deviceStates).forEach(device => {
        Object.keys(deviceStates[device]).forEach(id => {
            const { type, value } = deviceStates[device][id];
            socket.emit('data', { device, type, id, value });
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('switchRelay', (data) => {
        const { device, id, action } = data;
        // Preparing a topic MQTT and a message
        const topic = `${device}/Relay/${id}`;
        const message = action === 'on' ? 'on' : 'off';

        // Publication to broker MQTT
        mqttClient.publish(topic, message, {}, (err) => {
            if (err) {
                console.log("Error publishing to MQTT:", err);
            } else {
                console.log(`Published to MQTT topic "${topic}" message "${message}"`);
            }
        });
    });

    socket.on('removeDevice', (data) => {
        const { device } = data;
        if (deviceStates[device]) {
            delete deviceStates[device];
            socket.emit('removeDevice', { device }); // Emit to all clients might be needed
            console.log(`Device ${device} removed after inactivity.`);
        }
    });

});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 2000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

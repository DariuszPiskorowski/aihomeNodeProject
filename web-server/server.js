const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const basicAuth = require('express-basic-auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Fragment kodu odpowiedzialny za zarządzanie stanem urządzeń
const deviceStates = {};
const deviceTimeouts = {};

// Uwierzytelnianie Basic Auth dla HTTP
const authUsers = { 'admin': 'atu!3' };  // USER_LOGIN, USER_PASSWORD
app.use(basicAuth({
    users: authUsers,
    challenge: true,  // Powoduje wyskoczenie okna dialogowego do logowania
    realm: 'MQTTServer'
}));

// Opcje połączenia MQTT z uwierzytelnianiem
const mqttOptions = {
    host: 'aihome.local',
    port: 1883, // Zwykle MQTT korzysta z portu 1883 bez szyfrowania, zmień jeśli używasz innego
    username: 'admin',
    password: 'atu!3'
};

// Połączenie z serwerem MQTT
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
        // Przygotowanie tematu MQTT i wiadomości
        const topic = `${device}/Relay/${id}`;
        const message = action === 'on' ? 'on' : 'off';

        // Publikacja do brokera MQTT
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

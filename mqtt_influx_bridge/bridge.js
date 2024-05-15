const mqtt = require('mqtt');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// current config InfluxDB
const influxDBUrl = 'http://influxdb:8086';
const token = 'ecfIkGdIqwB-dEoIHT722esCaFnnYYdFN7JNLvsVbEHnZixuRVZOJSuJEq-yTP7qruXdZ99TwVrDZIeI4C1ltw=='; // BRIDGE_TOKEN
const org = 'ATU';
const bucket = 'AtuProject';

const clientInflux = new InfluxDB({ url: influxDBUrl, token: token });


// config MQTT
const mqttBrokerUrl = 'mqtt://AIHome.local';
const options = {
 // clientId: 'influxBridge',
  username: 'admin',   // USER_LOGIN
  password: 'atu!3'    // USER_PASSWORD
};
const mqttClient = mqtt.connect(mqttBrokerUrl, options);

const subscriptionTopic = '#'; // Subscribe all topics

mqttClient.on('connect', () => {
  console.log('Connected to MQTT Broker');
  mqttClient.subscribe(subscriptionTopic, () => {
    console.log(`Subscription of all topics (${subscriptionTopic})`);
  });
});

mqttClient.on('message', (topic, message) => {
  console.log(`Received msg from ${topic}: ${message.toString()}`);

  // Recording to influx
  const writeApi = clientInflux.getWriteApi(org, bucket);
  const point = new Point('mqtt_data').tag('topic', topic);

 if (topic.includes('Temperature')) {
    const value = parseFloat(message);
  if(!isNaN(value)){
    point.floatField('value', value);
   } else {
     console.error(`Received non-numeric data on topic ${topic}: ${message}`);
     return;
   }
  }else{
    point.stringField('message', message);
  }

  writeApi.writePoint(point);
  writeApi
    .close()
    .then(() => {
      console.log('Wrote data to InfluxDB');
    })
    .catch((err) => {
      console.error(`Error during writing data to InfluxDB: ${err}`);
    });
});



#include "DHT.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <BH1750.h>
#include <Wire.h>

#define DHTPIN 4  // cổng trên esp kết nối với sensor
#define DHTTYPE DHT11
#define LEDPIN 5
#define FANPIN 16
#define AIR_CONDITIONERPIN 17

// WiFi Config
const char* WIFI_SSID = "Minh";
const char* WIFI_PASS = "123456789";

// MQTT Config
const char* MQTT_SERVER = "172.11.9.22";
const int MQTT_PORT = 1883;
const char* username = "user1";
const char* password = "123";
const int qos = 1;
const String topicLed = "esp32/led";
const String topicFan = "esp32/fan";
const String topicAirConditioner = "esp32/air_conditioner";

// MQTT client sử dụng WiFi
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

// dht
DHT dht(DHTPIN, DHTTYPE);

// bh1750
BH1750 lightMeter;
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String topicStr = String(topic);
  String message;

  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.println("Topic: " + topicStr);
  Serial.println("Message: " + message);

  if (topicStr == topicLed) {
    digitalWrite(LEDPIN, message == "off" ? LOW : HIGH);
  } else if (topicStr == topicFan) {
    digitalWrite(FANPIN, message == "off" ? LOW : HIGH);
  } else if (topicStr == topicAirConditioner) {
    digitalWrite(AIR_CONDITIONERPIN, message == "off" ? LOW : HIGH);
  }
}
void setup() {
  Serial.begin(9600);
  // kết nối wifi
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Lỗi kết nối wifi");
  }
  Serial.print("\n WiFi Connected. IP: ");
  Serial.println(WiFi.localIP());

  // Cấu hình MQTT
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  mqttClient.setKeepAlive(60);
  mqttClient.setSocketTimeout(30);
  String clientId = "ESP32Client" + String(random(0xffff), HEX);
  while (!mqttClient.connected()) {
    Serial.print("Kết nối MQTT...");
    if (mqttClient.connect(clientId.c_str(), username, password)) {
      Serial.println("Thành công!");
      mqttClient.subscribe(topicLed.c_str(), qos);
      mqttClient.subscribe(topicFan.c_str(), qos);
      mqttClient.subscribe(topicAirConditioner.c_str(), qos);
    } else {
      Serial.print("Thất bại, lỗi: ");
      Serial.println(mqttClient.state());
      delay(2000);
    }
  }

  dht.begin();
  // cấu hình led
  pinMode(LEDPIN, OUTPUT);
  pinMode(FANPIN, OUTPUT);
  pinMode(AIR_CONDITIONERPIN, OUTPUT);

  // cấu hình bh1750
  Wire.begin(21, 22);
  lightMeter.begin();
}

void loop() {
  delay(2000);
  JsonDocument data;
  // Độ ẩm
  float h = dht.readHumidity();
  // Nhiệt độ
  float t = dht.readTemperature();
  // có ánh sáng không
  float lux = lightMeter.readLightLevel();
  data["humidity"] = h;
  data["temperature"] = t;
  data["brightness"] = lux;
  size_t len = measureJson(data) + 1;
  char output[len];
  serializeJson(data, output, len);
  if (mqttClient.connected()) {
    Serial.println(output);
    mqttClient.publish("topic/sendData", output, true);
  }
  mqttClient.loop();
}
#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"
#include "display.h" // OLED header

// ------------------- Pin Definitions -------------------
#define DHTPIN 0
#define DHTTYPE DHT11
#define POT_PIN 27
#define MIC_PIN 28

#define LED_TEMP 16
#define LED_WIND 17
#define LED_NOISE 18

//  WiFi settings
const char *ssid = "My-network";
const char *password = "1122334455";

const char *serverUrl = "http://10.171.156.101:3000/api/weather";

WiFiClient client;

// ------------------- Sensor Setup ----------------------
DHT dht(DHTPIN, DHTTYPE);

// --------------------------------------------------------
void setup()
{
  Serial.begin(115200);
  dht.begin();

  pinMode(LED_TEMP, OUTPUT);
  pinMode(LED_WIND, OUTPUT);
  pinMode(LED_NOISE, OUTPUT);

  initDisplay(); // OLED initialize

  // ---- WiFi Connection ----
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// --------------------------------------------------------
void loop()
{
  // ------------ SAFE DHT READ ------------
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (!isfinite(temp))
    temp = 0;
  if (!isfinite(hum))
    hum = 0;

  // ------------ Wind Sensor ------------
  int potRaw = analogRead(POT_PIN);
  float windSpeed = map(potRaw, 0, 4095, 0, 120);
  if (!isfinite(windSpeed))
    windSpeed = 0;

  // ------------ Noise Sensor ------------
  int micRaw = analogRead(MIC_PIN);
  float noise = map(micRaw, 0, 4095, 30, 120);
  if (!isfinite(noise))
    noise = 0;

  // ------------ LED Indicators ------------
  digitalWrite(LED_TEMP, temp > 40);
  digitalWrite(LED_WIND, windSpeed > 60);
  digitalWrite(LED_NOISE, noise > 100);

  // ------------ OLED Display ------------
  showWeatherData(temp, hum, windSpeed, noise);

  // ------------ JSON Payload ------------
  String json = "{";
  json += "\"temperature\":" + String(temp, 1) + ",";
  json += "\"humidity\":" + String(hum, 1) + ",";
  json += "\"windSpeed\":" + String(windSpeed, 1) + ",";
  json += "\"noiseLevel\":" + String(noise, 1);
  json += "}";

  Serial.println("Sending JSON: " + json);

  // ------------ HTTP POST ------------
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(client, serverUrl); // <-- FIXED
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(json);
    Serial.print("HTTP Response: ");
    Serial.println(httpCode);

    if (httpCode > 0)
      Serial.println("Server: " + http.getString());
    else
      Serial.println("POST failed");

    http.end();
  }
  else
  {
    Serial.println("WiFi disconnected!");
  }

  delay(5000);
}

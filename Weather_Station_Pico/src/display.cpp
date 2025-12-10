#include <Wire.h>
#include "display.h"

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void initDisplay()
{
    Wire.begin();
    if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS))
    {
        Serial.println(F("❌ SSD1306 initialization failed"));
        for (;;)
            ;
    }
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 10);
    display.println(F("OLED Ready ✅"));
    display.display();
    delay(1500);
}

void showWeatherData(float temperature, float humidity, float windSpeed, float noiseLevel)
{
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Weather Station");

    display.setCursor(0, 15);
    display.print("Temp: ");
    display.print(temperature, 1);
    display.println(" C");
    display.setCursor(0, 25);
    display.print("Hum: ");
    display.print(humidity, 1);
    display.println(" %");
    display.setCursor(0, 35);
    display.print("Wind: ");
    display.print(windSpeed, 1);
    display.println(" km/h");
    display.setCursor(0, 45);
    display.print("Noise: ");
    display.print(noiseLevel, 1);
    display.println(" dB");

    display.display();
}

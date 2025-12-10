#ifndef DISPLAY_H
#define DISPLAY_H

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

void initDisplay();
void showWeatherData(float temperature, float humidity, float windSpeed, float noiseLevel);

#endif

# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-18
### Added
- `GET /api/version` endpoint returning the app name and version (backward-compatible feature -> MINOR bump).
- Version shown in the dashboard footer.
- MIT `LICENSE` file.
- Versioning and License sections in the README.

## [1.0.0] - retroactive
### Added
- Raspberry Pi Pico firmware (DHT11, OLED, Wi-Fi upload every 5 s).
- Node.js/Express backend with SQLite storage and Firebase sync.
- REST API: `POST /api/weather`, `GET /api/readings/latest`, `GET /api/readings`, `GET /api/openweather`.
- Web dashboard and WhatsApp threshold alerts (CallMeBot).

## Versioning examples for this project
- **MAJOR** (e.g. 1.1.0 -> 2.0.0): breaking change, such as a new upload payload format that old Pico firmware cannot send, or replacing SQLite.
- **MINOR** (e.g. 1.1.0 -> 1.2.0): backward-compatible feature, such as real wind/rain sensors or an email alert channel.
- **PATCH** (e.g. 1.1.0 -> 1.1.1): bug fix only, such as fixing Wi-Fi reconnect on the Pico.

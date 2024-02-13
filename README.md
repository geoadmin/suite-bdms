[![.github/workflows/ci.yml](https://github.com/geoadmin/suite-bdms/actions/workflows/ci.yml/badge.svg)](https://github.com/geoadmin/suite-bdms/actions/workflows/ci.yml) [![Release](https://github.com/geoadmin/suite-bdms/actions/workflows/release.yml/badge.svg)](https://github.com/geoadmin/suite-bdms/actions/workflows/release.yml) [![Latest Release](https://img.shields.io/github/v/release/geoadmin/suite-bdms)](https://github.com/geoadmin/suite-bdms/releases/latest) [![License](https://img.shields.io/github/license/geoadmin/suite-bdms)](https://github.com/geoadmin/suite-bdms/blob/main/LICENSE)

# Bohrdatenmanagementsystem (BDMS)

Webapplikation zur einfachen strukturierten Erfassung von geologischen Bohrdaten. Mit dem BDMS können Bohrdaten von überall, ohne Lizenzen und Plattform-unabhängig erfasst, harmonisiert und für die eigene Nutzung exportiert werden.

## Einrichten der Entwicklungsumgebung

Folgende Komponenten müssen auf dem Entwicklungsrechner installiert sein:

✔️ Git  
✔️ Docker  
✔️ Visual Studio 2022  
✔️ Node.js 20 LTS  
✔️ Optional, um die Onlinehilfe zu erstellen: [MkDocs](https://www.mkdocs.org/)

### Entwicklung mit Visual Studio 2022

Es wird eine lokale Installation von Node.js benötigt. Diese kann mit Visual Studio 2022 oder mit [nvm](https://github.com/coreybutler/nvm-windows/releases) installiert werden, um mehrere Node Version zu verwalten. Anschliessend kann mit `nvm use` die im Projekt verwendete Node Version aktiviert werden.

In VS 2022 müssen mehrere Startup-Projects angewählt werden, um die komplette Applikation lauffähig zu haben. Unter _Configure Startup Projects..._ muss _Multiple startup projects_ ausgewählt und entsprechend konfiguriert werden:

| Project        | Action                  |
| :------------- | :---------------------- |
| BDMS           | Start                   |
| BDMS.Client    | Start                   |
| BDMS.Test      | None                    |
| docker-compose | Start without debugging |

⚠️ Möglicherweise wird das LaunchProfile von Docker Compose beim ersten Start nicht angewendet und deshalb API sowie Client zusätzlich im Docker gestartet. Dann muss das Projekt _docker-compose_ einmalig als Startprojekt ausgewählt. Anschliessend kann wieder auf _Multiple startup projects_ umgestellt werden.

### Entwicklung mit Docker

Mit `docker-compose up` kann eine funktionierende Infrastruktur hochgefahren werden. Sie unterstützt Hot-Reload und lädt den Code aus dem lokalen Verzeichnis. Unter Windows mit Docker-Desktop kann die Synchronisierung in den _mounted volumes_ zu Performance-Problemen führen.

**Folgende Dienste/Anwendungen sind anschliessend wie folgt verfügbar**

| 🔖 Dienst/Anwendung         | 🔗Adresse                                                                                      | 🧞Benutzername | 🔐Passwort     |
| :-------------------------- | :--------------------------------------------------------------------------------------------- | :------------- | :------------- |
| Boreholes of Switzerland    | [localhost:3000](http://localhost:3000/)                                                       | `admin`        | `swissforages` |
| pgAdmin                     | [localhost:3001](http://localhost:3001/)                                                       | n/a            | n/a            |
| Tornado REST API (`v1`)[^1] | [localhost:8888](http://localhost:8888/) [localhost:3000/api/v1](http://localhost:3000/api/v1) | n/a            | n/a            |
| .NET REST API (`v2`)[^1]    | [localhost:5000](http://localhost:5000/) [localhost:3000/api/v2](http://localhost:3000/api/v2) | n/a            | n/a            |
| OIDC Server                 | [localhost:4011](http://localhost:4011/)                                                       | `admin`        | `swissforages` |

[^1]: Authentifizierung via `Authorization` Header mit Bearer-Token von OIDC Server. Login-Konfigurationen können in [config/oidc-mock-users.json](./config/oidc-mock-users.json) getätigt werden.

❌Der Debug Output der Tornado REST API ist aktuell in Visual Studio nicht sichtbar. Bitte den Container-Log benutzen `docker compose logs api --follow` oder direkt in Visual Studio im _Containers_-Tab.

## Cypress Tests

Die Cypress Tests können mit `npm run cy` oder `npm run test` gestartet werden. Sie werden zudem automatisch in der CI/CD Pipeline ausgeführt. Das Projekt ist mit [Cypress Cloud](https://cloud.cypress.io/) konfiguriert, wodurch unter anderem die parallele Ausführung der End-to-End (E2E) Tests ermöglicht wird. Testergebnisse und Aufzeichnungen sind ebenfalls direkt in [Cypress Cloud](https://currents.dev/) einsehbar, was die Identifikation und Behebung möglicher Fehler und Probleme erleichtert. Um die detaillierten Testergebnisse einzusehen und die E2E-Tests des Projekts zu debuggen, kann die [Cypress Dashboard-Seite](https://cloud.cypress.io/projects/gv8yue/runs) besucht werden.

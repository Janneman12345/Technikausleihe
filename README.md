# 📸 Technik Ausleihe - Lausitz.Rocks

Ein modernes, mobiles Web-App-System zur Verwaltung von Technik-Ausleihen. Entwickelt für maximale Effizienz, Übersicht und mit intelligenter Unterstützung durch die Google Gemini AI.

## ✨ Features

- **Intuitive Erfassung**: Schnelles Umschalten zwischen Ausleihe und Rückgabe.
- **Foto-Dokumentation**: Direkte Aufnahme von Gerätezuständen via Smartphone-Kamera oder Galerie.
- **Smart Insights**: Automatische Sicherheits- und Nutzungstipps für Geräte via Gemini AI (Google GenAI SDK).
- **Dashboard & Stats**: Echtzeit-Übersicht über alle aktuell verliehenen Gegenstände.
- **PWA-Ready**: Kann als App auf dem Homescreen installiert werden (Offline-Support via Service Worker).
- **Vercel-Optimiert**: Bereit für das Deployment mit automatischen Rewrites und CI/CD.

## 🚀 Tech Stack

- **Frontend**: React 19 (TypeScript)
- **Styling**: Tailwind CSS
- **Bundler**: Vite
- **AI Integration**: @google/genai (Gemini 3 Flash Preview)
- **Deployment**: Vercel

## 🛠 Einrichtung

1. **Repository klonen**:
   ```bash
   git clone https://github.com/DEIN_USERNAME/technikausleihe.git
   cd technikausleihe
   ```

2. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```

3. **Umgebungsvariablen**:
   Erstelle eine `.env` Datei im Root-Verzeichnis:
   ```env
   VITE_API_KEY=DEIN_GEMINI_API_KEY
   ```

4. **Entwicklungsserver starten**:
   ```bash
   npm run dev
   ```

## 📦 Deployment auf Vercel

Die App ist vorkonfiguriert für Vercel. 
- Stelle sicher, dass du den `API_KEY` in den Vercel Project Settings als Environment Variable hinterlegst.
- Die `vercel.json` kümmert sich um das Routing der Single Page Application.

## 📝 Lizenz

Dieses Projekt wurde für **Lausitz.Rocks** entwickelt.
Feedback oder Probleme? Einfach bei Jan melden! ;)

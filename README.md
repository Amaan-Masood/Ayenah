# Ayenah Official — Luxury Mirror Art on Canvas
### Full-Stack Interactive React & Node.js Platform

Ayenah Official is a luxury handcrafted mirror art brand specializing in micro-mosaic mirrors sculpted onto canvas: Arabic calligraphy, sacred mandalas, organic silhouettes, and prism geometries.

---

## 🎨 Brand Design System & Color Palette
- **Obsidian Noir Canvas**: `#0A0A0A`
- **Charcoal Card & Atelier Surface**: `#1A1A1A`
- **Antique Gold Accent**: `#C9A84C`
- **Warm Light Gold Glint**: `#E8D48B`
- **Polished Chrome Mirror**: `#C0C0C0`
- **Diamond White**: `#E8E8E8`
- **Display Serif**: *Cormorant Garamond*
- **Body & Controls**: *Raleway*
- **Urdu Brand Signature**: *آئینہ*

---

## ✨ Signature Interactive Feature: Cursor Mirror Engine
- **Mouse-Reactive Mirror Shards**: Glides glittering polygon glass shards along cursor speed and trajectory.
- **Caustic Light Beam**: An ambient golden light aura illuminates the dark canvas beneath the mouse pointer.
- **Star Glints**: 4-pointed diamond stars twinkle in and out around cursor pauses.
- **Click Burst**: Radial detonation of sparkling mirror dust on mouse click.
- **3D Card Perspective Tilt**: Art cards track the cursor angle in 3D with dynamic specular glare overlays.

---

## 🚀 How to Run the Platform

### Option 1: Double-Click Start (Windows)
Double-click `start.bat` in the project root folder. It starts the Node.js server and prints:
```
Server running live at: http://localhost:5000
```
Open **`http://localhost:5000`** in Google Chrome or Edge.

### Option 2: Command Line (Node.js)
```bash
cd "C:\Users\Asifa Abbas\.gemini\antigravity\scratch\ayenah-website"
node server/server.js
```
Then visit **`http://localhost:5000`**.

### Option 3: Instant Local Preview (No Server Required)
Open **`public/index.html`** directly in any web browser.

---

## 🛠 Project Architecture

```
ayenah-website/
├── package.json               # Root scripts & dependencies
├── start.bat                  # One-click Windows starter
├── server/
│   ├── server.js              # REST API & static file server
│   └── data/
│       ├── products.json      # 8 Handcrafted artworks catalog
│       ├── inquiries.json     # Custom commission database
│       └── subscribers.json   # VIP Collector Circle database
├── public/
│   ├── index.html             # React mount, fonts, custom styles
│   └── app.js                 # Complete React 18 app & cursor engine
└── src/
    ├── components/
    │   ├── CursorMirrorEffect.jsx  # Interactive cursor shard engine
    │   ├── ArtCard.jsx             # 3D interactive tilt card
    │   └── CommissionStudio.jsx    # Customizer & price calculator
    └── ...
```

---

## 📡 REST API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve catalog (supports `?category=calligraphy` etc.) |
| `GET` | `/api/products/:id` | Get single art piece details |
| `POST` | `/api/inquiries` | Save new custom commission order |
| `GET` | `/api/inquiries` | Retrieve all pending commission inquiries |
| `POST` | `/api/subscribe` | Join VIP Collector Drops newsletter |
| `GET` | `/api/stats` | Brand metrics (shards placed, pieces created) |

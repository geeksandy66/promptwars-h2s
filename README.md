# 🛡️ Smart Mobility Intelligence — Safe Route Recommender

> An AI-powered micro-solution that helps urban commuters choose the **safest route** between two locations using intelligent safety scoring.

---

## 🚨 Problem Statement

Urban commuters — especially those travelling at night or through unfamiliar areas — often have no reliable way to assess the **safety** of different routes. Standard navigation apps optimise for speed or distance, while ignoring critical factors like:

- Crime incidents along the route
- Street lighting availability
- Traffic density (congestion = higher risk)

This leads to **informed guessing** rather than data-driven decisions.

---

## 💡 Solution Approach

**Smart Mobility Intelligence** applies a weighted AI scoring algorithm to rank candidate routes by a composite **Safety Score**. Each route is evaluated across three dimensions:

| Dimension         | Weight | Description                            |
|-------------------|--------|----------------------------------------|
| Crime Rate        | 50%    | Higher crime = lower score             |
| Lighting Level    | 30%    | Better lighting = higher score         |
| Traffic Density   | 20%    | Heavy traffic = lower score            |

The app instantly surfaces the **safest option** with a clear visual explanation — no expertise required.

---

## ⚙️ How It Works

```
1. User enters Source → Destination
2. App generates 3 simulated candidate routes
3. Each route receives a randomised crime_rate, lighting_level, traffic_density
4. Safety Score is calculated per route:

   Safety Score = (0.5 × (100 − crime_rate))
                + (0.3 × lighting_level)
                + (0.2 × (100 − traffic_density))

5. Routes are ranked highest → lowest
6. Results are displayed as cards with colour coding + explanation
```

### Safety Level Thresholds

| Score | Level     | Badge |
|-------|-----------|-------|
| 80+   | ✅ Safe    | Green |
| 50–79 | ⚠️ Moderate | Yellow |
| < 50  | ❌ Risky   | Red   |

---

## 🖥️ Screenshots

> *(Replace with actual screenshots after running the app)*

| Input Screen | Results Screen |
|---|---|
| ![Input](screenshots/input.png) | ![Results](screenshots/results.png) |

---

## 🛠️ Tech Stack

| Technology       | Purpose                     |
|------------------|-----------------------------|
| HTML5            | Semantic page structure     |
| CSS3             | Glassmorphism UI, animations|
| Vanilla JS (ES6) | AI logic, DOM manipulation  |
| Google Fonts     | Inter typeface              |

**No frameworks. No build tools. No dependencies to install.**

---

## 🚀 Getting Started

### Prerequisites
- Any modern browser (Chrome, Firefox, Edge, Safari)

### Run Locally
```bash
# Clone the repository
git clone https://github.com/your-username/safe-route-recommender.git

# Navigate into the project
cd safe-route-recommender

# Open in browser (no server required)
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

Or simply **drag `index.html` into your browser**.

---

## 📁 Project Structure

```
safe-route-recommender/
├── index.html       ← App structure & layout
├── style.css        ← Glassmorphism UI + animations
├── script.js        ← AI scoring logic + DOM controller
└── README.md        ← This file
```

---

## ✨ Features

- ⚡ Results in ~1.4 seconds with smooth loading animation
- 🎲 Randomised routes on every search (no two results are the same)
- 🎨 Full glassmorphism dark-mode design
- 📊 Animated progress bars visualising each score
- 💬 Plain-English explanation for every route
- ⌨️ Keyboard-friendly (press Enter to search)
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible ARIA labels on interactive elements

---

## 🔮 Future Improvements

| Feature | Description |
|---|---|
| 🗺️ Live Map | Integrate Leaflet.js to draw routes on an interactive map |
| 📡 Real Data | Connect to crime APIs, OpenStreetMap lighting data, Google Traffic |
| 🕐 Time-of-Day | Adjust scores based on time (night vs. day) |
| 🏘️ Neighbourhood DB | Pre-built safety profiles for major cities |
| 📲 PWA | Make it installable as a mobile app |
| 🔔 Alerts | Push notifications for route safety changes |
| 📈 History | Track previously searched routes and their scores |
| 🤖 ML Model | Replace weighted formula with a trained model |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

## 👤 Author

Built for a hackathon prototype · 2024  
*Prioritising clarity, speed, and usability.*

---

> ⭐ If you found this useful, consider giving it a star on GitHub!

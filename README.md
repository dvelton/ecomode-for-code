# EcoMode for Code 🌱 

**EcoMode for Code** is a web application that analyzes GitHub repositories to suggest energy-efficient code refactorings. Streamline compute and code’s environmental impact—lowering carbon footprint, water usage, energy consumption, and cloud costs—by surfacing actionable, eco-friendly alternatives for inefficient patterns.

---

## Features

- **Repository Analysis**  
  - Accepts GitHub repository URLs and performs static code analysis to detect energy-inefficient patterns.
  - Supports real-time progress tracking and handles large repositories, private repositories (with authentication), and unsupported languages gracefully.

- **Eco Impact Dashboard**  
  - Presents estimated environmental and cost savings (carbon, water, energy, and monetary) across multiple usage scales (100, 10,000, and 1,000,000 executions).
  - Visualizes impact with custom charts and animated metric cards.

- **Refactoring Suggestions**  
  - Provides before/after code examples for identified inefficiencies.
  - Quantifies potential savings for each suggestion—enabling developers to understand the real-world benefits of optimizations.

- **Customization & Settings**  
  - Lets users personalize analysis: select cloud provider, region, and adjust usage frequency assumptions.
  - Settings persist between sessions and immediately update all calculations.

---

## Example Workflow

1. **Paste a GitHub repository URL** and click "Analyze Repository".
2. **App validates and clones** the codebase, detects languages, and performs static analysis.
3. **Dashboard displays** estimated environmental and economic impact.
4. **Refactoring suggestions** appear, each with before/after code, details, and quantified savings.
5. **Adjust settings** for cloud provider/region and see metrics update instantly.

---

## Environmental Metrics

- **Carbon emissions** (gCO₂e)
- **Water usage** (liters)
- **Energy consumption** (Wh/kWh)
- **Cloud cost** (USD)

All metrics are estimated for three usage scales: *100, 10,000, and 1,000,000 runs.*

---

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Auth & Integration**: GitHub API
- **UI Components**: Custom & Radix UI primitives

---

## Getting Started

1. **Clone the repo:**  
   ```bash
   git clone https://github.com/dvelton/ecomode-for-code.git
   ```
2. **Install dependencies:**  
   ```bash
   npm install
   ```
3. **Run locally:**  
   ```bash
   npm run dev
   ```
4. **Open in browser:**  
   Visit [http://localhost:3000](http://localhost:3000) and start analyzing!

---

## [Simulation](https://gh.io/ecomode)

---

## License

This project is licensed under the MIT License.  
See [LICENSE](./LICENSE) for details.

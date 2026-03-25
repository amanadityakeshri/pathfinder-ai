# ◈ PATHFINDER — AI Planning Agent

> An interactive, browser-based visualization tool for classical AI search algorithms — built as part of an Artificial Intelligence course project.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![AI](https://img.shields.io/badge/Artificial%20Intelligence-Course%20Project-7c5cfc?style=flat)
![License](https://img.shields.io/badge/License-MIT-00f5c4?style=flat)

---

## 📌 About the Project

**PATHFINDER** is an AI Planning Agent visualizer that demonstrates how classical search algorithms explore a grid environment to find a path from a **Start node** to a **Goal node**. It is designed to make abstract AI concepts tangible through real-time animation and live performance metrics.

This project was developed as part of the **Artificial Intelligence** curriculum and covers core topics from uninformed search, informed search, and heuristic-based planning — all foundational concepts in AI agent design.

---

## 🤖 AI Concepts Covered

This project directly maps to the following AI topics:

| Concept | Description |
|---|---|
| **Search Agents** | The grid acts as a state space; the algorithm is the agent's planning engine |
| **Uninformed Search** | BFS and DFS explore without domain knowledge |
| **Informed Search** | A* and Greedy use heuristics (Manhattan distance) to guide search |
| **Cost-Based Search** | UCS and Dijkstra minimize path cost through weighted edges |
| **Heuristic Function** | Manhattan distance `h(n) = |x1-x2| + |y1-y2|` used in A* and Greedy |
| **Optimality** | Compares optimal vs. non-optimal algorithms on the same environment |
| **State Space** | Grid cells = states; adjacency = transitions; walls = blocked states |

---

## 🧠 Algorithms Implemented

### Uninformed Search
| Algorithm | Strategy | Optimal? | Complete? |
|---|---|---|---|
| **BFS** | Explores level by level (FIFO queue) | ✅ Yes (unweighted) | ✅ Yes |
| **DFS** | Explores depth-first (LIFO stack) | ❌ No | ✅ Yes (finite graph) |

### Cost-Based Search
| Algorithm | Strategy | Optimal? | Notes |
|---|---|---|---|
| **UCS** | Expands lowest-cost node first | ✅ Yes | Uses uniform edge weights |
| **Dijkstra** | Same as UCS but respects weighted cells | ✅ Yes | Weighted cells cost ×3 |

### Informed / Heuristic Search
| Algorithm | Strategy | Optimal? | Notes |
|---|---|---|---|
| **A\*** | `f(n) = g(n) + h(n)` | ✅ Yes | Fastest optimal algorithm |
| **Greedy Best-First** | Expands node closest to goal | ❌ No | Fast but not guaranteed optimal |

> **Heuristic used:** Manhattan Distance — admissible and consistent for 4-directional grid movement.

---

## ✨ Features

- 🗺️ **Interactive Grid** — Draw walls, place weighted cells, move start/goal nodes
- ▶️ **Real-time Animation** — Watch the algorithm explore the grid step by step
- 📊 **Live Stats** — Nodes explored, path length, total cost, and execution time (ms)
- 🎛️ **Speed Control** — Adjust animation speed from slow to fast
- 🧩 **Preset Environments** — Maze, Diagonal, Spiral, and Random layouts
- 🖱️ **Click & Drag** — Paint walls and weights by dragging across the grid
- 🏷️ **Algorithm Comparison** — Run multiple algorithms on the same grid to compare performance

---

## 🚀 Live Demo

👉 **[View The Live Application](https://pathfinder-ai-sooty.vercel.app/)**


---

## 🛠️ Getting Started

### Run Locally

No installation or build step required. This is a pure frontend project.

```bash
# 1. Clone the repository
git clone https://github.com/amanadityakeshri/pathfinder-ai.git

# 2. Navigate into the folder
cd pathfinder-ai

# 3. Open index.html in your browser
open index.html
# or just double-click index.html
```

### File Structure

```
pathfinder-ai/
├── index.html      # Main HTML structure and layout
├── style.css       # Dark theme UI styling and animations
├── main.js         # All algorithm logic and grid interaction
└── README.md       # Project documentation
```

---

## 🎮 How to Use

1. **Select an algorithm** from the sidebar
2. **Draw walls** by clicking/dragging on the grid (default tool)
3. Optionally place **weighted cells** (cost ×3) using the Weight tool
4. Move the **Start (▲)** or **Goal (★)** nodes using their tools
5. Hit **RUN** and watch the agent plan its path
6. Use **Clear Path** to reset visualization, or **Reset All** to start fresh
7. Try the **Presets** for ready-made environments

---

## 📐 Technical Implementation

- **Language:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **No frameworks or libraries** — zero dependencies
- **Priority Queue:** Simulated using sorted arrays for UCS, Dijkstra, A*, and Greedy
- **Animation:** Timeout-based sequential rendering with configurable delay
- **Heuristic:** Manhattan distance for A* and Greedy Best-First Search
- **Grid:** 14×12 cell matrix — each cell stores state (empty / wall / weighted)


---

## 🎓 Academic Context

- **Course:** Artificial Intelligence
- **Institution:** SRM Institute of Science and Technology, Kattankulatham
- **Program:** B.Tech Computer Science & Engineering
- **Topics Covered:** Uninformed Search, Informed Search, Heuristic Functions, Agent Planning

---

## 📚 References

- Russell, S. & Norvig, P. — *Artificial Intelligence: A Modern Approach* (Chapter 3 — Search)
- Manhattan Distance as an admissible heuristic for grid-based pathfinding
- BFS/DFS/UCS/A* algorithm theory from AIMA

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use, fork, and build on it.

---

<div align="center">
  Made with ◈ for AI coursework
</div>

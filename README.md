# 🚀 LRU Cache Visualizer

An interactive Data Structures & Algorithms (DSA) demonstration tool for visualizing **Least Recently Used (LRU) Cache** operations. Built with **Next.js 14+**, **Framer Motion**, and **Tailwind CSS**.

![LRU Cache Visualization](https://img.shields.io/badge/DSA-Visualization-blueviolet)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## ✨ Features

- **O(1) Accuracy**: Implements the algorithm using a HashMap + Doubly Linked List.
- **Real-time Visualization**: Watch nodes move from HEAD (MRU) to TAIL (LRU) with spring-physics animations.
- **Interactive Controls**: Manually `put` and `get` items, adjust capacity, and trigger evictions.
- **Statistics Dashboard**: Track Hit Rate, Misses, and Evictions in real-time.
- **Glassmorphic UI**: High-end modern design with fluid transitions and responsive layouts.
- **Operation Log**: A chronological timeline of all cache interactions with complexity analysis.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

## 🚀 Deployment

The project is production-ready. I have verified the build locally.

### Option 1: Vercel (Recommended)
The easiest way to deploy is using the Vercel platform:
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/new).
3. Import your project and click **Deploy**.

### Option 2: Generic Build
To generate a production build locally:
```bash
npm run build
```
The output will be in the `.next` folder. You can start the production server with:
```bash
npm run start
```

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the dev server**:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

---

Built with ❤️ for DSA enthusiasts.

# cyscom-vit-chennai

The official website for CYSCOM (Cybersecurity Community of VIT Chennai), VIT Vellore.

**Project Name:** `cyscom-vit-chennai` (npm package)
**Organization:** CYSCOM (Cybersecurity Community of VIT Chennai)
**Website:** https://cyscom-vit-chennai.vercel.app

## Overview

This project is a React-based website built with Vite, featuring:
- Modern React components with TypeScript
- GSAP animations for smooth transitions
- Tailwind CSS for styling
- Responsive design with mobile-first approach
- Interactive UI elements and animations
- Comprehensive resources for cybersecurity education and community engagement
- Official platform for CYSCOM (Cybersecurity Community of VIT Chennai)

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Key Features](#key-features)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Code Quality](#code-quality)
- [Project Architecture](#project-architecture)
- [Contributing](#contributing)
- [License](#license)

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cyscom-vit-chennai

# Install dependencies
npm install
# or
yarn install
```

### Running the Development Server

```bash
# Start the development server
npm run dev
# or
yarn dev

# Open your browser and navigate to http://localhost:3000
```

## Project Structure

```
.
├── public/                    # Static assets
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/           # React components
│   │   ├── About.jsx
│   │   ├── AnimatedTitle.jsx
│   │   ├── Button.jsx
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   │   └── usePreloadAssets.js
│   ├── ui/                   # UI components
│   │   ├── photo-carousel.jsx
│   │   ├── sticky-scroll-reveal.jsx
│   │   └── target.jsx
│   ├── assets/              # Static assets
│   ├── ui/                  # UI components
│   ├── App.jsx              # Main application component
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── dist/                      # Build output (gitignored)
├── package.json              # Project metadata
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── .gitignore                # Git ignore rules
```

## How It Works

### Build Tools

This project uses **Vite** as the build tool, which provides:
- Fast development server with hot module replacement
- Optimized production builds
- TypeScript support
- ES modules

### Technologies Used

- **React 18** - Component-based UI library
- **Vite** - Fast build tool and dev server
- **GSAP** - Advanced animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **clsx** - Utility for conditional class names

### Animation System

The project uses **GSAP (GreenSock Animation Platform)** for:
- Smooth page transitions
- Animated text reveals
- Interactive UI elements
- Scroll-based animations

### Component Architecture

The codebase follows a modular component architecture:
- **Components** - Reusable UI elements (About, Features, Hero, etc.)
- **UI** - Lower-level, reusable UI primitives
- **Hooks** - Custom React hooks for reusable logic

## Key Features

### Core Ecosystem Features
- **Offline-First QR Scanning:** Progressive Web App (PWA) with IndexedDB support for reliable scanning in high-latency event environments.
- **3D Achievement Badges:** Interactive 3D coins and badges using Three.js and React Three Fiber to showcase community milestones.
- **Passwordless OTP Authentication:** Secure 2-step verification system replacing traditional passwords for seamless event access.
- **Live Event Analytics:** Real-time dashboards with Recharts, featuring dynamic heatmaps for check-in monitoring.
- **Project Showcase & Peer Ratings:** Community portal to submit, discover, and rate open-source projects and CTF writeups.
- **Dynamic OpenGraph Certificates:** Automated OpenGraph social sharing UI that generates visual previews for LinkedIn and Twitter.

### Visual Features

- **Animated Transitions** - Smooth page transitions using GSAP
- **Interactive Elements** - Hover states and animations
- **Responsive Design** - Mobile-first approach
- **Performance Optimized** - Code splitting and lazy loading

### Content Features

- **Multi-page Structure** - About, Resources, Team, Events, Blog, Contact
- **Dynamic Content** - Modular component system
- **SEO Optimized** - Meta tags and structured data
- **Accessibility** - ARIA labels and keyboard navigation
- **Cybersecurity Resources** - Tutorials, guides, tools, and community content
- **Official CYSCOM Platform** - Central hub for all cybersecurity activities

## Development

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |

### Code Quality

The project uses:
- **ESLint** with React and Tailwind CSS plugins
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Vitest** for testing (if configured)

### Linting and Formatting

```bash
# Run linter
npm run lint

# Fix linting issues (if supported)
npm run lint -- --fix
```

## Building for Production

```bash
# Build for production
npm run build

# The output will be in the dist/ directory
# Serve the dist/ directory using your preferred web server
```

## Project Architecture

### Main Entry Point

`src/main.jsx` - Entry point that:
- Renders the React application
- Sets up React Router
- Provides global context providers

### Core Components

1. **App.jsx** - Main application layout with navigation
2. **Navbar.jsx** - Responsive navigation bar
3. **Hero.jsx** - Hero section with animations
4. **Features.jsx** - Features showcase
5. **OurTeam.jsx** - Team member display
6. **Footer.jsx** - Site footer

### Animation Components

- **AnimatedTitle.jsx** - Animated text reveals
- **ParticleBackground.jsx** - Animated particle effects
- **EasedImage.jsx** - Image with easing animations

### UI Primitives

- **Button.jsx** - Styled button component
- **target.jsx** - Custom cursor component
- **photo-carousel.jsx** - Image carousel
- **sticky-scroll-reveal.jsx** - Scroll reveal animations

## Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add TypeScript types where needed
   - Write tests if applicable
   - Update cybersecurity resources if modifying content

3. **Commit your changes**
   ```bash
   git add .
git commit -m "feat: add your feature"
   ```

4. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a pull request**
   - Fill out the PR template
   - Request review from maintainers
   - Ensure all cybersecurity content is accurate

### Code Standards

- Use TypeScript for all new code
- Follow existing naming conventions
- Write descriptive commit messages
- Keep changes focused and minimal
- Ensure all cybersecurity resources are current and accurate

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

For questions or support, please contact:
- Project: CYSCOM (Cybersecurity Community of VIT Chennai)
- Website: https://cyscom-vit-chennai.vercel.app

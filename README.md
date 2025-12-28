# HyperCode IDE

![HyperCode IDE Banner](https://via.placeholder.com/1200x400/1a1a1a/ffffff?text=HyperCode+IDE)

**A neurodivergent-first, web-based IDE and language toolkit** designed to make programming more accessible through spatial layouts, visual coding, and cognitive-friendly interfaces.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=flat&logo=yarn&logoColor=white)](https://yarnpkg.com/)

## 🧠 Why HyperCode?

Programming languages should adapt to how minds think, not the other way around. HyperCode is built from the ground up with neurodivergent programmers in mind, featuring:

- **Spatial Code Organization** - Leverage visual memory with flexible layouts
- **Reduced Cognitive Load** - Clean interfaces that minimize distractions
- **Multi-Modal Feedback** - Visual, auditory, and haptic feedback options
- **Chunked Workflows** - Break down complex tasks into manageable units
- **Fully Customizable** - Adapt the environment to your thinking style

## 🏗️ Architecture

HyperCode is built as a modern monorepo using Yarn workspaces:

```
hypercode-ide/
├── packages/
│   ├── core/           # Core AST and type definitions
│   ├── compiler/       # Parser and tokenizer
│   └── ide/            # Web-based IDE interface (Next.js)
```

### Core (`@hypercode/core`)
Defines the Abstract Syntax Tree (AST) structure and type system that powers the entire platform.

### Compiler (`@hypercode/compiler`)
Handles parsing, transformation, and code generation with a focus on developer experience.

### IDE (`@hypercode/ide`)
A modern web-based interface built with Next.js, featuring a responsive design and accessible components.

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- Yarn 1.22.22 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hypercode-ide.git
cd hypercode-ide

# Install dependencies
yarn install

# Build all packages
yarn build

# Start the development server
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Development

### Available Scripts

- `yarn build` - Build all packages
- `yarn dev` - Start development server
- `yarn test` - Run tests across all packages
- `yarn clean` - Remove node_modules and build artifacts

### Building a Specific Package

```bash
yarn workspace @hypercode/core build
yarn workspace @hypercode/compiler build
yarn workspace @hypercode/ide dev
```

## 🌟 Features

### Current
- [x] Core AST structure with TypeScript types
- [x] Basic compiler with parser and tokenizer
- [x] Next.js-based IDE shell
- [x] Development environment setup

### Coming Soon
- [ ] Visual code editor
- [ ] AI-assisted coding
- [ ] Plugin system
- [ ] Real-time collaboration

## 🧩 Extending HyperCode

### Creating a New Package

1. Create a new directory in `packages/`
2. Initialize with `yarn init`
3. Update root `package.json` workspaces
4. Add necessary dependencies

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Connect

- [GitHub Issues](https://github.com/yourusername/hypercode-ide/issues)
- [Discord Community](#) (Coming Soon!)
- [Twitter](#) (Coming Soon!)

---

Made with ❤️ by the HyperCode Team

> *"Programming languages are how minds think; HyperCode is for ADHD/dyslexic brains first."*

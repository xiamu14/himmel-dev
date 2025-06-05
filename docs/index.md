# Himmel Documentation

## Packages

- [Himmel Core](./../packages/core/README.md)
- [Himmel Demo](./../packages/demo/README.md)

## Contributing

We welcome contributions to Himmel! Whether it's bug reports, feature suggestions, or code contributions, your help is appreciated.

### Reporting Bugs
If you find a bug, please open an issue on our GitHub repository. Include the following information:
- A clear and descriptive title.
- Steps to reproduce the bug.
- What you expected to happen.
- What actually happened.
- Your environment (e.g., browser version, Node.js version).

### Suggesting Enhancements
If you have an idea for a new feature or an improvement to an existing one, please open an issue on GitHub. Describe the feature and why you think it would be beneficial.

### Code Contributions
1.  **Fork the repository.**
2.  **Clone your fork:** `git clone https://github.com/YOUR_USERNAME/himmel.git` (Replace `YOUR_USERNAME`)
3.  **Create a new branch:** `git checkout -b my-feature-branch`
4.  **Set up the development environment:**
    - Ensure you have [Node.js](https://nodejs.org/) (version specified in `package.json`'s `volta` field, if present, otherwise latest LTS) and [pnpm](https://pnpm.io/) installed.
    - Navigate to the project root and run `pnpm install` to install dependencies for all packages.
5.  **Make your changes.**
    - Write clean, well-commented code.
    - Follow the existing coding style.
    - If you are adding new functionality, please include tests. (Details on running tests would be added here if a test setup is identified).
    - Ensure your changes do not break existing functionality.
6.  **Build the `core` package if you made changes there:** `pnpm -r --filter=himmel run build` (or a similar script based on `package.json`)
7.  **Test your changes with the `demo` package:**
    - You might need to ensure the `demo` package is using your local build of `himmel`. The root `package.json` has an `amend` script: `pnpm amend` which seems to build `himmel` and then update it as a dependency for `demo`. This is useful for testing local `core` changes.
    - Run the demo: `pnpm demo:dev`
8.  **Commit your changes:** `git commit -m "feat: Describe your feature"` (Follow conventional commit messages if applicable).
9.  **Push to your branch:** `git push origin my-feature-branch`
10. **Open a Pull Request** against the main Himmel repository.

### Development Scripts
(Refer to the `scripts` section in the root `package.json` and package-specific `package.json` files for available commands.)
- `pnpm demo:dev`: Runs the demo application in development mode.
- `pnpm -r --filter=himmel run build`: Builds the `core` (himmel) package.
- `pnpm amend`: Builds the `core` package and updates its usage in the `demo` package. This is useful for testing local changes to `core` within the demo.

---

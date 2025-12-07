# Catan Board Generator

A beautiful, mobile-optimized randomizer for Catan 5-6 player expansion boards with TypeScript type safety.

## Features

- **🎲 Advanced Board Generation**: Generate balanced, randomized Catan boards using algorithms based on competitive play research
- **🔢 Reproducible Seeds**: Use friendly seed names like "BraveWheat042" - paste the same seed to get the exact same board
- **📊 CIBI Score Display**: Real-time Catan Island Balance Index score (0-100) showing board balance quality
- **📈 Resource Distribution Stats**: See pip value totals for each resource (Wood, Wheat, Sheep, Ore, Brick)
- **🏷️ Human-Friendly Seeds**: Auto-generated memorable seed names using string hashing for reproducibility
- **⚖️ Smart Balance Algorithm**:
  - Prevents adjacent red number tiles (6 and 8)
  - Prevents clustering of high-probability numbers (5, 6, 8, 9)
  - Uses pip values to ensure fair resource distribution
  - Calculates CIBI to measure overall board balance
- **📱 Mobile-First Design**: Optimized touch interface with smooth animations
- **🎨 Beautiful UI**: Elegant gradient design with proper resource colors and typography
- **💎 TypeScript**: Fully typed codebase with strict type checking

## Live Demo

🎲 **[Play Now](https://calm-ocean-0659fb203.3.azurestaticapps.net)**

## How to Use

1. Open the generator in your browser
2. (Optional) Enter a custom seed name (or paste a previous seed to reproduce a board)
3. Tap **Shuffle** to generate a new board
4. Check the **CIBI Score** to see how balanced your board is (higher is better)
5. View **Resource Distribution** to see pip values per resource
6. Copy the **Seed** name and share with friends to play the same layout

### Seed Reproducibility

The generator creates friendly seed names like "BraveWheat042". These names are hashed to create consistent numeric seeds:
- Generate a board → Get "BraveWheat042"
- Copy and paste "BraveWheat042" → Get the exact same board
- Works with any text input for custom seeds

## Board Details

### Resources
- 6x Wood (Forest) 🌲
- 6x Wheat (Fields) 🌾
- 6x Sheep (Pasture) 🐑
- 5x Ore (Mountains) ⛰️
- 5x Brick (Hills) 🧱
- 2x Desert 🏜️

### Number Tokens
- Red numbers (6, 8): Most common rolls - 5 pips each
- High numbers (5, 9): Very common - 4 pips each
- Medium numbers (4, 10): Common - 3 pips each
- Low numbers (3, 11): Uncommon - 2 pips each
- Rare numbers (2, 12): Very rare - 1 pip each

## Balance Algorithm

This generator uses research-based algorithms to create fair, competitive boards:

### Number Placement
- **Pip Value Analysis**: Each number has a pip value (1-5) representing probability
  - 6 & 8 = 5 pips (14% chance each)
  - 5 & 9 = 4 pips (11% chance each)
  - 4 & 10 = 3 pips (8% chance each)
  - 3 & 11 = 2 pips (6% chance each)
  - 2 & 12 = 1 pip (3% chance each)

### Balance Checks
1. **Red Number Rule**: No two red numbers (6, 8) can be adjacent
2. **High-Pip Clustering Prevention**: Prevents 3+ adjacent high-value tiles
3. **Iterative Optimization**: Tries up to 200 layouts to find balanced placement

### CIBI (Catan Island Balance Index)
- Calculates resource distribution balance (0-100 scale)
- Measures pip value variance across all five resources
- Lower variance = higher score = better balance
- Score of 90+ = Excellent balance
- Score of 70-89 = Good balance
- Score below 70 = Consider reshuffling

### Resource Distribution Statistics
- Displays total pip values for each resource
- Helps evaluate if resources are balanced
- Higher pip total = more production probability for that resource
- Ideal boards have similar pip totals across all resources

## Technical Details

### Architecture
- **TypeScript**: Fully typed codebase with strict mode enabled
- **Type Definitions**:
  - `Resource`: Wood, wheat, sheep, ore, brick, desert
  - `Tile`: Combines resource, number token, position, and edge status
  - `NumberToken`: Value, letter, pips, color, pip value
  - `Position`: Board coordinates with edge detection
  - `CIBIResult`: Balance score and resource pip totals

### Key Components
- Seeded random number generator for reproducible layouts
- String hashing function for friendly seed name conversion
- Advanced balance validation using pip values and adjacency checks
- Responsive design with touch optimization
- ES2020 TypeScript compiled to clean JavaScript

### Algorithm Research
Based on principles from:
- CIBI (Catan Island Balance Index)
- Competitive Catan community best practices
- Fairness measures for starting position equity

## Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch for changes
npm run watch

# Clean build artifacts
npm run clean
```

### Project Structure
```
catan/
├── src/
│   └── board-generator.ts   # TypeScript source with types
├── dist/                     # Build output (generated)
│   ├── board-generator.js
│   ├── board-generator.d.ts
│   └── index.html
├── index.html               # Main HTML file
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── .github/workflows/       # Azure deployment
```

### Type System
The codebase uses strict TypeScript types for safety:
- `Resource` type for resource names
- `Tile` interface for board tiles
- `NumberToken` interface for number tokens
- `Position` interface for board positions
- `CIBIResult` interface for balance calculations

## Deployment

This project is automatically deployed to Azure Static Web Apps via GitHub Actions.

### Build Process
1. Install Node.js dependencies
2. Compile TypeScript to JavaScript
3. Copy HTML to dist folder
4. Deploy dist folder to Azure

### Manual Deployment

To deploy elsewhere:

```bash
# Build the project
npm run build

# Upload dist/ folder to any static hosting service
```

## License

MIT License - Feel free to use and modify!

## Credits

Built for Catan enthusiasts who want quick, balanced board setups for 5-6 player games.

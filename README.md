# Catan Board Generator

A beautiful, mobile-optimized randomizer for Catan 5-6 player expansion boards.

## Features

- **🎲 Advanced Board Generation**: Generate balanced, randomized Catan boards using algorithms based on competitive play research
- **🔢 Seeded Generation**: Use custom seeds to create reproducible board layouts - share seeds with friends to play the same setup
- **⚖️ Smart Balance Algorithm**:
  - Prevents adjacent red number tiles (6 and 8)
  - Prevents clustering of high-probability numbers (5, 6, 8, 9)
  - Uses pip values to ensure fair resource distribution
  - Based on CIBI (Catan Island Balance Index) principles
- **⚓ Randomized Harbors**: All 8 harbors (3x generic 3:1 and 5x specialty 2:1) are randomly placed each shuffle
- **📱 Mobile-First Design**: Optimized touch interface with smooth animations
- **🎨 Beautiful UI**: Elegant gradient design with proper resource colors and typography
- **⚡ No Build Required**: Pure HTML/CSS/JavaScript - works anywhere

## Live Demo

🎲 **[Play Now](https://calm-ocean-0659fb203.3.azurestaticapps.net)**

## How to Use

1. Open the generator in your browser
2. (Optional) Enter a seed number for reproducible layouts
3. Tap **Shuffle** to generate a new board
4. Share the seed with friends to play the same layout

## Board Details

### Resources
- 6x Wood (Forest)
- 6x Wheat (Fields)
- 6x Sheep (Pasture)
- 5x Ore (Mountains)
- 5x Brick (Hills)
- 2x Desert

### Number Tokens
- Red numbers (6, 8): Most common rolls
- Black numbers (5, 9): Very common
- Other numbers (2-4, 10-12): Less frequent

### Harbors
- 3x Generic (3:1) harbors
- 5x Specialty (2:1) harbors:
  - Wheat (🌾)
  - Brick (🧱)
  - Wood (🌲)
  - Ore (⛰️)
  - Sheep (🐑)

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

### Harbor Randomization
- All 8 harbor positions are randomized each shuffle
- Prevents memorization of optimal starting positions
- Creates unique strategic opportunities every game

## Technical Details

- Pure vanilla JavaScript - no dependencies
- Seeded random number generator for reproducible layouts
- Advanced balance validation using pip values and adjacency checks
- Responsive design with touch optimization
- Progressive enhancement for mobile web apps

### Algorithm Research
Based on principles from:
- CIBI (Catan Island Balance Index)
- Competitive Catan community best practices
- Fairness measures for starting position equity

## Deployment

This project is automatically deployed to Azure Static Web Apps via GitHub Actions.

### Manual Deployment

To deploy elsewhere:

1. Clone this repository
2. Upload `index.html` to any static hosting service
3. No build step required!

## Development

This is a single-file application. To modify:

1. Edit `index.html`
2. Test in a browser
3. Deploy

## License

MIT License - Feel free to use and modify!

## Credits

Built for Catan enthusiasts who want quick, balanced board setups for 5-6 player games.

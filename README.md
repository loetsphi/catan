# Catan Board Generator

A beautiful, mobile-optimized randomizer for Catan 5-6 player expansion boards.

## Features

- **Random Board Generation**: Generate balanced, randomized Catan boards with a single tap
- **Seeded Generation**: Use custom seeds to create reproducible board layouts
- **Smart Placement**: Automatically prevents adjacent red number tiles (6 and 8) for better game balance
- **Mobile-First Design**: Optimized touch interface with smooth animations
- **Beautiful UI**: Elegant gradient design with proper resource colors and typography
- **No Build Required**: Pure HTML/CSS/JavaScript - works anywhere

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

## Technical Details

- Pure vanilla JavaScript - no dependencies
- Seeded random number generator for reproducible layouts
- Automatic validation to prevent adjacent red numbers
- Responsive design with touch optimization
- Progressive enhancement for mobile web apps

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

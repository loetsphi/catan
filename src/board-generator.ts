// ============================================================================
// Type Definitions
// ============================================================================

type Resource = 'wood' | 'wheat' | 'sheep' | 'ore' | 'brick' | 'desert';

interface NumberToken {
    val: number;
    letter: string;
    pips: string;
    red: boolean;
    pipValue: number;
}

interface Position {
    pos: [number, number];
    edge: boolean;
}

interface ResourcePipTotals {
    wood: number;
    wheat: number;
    sheep: number;
    ore: number;
    brick: number;
}

interface CIBIResult {
    score: number;
    pipTotals: ResourcePipTotals;
}

// ============================================================================
// Constants
// ============================================================================

const BALANCE_ATTEMPTS = 200;
const HIGH_PIP_THRESHOLD = 4;
const MAX_ADJACENT_HIGH_PIPS = 2;
const CIBI_VARIANCE_MULTIPLIER = 2;

const ADJECTIVES = ['Swift', 'Noble', 'Brave', 'Bright', 'Lucky', 'Grand', 'Wise', 'Bold', 'Epic', 'Pure'];
const NOUNS = ['Sheep', 'Wheat', 'Wood', 'Brick', 'Stone', 'Harbor', 'Island', 'Coast', 'Trade', 'Road'];

// ============================================================================
// Random & Hashing Functions
// ============================================================================

/**
 * Seeded random number generator using sine function
 * @param seed - Numeric seed for reproducibility
 * @returns Random number between 0 and 1
 */
function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

/**
 * Shuffle array using Fisher-Yates algorithm with seeded randomness
 * @param array - Array to shuffle
 * @param seed - Numeric seed for reproducibility
 * @returns New shuffled array
 */
function shuffleArray<T>(array: T[], seed: number): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Hash a string to a consistent numeric seed using djb2 algorithm
 * @param str - String to hash
 * @returns Positive integer hash value
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// ============================================================================
// Seed Generation
// ============================================================================

/**
 * Generate a random human-friendly seed name
 * @returns Seed name in format "AdjectiveNoun###" (e.g., "BraveWheat042")
 */
function generateRandomFriendlyName(): string {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${adj}${noun}${num}`;
}

// ============================================================================
// Board Geometry
// ============================================================================

/**
 * Check if two board positions are adjacent (share an edge)
 * Uses offset coordinate system for hexagonal grid
 * @param posObj1 - First position
 * @param posObj2 - Second position
 * @returns True if positions are adjacent
 */
function areAdjacent(posObj1: Position | [number, number], posObj2: Position | [number, number]): boolean {
    const pos1 = Array.isArray(posObj1) ? posObj1 : posObj1.pos;
    const pos2 = Array.isArray(posObj2) ? posObj2 : posObj2.pos;
    const [row1, col1] = pos1;
    const [row2, col2] = pos2;

    if (Math.abs(row1 - row2) > 1) return false;

    if (row1 === row2) {
        return Math.abs(col1 - col2) === 1;
    }

    if (row1 % 2 === 0) {
        return col2 === col1 || col2 === col1 - 1;
    } else {
        return col2 === col1 || col2 === col1 + 1;
    }
}

/**
 * Get pip value for a dice number (probability weight)
 * @param num - Dice roll value (2-12)
 * @returns Pip value (0-5)
 */
function getPipValue(num: number): number {
    const pipMap: Record<number, number> = {
        2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1
    };
    return pipMap[num] || 0;
}

// ============================================================================
// Balance Calculation
// ============================================================================

/**
 * Calculate CIBI (Catan Island Balance Index)
 * Measures resource distribution balance from 0-100 (higher is better)
 * @param shuffledResources - Array of resources assigned to tiles
 * @param shuffledNumbers - Array of number tokens
 * @param nonDesertIndices - Indices of non-desert tiles
 * @returns CIBI score and pip totals per resource
 */
function calculateCIBI(
    shuffledResources: (Resource | undefined)[],
    shuffledNumbers: NumberToken[],
    nonDesertIndices: number[]
): CIBIResult {
    let totalVariance = 0;
    const resourcePipTotals: ResourcePipTotals = {
        wood: 0,
        wheat: 0,
        sheep: 0,
        ore: 0,
        brick: 0
    };

    // Calculate total pip values for each resource
    nonDesertIndices.forEach((idx, i) => {
        const resource = shuffledResources[idx];
        const number = shuffledNumbers[i];
        if (number && resource && resource !== 'desert') {
            resourcePipTotals[resource] = (resourcePipTotals[resource] || 0) + number.pipValue;
        }
    });

    // Calculate variance from ideal (all resources should have similar pip totals)
    const pipValues = Object.values(resourcePipTotals);
    const avgPips = pipValues.reduce((a, b) => a + b, 0) / pipValues.length;
    pipValues.forEach(pips => {
        totalVariance += Math.pow(pips - avgPips, 2);
    });

    // Lower variance = better balance. Scale to 0-100 (100 = perfect)
    const variance = totalVariance / pipValues.length;
    const score = Math.max(0, Math.min(100, 100 - (variance * CIBI_VARIANCE_MULTIPLIER)));

    return {
        score: Math.round(score),
        pipTotals: resourcePipTotals
    };
}

/**
 * Check if number token placement meets balance requirements
 * @param shuffledNumbers - Array of number tokens
 * @param shuffledResources - Array of resources (unused but kept for future)
 * @param nonDesertIndices - Indices of non-desert tiles
 * @returns True if placement is balanced
 */
function isBalancedPlacement(
    shuffledNumbers: NumberToken[],
    _shuffledResources: (Resource | undefined)[],
    nonDesertIndices: number[]
): boolean {
    // Rule 1: No adjacent red numbers (6, 8)
    for (let i = 0; i < nonDesertIndices.length; i++) {
        const idx1 = nonDesertIndices[i];
        const num1 = shuffledNumbers[i];

        if (!num1 || !num1.red) continue;

        for (let j = i + 1; j < nonDesertIndices.length; j++) {
            const idx2 = nonDesertIndices[j];
            const num2 = shuffledNumbers[j];

            if (!num2) continue;

            if (num2.red && areAdjacent(landPositions[idx1], landPositions[idx2])) {
                return false;
            }
        }
    }

    // Rule 2: No clusters of high-pip numbers (prevent 3+ adjacent high-value tiles)
    for (let i = 0; i < nonDesertIndices.length; i++) {
        const idx1 = nonDesertIndices[i];
        const num1 = shuffledNumbers[i];

        if (!num1 || num1.pipValue < HIGH_PIP_THRESHOLD) continue;

        let highPipNeighbors = 0;
        for (let j = 0; j < nonDesertIndices.length; j++) {
            if (i === j) continue;
            const idx2 = nonDesertIndices[j];
            const num2 = shuffledNumbers[j];

            if (num2 && num2.pipValue >= HIGH_PIP_THRESHOLD && areAdjacent(landPositions[idx1], landPositions[idx2])) {
                highPipNeighbors++;
            }
        }

        if (highPipNeighbors > MAX_ADJACENT_HIGH_PIPS) {
            return false;
        }
    }

    return true;
}

// ============================================================================
// Game Data
// ============================================================================

const landPositions: Position[] = [
    {pos: [1, 0], edge: true}, {pos: [1, 1], edge: true}, {pos: [1, 2], edge: true},
    {pos: [2, 0], edge: true}, {pos: [2, 1], edge: false}, {pos: [2, 2], edge: false}, {pos: [2, 3], edge: true},
    {pos: [3, 0], edge: true}, {pos: [3, 1], edge: false}, {pos: [3, 2], edge: false}, {pos: [3, 3], edge: false}, {pos: [3, 4], edge: true},
    {pos: [4, 0], edge: true}, {pos: [4, 1], edge: false}, {pos: [4, 2], edge: false}, {pos: [4, 3], edge: false}, {pos: [4, 4], edge: false}, {pos: [4, 5], edge: true},
    {pos: [5, 0], edge: true}, {pos: [5, 1], edge: false}, {pos: [5, 2], edge: false}, {pos: [5, 3], edge: false}, {pos: [5, 4], edge: true},
    {pos: [6, 0], edge: true}, {pos: [6, 1], edge: false}, {pos: [6, 2], edge: false}, {pos: [6, 3], edge: true},
    {pos: [7, 0], edge: true}, {pos: [7, 1], edge: true}, {pos: [7, 2], edge: true}
];

const resources: Resource[] = [
    'wood', 'wood', 'wood', 'wood', 'wood', 'wood',
    'wheat', 'wheat', 'wheat', 'wheat', 'wheat', 'wheat',
    'sheep', 'sheep', 'sheep', 'sheep', 'sheep', 'sheep',
    'ore', 'ore', 'ore', 'ore', 'ore',
    'brick', 'brick', 'brick', 'brick', 'brick',
    'desert', 'desert'
];

const numbers: NumberToken[] = [
    {val: 2, letter: 'A', pips: '•', red: false, pipValue: 1},
    {val: 3, letter: 'B', pips: '••', red: false, pipValue: 2},
    {val: 3, letter: 'C', pips: '••', red: false, pipValue: 2},
    {val: 4, letter: 'D', pips: '•••', red: false, pipValue: 3},
    {val: 4, letter: 'E', pips: '•••', red: false, pipValue: 3},
    {val: 5, letter: 'F', pips: '••••', red: false, pipValue: 4},
    {val: 5, letter: 'G', pips: '••••', red: false, pipValue: 4},
    {val: 6, letter: 'H', pips: '•••••', red: true, pipValue: 5},
    {val: 6, letter: 'I', pips: '•••••', red: true, pipValue: 5},
    {val: 8, letter: 'J', pips: '•••••', red: true, pipValue: 5},
    {val: 8, letter: 'K', pips: '•••••', red: true, pipValue: 5},
    {val: 9, letter: 'L', pips: '••••', red: false, pipValue: 4},
    {val: 9, letter: 'M', pips: '••••', red: false, pipValue: 4},
    {val: 10, letter: 'N', pips: '•••', red: false, pipValue: 3},
    {val: 10, letter: 'O', pips: '•••', red: false, pipValue: 3},
    {val: 11, letter: 'P', pips: '••', red: false, pipValue: 2},
    {val: 11, letter: 'Q', pips: '••', red: false, pipValue: 2},
    {val: 12, letter: 'R', pips: '•', red: false, pipValue: 1},
    {val: 2, letter: 'S', pips: '•', red: false, pipValue: 1},
    {val: 3, letter: 'T', pips: '••', red: false, pipValue: 2},
    {val: 4, letter: 'U', pips: '•••', red: false, pipValue: 3},
    {val: 5, letter: 'V', pips: '••••', red: false, pipValue: 4},
    {val: 6, letter: 'W', pips: '•••••', red: true, pipValue: 5},
    {val: 8, letter: 'X', pips: '•••••', red: true, pipValue: 5},
    {val: 9, letter: 'Y', pips: '••••', red: false, pipValue: 4},
    {val: 10, letter: 'Za', pips: '•••', red: false, pipValue: 3},
    {val: 11, letter: 'Zb', pips: '••', red: false, pipValue: 2},
    {val: 12, letter: 'Zc', pips: '•', red: false, pipValue: 1}
];

const resourceLabels: Record<Resource, string> = {
    wood: 'Wood',
    wheat: 'Wheat',
    sheep: 'Sheep',
    ore: 'Ore',
    brick: 'Brick',
    desert: 'Desert'
};

// ============================================================================
// Main Board Generation
// ============================================================================

/**
 * Main function to shuffle and generate a new Catan board
 * Generates resources, numbers, calculates CIBI, and updates the UI
 */
function shuffleBoard(): void {
    const seedInput = (document.getElementById('seedInput') as HTMLInputElement).value;
    let friendlySeedName: string;

    // Determine seed source
    if (seedInput) {
        friendlySeedName = seedInput;
    } else {
        friendlySeedName = generateRandomFriendlyName();
    }

    // Hash friendly name to numeric seed for reproducibility
    const seed = hashString(friendlySeedName);

    // Shuffle resources - place deserts on edge tiles
    const edgeIndices = landPositions.map((p, i) => p.edge ? i : -1).filter(i => i >= 0);
    const shuffledResources: (Resource | undefined)[] = new Array(30);
    const nonDesertResources = resources.filter(r => r !== 'desert');

    const shuffledEdges = shuffleArray(edgeIndices, seed);
    const desertPos1 = shuffledEdges[0];
    const desertPos2 = shuffledEdges[1];
    shuffledResources[desertPos1] = 'desert';
    shuffledResources[desertPos2] = 'desert';

    const remainingIndices: number[] = [];
    for (let i = 0; i < 30; i++) {
        if (i !== desertPos1 && i !== desertPos2) {
            remainingIndices.push(i);
        }
    }

    const shuffledNonDesert = shuffleArray(nonDesertResources, seed + 500);
    remainingIndices.forEach((idx, i) => {
        shuffledResources[idx] = shuffledNonDesert[i];
    });

    // Shuffle numbers with balance validation
    let shuffledNumbers = shuffleArray(numbers, seed + 1000);
    const nonDesertIndices = shuffledResources.map((r, i) => r !== 'desert' ? i : -1).filter(i => i >= 0);

    let attempts = 0;
    while (attempts < BALANCE_ATTEMPTS && !isBalancedPlacement(shuffledNumbers, shuffledResources, nonDesertIndices)) {
        shuffledNumbers = shuffleArray(numbers, seed + 1000 + attempts);
        attempts++;
    }

    // Calculate balance metrics
    const cibiResult = calculateCIBI(shuffledResources, shuffledNumbers, nonDesertIndices);

    // Update UI displays
    updateSeedDisplay(friendlySeedName);
    updateStatsDisplay(cibiResult);
    updateBoardDisplay(shuffledResources, shuffledNumbers, resourceLabels);
}

// ============================================================================
// UI Update Functions
// ============================================================================

/**
 * Update seed display in UI
 */
function updateSeedDisplay(seedName: string): void {
    const seedDisplay = document.getElementById('seedDisplay');
    if (seedDisplay) seedDisplay.textContent = seedName;
}

/**
 * Update statistics displays (CIBI and resource pips)
 */
function updateStatsDisplay(cibiResult: CIBIResult): void {
    const cibiDisplay = document.getElementById('cibiDisplay');
    if (cibiDisplay) cibiDisplay.textContent = cibiResult.score.toString();

    const pipDisplays = {
        wood: document.getElementById('woodPips'),
        wheat: document.getElementById('wheatPips'),
        sheep: document.getElementById('sheepPips'),
        ore: document.getElementById('orePips'),
        brick: document.getElementById('brickPips')
    };

    Object.entries(pipDisplays).forEach(([resource, element]) => {
        if (element) {
            element.textContent = cibiResult.pipTotals[resource as keyof ResourcePipTotals].toString();
        }
    });
}

/**
 * Update board hexagon displays
 */
function updateBoardDisplay(
    shuffledResources: (Resource | undefined)[],
    shuffledNumbers: NumberToken[],
    labels: Record<Resource, string>
): void {
    const hexes = document.querySelectorAll<HTMLElement>('.hex:not(.water)');
    let numberIndex = 0;

    hexes.forEach((hex, index) => {
        const resource = shuffledResources[index];
        if (!resource) return;

        hex.className = 'hex ' + resource;
        const inner = hex.querySelector<HTMLElement>('.hex-inner');
        if (!inner) return;

        const label = labels[resource];

        if (resource === 'desert') {
            inner.innerHTML = `
                <div class="resource-label">${label}</div>
                <div class="number-token" style="background: transparent; border: none; box-shadow: none;">
                    <div style="font-size: 16px;">🏜️</div>
                </div>
            `;
        } else {
            const num = shuffledNumbers[numberIndex++];
            if (num) {
                const colorClass = num.red ? 'red' : 'black';
                inner.innerHTML = `
                    <div class="resource-label">${label}</div>
                    <div class="number-token">
                        <div class="number ${colorClass}">${num.val}</div>
                        <div class="token-letter">${num.letter}</div>
                        <div class="pips">${num.pips}</div>
                    </div>
                `;
            }
        }
    });

    // Clear water hexes (no harbors)
    const waterHexes = document.querySelectorAll<HTMLElement>('.hex.water');
    waterHexes.forEach((hex) => {
        const inner = hex.querySelector<HTMLElement>('.hex-inner');
        if (inner) inner.innerHTML = '';
    });
}

// Make shuffleBoard available globally
(window as any).shuffleBoard = shuffleBoard;

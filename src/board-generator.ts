// Type definitions
type ResourceType = 'wood' | 'wheat' | 'sheep' | 'ore' | 'brick' | 'desert';

interface NumberToken {
    val: number;
    letter: string;
    pips: string;
    red: boolean;
    pipValue: number;
}

interface LandPosition {
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

// Seeded random number generator
function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Shuffle array with seed
function shuffleArray<T>(array: T[], seed: number): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Check if two positions are adjacent
function areAdjacent(posObj1: LandPosition | [number, number], posObj2: LandPosition | [number, number]): boolean {
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

// Get pip value for a number
function getPipValue(num: number): number {
    const pipMap: Record<number, number> = {
        2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1
    };
    return pipMap[num] || 0;
}

// Calculate CIBI (Catan Island Balance Index)
function calculateCIBI(
    shuffledResources: (ResourceType | undefined)[],
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
    const score = Math.max(0, Math.min(100, 100 - (variance * 2)));

    return {
        score: Math.round(score),
        pipTotals: resourcePipTotals
    };
}

// Generate human-friendly seed name
function generateFriendlySeed(numericSeed: number): string {
    const adjectives = ['Swift', 'Noble', 'Brave', 'Bright', 'Lucky', 'Grand', 'Wise', 'Bold', 'Epic', 'Pure'];
    const nouns = ['Sheep', 'Wheat', 'Wood', 'Brick', 'Stone', 'Harbor', 'Island', 'Coast', 'Trade', 'Road'];

    const adj = adjectives[Math.floor((numericSeed / 1000) % adjectives.length)];
    const noun = nouns[Math.floor((numericSeed / 100) % nouns.length)];
    const num = (numericSeed % 1000).toString().padStart(3, '0');

    return `${adj}${noun}${num}`;
}

// Hash a string to a consistent numeric seed
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Game data
const landPositions: LandPosition[] = [
    {pos: [1, 0], edge: true}, {pos: [1, 1], edge: true}, {pos: [1, 2], edge: true},
    {pos: [2, 0], edge: true}, {pos: [2, 1], edge: false}, {pos: [2, 2], edge: false}, {pos: [2, 3], edge: true},
    {pos: [3, 0], edge: true}, {pos: [3, 1], edge: false}, {pos: [3, 2], edge: false}, {pos: [3, 3], edge: false}, {pos: [3, 4], edge: true},
    {pos: [4, 0], edge: true}, {pos: [4, 1], edge: false}, {pos: [4, 2], edge: false}, {pos: [4, 3], edge: false}, {pos: [4, 4], edge: false}, {pos: [4, 5], edge: true},
    {pos: [5, 0], edge: true}, {pos: [5, 1], edge: false}, {pos: [5, 2], edge: false}, {pos: [5, 3], edge: false}, {pos: [5, 4], edge: true},
    {pos: [6, 0], edge: true}, {pos: [6, 1], edge: false}, {pos: [6, 2], edge: false}, {pos: [6, 3], edge: true},
    {pos: [7, 0], edge: true}, {pos: [7, 1], edge: true}, {pos: [7, 2], edge: true}
];

const resources: ResourceType[] = [
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

const resourceLabels: Record<ResourceType, string> = {
    wood: 'Wood',
    wheat: 'Wheat',
    sheep: 'Sheep',
    ore: 'Ore',
    brick: 'Brick',
    desert: 'Desert'
};

// Check if number placement is balanced
function isBalancedPlacement(
    shuffledNumbers: NumberToken[],
    _shuffledResources: (ResourceType | undefined)[],
    nonDesertIndices: number[]
): boolean {
    // Check 1: No adjacent red numbers (6, 8)
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

    // Check 2: No clusters of high-pip numbers (prevent 3+ adjacent high-value tiles)
    for (let i = 0; i < nonDesertIndices.length; i++) {
        const idx1 = nonDesertIndices[i];
        const num1 = shuffledNumbers[i];

        if (!num1 || num1.pipValue < 4) continue;

        let highPipNeighbors = 0;
        for (let j = 0; j < nonDesertIndices.length; j++) {
            if (i === j) continue;
            const idx2 = nonDesertIndices[j];
            const num2 = shuffledNumbers[j];

            if (num2 && num2.pipValue >= 4 && areAdjacent(landPositions[idx1], landPositions[idx2])) {
                highPipNeighbors++;
            }
        }

        if (highPipNeighbors >= 3) {
            return false;
        }
    }

    return true;
}

// Main shuffle function
function shuffleBoard(): void {
    const seedInput = (document.getElementById('seedInput') as HTMLInputElement).value;
    let seed: number;
    let friendlySeedName: string;

    if (seedInput) {
        // Hash the input string to get a consistent seed
        seed = hashString(seedInput);
        friendlySeedName = seedInput;
    } else {
        // Generate random seed
        seed = Math.floor(Date.now() + Math.random() * 1000000);
        friendlySeedName = generateFriendlySeed(seed);
    }

    // Shuffle resources
    const edgeIndices = landPositions.map((p, i) => p.edge ? i : -1).filter(i => i >= 0);

    const shuffledResources: (ResourceType | undefined)[] = new Array(30);
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

    // Shuffle numbers with better balancing
    let shuffledNumbers = shuffleArray(numbers, seed + 1000);
    const nonDesertIndices = shuffledResources.map((r, i) => r !== 'desert' ? i : -1).filter(i => i >= 0);

    let attempts = 0;
    while (attempts < 200 && !isBalancedPlacement(shuffledNumbers, shuffledResources, nonDesertIndices)) {
        shuffledNumbers = shuffleArray(numbers, seed + 1000 + attempts);
        attempts++;
    }

    // Calculate CIBI score and resource pip totals
    const cibiResult = calculateCIBI(shuffledResources, shuffledNumbers, nonDesertIndices);

    // Update displays
    const seedDisplay = document.getElementById('seedDisplay');
    const cibiDisplay = document.getElementById('cibiDisplay');
    if (seedDisplay) seedDisplay.textContent = friendlySeedName;
    if (cibiDisplay) cibiDisplay.textContent = cibiResult.score.toString();

    // Update resource distribution displays
    const woodPipsEl = document.getElementById('woodPips');
    const wheatPipsEl = document.getElementById('wheatPips');
    const sheepPipsEl = document.getElementById('sheepPips');
    const orePipsEl = document.getElementById('orePips');
    const brickPipsEl = document.getElementById('brickPips');

    if (woodPipsEl) woodPipsEl.textContent = cibiResult.pipTotals.wood.toString();
    if (wheatPipsEl) wheatPipsEl.textContent = cibiResult.pipTotals.wheat.toString();
    if (sheepPipsEl) sheepPipsEl.textContent = cibiResult.pipTotals.sheep.toString();
    if (orePipsEl) orePipsEl.textContent = cibiResult.pipTotals.ore.toString();
    if (brickPipsEl) brickPipsEl.textContent = cibiResult.pipTotals.brick.toString();

    // Update land hexes
    const hexes = document.querySelectorAll<HTMLElement>('.hex:not(.water)');
    let numberIndex = 0;

    hexes.forEach((hex, index) => {
        const resource = shuffledResources[index];
        if (!resource) return;

        hex.className = 'hex ' + resource;

        const inner = hex.querySelector<HTMLElement>('.hex-inner');
        if (!inner) return;

        const label = resourceLabels[resource];

        if (resource === 'desert') {
            inner.innerHTML = `
                <div class="resource-label">${label}</div>
                <div class="number-token" style="background: transparent; border: none; box-shadow: none;">
                    <div style="font-size: 16px;">🏜️</div>
                </div>
            `;
        } else {
            const num = shuffledNumbers[numberIndex];
            numberIndex++;
            if (num) {
                const numberClass = num.red ? 'number red' : 'number black';
                inner.innerHTML = `
                    <div class="resource-label">${label}</div>
                    <div class="number-token">
                        <div class="${numberClass}">${num.val}</div>
                        <div class="token-letter">${num.letter}</div>
                        <div class="pips">${num.pips}</div>
                    </div>
                `;
            }
        }
    });

    // Water hexes remain empty (no harbors)
    const waterHexes = document.querySelectorAll<HTMLElement>('.hex.water');
    waterHexes.forEach((hex) => {
        const inner = hex.querySelector<HTMLElement>('.hex-inner');
        if (inner) {
            inner.innerHTML = ''; // Keep water empty
        }
    });
}

// Make shuffleBoard available globally
(window as any).shuffleBoard = shuffleBoard;

// Gamification System
export class GamificationSystem {
  constructor() {
    this.attributes = {
      physical: { xp: 0, level: 1 },
      mental: { xp: 0, level: 1 },
      intellect: { xp: 0, level: 1 },
      ambition: { xp: 0, level: 1 },
      discipline: { xp: 0, level: 1 },
      relationship: { xp: 0, level: 1 }
    };
    
    this.personalityTypes = {
      SCHOLAR: { name: 'The Scholar', description: 'Intellect and mental prowess are your strengths' },
      ATHLETE: { name: 'The Athlete', description: 'Physical and discipline define your character' },
      LEADER: { name: 'The Leader', description: 'Ambition and relationship skills set you apart' },
      BALANCED: { name: 'The Balanced', description: 'You maintain harmony across all attributes' }
    };

    this.loadFromStorage();
  }

  // XP required for next level (increasing XP curve)
  getXpForNextLevel(currentLevel) {
    return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
  }

  // Add XP to an attribute and handle level up
  addXp(attribute, amount) {
    if (!this.attributes[attribute]) return false;
    
    this.attributes[attribute].xp += amount;
    const nextLevelXp = this.getXpForNextLevel(this.attributes[attribute].level);
    
    if (this.attributes[attribute].xp >= nextLevelXp) {
      this.attributes[attribute].level++;
      this.attributes[attribute].xp -= nextLevelXp;
      this.saveToStorage();
      return { leveledUp: true, newLevel: this.attributes[attribute].level };
    }
    
    this.saveToStorage();
    return { leveledUp: false, currentXp: this.attributes[attribute].xp };
  }

  // Calculate personality type based on attribute distribution
  calculatePersonalityType() {
    const levels = Object.values(this.attributes).map(attr => attr.level);
    const maxLevel = Math.max(...levels);
    const minLevel = Math.min(...levels);
    const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;
    
    // If all attributes are within 2 levels of each other
    if (maxLevel - minLevel <= 2) {
      return this.personalityTypes.BALANCED;
    }
    
    // Check for dominant attributes
    const dominantPairs = [
      { type: this.personalityTypes.SCHOLAR, attrs: ['intellect', 'mental'] },
      { type: this.personalityTypes.ATHLETE, attrs: ['physical', 'discipline'] },
      { type: this.personalityTypes.LEADER, attrs: ['ambition', 'relationship'] }
    ];
    
    for (const pair of dominantPairs) {
      const pairAvg = pair.attrs.reduce((sum, attr) => 
        sum + this.attributes[attr].level, 0) / 2;
      if (pairAvg > avgLevel + 1) {
        return pair.type;
      }
    }
    
    return this.personalityTypes.BALANCED;
  }

  // Save state to localStorage
  saveToStorage() {
    localStorage.setItem('gamificationState', JSON.stringify(this.attributes));
  }

  // Load state from localStorage
  loadFromStorage() {
    const saved = localStorage.getItem('gamificationState');
    if (saved) {
      this.attributes = JSON.parse(saved);
    }
  }

  // Get current state
  getState() {
    return {
      attributes: this.attributes,
      personalityType: this.calculatePersonalityType()
    };
  }
} 
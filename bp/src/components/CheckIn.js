// Daily Check-in Quiz Component
export class CheckIn {
  constructor(gamificationSystem) {
    this.gamificationSystem = gamificationSystem;
    this.tasks = {
      physical: [
        { text: "Did you exercise for at least 30 minutes today?", xp: 50 },
        { text: "Did you maintain good posture throughout the day?", xp: 25 },
        { text: "Did you get 7-8 hours of sleep last night?", xp: 40 }
      ],
      mental: [
        { text: "Did you practice mindfulness or meditation today?", xp: 40 },
        { text: "Did you take regular breaks from screen time?", xp: 30 },
        { text: "Did you engage in a stress-reducing activity?", xp: 35 }
      ],
      intellect: [
        { text: "Did you read or learn something new today?", xp: 45 },
        { text: "Did you solve a challenging problem?", xp: 40 },
        { text: "Did you practice a skill you're developing?", xp: 35 }
      ],
      ambition: [
        { text: "Did you work towards a long-term goal today?", xp: 50 },
        { text: "Did you step out of your comfort zone?", xp: 45 },
        { text: "Did you set new goals or milestones?", xp: 40 }
      ],
      discipline: [
        { text: "Did you stick to your planned schedule today?", xp: 40 },
        { text: "Did you resist a temptation or bad habit?", xp: 35 },
        { text: "Did you complete all your planned tasks?", xp: 45 }
      ],
      relationship: [
        { text: "Did you connect meaningfully with someone today?", xp: 40 },
        { text: "Did you help or support someone?", xp: 35 },
        { text: "Did you express gratitude to someone?", xp: 30 }
      ]
    };
  }

  // Get random tasks for each attribute
  getRandomTasks() {
    const dailyTasks = {};
    for (const [attribute, tasks] of Object.entries(this.tasks)) {
      // Shuffle and take 2 tasks
      dailyTasks[attribute] = this.shuffleArray([...tasks]).slice(0, 2);
    }
    return dailyTasks;
  }

  // Shuffle array (Fisher-Yates algorithm)
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Submit answers and calculate XP
  submitAnswers(answers) {
    const results = {
      xpGained: {},
      leveledUp: {},
      totalXpGained: 0
    };

    for (const [attribute, taskAnswers] of Object.entries(answers)) {
      results.xpGained[attribute] = 0;
      results.leveledUp[attribute] = false;

      for (const answer of taskAnswers) {
        if (answer.completed) {
          const xpResult = this.gamificationSystem.addXp(attribute, answer.xp);
          results.xpGained[attribute] += answer.xp;
          results.totalXpGained += answer.xp;
          
          if (xpResult.leveledUp) {
            results.leveledUp[attribute] = true;
          }
        }
      }
    }

    return results;
  }

  // Get suggestions based on lowest attributes
  getSuggestions() {
    const state = this.gamificationSystem.getState();
    const attributes = state.attributes;
    
    // Sort attributes by level
    const sortedAttrs = Object.entries(attributes)
      .sort(([, a], [, b]) => a.level - b.level);
    
    // Get the two lowest attributes
    const lowestAttrs = sortedAttrs.slice(0, 2);
    
    return lowestAttrs.map(([attr, data]) => ({
      attribute: attr,
      level: data.level,
      suggestion: this.getSuggestionForAttribute(attr)
    }));
  }

  // Get specific suggestion for an attribute
  getSuggestionForAttribute(attribute) {
    const suggestions = {
      physical: "Try adding a short workout routine to your daily schedule",
      mental: "Consider starting a daily meditation practice",
      intellect: "Set aside time each day for reading or learning",
      ambition: "Break down your big goals into smaller, achievable steps",
      discipline: "Create a daily routine and stick to it",
      relationship: "Make time for meaningful connections each day"
    };
    
    return suggestions[attribute] || "Focus on consistent daily progress";
  }
} 
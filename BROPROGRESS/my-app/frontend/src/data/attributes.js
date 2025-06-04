export const attributes = {
  physical: {
    name: 'Physical',
    level: 50,
    xp: 0,
    tasks: [
      { text: 'Run 10km without stopping', points: 3 },
      { text: 'Wake up at 5 AM 5 days in a row', points: 2 },
      { text: 'No junk food for a week', points: 2 },
      { text: 'Failed to work out for 3 days', points: -2 },
      { text: 'Slept < 5 hours for 2 nights', points: -1 }
    ]
  },
  mental: {
    name: 'Mental',
    level: 50,
    xp: 0,
    tasks: [
      { text: 'Meditated for 10 mins daily for a week', points: 2 },
      { text: 'Read a non-fiction book', points: 3 },
      { text: 'Kept a gratitude journal', points: 2 },
      { text: 'Doomscrolled for more than 1 hour', points: -2 },
      { text: 'Didn\'t sleep well (mental fatigue)', points: -1 }
    ]
  },
  intellect: {
    name: 'Intellect',
    level: 50,
    xp: 0,
    tasks: [
      { text: 'Solved 3 LeetCode/Logic puzzles', points: 2 },
      { text: 'Learned something new (course, skill)', points: 3 },
      { text: 'Wasted time on useless content', points: -2 },
      { text: 'Avoided learning for a week', points: -3 }
    ]
  },
  ambition: {
    name: 'Ambition',
    level: 50,
    xp: 0,
    tasks: [
      { text: 'Set a clear weekly goal and achieved it', points: 2 },
      { text: 'Applied for a new opportunity', points: 2 },
      { text: 'Made a vision board / goal planner', points: 3 },
      { text: 'Drifted aimlessly, no plan for 3+ days', points: -2 }
    ]
  },
  discipline: {
    name: 'Discipline',
    level: 50,
    xp: 0,
    tasks: [
      { text: 'Followed routine strictly for 5 days', points: 3 },
      { text: 'Avoided distractions (no Insta etc.)', points: 2 },
      { text: 'Broke a habit repeatedly', points: -2 },
      { text: 'Procrastinated hard tasks', points: -2 }
    ]
  },
  relationship: {
    name: 'Relationship',
    level: 50,
    xp: 0,
    tasks: [
      { text: 'Had deep 1:1 conversation with loved one', points: 2 },
      { text: 'Resolved a conflict peacefully', points: 3 },
      { text: 'Did something kind for someone', points: 2 },
      { text: 'Ignored or fought with close ones', points: -2 }
    ]
  }
};

export const calculateLevel = (xp) => {
  // Simple level calculation: 1 level per 100 XP
  return Math.min(100, Math.max(0, Math.floor(xp / 100)));
};

export const getPersonalityType = (attributes) => {
  const highestAttribute = Object.entries(attributes).reduce((a, b) => 
    a[1].level > b[1].level ? a : b
  );
  
  return {
    type: highestAttribute[0],
    level: highestAttribute[1].level
  };
}; 
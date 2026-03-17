// src/data/affirmations.js

export const affirmationGroups = {
  gita: {
    id: 'gita',
    label: 'Bhagavad Gita',
    quotes: [
      { text: "You have the right to work, but for the work's sake only. You have no right to the fruits of work.", author: "Lord Krishna (2.47)" },
      { text: "Yoga is the journey of the self, through the self, to the self.", author: "Bhagwat Gita (6.20)" },
      { text: "The mind is restless and difficult to restrain, but it is subdued by practice.", author: "Lord Krishna (6.35)" },
      { text: "There is neither this world, nor the world beyond, nor happiness for the one who doubts.", author: "Bhagwat Gita (4.40)" }
    ]
  },
  positive: {
    id: 'positive',
    label: 'Positive Thinking',
    quotes: [
      { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
      { text: "Act as if what you do makes a difference. It does.", author: "William James" }
    ]
  },
  gratitude: {
    id: 'gratitude',
    label: 'Gratitude',
    quotes: [
      { text: "Gratitude turns what we have into enough.", author: "Unknown" },
      { text: "Enjoy the little things, for one day you may look back and realize they were the big things.", author: "Robert Brault" },
      { text: "Wear gratitude like a cloak, and it will feed every corner of your life.", author: "Rumi" },
      { text: "Reflect upon your present blessings, of which every man has plenty.", author: "Charles Dickens" }
    ]
  }
};

export const getAllQuotes = () => {
  return [
    ...affirmationGroups.gita.quotes,
    ...affirmationGroups.positive.quotes,
    ...affirmationGroups.gratitude.quotes
  ];
};
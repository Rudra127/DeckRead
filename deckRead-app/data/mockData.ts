export interface BookCard {
  id: string;
  content: string;
  imageUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  cards: BookCard[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  followers: number;
  following: number;
  savedBooks: string[];
  quotes: Quote[];
}

export interface Quote {
  id: string;
  bookId: string;
  cardId: string;
  content: string;
  createdAt: number; // timestamp
}

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverImage: 'https://api.a0.dev/assets/image?text=Atomic+Habits&aspect=1:1',
    cards: [
      {
        id: '1-1',
        content: 'Tiny changes, remarkable results. Atomic Habits is about how small, consistent actions lead to significant improvements over time.',
      },
      {
        id: '1-2',
        content: 'The 1% Rule: Improve by 1% each day for one year, and you\'ll end up 37 times better.',
      },
      {
        id: '1-3',
        content: 'Four Laws of Behavior Change: Make it obvious, make it attractive, make it easy, make it satisfying.',
      },
      {
        id: '1-4',
        content: 'Identity-based habits: Focus on who you want to become, not what you want to achieve.',
      },
      {
        id: '1-5',
        content: 'Environment design is more important than motivation. Set up your space for success.',
      }
    ]
  },
  {
    id: '2',
    title: 'Deep Work',
    author: 'Cal Newport',
    coverImage: 'https://api.a0.dev/assets/image?text=Deep+Work&aspect=1:1',
    cards: [
      {
        id: '2-1',
        content: 'Deep Work: Professional activities performed in a state of distraction-free concentration that push cognitive capabilities to their limit.',
      },
      {
        id: '2-2',
        content: 'The ability to perform deep work is becoming increasingly rare and valuable in our economy.',
      },
      {
        id: '2-3',
        content: 'Schedule every minute of your day to make the most of your time and avoid distractions.',
      },
      {
        id: '2-4',
        content: 'Embrace boredom to train your mind to focus and resist the pull of distractions.',
      },
      {
        id: '2-5',
        content: 'Quit social media selectively to reclaim your attention and time for deep work.',
      }
    ]
  },
  {
    id: '3',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    coverImage: 'https://api.a0.dev/assets/image?text=Thinking+Fast+and+Slow&aspect=1:1',
    cards: [
      {
        id: '3-1',
        content: 'System 1 (fast thinking) is automatic, intuitive, and emotional. System 2 (slow thinking) is deliberate, logical, and requires effort.',
      },
      {
        id: '3-2',
        content: 'We often rely on mental shortcuts (heuristics) that can lead to systematic errors (biases).',
      },
      {
        id: '3-3',
        content: 'Anchoring Effect: Initial information influences subsequent judgments, even when irrelevant.',
      },
      {
        id: '3-4',
        content: 'Availability Bias: We overestimate the likelihood of events that are easy to recall.',
      },
      {
        id: '3-5',
        content: 'Loss aversion: The pain of losing is psychologically about twice as powerful as the pleasure of gaining.',
      }
    ]
  },
  {
    id: '4',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    coverImage: 'https://api.a0.dev/assets/image?text=Sapiens&aspect=1:1',
    cards: [
      {
        id: '4-1',
        content: 'Homo sapiens conquered the world thanks to its unique language and ability to create and believe in shared myths.',
      },
      {
        id: '4-2',
        content: 'The Agricultural Revolution was history\'s biggest fraud—it made life worse for most humans.',
      },
      {
        id: '4-3',
        content: 'Money, empires, and religions are all inter-subjective realities that exist only in our collective imagination.',
      },
      {
        id: '4-4',
        content: 'Capitalism\'s success relies on our trust in the future and reinvestment of profits.',
      },
      {
        id: '4-5',
        content: 'Despite material abundance, modern humans aren\'t necessarily happier than our ancestors.',
      }
    ]
  }
];

export const mockUser: User = {
  id: '1',
  username: 'bookworm',
  email: 'reader@deckread.com',
  profilePicture: 'https://api.a0.dev/assets/image?text=BR&aspect=1:1',
  bio: 'Avid reader and knowledge seeker. I love summarizing books!',
  followers: 245,
  following: 123,
  savedBooks: ['1', '3'],
  quotes: [
    {
      id: 'q1',
      bookId: '1',
      cardId: '1-2',
      content: 'The 1% Rule: Improve by 1% each day for one year, and you\'ll end up 37 times better.',
      createdAt: Date.now() - 3600000, // 1 hour ago
    }
  ]
};
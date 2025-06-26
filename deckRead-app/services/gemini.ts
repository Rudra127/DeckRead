import { BookCard } from '../data/mockData';

const GEMINI_API_KEY = 'AIzaSyDSgLdO3IuMHu-xTbRKNwdecefDcLQ44bU';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export const callGemini = async (prompt: string): Promise<string> => {
  try {
    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const res = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error('Gemini API Error');
    }

    const data: GeminiResponse = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return text.trim();
  } catch (e) {
    console.error('Gemini fetch error', e);
    return '';
  }
};

export const generateSummaryCards = async (
  bookTitle: string,
  bookDescription: string,
  cardCount: number,
): Promise<BookCard[]> => {
  const prompt = `You are a world-class book summarizer that writes in the voice of the original author.
Return **exactly** ${cardCount} JSON objects in an array, each with an \"content\" field (no other keys). The content of each object should read like a vivid, stand-alone quote-sized insight— succinct yet emotionally resonant. Finish each card without trailing spaces or line breaks.

Book title: ${bookTitle}

Book description / excerpt:
"""
${bookDescription}
"""`;

  const raw = await callGemini(prompt);

  // Try to parse JSON array. Fallback to splitting by newline if parse fails.
  try {
    const arr = JSON.parse(raw) as { content: string }[];
    return arr.map((obj, idx) => ({ id: `${Date.now()}-${idx}`, content: obj.content }));
  } catch (err) {
    // naive split
    const parts = raw.split(/\n+/).filter(Boolean).slice(0, cardCount);
    return parts.map((p, idx) => ({ id: `${Date.now()}-${idx}`, content: p.replace(/^[-*\d.\s]+/, '') }));
  }
};

export const generateNewBookSuggestions = async (userInterests: string) => {
  const prompt = `Based on the following user interests: \"${userInterests}\", please generate a list of 3 fictional book suggestions.
For each book, provide a creative \"title\", plausible \"author\", and a single paragraph \"summary\".
Return the result as valid JSON array.`;
  const raw = await callGemini(prompt);
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};
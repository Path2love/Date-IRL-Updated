import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { DateIdea, ProfileState, UserIntent } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'A short, evocative title for the date, like "Cozy Corner at Willow & Bean".' },
      description: { type: Type.STRING, description: 'A short, engaging description of the date, 2-3 sentences long.' },
      category: { type: Type.STRING, description: 'A single category like "Dining", "Outdoors", "Arts", "Entertainment", "Cozy Night In".' },
      budget: { type: Type.STRING, description: 'The estimated cost per person, matching the user\'s selected budget range.' },
      address: { type: Type.STRING, description: 'A complete, real-world street address for the activity including street name, number, city, state/province, and postal code in the specified location. This is MANDATORY.' },
      photo_prompt: { type: Type.STRING, description: 'A comma-separated list of 2-3 simple, descriptive keywords for an image search (e.g., "cozy cafe, latte art").' },
      rating: { type: Type.NUMBER, description: 'An overall rating score out of 5, e.g., 4.5.' },
      review_count: { type: Type.INTEGER, description: 'The number of reviews the place has, e.g., 120.' },
      know_before_you_go: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'A short bullet list of practical tips: dress code, best arrival time, parking, noise level.'
      },
      why_this_is_a_match: { type: Type.STRING, description: 'A 1-2 sentence personalized rationale explaining why this is a good match for the user\'s complete profile. Example: "Because you love intellectual debates and deep conversation, this quiet bookstore cafe is ideal."' },
      ice_breaker: { type: Type.STRING, description: 'A unique conversation starter specific to the venue or activity. Example: "Which book cover here best represents your life story?"' },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'A list of relevant vibe tags, like "Cozy", "Quiet", "Conversation", "Pet-friendly".'
      },
      experience_flow: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'A 3-5 step plan for the date experience. E.g., "Arrive & grab coffee", "Discuss the daily prompt", "Walk to the nearby park".'
      },
      duration: { type: Type.STRING, description: 'Suggested time window for the date, e.g., "60-90 min".' },
      distance_eta: { type: Type.STRING, description: 'An estimated travel time from a central point, e.g., "15 min drive".' },
      safety_badges: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'List of safety/comfort badges like "Public First-Date", "Well-Lit", "ID Verified", "LGBTQ+ Friendly".'
      },
    },
    required: ['title', 'description', 'category', 'budget', 'address', 'photo_prompt', 'rating', 'review_count', 'know_before_you_go', 'why_this_is_a_match', 'ice_breaker', 'tags', 'experience_flow', 'duration', 'distance_eta', 'safety_badges'],
  },
};

const buildPrompt = (profile: ProfileState, intent: UserIntent) => {
    let intentText: string;
    switch (intent) {
        case 'find_date_spot':
          intentText = 'The user is looking for a curated date spot, suitable for getting to know someone.';
          break;
        case 'find_singles_spots':
          intentText = 'The user is single and is ACTIVELY looking for places and social environments to meet other like-minded singles. This is NOT for a one-on-one date. The primary goal is to mingle. Therefore, prioritize vibrant, social venues: think lively bars with communal tables, popular coffee shops known for their social scene, group hobby classes (like pottery or dancing), social sports leagues, or community events. The suggestions MUST be actual places or events, not generic advice like "go to a bar". Critically, do NOT suggest quiet, romantic restaurants or any setting designed for an intimate two-person date.';
          break;
        case 'find_event':
            intentText = 'The user wants to find a specific, timed event happening soon. Prioritize suggestions like concerts, art gallery openings, workshops, food festivals, or live performances. The title should include the event name and date if possible.'
            break;
        default:
          intentText = 'The user is looking for a general date idea.';
    }

    const locationText = `in or near ${profile.preferences.location.city}, ${profile.preferences.location.country} (${profile.preferences.location.postalCode})`;

    return `Based on the "Date IRL" app, act as a hyper-personalized date concierge. Here is the user's deep profile:

- **Identity**: A ${profile.identity.age || 'user'}-year-old ${profile.identity.gender || 'person'} who identifies as ${profile.identity.orientation || 'not specified'}.
- **Personality**: Their primary archetypes are [${profile.personality.archetypes.join(', ')}] or they have a general "open" personality if none are selected. They are seeking a "${profile.personality.vibe || 'any'}" vibe.
- **Style & Goals**: They prefer communication that is [${profile.style.communication.join(', ') || 'any style'}]. Their relationship goals include [${profile.style.goals.join(', ') || 'open to anything'}].
- **Preferences**: They are looking for ideas ${locationText} within a ${profile.preferences.radius}-mile radius. Their budget is "${profile.preferences.budget || 'any'}" per person. They are available on [${profile.preferences.availability.days.join(' & ') || 'any day'}] during the [${profile.preferences.availability.times.join(' or ') || 'any time'}].
- **Safety**: Their safety preferences are: ID Verification (${profile.safety.id_verification}), Share Location (${profile.safety.share_location}), Public First Date (${profile.safety.public_first}).

**User's Goal for Today**:
${intentText}

**CRITICAL TASK**:
Use this rich profile to generate a list of 6 high-quality, context-aware recommendations. The suggestions must feel deeply personalized. The "Why It's a Match" section is critical and must directly reference their profile (e.g., archetypes, goals). For each recommendation, provide a "Date Card" with all required fields.

**DATA QUALITY RULES:**
1.  **Address is Paramount**: The 'address' field is the most critical piece of information. It MUST be a complete, real-world, verifiable street address for a specific, existing venue (e.g., "123 Main St, San Francisco, CA 94111").
2.  **No Vague Locations**: Do NOT use general locations like "a local park" or "downtown area". You must find a specific, named venue.
3.  **Substitution Strategy**: If you have a great idea (e.g., "stargazing") but cannot find a specific, address-verifiable business or location for it, you MUST substitute that idea with a different one that DOES have a verifiable address. Prioritize real, actionable locations over concepts.
4.  **Complete All Fields**: Every single field in the response schema is required. Do not omit any.`;
};


export const generateDateIdeas = async (profile: ProfileState, intent: UserIntent): Promise<DateIdea[]> => {
  try {
    const prompt = buildPrompt(profile, intent);

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, // Lowered for more consistent, structured output
      },
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
      throw new Error("The AI returned an empty response. Please try adjusting your filters.");
    }
    
    try {
        const ideas = JSON.parse(jsonText) as DateIdea[];
        // Sometimes the model might return a single object instead of an array
        if (ideas && !Array.isArray(ideas)) {
            return [ideas];
        }
        return ideas;
    } catch (parseError) {
        console.error("Failed to parse JSON response from AI. Response text:", jsonText);
        throw new Error("The AI returned a response in an unexpected format. Please try again.");
    }

  } catch (error) {
    console.error("Error generating date ideas:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate date ideas from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};
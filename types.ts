export interface DateIdea {
  title: string;
  description: string;
  category: string;
  budget: string;
  address: string;
  rating: number;
  review_count: number;
  know_before_you_go: string[];
  why_this_is_a_match: string;
  ice_breaker: string;
  tags: string[];
  experience_flow: string[];
  duration: string;
  distance_eta: string;
  safety_badges: string[];
  photo_prompt: string;
  imageUrl?: string;
  event_date?: string;
  event_time?: string;
  ticket_price?: string;
  booking_link?: string;
  venue_website?: string;
}

export type UserIntent = 'find_date_spot' | 'find_singles_spots' | 'find_event';

export type Vibe = 'Adventurous' | 'Cozy' | 'Intellectual' | 'Foodie' | 'Creative' | 'Laid-back' | 'Cultural' | 'Social' | 'Romantic' | '';

export type Archetype = 'Adventurous Explorer' | 'Cozy Homebody' | 'Intellectual Debater' | 'Nature Lover' | 'Foodie' | 'Social Butterfly' | 'Fitness Enthusiast' | 'Creative Artist' | 'Cultural Curator' | 'Night Owl';

export type CommunicationStyle = 'Clear Communicator' | 'Big Picture Thinker' | 'Straight-to-the-Point Speaker' | 'Playful Talker' | 'The Heartfelt Speaker';

export type LoveGoal = 'Long-term relationship' | 'Short-term dating' | 'Spontaneity' | 'Stability' | 'Emotional safety';

export type Budget = '<$25' | '$25-$50' | '$50-$100' | '$100-$200' | '$200+' | '';

export type Availability = 'Weekdays' | 'Weekends';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';

export type SubscriptionStatus = 'none' | 'free' | 'premium';

export type Feedback = 'like' | 'dislike';
export type FeedbackState = Record<string, Feedback>;

export interface ProfileState {
  identity: {
    age: number | '';
    gender: string;
    orientation: string;
  },
  personality: {
    archetypes: Archetype[];
    vibe: Vibe;
  },
  style: {
    communication: CommunicationStyle[];
    goals: LoveGoal[];
  },
  preferences: {
    location: {
        city: string;
        country: string;
        postalCode: string;
    };
    radius: number;
    budget: Budget;
    availability: {
      days: Availability[];
      times: TimeOfDay[];
    }
  },
  safety: {
    id_verification: boolean;
    share_location: boolean;
    public_first: boolean;
  }
}
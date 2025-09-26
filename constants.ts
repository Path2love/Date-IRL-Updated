import type { ProfileState, Vibe, Archetype, CommunicationStyle, LoveGoal, Budget, Availability, TimeOfDay } from './types';

export const VIBES: Vibe[] = ['Adventurous', 'Cozy', 'Intellectual', 'Foodie', 'Creative', 'Laid-back', 'Cultural', 'Social', 'Romantic'];

export const ARCHETYPES: { name: Archetype; icon: string; description: string }[] = [
  { name: 'Adventurous Explorer', icon: 'adventurous', description: 'Seeks thrills and new experiences.' },
  { name: 'Cozy Homebody', icon: 'cozy', description: 'Prefers quiet, intimate settings.' },
  { name: 'Intellectual Debater', icon: 'intellectual', description: 'Loves deep talks and mental stimulation.' },
  { name: 'Nature Lover', icon: 'nature', description: 'Finds peace and connection outdoors.' },
  { name: 'Foodie', icon: 'foodie', description: 'Explores the world through taste.' },
  { name: 'Social Butterfly', icon: 'social', description: 'Thrives in lively, group settings.' },
  { name: 'Fitness Enthusiast', icon: 'fitness', description: 'Enjoys active and healthy pursuits.' },
  { name: 'Creative Artist', icon: 'creative', description: 'Expresses through art and culture.' },
  { name: 'Cultural Curator', icon: 'cultural', description: 'Appreciates history, art, and museums.' },
  { name: 'Night Owl', icon: 'nightowl', description: 'Comes alive after the sun goes down.' },
];

export const COMMUNICATION_STYLES: CommunicationStyle[] = ['Clear Communicator', 'Big Picture Thinker', 'Straight-to-the-Point Speaker', 'Playful Talker', 'The Heartfelt Speaker'];
export const LOVE_GOALS: LoveGoal[] = ['Long-term relationship', 'Short-term dating', 'Spontaneity', 'Stability', 'Emotional safety'];

export const GENDERS: string[] = ['Man', 'Woman', 'Non-binary', 'Other', 'Prefer not to say'];
export const ORIENTATIONS: string[] = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Queer', 'Questioning', 'Pansexual', 'Asexual', 'Prefer not to say'];
export const RADII: number[] = [1, 5, 10, 15, 25, 50];
export const BUDGETS: Budget[] = ['<$25', '$25-$50', '$50-$100', '$100-$200', '$200+'];

export const AVAILABILITY_DAYS: Availability[] = ['Weekdays', 'Weekends'];
export const AVAILABILITY_TIMES: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening'];


export const INITIAL_PROFILE: ProfileState = {
  identity: {
    age: '',
    gender: '',
    orientation: '',
  },
  personality: {
    archetypes: [],
    vibe: '',
  },
  style: {
    communication: [],
    goals: [],
  },
  preferences: {
    location: {
        city: '',
        country: '',
        postalCode: '',
    },
    radius: 15,
    budget: '',
    availability: {
      days: [],
      times: [],
    }
  },
  safety: {
    id_verification: false,
    share_location: false,
    public_first: false,
  }
};
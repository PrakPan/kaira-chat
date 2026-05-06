export interface ThemePromptChip {
  icon?: string;
  label: string;
  sublabel?: string;
  prompt: string;
}

export interface ThemeTripCard {
  image: string;
  label: string;
  tags?: string;
  description?: string;
  prompt: string;
}

export interface ThemeTrendingCard {
  image: string;
  label: string;
  sublabel: string;
  prompt: string;
  description?: string;
}

export interface ThemeRow<T> {
  heading: string;
  icon?: string;
  cards: T[];
}

export interface ThemeTravellerStory {
  id: number;
  name: string;
  tripName: string;
  duration: string;
  groupType: string;
  destinations: string[];
  image: string;
  images?: string[];
  shortDescription: string;
  viewItineraryLink: string;
  rating: number;
  prompt: string;
}

export interface ThemeConfig {
  welcome?: {
    subtitle?: string;
    promptChips?: ThemePromptChip[];
  };
  rows?: {
    row1?: ThemeRow<ThemeTripCard>;
    row2?: ThemeRow<ThemeTrendingCard>;
    row3?: ThemeRow<ThemeTrendingCard>;
    row4?: ThemeRow<ThemeTripCard>;
  };
  travellerStories?: ThemeTravellerStory[];
  loginMandatory?: boolean;
}

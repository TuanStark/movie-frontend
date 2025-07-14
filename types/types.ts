export interface Movie {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  duration: string;
  releaseDate: string;
  upcoming: boolean;
  synopsis: string;
  director: string;
  actors: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  data?: Movie[]; // Add data field for movie cards
}

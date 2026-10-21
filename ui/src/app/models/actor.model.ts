export interface Actor {
  id: number;
  name: string;
  birthDate: string | null;
  biography: string | null;
  photo: string | null;
}

export interface ActorRequest {
  name: string;
  birthDate: string | null;
  biography: string | null;
  photo: string | null;
}

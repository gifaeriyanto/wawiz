export interface BroadcastListData {
  id: string | number;
  title: string;
  sentCount: number;
  image?: string;
}

export interface RecipientData {
  id: string;
  number: string;
  name?: string;
}

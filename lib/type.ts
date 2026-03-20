export interface Trip {
  id: string;
  title: string | null;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
}

export interface Note {
  id: string;
  text: string | null;
  type: 'task' | 'memo';
  completed: boolean;
}

export interface Itinerary {
  id: string;
  tripId: string | null;
  date: string | null;
  title: string | null;
  startTime?: string | null;
  endTime?: string | null;
  memo?: string | null;
  cost?: number | null;
  costCurrency?: string | 'JPY';
}

export interface Accommodation {
  id: string;
  tripId: string;
  name: string | null;
  checkIn: string;
  checkOut: string;
  address: string | null;
  url: string | null;
  memo: string | null;
}

export interface Member {
  id: string;
  tripId: string;
  name: string;
}

export interface AlbumLink {
  id: string;
  tripId: string;
  title: string;
  url: string;
  createdAt: string;
  tripTitle?: string;
  tripDestination?: string;
}

export interface Expense {
  id: string;
  tripId: string;
  amount: number;
  currency: string;
  paidByMemberId: string;
  splitMemberIds?: string[];
  title: string | null;
  date: string;
}
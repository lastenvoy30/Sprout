export type Frequency = "DAILY" | "WEEKDAYS" | "X_PER_WEEK";

export interface CheckIn {
  id: string;
  date: string;
  note: string | null;
  userId: string;
}

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  color: string;
  frequency: Frequency;
  targetCount: number | null;
  archived: boolean;
  checkIns: CheckIn[];
}

export interface GroupMember {
  id: string;
  userId: string;
  user: { id: string; name: string };
}

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  memberships: GroupMember[];
}

export interface FeedItem {
  id: string;
  date: string;
  habit: { title: string; emoji: string; color: string };
  user: { id: string; name: string };
  kudos: { id: string; emoji: string; from: { id: string; name: string } }[];
}

export interface GroupMember {
  id: string;
  userId: string;
  user: { id: string; name: string };
}

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  memberships: GroupMember[];
}
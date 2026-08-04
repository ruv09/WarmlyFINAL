import { MoodId } from "./mood";

export interface Entry {
  id: string;
  /** YYYY-MM-DD, используется для группировки по дням. */
  date: string;
  /** HH:mm */
  time: string;
  moodId: MoodId;
  note: string;
  smallWin?: string;
  treeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryInput {
  moodId: MoodId;
  note: string;
  smallWin?: string;
}

export interface UpdateEntryInput {
  moodId?: MoodId;
  note?: string;
  smallWin?: string;
}

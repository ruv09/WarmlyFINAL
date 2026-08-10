import { create } from "zustand";
import { CreateEntryInput, Entry, Tree, UpdateEntryInput } from "../types";
import {
  assignNextSpecies,
  entryRepository,
  placeNextTree,
  placementMeta,
  treeRepository,
} from "../services";
import { requireMoodById } from "../constants/moods";
import { generateId, toDateKey, toTimeString } from "../utils";
import { useForestStore } from "./useForestStore";

interface EntriesState {
  entries: Entry[];
  isLoading: boolean;
  load: () => Promise<void>;
  createEntry: (input: CreateEntryInput) => Promise<Entry>;
  updateEntry: (id: string, input: UpdateEntryInput) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

/**
 * Единственное место, где живёт правило "новая запись -> новое дерево".
 * Настроение (input.moodId) больше не определяет вид дерева — вид
 * выбирает assignNextSpecies, а место в лесу — placeNextTree.
 * После записи/удаления лес перезагружается в useForestStore.
 */
export const useEntriesStore = create<EntriesState>((set, get) => ({
  entries: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    const entries = await entryRepository.getAll();
    set({
      entries: [...entries].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
      isLoading: false,
    });
  },

  createEntry: async (input) => {
    requireMoodById(input.moodId);

    const now = new Date();
    const nowIso = now.toISOString();

    const existingTrees = await treeRepository.getAll();
    const recentSpecies = existingTrees.slice(-3).map((tree) => tree.species);
    const species = assignNextSpecies(recentSpecies);
    const position = placeNextTree(existingTrees);
    const meta = placementMeta(position);
    const variant = Math.random() < 0.5 ? 1 : 2;

    const tree: Tree = {
      id: generateId(),
      species,
      position,
      scale: meta.scale,
      depth: meta.depth,
      variant,
      createdAt: nowIso,
    };
    await treeRepository.add(tree);

    const entry: Entry = {
      id: generateId(),
      date: toDateKey(now),
      time: toTimeString(now),
      moodId: input.moodId,
      note: input.note.trim(),
      smallWin: input.smallWin?.trim() || undefined,
      treeId: tree.id,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await entryRepository.add(entry);
    await get().load();
    await useForestStore.getState().load();
    return entry;
  },

  updateEntry: async (id, input) => {
    if (input.moodId) requireMoodById(input.moodId);
    await entryRepository.update(id, (entry) => ({
      ...entry,
      moodId: input.moodId ?? entry.moodId,
      note: input.note !== undefined ? input.note.trim() : entry.note,
      smallWin:
        input.smallWin !== undefined ? input.smallWin.trim() || undefined : entry.smallWin,
      updatedAt: new Date().toISOString(),
    }));
    await get().load();
  },

  deleteEntry: async (id) => {
    const entry = get().entries.find((e) => e.id === id);
    await entryRepository.remove(id);
    if (entry) await treeRepository.remove(entry.treeId);
    await get().load();
    await useForestStore.getState().load();
  },
}));

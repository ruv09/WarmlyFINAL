import { create } from "zustand";
import { CreateEntryInput, Entry, FOREST_LAYOUT_VERSION, Tree, UpdateEntryInput } from "../types";
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
 * Настроение не определяет вид: assignNextSpecies выбирает вид,
 * placeNextTree задаёт вариацию размера. Каталог группирует деревья по месяцу записи.
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
    const planted = placeNextTree(existingTrees);
    const meta = placementMeta(planted);
    const variant = hash01(`${nowIso}:${species}`) < 0.5 ? 1 : 2;

    const tree: Tree = {
      id: generateId(),
      species,
      position: { x: planted.x, y: planted.y },
      scale: meta.scale,
      depth: meta.depth,
      layer: meta.layer,
      variant,
      layoutVersion: FOREST_LAYOUT_VERSION,
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

function hash01(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

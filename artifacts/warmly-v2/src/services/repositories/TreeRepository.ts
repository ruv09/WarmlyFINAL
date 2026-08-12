import { FOREST_LAYOUT_VERSION, Tree, normalizeTree } from "../../types";
import { StorageClient } from "../storage/StorageClient";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { placeNextTree, placementMeta } from "../forest/placement";

type RawTree = Partial<Tree> & Pick<Tree, "id" | "species" | "position" | "createdAt">;

/**
 * Дерево неизменяемо после создания (без механики роста).
 * При смене FOREST_LAYOUT_VERSION лес перераскладывается один раз.
 */
export class TreeRepository {
  constructor(private readonly storage: StorageClient) {}

  async getAll(): Promise<Tree[]> {
    const raw = (await this.storage.getItem<RawTree[]>(STORAGE_KEYS.trees)) ?? [];
    if (raw.length === 0) return [];

    const needsRelayout = raw.some(
      (tree) =>
        tree.layoutVersion !== FOREST_LAYOUT_VERSION ||
        typeof tree.depth !== "number" ||
        typeof tree.scale !== "number",
    );

    if (!needsRelayout) {
      return raw.map((tree) => normalizeTree(tree));
    }

    const ordered = [...raw].sort((a, b) =>
      a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0,
    );
    const placed: Tree[] = [];
    for (const tree of ordered) {
      const position = placeNextTree(placed);
      const meta = placementMeta(position);
      placed.push(
        normalizeTree({
          ...tree,
          position,
          scale: meta.scale,
          depth: meta.depth,
          variant: typeof tree.variant === "number" ? tree.variant : undefined,
          layoutVersion: FOREST_LAYOUT_VERSION,
        }),
      );
    }
    await this.saveAll(placed);
    return placed;
  }

  async saveAll(trees: Tree[]): Promise<void> {
    await this.storage.setItem(
      STORAGE_KEYS.trees,
      trees.map((tree) => ({ ...normalizeTree(tree), layoutVersion: FOREST_LAYOUT_VERSION })),
    );
  }

  async add(tree: Tree): Promise<void> {
    const trees = await this.getAll();
    trees.push(normalizeTree({ ...tree, layoutVersion: FOREST_LAYOUT_VERSION }));
    await this.saveAll(trees);
  }

  async remove(id: string): Promise<void> {
    const trees = await this.getAll();
    await this.saveAll(trees.filter((t) => t.id !== id));
  }
}

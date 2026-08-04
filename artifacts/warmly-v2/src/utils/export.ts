import { Entry } from "../types";

export interface ExportPayload {
  exportedAt: string;
  version: 1;
  entries: Entry[];
}

/**
 * Готовит данные к экспорту как чистые данные — не знает, будет ли
 * результат сохранён в файл, отправлен через Share API или выведен
 * как угодно ещё. Формат — обычный читаемый JSON: пользователь имеет
 * право получить свои данные в открытом, непроприетарном виде.
 */
export function buildExportPayload(entries: Entry[]): ExportPayload {
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    entries,
  };
}

export function serializeExportPayload(payload: ExportPayload): string {
  return JSON.stringify(payload, null, 2);
}

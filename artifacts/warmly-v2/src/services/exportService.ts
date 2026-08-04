import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Entry } from "../types";
import { buildExportPayload, serializeExportPayload } from "../utils/export";

/**
 * Единственное место в приложении, которое знает про файловую
 * систему устройства и Share-диалог. hooks/screens вызывают только
 * exportEntries(entries) и не знают, что за этим стоит запись
 * временного файла — как и с AsyncStorage, это деталь реализации,
 * а не то, с чем должен работать UI напрямую (см. /DATA_LAYER.md).
 *
 * Файл, а не текстовый Share.share(), — потому что на некоторых
 * платформах текстовый шаринг обрезает длинные сообщения; экспорт
 * дневника за месяцы использования может быть заметно длиннее лимита.
 */
export async function exportEntries(entries: Entry[]): Promise<void> {
  const payload = buildExportPayload(entries);
  const json = serializeExportPayload(payload);

  const file = new File(Paths.cache, `warmly-export-${Date.now()}.json`);
  file.create();
  file.write(json);

  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error("Sharing is not available on this device");
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: "application/json",
    dialogTitle: "Экспорт данных Warmly",
  });
}

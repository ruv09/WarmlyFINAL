import { TreePosition } from "../../types";

const MIN_DISTANCE = 58;
const MAX_DISTANCE_FROM_ANCHOR = 160;
const MAX_ATTEMPTS_PER_ANCHOR = 28;
const MAX_ANCHOR_ROUNDS = 14;

function distance(a: TreePosition, b: TreePosition): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function isFarEnoughFromAll(candidate: TreePosition, existing: TreePosition[]): boolean {
  return existing.every((point) => distance(point, candidate) >= MIN_DISTANCE);
}

/**
 * Находит естественное место для нового дерева — упрощённый,
 * инкрементальный вариант dart-throwing/Poisson-disc sampling.
 *
 * Идея: новое дерево появляется рядом со случайным уже существующим
 * ("якорем"), на случайном расстоянии и под случайным углом от него.
 * Это заставляет лес расти органично наружу от уже занятой области
 * (требование "лес постепенно расширяется, без ощущения жёстких
 * границ"), а не разбрасывает деревья равномерно по бесконечному
 * пространству. Минимальная дистанция до ВСЕХ остальных деревьев
 * гарантирует отсутствие пересечений; случайные угол и дистанция
 * от якоря естественным образом создают неровные промежутки и
 * небольшие полянки — в отличие от сетки, где расстояния всегда
 * одинаковы.
 *
 * Почему не классический Poisson-disc sampling по всей области сразу:
 * деревья появляются по одному, в реальном времени, по мере создания
 * записей — а не все сразу для готового набора точек. Этот алгоритм —
 * инкрементальная версия того же принципа.
 *
 * Производительность: сложность одной попытки — O(n) от количества
 * уже существующих деревьев, но вызывается функция ровно один раз
 * при создании записи — событие, определяемое темпом пользователя
 * (не кадром рендера). Даже при тысяче деревьев это разовые доли
 * миллисекунды. Частая операция — не размещение, а отрисовка, и она
 * оптимизируется отдельно, виртуализацией видимой области
 * (см. utils/viewportCulling.ts).
 */
export function placeNextTree(existingPositions: TreePosition[]): TreePosition {
  if (existingPositions.length === 0) {
    return { x: 0, y: 0 };
  }

  for (let anchorRound = 0; anchorRound < MAX_ANCHOR_ROUNDS; anchorRound++) {
    const anchor = existingPositions[Math.floor(Math.random() * existingPositions.length)];

    for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_ANCHOR; attempt++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = MIN_DISTANCE + Math.random() * (MAX_DISTANCE_FROM_ANCHOR - MIN_DISTANCE);
      // Чуть шире по горизонтали — лес читается как территория, а не столбик.
      const candidate: TreePosition = {
        x: anchor.x + Math.cos(angle) * dist * 1.15,
        y: anchor.y + Math.sin(angle) * dist * 0.9,
      };
      if (isFarEnoughFromAll(candidate, existingPositions)) {
        return candidate;
      }
    }
  }

  const fallbackAnchor = existingPositions[Math.floor(Math.random() * existingPositions.length)];
  const angle = Math.random() * Math.PI * 2;
  return {
    x: fallbackAnchor.x + Math.cos(angle) * MAX_DISTANCE_FROM_ANCHOR * 1.5,
    y: fallbackAnchor.y + Math.sin(angle) * MAX_DISTANCE_FROM_ANCHOR * 1.5,
  };
}

/**
 * 坐标系计算
 */
export interface Coordinate {
  x: number;
  y: number;
}

/**
 * 圆
 * @param basePoint
 * @param radius
 * @param count
 */
export function calculateCircularCoords(
  basePoint: Coordinate,
  radius: number,
  count: number,
): Coordinate[] {
  const perAngel = (2 * Math.PI) / count;
  const nodes = new Array(count).fill(null).map((item, idx) => {
    return {
      x: Math.cos(idx * perAngel) * radius + basePoint.x,
      y: Math.sin(idx * perAngel) * radius + basePoint.y,
    };
  });
  return nodes;
}

/**
 * 扇形
 * @param basePoint
 * @param radius
 * @param count
 */
export function calculateSectorCoords(
  basePoint: Coordinate,
  radius: number,
  count: number,
) {}

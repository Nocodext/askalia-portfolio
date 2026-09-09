export type BuildingType = "tower" | "campus" | "hospital" | "station" | "residential";

export type MatrixCell = { x: number; y: number; z: number; level: number };

export type MatrixGeometry = {
  cells: MatrixCell[];
  cell: number;
  cols: number;
  rows: number;
  levelH: number;
  cx: number;
  cz: number;
};

/**
 * Procedural massing per building archetype. Each type carves a different
 * footprint-over-height pattern out of the same cols x rows x levels grid,
 * so the level slider / voxel-density controls stay meaningful for all of
 * them while the silhouette reads as a distinct, typical building type.
 */
export function generateBuildingCells(
  type: BuildingType,
  levels: number,
  density: number,
): MatrixGeometry {
  const cell = 2.4 / density;
  const cols = Math.round(9 * density);
  const rows = Math.round(7 * density);
  const levelH = cell;
  const cx = (cols - 1) / 2;
  const cz = (rows - 1) / 2;

  const cells: MatrixCell[] = [];
  const push = (i: number, j: number, l: number) =>
    cells.push({ x: (i - cx) * cell, y: l * levelH, z: (j - cz) * cell, level: l });

  switch (type) {
    case "tower": {
      // Office tower: setback silhouette that tapers as it rises, with a
      // technical atrium void punched through the upper floors.
      for (let l = 0; l < levels; l++) {
        const t = l / Math.max(1, levels - 1);
        const shrink = 1 - t * 0.42;
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const dx = Math.abs(i - cx) / cx;
            const dz = Math.abs(j - cz) / cz;
            if (dx > shrink || dz > shrink) continue;
            const core = dx < 0.22 && dz < 0.22;
            if (core && l > levels * 0.45 && l % 3 !== 0) continue;
            push(i, j, l);
          }
        }
      }
      break;
    }

    case "campus": {
      // University campus: two low parallel bars around a central
      // courtyard, linked by a ground-floor breezeway.
      for (let l = 0; l < levels; l++) {
        for (let i = 0; i < cols; i++) {
          const iFrac = i / Math.max(1, cols - 1);
          const inCourtyard = iFrac > 0.4 && iFrac < 0.6;
          for (let j = 0; j < rows; j++) {
            if (inCourtyard && l >= 2) continue;
            push(i, j, l);
          }
        }
      }
      break;
    }

    case "hospital": {
      // CHU — 6 ailes: a wide podium base, a full-width connecting spine
      // corridor, and six separate ward wings branching off it — the
      // classic comb-shaped hospital layout.
      const podiumLevels = Math.max(2, Math.round(levels * 0.3));
      const wingCount = 6;
      const gapFrac = 0.3 / (wingCount - 1);
      const wingFrac = (1 - gapFrac * (wingCount - 1)) / wingCount;
      const isWingColumnAt = (iFrac: number) => {
        let pos = 0;
        for (let w = 0; w < wingCount; w++) {
          if (iFrac >= pos && iFrac < pos + wingFrac) return true;
          pos += wingFrac + gapFrac;
        }
        return false;
      };
      const spineRows = Math.max(1, Math.round(rows * 0.22));
      for (let l = 0; l < levels; l++) {
        const inPodium = l < podiumLevels;
        for (let i = 0; i < cols; i++) {
          const isWingColumn = isWingColumnAt(i / cols);
          for (let j = 0; j < rows; j++) {
            if (inPodium) {
              push(i, j, l);
              continue;
            }
            const inSpine = j < spineRows;
            if (inSpine || isWingColumn) push(i, j, l);
          }
        }
      }
      break;
    }

    case "station": {
      // Multimodal station: a long low concourse hall with a taller
      // central spine standing in for the vaulted train shed roof.
      const hallLevels = Math.max(2, Math.round(levels * 0.48));
      for (let l = 0; l < levels; l++) {
        const inHall = l < hallLevels;
        for (let i = 0; i < cols; i++) {
          const iFrac = i / Math.max(1, cols - 1);
          const inSpine = iFrac > 0.36 && iFrac < 0.64;
          for (let j = 0; j < rows; j++) {
            if (inHall || inSpine) push(i, j, l);
          }
        }
      }
      break;
    }

    case "residential": {
      // Housing block: a simple rectangular slab with a recessed rhythm
      // standing in for loggias / balconies on the facade.
      for (let l = 0; l < levels; l++) {
        for (let i = 0; i < cols; i++) {
          const isBalconyCol = i % 3 === 1;
          for (let j = 0; j < rows; j++) {
            const isFrontRow = j === 0 || j === rows - 1;
            if (isBalconyCol && isFrontRow && l % 2 === 1 && l > 0) continue;
            push(i, j, l);
          }
        }
      }
      break;
    }
  }

  return { cells, cell, cols, rows, levelH, cx, cz };
}

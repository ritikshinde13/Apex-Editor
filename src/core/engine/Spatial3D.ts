import { TransformProperties } from '@/types/timeline';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
  depthScale: number;
}

export interface Preset3D {
  id: string;
  name: string;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  z: number;
  perspective: number;
  depthShadow?: boolean;
}

export const PRESETS_3D: Preset3D[] = [
  { id: 'flat', name: 'Reset 2D', rotateX: 0, rotateY: 0, rotateZ: 0, z: 0, perspective: 1000, depthShadow: false },
  { id: 'isometric-r', name: 'Isometric (Right)', rotateX: 25, rotateY: -35, rotateZ: 0, z: 40, perspective: 1200, depthShadow: true },
  { id: 'isometric-l', name: 'Isometric (Left)', rotateX: 25, rotateY: 35, rotateZ: 0, z: 40, perspective: 1200, depthShadow: true },
  { id: 'cinematic-pitch', name: 'Cinematic Tilt', rotateX: 32, rotateY: 0, rotateZ: 0, z: 60, perspective: 900, depthShadow: true },
  { id: 'billboard-yaw', name: 'Perspective Turn', rotateX: 0, rotateY: 42, rotateZ: 0, z: 0, perspective: 1000, depthShadow: true },
  { id: 'floating-depth', name: 'Floating Card', rotateX: 18, rotateY: -22, rotateZ: 4, z: 160, perspective: 1100, depthShadow: true },
  { id: 'dramatic-wide', name: 'Dramatic Pop-Out', rotateX: -15, rotateY: 25, rotateZ: -6, z: 250, perspective: 650, depthShadow: true },
];

/**
 * Check if a transform has active 3D rotation, depth or perspective
 */
export function has3DTransform(transform: TransformProperties): boolean {
  const rx = transform.rotateX || 0;
  const ry = transform.rotateY || 0;
  const rz = transform.rotateZ || 0;
  const z = transform.z || 0;
  return Math.abs(rx) > 0.1 || Math.abs(ry) > 0.1 || Math.abs(rz) > 0.1 || Math.abs(z) > 0.1;
}

/**
 * Project a 3D vertex through pitch (X), yaw (Y), roll (Z) rotations and camera perspective
 */
export function project3DVertex(
  localX: number,
  localY: number,
  localZ: number,
  rotateXDeg: number,
  rotateYDeg: number,
  rotateZDeg: number,
  offsetX: number,
  offsetY: number,
  offsetZ: number,
  perspectiveDist: number,
  centerX: number,
  centerY: number
): ProjectedPoint {
  const radX = (rotateXDeg * Math.PI) / 180;
  const radY = (rotateYDeg * Math.PI) / 180;
  const radZ = (rotateZDeg * Math.PI) / 180;

  // 1. Rotate around X-axis (Pitch / Tilt)
  const y1 = localY * Math.cos(radX) - localZ * Math.sin(radX);
  const z1 = localY * Math.sin(radX) + localZ * Math.cos(radX);
  const x1 = localX;

  // 2. Rotate around Y-axis (Yaw / Turn)
  const x2 = x1 * Math.cos(radY) + z1 * Math.sin(radY);
  const z2 = -x1 * Math.sin(radY) + z1 * Math.cos(radY);
  const y2 = y1;

  // 3. Rotate around Z-axis (Roll)
  const x3 = x2 * Math.cos(radZ) - y2 * Math.sin(radZ);
  const y3 = x2 * Math.sin(radZ) + y2 * Math.cos(radZ);
  const z3 = z2;

  // 4. Translate in 3D space
  const worldX = x3 + offsetX;
  const worldY = y3 + offsetY;
  const worldZ = z3 + offsetZ;

  // 5. Camera Perspective Projection
  const safeD = Math.max(200, perspectiveDist);
  const eyeZ = safeD + worldZ;
  const scale = eyeZ > 20 ? safeD / eyeZ : 0.05;

  return {
    x: centerX + worldX * scale,
    y: centerY + worldY * scale,
    z: worldZ,
    depthScale: scale,
  };
}

/**
 * Affine textured triangle rendering on HTML5 Canvas 2D
 */
export function drawTexturedTriangle(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  u2: number,
  v2: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.closePath();
  ctx.clip();

  const delta = u0 * (v1 - v2) - u1 * (v0 - v2) + u2 * (v0 - v1);
  if (Math.abs(delta) > 0.00001) {
    const a = -(v0 * (p1.x - p2.x) - v1 * (p0.x - p2.x) + v2 * (p0.x - p1.x)) / delta;
    const b = -(v0 * (p1.y - p2.y) - v1 * (p0.y - p2.y) + v2 * (p0.y - p1.y)) / delta;
    const c = (u0 * (p1.x - p2.x) - u1 * (p0.x - p2.x) + u2 * (p0.x - p1.x)) / delta;
    const d = (u0 * (p1.y - p2.y) - u1 * (p0.y - p2.y) + u2 * (p0.y - p1.y)) / delta;
    const e = (u0 * (v1 * p2.x - v2 * p1.x) - u1 * (v0 * p2.x - v2 * p0.x) + u2 * (v0 * p1.x - v1 * p0.x)) / delta;
    const f = (u0 * (v1 * p2.y - v2 * p1.y) - u1 * (v0 * p2.y - v2 * p0.y) + u2 * (v0 * p1.y - v1 * p0.y)) / delta;

    ctx.transform(a, b, c, d, e, f);
    ctx.drawImage(source, 0, 0);
  }
  ctx.restore();
}

/**
 * Render a complete 3D perspective quad with depth grid and dynamic drop shadow
 */
export function render3DQuad(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  destWidth: number,
  destHeight: number,
  transform: TransformProperties,
  centerX: number,
  centerY: number,
  gridDivisions: number = 4
) {
  const rotX = transform.rotateX || 0;
  const rotY = transform.rotateY || 0;
  const rotZ = (transform.rotateZ || 0) + (transform.rotation || 0);
  const transX = transform.x;
  const transY = transform.y;
  const transZ = transform.z || 0;
  const perspective = transform.perspective || 1000;
  const scale = transform.scale || 1.0;

  const w = destWidth * scale;
  const h = destHeight * scale;

  // 1. Dynamic 3D Cast Shadow onto scene floor
  if (transform.depthShadow) {
    const shadowOffsetY = Math.max(30, 60 + (transZ * 0.25));
    const shadowSkewX = (rotY * 0.8);
    const shadowAlpha = Math.max(0.1, Math.min(0.65, 0.45 - transZ * 0.0005));

    ctx.save();
    ctx.filter = `blur(${Math.max(12, 24 + transZ * 0.05)}px)`;
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;

    // Compute shadow 4 corners
    const sP0 = project3DVertex(-w / 2, -h / 2, 0, rotX * 0.4, rotY * 0.4, rotZ, transX + shadowSkewX, transY + shadowOffsetY, transZ - 100, perspective, centerX, centerY);
    const sP1 = project3DVertex(w / 2, -h / 2, 0, rotX * 0.4, rotY * 0.4, rotZ, transX + shadowSkewX, transY + shadowOffsetY, transZ - 100, perspective, centerX, centerY);
    const sP2 = project3DVertex(w / 2, h / 2, 0, rotX * 0.4, rotY * 0.4, rotZ, transX + shadowSkewX, transY + shadowOffsetY, transZ - 100, perspective, centerX, centerY);
    const sP3 = project3DVertex(-w / 2, h / 2, 0, rotX * 0.4, rotY * 0.4, rotZ, transX + shadowSkewX, transY + shadowOffsetY, transZ - 100, perspective, centerX, centerY);

    ctx.beginPath();
    ctx.moveTo(sP0.x, sP0.y);
    ctx.lineTo(sP1.x, sP1.y);
    ctx.lineTo(sP2.x, sP2.y);
    ctx.lineTo(sP3.x, sP3.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 2. Generate Subdivided 3D Mesh Grid for perspective distortion
  const rows = gridDivisions;
  const cols = gridDivisions;

  const gridPoints: ProjectedPoint[][] = [];
  const uvs: { u: number; v: number }[][] = [];

  for (let r = 0; r <= rows; r++) {
    gridPoints[r] = [];
    uvs[r] = [];
    const vFraction = r / rows;
    const localY = -h / 2 + vFraction * h;
    const uvY = vFraction * sourceHeight;

    for (let c = 0; c <= cols; c++) {
      const uFraction = c / cols;
      const localX = -w / 2 + uFraction * w;
      const uvX = uFraction * sourceWidth;

      gridPoints[r][c] = project3DVertex(
        localX,
        localY,
        0,
        rotX,
        rotY,
        rotZ,
        transX,
        transY,
        transZ,
        perspective,
        centerX,
        centerY
      );
      uvs[r][c] = { u: uvX, v: uvY };
    }
  }

  // 3. Render triangular mesh
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p00 = gridPoints[r][c];
      const p10 = gridPoints[r][c + 1];
      const p11 = gridPoints[r + 1][c + 1];
      const p01 = gridPoints[r + 1][c];

      const uv00 = uvs[r][c];
      const uv10 = uvs[r][c + 1];
      const uv11 = uvs[r + 1][c + 1];
      const uv01 = uvs[r + 1][c];

      // Triangle 1: p00, p10, p11
      drawTexturedTriangle(
        ctx,
        source,
        uv00.u, uv00.v,
        uv10.u, uv10.v,
        uv11.u, uv11.v,
        p00, p10, p11
      );

      // Triangle 2: p00, p11, p01
      drawTexturedTriangle(
        ctx,
        source,
        uv00.u, uv00.v,
        uv11.u, uv11.v,
        uv01.u, uv01.v,
        p00, p11, p01
      );
    }
  }

  // 4. Subtle 3D Ambient Specular Lighting Glint based on tilt
  const lightIntensity = Math.max(0, Math.min(0.25, (rotX * 0.002) - (rotY * 0.002)));
  if (lightIntensity > 0.02) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = `rgba(255, 255, 255, ${lightIntensity})`;
    ctx.beginPath();
    ctx.moveTo(gridPoints[0][0].x, gridPoints[0][0].y);
    ctx.lineTo(gridPoints[0][cols].x, gridPoints[0][cols].y);
    ctx.lineTo(gridPoints[rows][cols].x, gridPoints[rows][cols].y);
    ctx.lineTo(gridPoints[rows][0].x, gridPoints[rows][0].y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

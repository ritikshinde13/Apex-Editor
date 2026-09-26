import { describe, it, expect } from 'vitest';
import {
  has3DTransform,
  project3DVertex,
  PRESETS_3D,
} from '../../src/core/engine/Spatial3D';
import { TransformProperties } from '../../src/types/timeline';

describe('Spatial3D Engine Module', () => {
  it('correctly identifies when 3D transform is active', () => {
    const flatTransform: TransformProperties = {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
      cropTop: 0,
      cropBottom: 0,
      cropLeft: 0,
      cropRight: 0,
    };
    expect(has3DTransform(flatTransform)).toBe(false);

    const pitchTransform: TransformProperties = {
      ...flatTransform,
      rotateX: 25,
    };
    expect(has3DTransform(pitchTransform)).toBe(true);

    const yawTransform: TransformProperties = {
      ...flatTransform,
      rotateY: -30,
    };
    expect(has3DTransform(yawTransform)).toBe(true);

    const depthTransform: TransformProperties = {
      ...flatTransform,
      z: 150,
    };
    expect(has3DTransform(depthTransform)).toBe(true);
  });

  it('projects 3D vertex to 2D screen coordinates with perspective scale', () => {
    // Center point with zero rotation and zero depth
    const centerProjected = project3DVertex(
      0, 0, 0,
      0, 0, 0,
      0, 0, 0,
      1000,
      500, 300
    );

    expect(centerProjected.x).toBeCloseTo(500, 1);
    expect(centerProjected.y).toBeCloseTo(300, 1);
    expect(centerProjected.depthScale).toBeCloseTo(1.0, 2);

    // Point moved closer along Z (positive depth -> scale > 1)
    const closeProjected = project3DVertex(
      0, 0, 0,
      0, 0, 0,
      0, 0, -200, // closer to camera
      1000,
      500, 300
    );
    expect(closeProjected.depthScale).toBeGreaterThan(1.0);

    // Point moved further away along Z (positive worldZ -> scale < 1)
    const farProjected = project3DVertex(
      0, 0, 0,
      0, 0, 0,
      0, 0, 500,
      1000,
      500, 300
    );
    expect(farProjected.depthScale).toBeLessThan(1.0);
  });

  it('rotates points in 3D around X, Y, and Z axes', () => {
    // 90 degree yaw rotation around Y turns X axis into Z
    const rotated = project3DVertex(
      100, 0, 0,
      0, 90, 0,
      0, 0, 0,
      1000,
      0, 0
    );
    // At 90 deg Yaw, x = 100 * cos(90) = 0
    expect(rotated.x).toBeCloseTo(0, 1);
  });

  it('provides all 7 spatial presets', () => {
    expect(PRESETS_3D.length).toBe(7);
    const presetIds = PRESETS_3D.map((p) => p.id);
    expect(presetIds).toContain('flat');
    expect(presetIds).toContain('isometric-r');
    expect(presetIds).toContain('isometric-l');
    expect(presetIds).toContain('cinematic-pitch');
    expect(presetIds).toContain('billboard-yaw');
    expect(presetIds).toContain('floating-depth');
    expect(presetIds).toContain('dramatic-wide');
  });
});

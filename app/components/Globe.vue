<template>
  <TresCanvas clearColor="#000000">
    <TresPerspectiveCamera
      :position="[0, 0, cameraPositionZ]"
      :near="0.1"
      :far="cameraFar"
      :fov="50"
    />
    <OrbitControls :target="[0, 0, 0]" />

    <TresMesh
      :geometry="globeGeometry"
      :material="globeMaterial"
      :rotation-y="globeRotation.y"
    />

    <Stars :position="[0, 0, starsPositionZ]" />
  </TresCanvas>
</template>

<script setup lang="ts">
/**
 * Globe component
 *
 * @see https://docs.tresjs.org/guide/
 * @see https://cientos.tresjs.org/guide/
 */

import {
  BufferGeometry,
  Float32BufferAttribute,
  MeshBasicMaterial as ThreeMeshBasicMaterial,
  Vector3,
  SphereGeometry,
  Material,
} from "three";
import { ref, type Ref } from "vue";

// Earth's semi-major axis (equatorial radius) in meters
const earthEquatorialRadiusMeters = 6378137;
// Earth's semi-minor axis (polar radius) in meters
const earthPolarRadiusMeters = 6356752;

// --- Fixed Scale Factor ---
const scaleFactor = 1; // Set your desired scale factor here

// --- Scaling Ratios (these are unitless and define proportions) ---
const cameraDistanceRatio = 4; // Camera distance from Earth center as a multiple of equatorial radius
const cameraFarRatio = 10; // Camera far clipping plane as a multiple of equatorial radius
const starsDistanceRatio = 2; // Stars distance from Earth center as a multiple of equatorial radius

// --- Scaled Radii (no computed) ---
const equatorialRadius = earthEquatorialRadiusMeters * scaleFactor; // in units (meters * scaleFactor)
const polarRadius = earthPolarRadiusMeters * scaleFactor; // in units (meters * scaleFactor)

// --- Scaled Positions (no computed) ---
const cameraPositionZ = equatorialRadius * cameraDistanceRatio;
const cameraFar = equatorialRadius * cameraFarRatio;
const starsPositionZ = equatorialRadius * starsDistanceRatio;

const globeGeometry: BufferGeometry = new SphereGeometry(1, 64, 64); // Start with a unit sphere

// Modify vertex positions to create oblate spheroid
const positions = Array.from(globeGeometry.attributes.position?.array || []);
for (let i = 0; i < positions.length; i += 3) {
  const x = positions[i];
  const y = positions[i + 1];
  const z = positions[i + 2];

  const vertex = new Vector3(x, y, z).normalize(); // Get vertex direction from sphere center

  positions[i] = vertex.x * equatorialRadius; // Scale X by equatorial radius
  positions[i + 1] = vertex.y * polarRadius; // Scale Y (poles) by polar radius
  positions[i + 2] = vertex.z * equatorialRadius; // Scale Z by equatorial radius
}

// Update the position attribute with modified values
globeGeometry.setAttribute(
  "position",
  new Float32BufferAttribute(positions, 3)
);
globeGeometry.computeVertexNormals(); // Important to recompute normals after vertex change

const globeMaterial: Material = new ThreeMeshBasicMaterial({
  color: 0x0088ff,
  wireframe: true,
});

interface GlobeRotation {
  y: number;
}
const globeRotation: Ref<GlobeRotation> = ref({ y: 0 });
</script>

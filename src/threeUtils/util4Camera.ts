import { cameraTween } from "@/three/animate";
import { Three3d } from "@/three/Three3d";
import { SceneUserData } from "@/three/Three3dConfig";

export function cameraEnterAnimation(instance: Three3d) {
  const { camera, scene } = instance;
  const { cameraPosition } = scene.userData as SceneUserData;
  const { start, end } = cameraPosition;
  camera.position.set(start.x, start.y, start.z);
  cameraTween(camera, end, 1000).start();
}

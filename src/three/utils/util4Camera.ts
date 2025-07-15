import { cameraTween } from "@/three/animate";
import { Three3d } from "@/three/threeObj/Three3d";
import { SceneUserData } from "@/three/config/Three3dConfig";
import { Vector3 } from "three";

export function cameraEnterAnimation(instance: Three3d) {
  const { camera, scene } = instance;
  const { cameraPosition, config3d } = scene.userData as SceneUserData;

  const { start, end } = cameraPosition;
  if (config3d.useCesium) {
    const { x, y, z } = new Vector3(-2306236.16, 6965679.87, -8196202.81);

    camera.position.set(x, y, z);
    camera.updateProjectionMatrix();
    return;
  }
  //end的位置怎么没有变化？
  camera.position.set(start.x, start.y, start.z);
  cameraTween(camera, end, 1000).start();
}

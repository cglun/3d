import Toast3d from "@/component/common/Toast3d/Toast3d";
import { APP_COLOR, DELAY, MessageError } from "@/app/type";
import { EmergencyResponsePlanButtonGroupUpdate } from "@/app/customEvents/sceneEvent";
import { getEditorInstance } from "@/three/utils/utils";

export function errorMessage(error: MessageError) {
  const { status, response } = error;
  console.error(error);
  if (status === 500) {
    if (response.data.message) {
      Toast3d(response.data.message, "提示", APP_COLOR.Danger, DELAY.MIDDLE);
      return;
    }
    Toast3d("查看控制台！", "提示", APP_COLOR.Danger);
    return;
  }
  Toast3d("有误，查看控制台！", "提示", APP_COLOR.Danger);
}
// 更新预案按钮组
export function updateEmergencyPlan() {
  document.dispatchEvent(
    EmergencyResponsePlanButtonGroupUpdate({ time: new Date().getTime() })
  );
}

export function navigateToUrl(urlName: string) {
  const { userData } = getEditorInstance();
  const url = `/editor3d/${urlName}?sceneId=${userData.projectId}`;
  return url;
}

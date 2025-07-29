import Toast3d from "@/component/common/Toast3d/Toast3d";
import { APP_COLOR, DELAY, MessageError } from "@/app/type";

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

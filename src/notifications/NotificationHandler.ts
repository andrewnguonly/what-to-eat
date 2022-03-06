import { Platform } from "react-native";
import PushNotification from "react-native-push-notification";

class NotificationHandler {
  onNotification(notification: any) {
    console.log("NotificationHandler:", notification);

    if (typeof this.onNotification === "function") {
      this.onNotification(notification);
    }
  }

  attachNotification(handler: {
    (notification: { title: string; message: string | undefined }): void;
    (notification: any): void;
  }) {
    this.onNotification = handler;
  }
}

const handler = new NotificationHandler();

PushNotification.configure({
  onNotification: handler.onNotification.bind(handler),
  requestPermissions: Platform.OS === "ios",
});

export default handler;

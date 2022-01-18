import PushNotification, {
  PushNotificationScheduleObject,
} from "react-native-push-notification";
import NotificationHandler from "./NotificationHandler";

export default class NotificationService {
  constructor(
    onNotification: (notification: {
      title: string;
      message: string | undefined;
    }) => void
  ) {
    NotificationHandler.attachNotification(onNotification);
  }

  scheduleNotification(notification: PushNotificationScheduleObject) {
    PushNotification.localNotificationSchedule(notification);
  }

  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
    PushNotification.setApplicationIconBadgeNumber(0);
  }
}

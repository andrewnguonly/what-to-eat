import { PushNotificationScheduleObject } from "react-native-push-notification";

const lunchTime = new Date();
lunchTime.setDate(lunchTime.getDate() + 1);
lunchTime.setHours(12);
lunchTime.setMinutes(0);
lunchTime.setSeconds(0);

const dinnerTime = new Date();
dinnerTime.setDate(dinnerTime.getDate() + 1);
dinnerTime.setHours(20);
dinnerTime.setMinutes(0);
dinnerTime.setSeconds(0);

export const lunchNotification: PushNotificationScheduleObject = {
  date: lunchTime,
  title: "Lunch time!",
  message: "Don't forget to log your breakfast/lunch!",
  repeatType: "day",
  number: 1,

  // Android only
  channelId: "default-channel-id",
};

export const dinnerNotification: PushNotificationScheduleObject = {
  date: dinnerTime,
  title: "Dinner time!",
  message: "Don't forget to log your dinner!",
  repeatType: "day",
  number: 1,

  // Android only
  channelId: "default-channel-id",
};

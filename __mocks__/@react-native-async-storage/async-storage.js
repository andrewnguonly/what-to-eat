import AsyncStorageMock from "@react-native-async-storage/async-storage/jest/async-storage-mock";

AsyncStorageMock.getAllKeys = jest.fn(() => {
  return ["burger", "pizza"];
});

AsyncStorageMock.multiGet = jest.fn((keys) => {
  return [
    ["burger", '{"name":"burger","last_eaten_ts":0,"eaten_count":1}'],
    ["pizza", '{"name":"pizza","last_eaten_ts":1,"eaten_count":1}'],
  ];
});

export default AsyncStorageMock;

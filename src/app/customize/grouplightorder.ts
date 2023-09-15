type lightOrderGroup = {
  groupID: string;
  lights: string[];
};

const lightsOrder: lightOrderGroup[] = [
  { groupID: "81", lights: ["4", "8", "5", "7", "10", "9", "6", "22"] },
  { groupID: "83", lights: ["14", "15", "13"] },
  { groupID: "84", lights: ["16", "18", "17", "21", "20", "19"] },
  { groupID: "201", lights: ["4", "8", "5", "7", "10", "9", "6", "22", "15"] },
];

export default lightsOrder;

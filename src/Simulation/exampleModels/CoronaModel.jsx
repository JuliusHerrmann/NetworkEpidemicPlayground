import Model from "./Model";

class CoronaModel extends Model  {
  constructor() {
    super("Corona-Model",
      [["S", 0.830, "#1F85DE"], ["E", 0.1, "#010061"], ["I1", 0.005, "#de1f50"], ["I2", 0.005, "#b91fde"], ["I3", 0.005, "#1fdea7"], ["R", 0.005, "#8fde1f"], ["V", 0.005, "#de801f"], ["D", 0.005, "#3b0b0b"]],
      [[["I1", "S"], ["I1", "E"], 0.15],
        [["I2", "S"], ["I2", "E"], 0.05],
        [["I3", "S"], ["I3", "E"], 0.05],
        ["E", "I1", 1.0/5.0],
        ["I1", "I2", 0.2/6.0],
        ["I2", "I3", 0.25/6.0],
        ["I3", "D", 0.02/8.0],
        ["I1", "R", 0.8/6.0],
        ["I2", "R", 0.75/6.0],
        ["I3", "R", 0.98/8.0]],
      1, 0.001);
  }
}

export default CoronaModel;
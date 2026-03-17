import rain1 from "../assets/sounds/calming-rain-257596.mp3";
import rain2 from "../assets/sounds/gentle-rain-05-437316.mp3";
import rain3 from "../assets/sounds/relaxing-rain-444802.mp3";

import ocean1 from "../assets/sounds/soothing-ocean-waves-372489 (1).mp3";
import ocean2 from "../assets/sounds/ocean-waves-376898.mp3";
import ocean3 from "../assets/sounds/ocean 3.mp3";

import white1 from "../assets/sounds/white noise 1.mp3";
import white2 from "../assets/sounds/white noise 2 .mp3";
import white3 from "../assets/sounds/white noise 3.mp3";

export const soundGroups = {
  rain: {
    title: "Rain",
    sounds: [
      { id: 1, title: "Calming Rain", file: rain1 },
      { id: 2, title: "Gentle Rain", file: rain2 },
      { id: 3, title: "Relaxing Rain", file: rain3 },
    ],
  },
  ocean: {
    title: "Ocean",
    sounds: [
      { id: 4, title: "Ocean Waves", file: ocean1 },
      { id: 5, title: "Soothing Ocean", file: ocean2 },
      { id: 9, title: "Deep Ocean", file: ocean3 },
    ],
  },
  white: {
    title: "White Noise",
    sounds: [
      { id: 6, title: "White Noise 1", file: white1 },
      { id: 7, title: "White Noise 2", file: white2 },
      { id: 8, title: "White Noise 3", file: white3 },
    ],
  },
};

// // src/context/MoodContext.jsx

// import React, { createContext, useContext, useState, useEffect } from "react";

// const MoodContext = createContext();

// export const MoodProvider = ({ children }) => {
//   const [moods, setMoods] = useState(() => {
//     const saved = localStorage.getItem("moodEntries");
//     return saved ? JSON.parse(saved) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem("moodEntries", JSON.stringify(moods));
//   }, [moods]);

//   const addMood = (moodValue, moodLabel) => {
//     const newEntry = {
//       id: Date.now(),
//       mood: moodValue,
//       label: moodLabel,
//       date: new Date().toLocaleDateString(),
//       time: new Date().toLocaleTimeString(),
//       timestamp: new Date().getTime(),
//     };

//     setMoods((prev) => [newEntry,...prev]);
//   };

//   return (
//     <MoodContext.Provider value={{ moods, addMood }}>
//       {children}
//     </MoodContext.Provider>
//   );
// };

// export const useMood = () => useContext(MoodContext);

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [moods, setMoods] = useState(() => {
    const saved = localStorage.getItem("moodEntries");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(
      "moodEntries",
      JSON.stringify(moods)
    );
  }, [moods]);

  const addMood = (moodValue, moodLabel) => {
    const now = new Date();

    const newEntry = {
      id: Date.now(),
      mood: moodValue,              // numeric 1–5
      label: moodLabel,
      timestamp: now.getTime(),     // used for weekly grouping
      isoDate: now.toISOString().split("T")[0], // reliable date
    };

    setMoods((prev) => [newEntry, ...prev]);
  };

  return (
    <MoodContext.Provider value={{ moods, addMood }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => useContext(MoodContext);

// export default Analytics;
import React, { useMemo } from "react";
import { useMood } from "../context/MoodContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Analytics = () => {
  const { moods } = useMood();
  const total = moods.length;

  /* ===============================
     DISTRIBUTION
  =============================== */

  const moodTypes = [
    { label: "Great", color: "#22D3A6" },
    { label: "Good", color: "#FACC15" },
    { label: "Okay", color: "#60A5FA" },
    { label: "Low", color: "#FB923C" },
    { label: "Anxious", color: "#F43F5E" },
  ];

  const distribution = useMemo(() => {
    return moodTypes.map((type) => {
      const count = moods.filter((m) => m.label === type.label).length;
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return { ...type, count, percentage };
    });
  }, [moods, total]);

  const maxCount = Math.max(...distribution.map((m) => m.count), 0);

  const positive =
    distribution[0].percentage + distribution[1].percentage;

  const negative =
    distribution[3].percentage + distribution[4].percentage;

  /* ===============================
     WEEKLY DATA (REAL FIX)
  =============================== */

  const weeklyData = useMemo(() => {
    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const target = new Date();
      target.setDate(today.getDate() - i);

      const day = target.getDate();
      const month = target.getMonth();
      const year = target.getFullYear();

      const dayMoods = moods.filter((m) => {
        const moodDate = new Date(m.timestamp);
        return (
          moodDate.getDate() === day &&
          moodDate.getMonth() === month &&
          moodDate.getFullYear() === year
        );
      });

      const avg =
        dayMoods.length > 0
          ? dayMoods.reduce(
              (sum, m) => sum + (Number(m.mood) || 0),
              0
            ) / dayMoods.length
          : 0;

      result.push({
        date: target.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
        value: Number(avg.toFixed(1)),
        isToday:
          target.toDateString() === today.toDateString(),
      });
    }

    return result;
  }, [moods]);

  /* ===============================
     EMOJI + TOOLTIP
  =============================== */

  const moodToEmoji = {
    5: "🤩",
    4: "🙂",
    3: "😐",
    2: "😔",
    1: "😰",
  };

  const moodToLabel = {
    5: "Great",
    4: "Good",
    3: "Okay",
    2: "Low",
    1: "Anxious",
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const moodValue = Math.round(payload[0].value);
      if (!moodValue) return null;

      return (
        <div className="bg-[#1e1e3f] px-4 py-2 rounded-xl border border-yellow-400 shadow-lg">
          <p className="text-sm font-semibold">
            {moodToEmoji[moodValue]} {moodToLabel[moodValue]}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = ({ cx, cy, payload }) => {
    if (!payload.value) return null;

    const moodValue = Math.round(payload.value);

    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={7}
          fill="#FFD700"
          className="animate-pulse"
        />
        <text
          x={cx}
          y={cy - 14}
          textAnchor="middle"
          fontSize="18"
        >
          {moodToEmoji[moodValue]}
        </text>
      </g>
    );
  };

  /* ===============================
     RENDER
  =============================== */

  return (
    <div className="glass-card p-12 rounded-3xl max-w-6xl mx-auto mt-12">
      <h2 className="text-4xl font-bold mb-12">
        Mood Analytics
      </h2>

      {total === 0 ? (
        <p className="opacity-60">No mood data yet.</p>
      ) : (
        <>
          {/* ================= BAR SECTION ================= */}
          <div className="grid md:grid-cols-2 gap-16 items-end">

            {/* BARS */}
            <div className="flex justify-center items-end gap-10 h-[280px]">

              {distribution.map((mood, index) => {
                const isTop =
                  mood.count === maxCount && maxCount > 0;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center group relative"
                  >
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition bg-black/80 text-white text-xs px-3 py-1 rounded-lg">
                      {mood.count} entries
                    </div>

                    <span className="mb-2 text-sm font-semibold opacity-80">
                      {mood.percentage.toFixed(0)}%
                    </span>

                    <div
                      className={`w-16 rounded-xl transition-all duration-700 ${
                        isTop
                          ? "border-2 border-yellow-400"
                          : ""
                      }`}
                      style={{
                        height: `${mood.percentage * 2.2}px`,
                        background: mood.color,
                      }}
                    />

                    <span className="mt-3 text-sm opacity-70">
                      {mood.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* POS / NEG */}
            <div className="grid gap-6">
              <div className="glass-card p-6 rounded-xl">
                <p className="text-sm opacity-60">
                  Positive Mood %
                </p>
                <p className="text-3xl font-bold mt-2 text-green-400">
                  {positive.toFixed(1)}%
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <p className="text-sm opacity-60">
                  Negative Mood %
                </p>
                <p className="text-3xl font-bold mt-2 text-red-400">
                  {negative.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* ================= WEEKLY CHART ================= */}
          <div className="mt-16 glass-card p-8 rounded-2xl">
            <h3 className="text-xl font-semibold mb-6">
              Weekly Mood Trend
            </h3>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />

                <XAxis
                  dataKey="date"
                  tick={({ x, y, payload, index }) => {
                    const isToday =
                      weeklyData[index].isToday;

                    return (
                      <text
                        x={x}
                        y={y + 15}
                        textAnchor="middle"
                        fill={
                          isToday ? "#FFD700" : "#aaa"
                        }
                        fontWeight={
                          isToday ? "bold" : "normal"
                        }
                      >
                        {payload.value}
                      </text>
                    );
                  }}
                />

                <YAxis domain={[1, 5]} hide />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#FFD700"
                  strokeWidth={3}
                  dot={<CustomDot />}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
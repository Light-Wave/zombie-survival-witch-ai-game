/*"use client";

import { useState } from "react";
import { askForWeather } from "@/lib/ai";

export default function WeatherComponent() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<string | null>(null);

  return (
    <div>
      <p>{weather}</p>
      <input
        className="border-2"
        type="text"
        onChange={(e) => {
          setLocation(e.target.value);
        }}
      />
      <button
        className="ml-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={async () => {
          const weatherInfo = await askForWeather(location);
          setWeather(weatherInfo);
        }}
      >
        Get Weather
      </button>
    </div>
  );
}
*/

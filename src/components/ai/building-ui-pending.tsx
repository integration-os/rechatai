"use client";
import React, { useState, useEffect } from "react";
import { LoadingPrompt } from "./loading-action";

const messages = [
  "Thinking...",
  "Designing...",
  "Writing code...",
  "Testing and optimizing...",
  "Finishing up...",
];

export const BuildingUiPending = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex < messages.length - 1 ? prevIndex + 1 : prevIndex
      );
    }, Math.random() * 4000 + 1000);

    return () => clearInterval(interval);
  }, []);

  return <LoadingPrompt message={messages[currentMessageIndex]} />;
};

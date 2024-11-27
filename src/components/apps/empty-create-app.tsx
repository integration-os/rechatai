"use client";

import React, { forwardRef } from "react";
import { ChatPanel } from "../ai/chat-panel";
import { EmptyScreen } from "../empty-screen";
import { Button } from "../ui/button";

const EmptyCreateApp = forwardRef<HTMLButtonElement, {}>((props, ref) => {
  return (
    <div className="flex items-center justify-center flex-col">
      <EmptyScreen />
    </div>
  );
});

EmptyCreateApp.displayName = "EmptyCreateApp";

export default EmptyCreateApp;

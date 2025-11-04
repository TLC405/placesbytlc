import { useEffect, useState } from "react";

interface ProgressMessagesProps {
  style: string;
  progress: number;
}

const styleMessages: Record<string, { emoji: string; messages: string[] }> = {
  simpsons: { emoji: "🍩", messages: ["Traveling to Springfield...", "Meeting Homer...", "D'oh-ing it up..."] },
  spongebob: { emoji: "🧽", messages: ["Diving to Bikini Bottom...", "Finding Patrick...", "I'm ready!"] },
  rickandmorty: { emoji: "🌀", messages: ["Opening portal...", "Wubba lubba dub dub...", "Science time!"] },
  southpark: { emoji: "🚌", messages: ["Catching school bus...", "Oh my god!", "Going to South Park..."] },
  familyguy: { emoji: "🦆", messages: ["Road to Quahog...", "Hehehehe...", "Freakin' sweet!"] },
  pokemon: { emoji: "⚡", messages: ["Gotta catch 'em all!", "Pikachu!", "Pokémon evolution..."] },
  renandstimpy: { emoji: "🤪", messages: ["Getting gross...", "Log time!", "Happy happy joy joy!"] },
  kingofthehill: { emoji: "🏡", messages: ["Heading to Arlen...", "Propane and propane accessories...", "Yep."] },
  beavisandbutt: { emoji: "🎸", messages: ["Heh heh...", "This is cool...", "Fire! Fire!"] },
  toontown: { emoji: "🎩", messages: ["Entering Toontown...", "Drawing rubber hose...", "That's all folks!"] },
  peppapig: { emoji: "🐷", messages: ["Jumping in muddy puddles...", "Snort snort...", "Peppa!"] },
  doraemon: { emoji: "🤖", messages: ["Opening 4D pocket...", "Gadget time...", "Nobita!"] },
};

export function ProgressMessages({ style, progress }: ProgressMessagesProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const styleData = styleMessages[style] || { emoji: "🎨", messages: ["Creating magic...", "Almost there...", "Finishing up..."] };

  useEffect(() => {
    if (progress < 33) setMessageIndex(0);
    else if (progress < 66) setMessageIndex(1);
    else setMessageIndex(2);
  }, [progress]);

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-3xl animate-bounce">{styleData.emoji}</span>
      <span className="text-lg font-semibold text-primary animate-pulse">
        {styleData.messages[messageIndex]}
      </span>
      <span className="text-2xl font-bold text-[#F7DC6F]">{progress}%</span>
    </div>
  );
}

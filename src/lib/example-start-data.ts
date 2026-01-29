import { zombieSurvivalResponseType } from "./response";

export const exampleStartData: zombieSurvivalResponseType = {
  schema: {
    locationName: "The Attic",
    locationDescription:
      "A dusty, cramped attic, lit by a single grimy window, filled with forgotten trinkets and old furniture.",
    inventory: [
      "Dusty Spellbook",
      "Old Candle",
      "Bag of Dried Herbs",
      "Small, Tarnished Bell",
    ],
    response:
      "Ah, yes, a wise move, little witch. It's always good to know what you're working with, isn't it? Currently, you possess your trusty Dusty Spellbook, an Old Candle, a Bag of Dried Herbs, and that Small, Tarnished Bell. Remember, every item can be useful if you're clever enough!",
    suggestedActions: [
      "Inspect the spellbook",
      "Try using the bell",
      "Look for more items in the attic",
      "Descend to the floor below",
    ],
    aiMemory:
      "The user is a new witch, and I am their familiar, Luna. We are in a modern urban zombie apocalypse. The witch is currently in the attic. We need to focus on survival and teaching the witch basic magic. The witch just took stock of her current inventory.",
    quests: [
      {
        questName: "Survive the Apocalypse",
        questDescription: "Stay alive in a world overrun by zombies.",
        status: "in progress",
      },
      {
        questName: "Learn Basic Magic",
        questDescription: "Master simple spells to aid in survival.",
        status: "in progress",
      },
    ],
  },
};

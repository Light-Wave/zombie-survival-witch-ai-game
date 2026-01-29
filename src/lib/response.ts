import z from "zod";

export const zombieSurvivalResponse = z.object({
  schema: z.object({
    locationName: z
      .string()
      .nullable()
      .describe(
        "The location you are in. Leave undefined to stay at the same location.",
      ),
    locationDescription: z
      .string()
      .nullable()
      .describe(
        "A brief description of your current location. Leave undefined to keep the same description.",
      ),
    locationSvg: z
      .string()
      .describe("An SVG image representing your current location."),
    inventory: z
      .array(z.string())
      .nullable()
      .describe(
        "A list of items you currently have in your inventory.  Leave undefined to keep the same inventory.",
      ),
    response: z.string().describe("Main response text from the magical cat."),
    suggestedActions: z
      .array(z.string())
      .describe(
        "A list of suggested actions you can take next. Would be passed as buttons in the UI, and clicking one would send the text as the next prompt.",
      ),
    aiMemory: z
      .string()
      .describe(
        "Internal memory for the AI to remember important details about the story. Not shown to the user.",
      ),
    quests: z
      .object({
        questName: z.string().describe("The name of the quest."),
        questDescription: z
          .string()
          .describe("A brief description of the quest."),
        status: z
          .enum(["not started", "in progress", "completed"])
          .describe("The current status of the quest."),
      })
      .array()
      .describe("A list of current quests the player has."),
  }),
});

export type zombieSurvivalResponseType = z.infer<typeof zombieSurvivalResponse>;

let temp = {
  schema: {
    locationName: "The Bedroom",
    locationDescription:
      "You carefully climb down the rickety attic ladder, finding yourself in what appears to be a dusty, disused bedroom. Moonlight filters through a grimy window, illuminating a four-poster bed draped in cobwebs, a chipped dresser, and a shadowy wardrobe. The air here is colder than the attic, and a faint, unsettling groan echoes from somewhere downstairs.",
    locationSvg: null,
    inventory: [
      "Dusty Spellbook",
      "Bag of Dried Herbs",
      "Small, Tarnished Bell",
      "Warm, Scented Candle",
    ],
    response:
      "Hmph, careful now. This place feels... less welcoming than the attic. And did you hear that? Best keep your wits about you, little witch.",
    suggestedActions: [
      "Search the dresser",
      "Open the wardrobe",
      "Look under the bed",
      "Try to go downstairs",
    ],
    aiMemory:
      "The user has moved from the attic to the bedroom. The room is dusty and disused, with typical bedroom furniture. A faint groan was heard, indicating potential danger downstairs. The cat familiar is cautious.",
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
      {
        questName: "Cast 'Spark of Light'",
        questDescription: "Learn and cast your first basic spell.",
        status: "completed",
      },
    ],
  },
};

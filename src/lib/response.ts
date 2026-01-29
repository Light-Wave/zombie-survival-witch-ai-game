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

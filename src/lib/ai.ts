"use server";

import { google } from "@ai-sdk/google";
import {
  generateText,
  ModelMessage,
  Output,
  stepCountIs,
  SystemModelMessage,
  tool,
} from "ai";
import { zombieSurvivalResponse, zombieSurvivalResponseType } from "./response";

export async function generateResponse(
  prompt: string,
  lastResponse: zombieSurvivalResponseType | null,
): Promise<zombieSurvivalResponseType> {
  const messages: ModelMessage[] = [];
  messages.push({
    role: "system",
    content:
      "You are a magical cat that are mentoring a human witch trying to survive a modern urban zombie apocalypse as their familiar.",
  });
  if (lastResponse) {
    const lastResponseMessage: ModelMessage = {
      role: "assistant",
      content: JSON.stringify(lastResponse),
    };
    messages.push(lastResponseMessage);
  }
  const userInput: ModelMessage = { role: "user", content: prompt };
  const response = await generateText({
    model: google("gemini-2.5-flash"),
    messages: [...messages, userInput],
    output: Output.object({
      schema: zombieSurvivalResponse,
    }),
  });
  response.warnings?.forEach((warning) => {
    console.warn("AI Warning:", warning);
  });
  return response.output;
}

/*
const weatherTool = tool({
  description: "Get the current weather for a given city",
  inputSchema: z.object({
    location: z.string().describe("The city"),
  }),
  execute: async ({ location }) => {
    return (
      await fetch(`https://weather.lexlink.se/forecast/${location}`)
    ).json();
  },
});

export async function askForWeather(location: string) {
  return (
    await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `What is the current weather in ${location}?`,
      tools: { weatherTool },
      stopWhen: stepCountIs(5),
    })
  ).text;
}
*/

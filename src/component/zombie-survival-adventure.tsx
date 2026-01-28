"use client";

import { generateResponse } from "@/lib/ai";
import { zombieSurvivalResponseType } from "@/lib/response";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ZombieSurvivalAdventure() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<zombieSurvivalResponseType | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  async function getAiResponse(prompt: string) {
    setIsLoading(true);
    const newResponse = await generateResponse(prompt, response);
    if (!newResponse.schema.locationName) {
      newResponse.schema.locationName = response?.schema.locationName ?? null;
    }
    if (!newResponse.schema.locationDescription) {
      newResponse.schema.locationDescription =
        response?.schema.locationDescription ?? null;
    }
    if (!newResponse.schema.inventory) {
      newResponse.schema.inventory = response?.schema.inventory || [];
    }
    setResponse(newResponse);
    setIsLoading(false);
  }
  return (
    <div>
      <div className="prose">
        {isLoading ? (
          <p>Loading...</p>
        ) : response ? (
          <div className="flex gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Response</h2>
              <Markdown remarkPlugins={[remarkGfm]}>
                {response.schema.response}
              </Markdown>
              {response.schema.suggestedActions.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">Suggested Actions:</h3>
                  <ul>
                    {response.schema.suggestedActions.map((action, index) => (
                      <li key={index}>
                        <button
                          className="text-blue-500 underline"
                          onClick={async () => {
                            await getAiResponse(action);
                          }}
                        >
                          {action}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="w-64">
              <h2 className="text-xl font-bold mb-2">Location</h2>
              {response.schema.locationName && (
                <h3 className="font-semibold">
                  {response.schema.locationName}
                </h3>
              )}
              <p className="text-sm mb-4">
                {response.schema.locationDescription}
              </p>
              <h3 className="font-semibold">Inventory</h3>
              <ul className="text-sm">
                {response.schema.inventory?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>...</p>
        )}
      </div>
      <hr className="my-2" />
      <input
        className="border-2"
        type="text"
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
        value={prompt}
      />
      <button
        className="ml-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={async () => {
          await getAiResponse(prompt);
          setPrompt("");
        }}
      >
        Go
      </button>
      <hr className="my-2" />
      <p className="text-sm text-gray-500">
        {response?.schema.aiMemory
          ? `AI Memory: ${response.schema.aiMemory}`
          : "AI Memory: ..."}
      </p>
    </div>
  );
}

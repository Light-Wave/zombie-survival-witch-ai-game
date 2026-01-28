"use client";

import { AiResponseType, generateResponse } from "@/lib/ai";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIComponent() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<AiResponseType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <div className="prose">
        {isLoading ? (
          <p>Loading...</p>
        ) : response ? (
          <div>
            <h2>{response.schema.recipe.name}</h2>

            <h3>Ingredients:</h3>
            <ul>
              {response.schema.recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name} - {ingredient.amount}
                </li>
              ))}
            </ul>

            <h3>Steps:</h3>
            <ol>
              {response.schema.recipe.steps.map((step, index) => (
                <li key={index}>
                  <Markdown remarkPlugins={[remarkGfm]}>{step}</Markdown>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p>No recipe generated yet.</p>
        )}
      </div>
      <hr className="my-2" />
      <input
        className="border-2"
        type="text"
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
      />
      <button
        className="ml-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={async () => {
          setIsLoading(true);
          setResponse(await generateResponse(prompt));
          setIsLoading(false);
        }}
      >
        Generate Recipe
      </button>
    </div>
  );
}

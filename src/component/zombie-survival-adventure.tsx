"use client";

import { generateResponse } from "@/lib/ai";
import { zombieSurvivalResponseType } from "@/lib/response";
import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { exampleStartData } from "@/lib/example-start-data";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { saveGameState, loadGameState } from "@/lib/savegame";

export default function ZombieSurvivalAdventure() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<zombieSurvivalResponseType | null>(
    exampleStartData,
  );
  const [history, setHistory] = useState<zombieSurvivalResponseType[]>([
    exampleStartData,
  ]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadSavedGame() {
      const savedState = await loadGameState();
      if (savedState && savedState.length > 0) {
        setHistory(savedState);
        setResponse(savedState[savedState.length - 1]);
        setHistoryIndex(savedState.length - 1);
      }
    }
    loadSavedGame();
  }, []);

  async function getAiResponse(prompt: string) {
    setIsLoading(true);
    const newResponse = await generateResponse(prompt, response);
    if (!newResponse.schema.locationName) {
      console.log("Filling in location name from previous response");
      newResponse.schema.locationName = response?.schema.locationName ?? null;
    }
    if (!newResponse.schema.locationDescription) {
      console.log("Filling in location description from previous response");
      newResponse.schema.locationDescription =
        response?.schema.locationDescription ?? null;
    }
    if (!newResponse.schema.inventory) {
      console.log("Filling in inventory from previous response");
      newResponse.schema.inventory = response?.schema.inventory || [];
    }
    setResponse(newResponse);
    setHistory((prevHistory) => [...prevHistory, newResponse]);
    setHistoryIndex((prevHistoryIndex) =>
      prevHistoryIndex !== null ? prevHistoryIndex + 1 : 0,
    );
    await saveGameState([...history, newResponse]);
    setIsLoading(false);
  }

  return (
    <div>
      <div className="w-full">
        {!isLoading && historyIndex !== null && (
          <div className="flex justify-between items-center mb-4">
            <ButtonGroup>
              <Button
                disabled={historyIndex === 0}
                onClick={() => {
                  const newIndex = historyIndex - 1;
                  setHistoryIndex(newIndex);
                  setResponse(history[newIndex]);
                }}
              >
                Back
              </Button>
              <Button
                disabled={historyIndex >= history.length - 1}
                onClick={() => {
                  const newIndex = historyIndex + 1;
                  setHistoryIndex(newIndex);
                  setResponse(history[newIndex]);
                }}
              >
                Forward
              </Button>
            </ButtonGroup>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">New Game</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={async () => {
                      setResponse(null);
                      setHistory([]);
                      setHistoryIndex(0);
                      setPrompt("");
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner /> <span>Loading...</span>
          </div>
        ) : response ? (
          <div className="flex gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {response.schema.response}
                </Markdown>
                {response.schema.suggestedActions.length > 0 &&
                  (historyIndex === history.length - 1 ||
                    historyIndex === null) && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Suggested Actions:</h3>
                      <ul className="space-y-2">
                        {response.schema.suggestedActions.map(
                          (action, index) => (
                            <li key={index}>
                              <Button
                                variant="link"
                                className="h-auto p-0 text-left"
                                onClick={async () => {
                                  await getAiResponse(action);
                                }}
                              >
                                {action}
                              </Button>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </CardContent>
            </Card>
            <div className="flex flex-col gap-4 w-96">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {response.schema.locationName &&
                      response.schema.locationName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    {response.schema.locationDescription}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    {response.schema.inventory?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    {response.schema.quests?.map((quest, index) => (
                      <li key={index}>
                        <strong>{quest.questName}</strong>:{" "}
                        {quest.questDescription} ({quest.status})
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <p>...</p>
        )}
      </div>
      {(historyIndex === history.length - 1 || historyIndex === null) && (
        <>
          <Separator className="my-4" />
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Take Stock"
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              value={prompt}
              className="flex-1"
            />
            <Button
              onClick={async () => {
                await getAiResponse(prompt);
                setPrompt("");
              }}
            >
              Go
            </Button>
          </div>
        </>
      )}
      <Separator className="my-4" />
      <p className="text-sm text-gray-500">
        {response?.schema.aiMemory && !isLoading
          ? `AI Memory: ${response.schema.aiMemory}`
          : "AI Memory: ..."}
      </p>
      {!isLoading && (
        <Input
          type="textarea"
          value={JSON.stringify(response, null, 2)}
          readOnly
        />
      )}
    </div>
  );
}

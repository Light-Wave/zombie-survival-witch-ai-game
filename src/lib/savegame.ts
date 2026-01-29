import { zombieSurvivalResponseType } from "./response";

const SAVE_NAME = "zombie_game_state";

/**
 * Save game state to local storage
 * @param gameState - Array of zombie survival responses representing the game history
 * @returns true if successful, false if the data is too large
 */
export async function saveGameState(
  gameState: zombieSurvivalResponseType[],
): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(gameState);
    // Encode to base64 to handle special characters
    const encoded = Buffer.from(jsonString).toString("base64");

    localStorage.setItem(SAVE_NAME, JSON.stringify(encoded));
    return true;
  } catch (error) {
    console.error("Failed to save game state to local storage:", error);
    return false;
  }
}

/**
 * Load game state from local storage
 * @returns Array of zombie survival responses or null if not found/invalid
 */
export async function loadGameState(): Promise<
  zombieSurvivalResponseType[] | null
> {
  try {
    // Decode from base64
    const jsonString = Buffer.from(
      localStorage.getItem(SAVE_NAME) ?? "",
      "base64",
    ).toString("utf-8");

    // Parse JSON
    const gameState = JSON.parse(jsonString) as zombieSurvivalResponseType[];

    return gameState;
  } catch (error) {
    console.error("Failed to load game state from local storage:", error);
    return null;
  }
}

/**
 * Clear game state from local storage
 */
export async function clearGameState(): Promise<void> {
  localStorage.removeItem(SAVE_NAME);
}

export const STORAGE_NAME = 'katadze_admin';

export const useStorage = () => {
  /**
   * Write API token pair to storage
   * @param tokenPair
   */
  const writeStorage = (tokenPair: string) => {
    localStorage.setItem(STORAGE_NAME, tokenPair);
  };
  /**
   * @returns API token pair
   */
  
  const readStorage = (): string | null => {
    return localStorage.getItem(STORAGE_NAME);
  };
  /**
   * Delete API token pair from storage
   */
  const clearStorage = () => {
    localStorage.removeItem(STORAGE_NAME);
  };

  const isAuthorized: boolean = readStorage() ? true : false;

  return {
    writeStorage,
    readStorage,
    clearStorage,
    isAuthorized,
  };
};

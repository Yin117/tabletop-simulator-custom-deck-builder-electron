

type TSpreadStringFunc = (...args: string[]) => string;

export const navURLs: Record<string, TSpreadStringFunc> = Object.freeze({
  home: () => '/',
});
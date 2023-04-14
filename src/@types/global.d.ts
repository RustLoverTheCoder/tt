type AnyLiteral = Record<string, any>;
type AnyClass = new (...args: any[]) => any;
type AnyFunction = (...args: any[]) => any;
type AnyToVoidFunction = (...args: any[]) => void;
type NoneToVoidFunction = () => void;

type EmojiCategory = {
  id: string;
  name: string;
  emojis: string[];
};

type Emoji = {
  id: string;
  names: string[];
  native: string;
  image: string;
  skin?: number;
};

type EmojiWithSkins = Record<number, Emoji>;

type AllEmojis = Record<string, Emoji | EmojiWithSkins>;

declare module "*.png";
declare module "*.svg";
declare module "*.tgs";
declare module "*.wasm";

declare module "*.txt" {
  const content: string;
  export default content;
}

declare module "pako/dist/pako_inflate" {
  function inflate(...args: any[]): string;
}

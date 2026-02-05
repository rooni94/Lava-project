import type { ReactNode } from "react";

const RIYAL_SYMBOL_SRC = "/Saudi_Riyal_Symbol-2.svg";
const RIYAL_PATTERN = /(SAR|ريال)/gi;

type RiyalSymbolProps = {
  className?: string;
  title?: string;
};

export function RiyalSymbol({ className, title = "ريال" }: RiyalSymbolProps) {
  return (
    <img
      src={RIYAL_SYMBOL_SRC}
      alt={title}
      title={title}
      className={className ?? "inline-block h-[1em] w-[1em] align-[-0.15em]"}
      loading="lazy"
    />
  );
}

type RiyalTextOptions = {
  symbolClassName?: string;
};

export function renderRiyalText(text?: string, options?: RiyalTextOptions): ReactNode {
  if (!text) return "";

  RIYAL_PATTERN.lastIndex = 0;
  let match = RIYAL_PATTERN.exec(text);
  if (!match) return text;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  while (match) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <RiyalSymbol
        key={`riy-${match.index}-${lastIndex}`}
        className={options?.symbolClassName}
      />
    );

    lastIndex = match.index + match[0].length;
    match = RIYAL_PATTERN.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function formatRiyal(value: number | string, note?: string, options?: RiyalTextOptions): ReactNode {
  const symbol = <RiyalSymbol className={options?.symbolClassName} />;
  const main = (
    <>
      {value} {symbol}
    </>
  );

  if (!note) return main;

  return (
    <>
      {main} {renderRiyalText(note, options)}
    </>
  );
}

export { RIYAL_SYMBOL_SRC };

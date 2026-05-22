import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import useQueryKeywords from "@/hooks/useQueryKeywords";
import { Spinner } from "./ui/spinner";

interface KeywordsInputProps {
  value: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function KeywordsInput({
  value,
  onChange,
  placeholder = "Type to search...",
  className,
}: KeywordsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    keywords,
    isLoading: isKeywordsLoading,
    error: keywordsError,
  } = useQueryKeywords();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isKeywordsLoading) {
    return <Spinner />;
  }

  if (keywordsError) {
    return <div>Error loading keywords: {keywordsError.message}</div>;
  }

  const filtered = keywords?.filter(
    ({ name }) =>
      name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(name),
  );

  function addKeyWord(keyword: string) {
    const trimmed = keyword.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
    setOpen(false);
  }

  function removeKeyWord(keyword: string) {
    onChange(value.filter((k) => k !== keyword));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addKeyWord(filtered![0]?.name ?? inputValue);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex min-h-12 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          className,
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((keyword) => (
          <Badge
            key={keyword}
            variant="secondary"
            className="h-7 gap-1 px-2 text-sm"
          >
            {keyword}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeKeyWord(keyword);
              }}
              className="ml-0.5 rounded-full opacity-60 hover:opacity-100"
              tabIndex={-1}
            >
              <XIcon className="size-3" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(e.target.value.length > 0);
          }}
          onFocus={() => {
            if (inputValue.length > 0) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-32 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>

      {open && filtered!.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-lg border bg-popover py-1 text-popover-foreground shadow-md ring-1 ring-foreground/10">
          {filtered!.map(({ name }) => (
            <li
              key={name}
              onMouseDown={(e) => {
                e.preventDefault();
                addKeyWord(name);
              }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

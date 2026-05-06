import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { searchDrive } from "@/app/lib/drive";
import { SearchResultsDropdown } from "./search-results-dropdown";
import { cn } from "@/app/lib/utils";

interface SearchInputProps {
  variant?: "default" | "page";
  className?: string;
  autoFocus?: boolean;
}

export function SearchInput({ variant = "default", className, autoFocus = false }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { data: session } = useSession();
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      
      if (variant === "page") {
        const currentQ = searchParams.get("q") || "";
        const nextQ = query.trim();
        
        if (nextQ !== currentQ) {
          const params = new URLSearchParams(searchParams.toString());
          if (nextQ) {
            params.set("q", nextQ);
          } else {
            params.delete("q");
          }
          router.replace(`/fm/drive/search?${params.toString()}`, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, variant, router, searchParams]);

  const { data: results, isLoading } = useQuery({
    queryKey: ["search-quick", debouncedQuery],
    queryFn: () => searchDrive(debouncedQuery, session!.backendToken),
    enabled: !!debouncedQuery && !!session?.backendToken && isOpen && variant === "default",
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      setIsOpen(false);
      router.push(`/fm/drive/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSeeAll = () => {
    setIsOpen(false);
    router.push(`/fm/drive/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div ref={containerRef} className={cn("relative group w-full", className)}>
      <Search className={cn(
        "absolute left-3.5 top-1/2 -translate-y-1/2 text-md-on-surface-variant group-focus-within:text-md-primary transition-colors",
        variant === "page" ? "w-5 h-5 left-4" : "w-4 h-4"
      )} />
      <input
        type="text"
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search everything..."
        className={cn(
          "w-full bg-md-surface-container-highest text-md-on-surface rounded-full outline-none focus:ring-2 focus:ring-md-primary/20 border border-md-outline-variant/10 focus:border-md-primary transition-all placeholder:text-md-on-surface-variant/40",
          variant === "page" ? "h-12 pl-12 pr-6 text-[15px]" : "h-10 pl-11 pr-4 text-[14px] font-medium"
        )}
      />

      {variant === "default" && isOpen && (debouncedQuery || isLoading) && (
        <SearchResultsDropdown 
          isLoading={isLoading}
          results={results}
          debouncedQuery={debouncedQuery}
          onSelect={() => setIsOpen(false)}
          onSeeAll={handleSeeAll}
        />
      )}
    </div>
  );
}

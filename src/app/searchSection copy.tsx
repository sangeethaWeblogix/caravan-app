// src/app/components/SearchSection.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchHomeSearchList } from "@/api/homeSearch/api";
import { toSlug } from "@/utils/seo/slug";

type Item = Record<string, any>;

const labelOf = (x: Item) =>
  x?.title ??
  x?.name ??
  x?.heading ??
  ([x?.make, x?.model].filter(Boolean).join(" ") || undefined);

export default function SearchSection() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string>("");
  const [isSuggestionBoxOpen, setIsSuggestionBoxOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHomeSearchList();
        setItems(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load");
      }
    })();
  }, []);

  const showSuggestions = async () => {
    setIsSuggestionBoxOpen(true);
    if (suggestions.length) return;
    try {
      const data = items.length ? items : await fetchHomeSearchList();
      setSuggestions(data.map(labelOf).filter(Boolean).slice(0, 15));
      if (!items.length) setItems(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load suggestions");
    }
  };

  const closeSuggestions = () => setIsSuggestionBoxOpen(false);
  //   const navigateWithKeyword = (kwRaw: string) => {
  //     const kw = kwRaw.trim();
  //     if (!kw) return;
  //     // Put value in input for UX
  //     if (searchInputRef.current) searchInputRef.current.value = kw;
  //     // Navigate: /listings/?keyword=<kw>
  //     router.push(`/listings/?keyword=${encodeURIComponent(kw)}`);
  //     // Optional: close dropdown
  //     setIsSuggestionBoxOpen(false);
  //   };
  const navigateWithKeyword = (kwRaw: string) => {
    const slug = toSlug(kwRaw);
    if (!slug) return;
    if (searchInputRef.current) searchInputRef.current.value = slug;
    router.push(`/listings/?keyword=${slug}`); // no encodeURIComponent needed now
    setIsSuggestionBoxOpen(false);
  };

  const handleSuggestionClick = (keyword: string) => {
    navigateWithKeyword(keyword);
  };

  // (later you can add live filter here if needed)
  const searchLocationho = () => {};

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      navigateWithKeyword(e.currentTarget.value);
    } else if (e.key === "Escape") {
      closeSuggestions();
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!items.length && !isSuggestionBoxOpen) return <p>Loading…</p>;

  return (
    <div>
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-12">
            <div className="section-head text-center">
              <h1 className="divide-orange">
                Browse New & Used Caravans For Sale
              </h1>
              <p>
                CFS is dedicated to revolutionising your caravan buying
                experience.
              </p>

              <div
                className="overlay_search"
                id="overlay_search"
                style={{ display: isSuggestionBoxOpen ? "block" : "none" }}
                onClick={closeSuggestions}
              />

              <div className="search-container">
                <div className="search-wrapper">
                  <i className="bi bi-search search-icon" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="search-box"
                    placeholder="Search by caravans..."
                    id="searchInput"
                    autoComplete="off"
                    onFocus={showSuggestions}
                    onClick={showSuggestions}
                    onKeyUp={searchLocationho}
                    onKeyDown={handleKeyDown} // ENTER → navigate
                    aria-haspopup="listbox"
                    aria-expanded={isSuggestionBoxOpen}
                  />
                  <div
                    className="close-btn"
                    id="closeBtn"
                    style={{ display: isSuggestionBoxOpen ? "block" : "none" }}
                    onClick={closeSuggestions}
                    role="button"
                    aria-label="Close suggestions"
                  >
                    <i className="bi bi-x-lg" />
                  </div>
                </div>

                <div
                  className="suggestions"
                  id="suggestionBox"
                  style={{ display: isSuggestionBoxOpen ? "block" : "none" }}
                  role="listbox"
                >
                  <h4>Suggested searches</h4>
                  <ul id="suggestionList" className="text-left">
                    {suggestions.map((keyword, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(keyword)}
                        style={{ cursor: "pointer" }}
                        role="option"
                        aria-selected="false"
                      >
                        {keyword}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="row justify-content-center mt-3">
                <div className="col-lg-3 col-4">
                  <Link
                    href="/listings/new-condition/"
                    className="btn btn-primary"
                  >
                    New
                  </Link>
                </div>
                <div className="col-lg-3 col-4">
                  <Link
                    href="/listings/used-condition/"
                    className="btn btn-primary"
                  >
                    Used
                  </Link>
                </div>
                <div className="col-lg-3 col-4">
                  <Link href="/listings/" className="btn btn-primary">
                    All
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

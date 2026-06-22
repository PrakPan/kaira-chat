import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import axios from "axios";
import axiossearchsuggestinstance from "../../../../../services/search/searchsuggest";
import { CONTENT_SERVER_HOST, MERCURY_HOST } from "../../../../../services/constants";
import * as ga from "../../../../../services/ga/Index";
import urls from "../../../../../services/urls";
import useDebounce from "../../../../../hooks/useDebounce";
import styles from "./SearchInput.module.scss";

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const VIBES = [
  { name: "Personalise", emoji: "✨", link: "/chat" },
  { name: "La Tomatina", emoji: "🍅", link: urls.travel_planner.LATOMATINA },
  { name: "Summer Holidays", emoji: "☀️", link: urls.travel_planner.SUMMER },
  { name: "Road Trips", emoji: "🚗", link: urls.travel_planner.ROADTRIPS },
  { name: "Europe under 1 Lakh", emoji: "🏰", link: urls.travel_planner.EUROPE_1_LAKH },
];

const CONTINENTS = [
  { name: "Asia", emoji: "🌏", link: "/asia" },
  { name: "Europe", emoji: "🏰", link: "/europe" },
  { name: "North America", emoji: "🗽", link: "/north_america" },
  { name: "South America", emoji: "🏔️", link: "/south_america" },
  { name: "Africa", emoji: "🦒", link: "/africa" },
  { name: "Oceania", emoji: "🐨", link: "/oceania" },
];

const getParent = (path) => {
  if (!path) return "";
  const links = path.split("/");
  links.pop();
  return links
    .map((part) =>
      part
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    )
    .join(" › ");
};

const normalizeImage = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `https://d31aoa0ehgvjdi.cloudfront.net/${img}`;
};

const SearchInput = (props) => {
  const router = useRouter();
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [hotLocations, setHotLocations] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (hotLocations.length || !open) return;
    const fromProps = props.hotLocations;
    if (Array.isArray(fromProps) && fromProps.length) {
      setHotLocations(fromProps);
      return;
    }
    axios
      .get(`${MERCURY_HOST}/api/v1/geos/search/hot_destinations`)
      .then((res) => {
        if (Array.isArray(res.data)) setHotLocations(res.data);
      })
      .catch(() => {});
  }, [open, props.hotLocations, hotLocations.length]);

  useEffect(() => {
    if (Array.isArray(props.hotLocations) && props.hotLocations.length) {
      setHotLocations(props.hotLocations);
    }
  }, [props.hotLocations]);

  useEffect(() => {
    const q = (debouncedQuery || "").trim();
    if (!q) {
      setResults(null);
      setLoadingResults(false);
      return;
    }
    setLoadingResults(true);
    let cancelled = false;
    axiossearchsuggestinstance
      .get(`?q=${encodeURIComponent(q)}`)
      .then((res) => {
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data.slice(0, 10) : [];
        setResults(data);
        setLoadingResults(false);
        if (
          q.length % 3 === 0 &&
          process.env.NODE_ENV === "production" &&
          !CONTENT_SERVER_HOST?.includes?.("dev")
        ) {
          try {
            ga.event({
              action: "HS-locationssearched",
              params: { search_text: q },
            });
          } catch {
            /* noop */
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        setResults([]);
        setLoadingResults(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const openPanel = () => setOpen(true);
  const closePanel = () => {
    setOpen(false);
    setQuery("");
    setResults(null);
  };

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return undefined;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) closePanel();
      if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase?.() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const popular = useMemo(() => {
    return (hotLocations || []).slice(0, 6).map((loc) => ({
      name: loc.name || loc.display_name || loc.title,
      image: normalizeImage(loc.image),
      path: loc.path,
      meta:
        loc.parent ||
        loc.state?.name ||
        (loc.path ? getParent(loc.path) : ""),
    }));
  }, [hotLocations]);

  const navigateTo = (path) => {
    if (!path) return;
    closePanel();
    const url = path.startsWith("/") ? path : `/${path}`;
    router.push(url);
  };

  const goToChat = () => {
    closePanel();
    router.push("/chat");
  };

  const q = (query || "").trim();
  const showResultsSection = Boolean(q);
  const showEmpty =
    showResultsSection && !loadingResults && results && results.length === 0;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const panel = (
    <div
      className={`${styles.searchPanel} ${
        open ? styles.searchPanelOpen : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Find a destination"
    >
        <div className={styles.searchPanelBackdrop} onClick={closePanel} />
        <div className={styles.searchPanelInner}>
          <div className={styles.searchInputRow}>
            <SearchIcon />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try Japan, Bali, honeymoon, foodie…"
              autoComplete="off"
            />
            <button
              type="button"
              className={styles.searchClose}
              onClick={closePanel}
            >
              x
            </button>
          </div>

          <div className={styles.searchBody}>
            {showResultsSection ? (
              <div className={styles.searchSection}>
                <h4>Search results</h4>
                {loadingResults && !results ? (
                  <div className={styles.searchList}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={styles.skeletonRow}>
                        <div className={styles.skeletonAvatar} />
                        <div className={styles.skeletonText} />
                      </div>
                    ))}
                  </div>
                ) : showEmpty ? (
                  <div className={styles.searchEmpty}>
                    Nothing matches '{q}'.{" "}
                    <span className={styles.accent} onClick={goToChat} style={{ cursor: "pointer" }}>
                      Just describe it to Kaira →
                    </span>
                  </div>
                ) : (
                  <div className={styles.searchPopular}>
                    {(results || []).map((r) => (
                      <button
                        type="button"
                        key={r.resource_id || r.path}
                        className={styles.popularItem}
                        onClick={() => navigateTo(r.path)}
                      >
                        <div
                          className={styles.popularItemImg}
                          style={
                            r.image
                              ? {
                                  backgroundImage: `url('${normalizeImage(
                                    r.image
                                  )}')`,
                                }
                              : undefined
                          }
                        />
                        <div className={styles.popularItemInfo}>
                          <div className={styles.popularItemName}>{r.name}</div>
                          <div className={styles.popularItemMeta}>
                            {r.parent || getParent(r.path)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {popular.length > 0 && (
                  <div className={styles.searchSection}>
                    <h4>Popular right now</h4>
                    <div className={styles.searchPopular}>
                      {popular.map((item, idx) => (
                        <button
                          type="button"
                          key={`${item.path || item.name}-${idx}`}
                          className={styles.popularItem}
                          onClick={() => navigateTo(item.path)}
                        >
                          <div
                            className={styles.popularItemImg}
                            style={
                              item.image
                                ? {
                                    backgroundImage: `url('${item.image}')`,
                                  }
                                : undefined
                            }
                          />
                          <div className={styles.popularItemInfo}>
                            <div className={styles.popularItemName}>
                              {item.name}
                            </div>
                            {item.meta && (
                              <div className={styles.popularItemMeta}>
                                {item.meta}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.searchSection}>
                  <h4>Browse by continent</h4>
                  <div className={styles.searchList}>
                    {CONTINENTS.map((c) => (
                      <button
                        type="button"
                        key={c.name}
                        className={styles.searchRow}
                        onClick={() => navigateTo(c.link)}
                      >
                        <span className={styles.searchRowEmoji}>{c.emoji}</span>
                        {c.name}
                        {c.meta && (
                          <span className={styles.searchRowMeta}>{c.meta}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.searchSection}>
                  <h4>Travel by vibe</h4>
                  <div className={styles.searchList}>
                    {VIBES.map((v) => (
                      <button
                        type="button"
                        key={v.name}
                        className={styles.searchRow}
                        onClick={() => navigateTo(v.link)}
                      >
                        <span className={styles.searchRowEmoji}>{v.emoji}</span>
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className={styles.searchCtaRow}>
              <div className={styles.searchCtaRowText}>
                 Looking for something specific?{" "}
                <span className={styles.serif}>Just tell Kaira</span> — she 
                can plan any kind of trip in 100+ countries.
              </div>
              <button
                type="button"
                className={styles.searchCtaRowBtn}
                onClick={goToChat}
              >
                Chat with Kaira
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
  );

  return (
    <>
      <button
        type="button"
        className={styles.navSearch}
        onClick={openPanel}
        aria-label="Search destinations"
      >
        <SearchIcon />
        <span className={styles.navSearchPlaceholder}>
          Where do you want to go?
        </span>
      </button>
      {mounted && typeof document !== "undefined"
        ? ReactDOM.createPortal(panel, document.body)
        : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  hotLocations: state.HotLocationSearch?.locations,
});

export default connect(mapStateToProps)(SearchInput);

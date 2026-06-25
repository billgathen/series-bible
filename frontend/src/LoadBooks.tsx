import { useState, useRef, useEffect } from "react"
import { NavLink } from "react-router-dom"
import Loader from "./Loader"
import Library from "./Library";

export default function LoadBooks() {
  const [seriesTitle, setSeriesTitle] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [bookTitle, setBookTitle] = useState("");
  const [textFile, setTextFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [libraryKey, setLibraryKey] = useState(0);
  const [seriesList, setSeriesList] = useState<string[]>([]);

  async function refreshSeriesList() {
    try {
      const response = await fetch("/library");
      if (response.ok) {
        const data: { series: string }[] = await response.json();
        setSeriesList([...new Set(data.map(row => row.series))]);
      }
    } catch {
      // non-critical — input still works as free text
    }
  }

  useEffect(() => {
    async function load() { await refreshSeriesList(); }
    load();
  }, []);

  const suggestions = seriesList.filter(s =>
    seriesTitle === "" || s.toLowerCase().includes(seriesTitle.toLowerCase())
  );

  const isOpen = showSuggestions && suggestions.length > 0;

  function closeSuggestions() {
    setShowSuggestions(false);
    setActiveIndex(-1);
  }

  function selectSuggestion(value: string) {
    setSeriesTitle(value);
    closeSuggestions();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      closeSuggestions();
    }
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("series_title", seriesTitle);
    formData.append("book_title", bookTitle);
    if (textFile) formData.append("file", textFile);

    try {
      const response = await fetch("/parse_text_file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert(`Error uploading data: ${response.status}`)
      } else {
        alert("Upload successful!")
        setLibraryKey(k => k + 1)
        refreshSeriesList();
        clearForm();
      }
    } catch (err) {
      alert(`Error during upload: ${err}`);
    }

    setLoading(false);
  }

  function clearForm() {
    setSeriesTitle("");
    setBookTitle("");
    setTextFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setTextFile(e.target.files[0]);
    }
  }

  return (
    <>
      <h2>Load Books</h2>
      <form onSubmit={handleSubmit}>
        <span></span>
        <span>(All fields are required)</span>
        <label htmlFor="series-title">Series Title</label>
        <div className="series-combobox">
          <input
            id="series-title"
            type="text"
            name="series-title"
            role="combobox"
            autoComplete="off"
            aria-expanded={isOpen}
            aria-controls="series-listbox"
            aria-activedescendant={activeIndex >= 0 ? `series-option-${activeIndex}` : undefined}
            value={seriesTitle}
            onChange={e => { setSeriesTitle(e.target.value); setActiveIndex(-1); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(closeSuggestions, 150)}
            onKeyDown={handleKeyDown}
            required
          />
          {isOpen && (
            <ul id="series-listbox" className="series-suggestions" role="listbox" aria-label="Existing series">
              {suggestions.map((s, i) => (
                <li
                  key={s}
                  id={`series-option-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={() => selectSuggestion(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <label htmlFor="book-title">Book Title</label>
        <input id="book-title" type="text" name="book-title" value={bookTitle} onChange={e => setBookTitle(e.target.value)} required />
        <label htmlFor="file">Text File</label>
        <input id="file" type="file" name="file" accept=".txt" ref={fileInputRef} onChange={handleFileChange} required />
        <span></span>
        <button type="submit">Submit</button>
        <span></span>
        <div className="centered">When you've loaded your books, click <NavLink to="/connect">Connect Your AI</NavLink> to complete the process.</div>
        {loading && <Loader />}
      </form>
      <Library refreshKey={libraryKey} onDelete={() => setLibraryKey(k => k + 1)} />
    </>
  )
}

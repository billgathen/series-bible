import { useEffect, useState } from "react"
import Loader from "./Loader";

interface BookData {
  series: string
  book: string
  chapter_ct: number
  paragraph_ct: number
}

function groupBySeries(items: BookData[]): Record<string, BookData[]> {
  return items.reduce<Record<string, BookData[]>>((acc, obj) => {
    if (!acc[obj.series]) acc[obj.series] = []
    acc[obj.series].push(obj)
    return acc
  }, {})
}

interface LibraryProps {
  refreshKey?: number
  onDelete?: () => void
}

export default function Library({ refreshKey = 0, onDelete }: LibraryProps) {
  const [data, setData] = useState<Record<string, BookData[]>>({})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/library", { signal: controller.signal });

        if (!response.ok) {
          setError(`Could not load library (${response.status})`)
        } else {
          setData(groupBySeries(await response.json()))
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Could not reach server")
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load()
    return () => controller.abort()
  }, [refreshKey])

  async function handleDeleteBook(series: string, book: string) {
    if (!confirm(`Delete "${book}" from "${series}"? This cannot be undone.`)) return;
    const key = `${series}/${book}`;
    setDeleting(key);
    try {
      const response = await fetch(
        `/library/${encodeURIComponent(series)}/${encodeURIComponent(book)}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        setError(`Could not delete book (${response.status})`);
      } else {
        onDelete?.();
      }
    } catch {
      setError("Could not reach server");
    } finally {
      setDeleting(null);
    }
  }

  async function handleDeleteSeries(series: string) {
    if (!confirm(`Delete entire series "${series}"? All books will be removed. This cannot be undone.`)) return;
    setDeleting(series);
    try {
      const response = await fetch(
        `/library/${encodeURIComponent(series)}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        setError(`Could not delete series (${response.status})`);
      } else {
        onDelete?.();
      }
    } catch {
      setError("Could not reach server");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="library">
      <h2>Library</h2>
      <div className="divider"></div>
      {loading ? <Loader /> : error ? (
        <p role="alert">{error}</p>
      ) : Object.keys(data).length === 0 ? (
        <p role="status">No books loaded yet.</p>
      ) : (
        <ul>
          {Object.entries(data).map(([series, books]) => (
            <li key={series}>
              <div className="library-row">
                <span className="library-series-name">{series}</span>
                <button
                  className="delete-btn"
                  aria-label={`Delete series ${series}`}
                  data-tooltip={`Delete entire series "${series}"`}
                  disabled={deleting !== null}
                  onClick={() => handleDeleteSeries(series)}
                >
                  &times;
                </button>
              </div>
              <ul>
                {books.map(row => (
                  <li key={row.book} className="library-book-row">
                    <span>{row.book} ({row.chapter_ct} chapters, {row.paragraph_ct} paragraphs)</span>
                    <button
                      className="delete-btn delete-btn--small"
                      aria-label={`Delete book ${row.book}`}
                      data-tooltip={`Delete "${row.book}"`}
                      disabled={deleting !== null}
                      onClick={() => handleDeleteBook(series, row.book)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

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

export default function Library({ refreshKey = 0 }: { refreshKey?: number }) {
  const [data, setData] = useState<Record<string, BookData[]>>({})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              {series}
              <ul>
                {books.map(row => <li key={row.book}>{row.book} ({row.chapter_ct} chapters, {row.paragraph_ct} paragraphs)</li>)}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
import { useEffect, useState } from "react"
import Loader from "./Loader";

interface BookData {
  series: string
  book: string
  chapter_ct: number
  paragraph_ct: number
}

export default function Library({ refreshKey = 0 }: { refreshKey?: number }) {
  const [data, setData] = useState<Record<string, BookData[]>>({})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groupBySeries = (_data: BookData[]) => {
    const newData: Record<string, BookData[]> = {}
    _data.forEach(obj => {
      const series = obj["series"]
      if (!newData[series]) newData[series] = []
      newData[series].push(obj)
    })
    setData(newData)
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/library");

        if (!response.ok) {
          setError(`Could not load library (${response.status})`)
        } else {
          groupBySeries(await response.json())
        }
      } catch {
        setError("Could not reach server")
      } finally {
        setLoading(false);
      }
    }

    load()
  }, [refreshKey])

  return (
    <div className="library">
      <h2>Library</h2>
      <div className="divider"></div>
      {loading ? <Loader /> : error ? (
        <p role="alert">{error}</p>
      ) : Object.keys(data).length === 0 ? (
        <p>No books loaded yet.</p>
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
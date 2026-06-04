import { useEffect, useState } from "react"
import Loader from "./Loader";

interface BookData {
  series: string
  book: string
  chapter_ct: number
  paragraph_ct: number
}

export default function Library() {
  const [data, setData] = useState<Record<string, BookData[]>>({})
  const [loading, setLoading] = useState(true);

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
      try {
        const response = await fetch("/library");

        if (!response.ok) {
          alert(`Error uploading data: ${response.status}`)
        } else {
          groupBySeries(await response.json())
        }
      } catch (err) {
        alert(`Error during upload: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    load()
  }, [])

  return (
    <div className="library">
      <h2>Library</h2>
      <div className="divider"></div>
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
      <div className="library-list">
        {loading && <Loader />}
      </div>
    </div>
  )
}
import { useState, useRef } from "react"
import { NavLink } from "react-router-dom"
import Loader from "./Loader"
import Library from "./Library";

export default function LoadBooks() {
  const [seriesTitle, setSeriesTitle] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [textFile, setTextFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [libraryKey, setLibraryKey] = useState(0);

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
      }
    } catch (err) {
      alert(`Error during upload: ${err}`);
    }

    clearForm();
    setLoading(false);
  }

  function clearForm() {
    setSeriesTitle("")
    setBookTitle("")
    setTextFile(null)
    if (inputRef.current != null) {
      inputRef.current.value = "";
    }
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
        <input id="series-title" type="text" name="series-title" value={seriesTitle} onChange={e => setSeriesTitle(e.target.value)} required />
        <label htmlFor="book-title">Book Title</label>
        <input id="book-title" type="text" name="book-title" value={bookTitle} onChange={e => setBookTitle(e.target.value)} required />
        <label htmlFor="file">Text File</label>
        <input id="file" type="file" name="file" accept=".txt" ref={inputRef} onChange={handleFileChange} required />
        <span></span>
        <button type="submit">Submit</button>
        <span></span>
        <div className="centered">When you've loaded your books, click <NavLink to="/connect">Connect Your AI</NavLink> to complete the process.</div>
        {loading && <Loader />}
      </form>
      <Library refreshKey={libraryKey} />
    </>
  )
}
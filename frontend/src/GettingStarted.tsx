import { NavLink } from "react-router-dom"

export default function GettingStarted() {
  return (
    <>
      <h2>Getting Started</h2>
      <p><strong>Series Bible</strong> is a free, open-source, AI-powered tool for fiction writers that takes in the raw text files from your books and allows them to be analyzed by any desktop AI client you use (Claude, ChatGPT, etc). Storing them locally on your computer speeds up access, minimizes AI quota (I use a free plan with mine and it works great!), and gives more precise results than handing the whole document (or series of documents) to your AI with every prompt.</p>
      <p>A "series bible" in the traditional sense is a collection of facts about the books in an ongoing series, such as:</p>
      <ul>
        <li>What is Gene's last name?</li>
        <li>When did Abby and Thea first meet?</li>
        <li>What exactly happened during the chase through the woods in Elements of Betrayal?</li>
      </ul>
      <p>These details can become foggy in an author's memory after several books (and years), but the bible is the place to look them up.</p>
      <p>Of course, it's tedious and time-consuming to create a quality bible and keep it up to date with everything you might want to ask, years down the line. <strong>Series Bible</strong> is designed to be your personal assistant, able to actively scan through all the existing books and track down exact occurrences, presenting the details however you need.</p>
      <p>To get started, click <NavLink to="/load">Load Books</NavLink> in the menu. If you'd like to take the app for a test drive without uploading your own work, click either of the following links to download a free, public-domain work from <a href="https://www.projectgutenberg.org">Project Gutenberg</a> to use instead.</p>
      <ul>
        <li><a href="https://www.gutenberg.org/cache/epub/1342/pg1342.txt">Pride and Prejudice</a> by Jane Austen</li>
        <li><a href="https://www.gutenberg.org/cache/epub/84/pg84.txt">Frankenstein</a> by Mary Wollstonecraft Shelley</li>
      </ul>
    </>
  )
}
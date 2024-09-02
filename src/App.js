import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <span style={{ fontSize: "40px" }}>{count}</span>
      <button className="btn btn-large" onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order("votesInteresting", { ascending: false })
          .limit(1000);

        if (!error) setFacts(facts);
        else alert("Something happened and we can't load the data :(");
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  ); // [] is called a dependency array and it make sure that our function run only once

  return (
    <>
      {/* Header */}
      <Header showForm={showForm} setShowForm={setShowForm} />
      {/* useState, ternary operator is used to show form when user click it */}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

// loader component
function Loader() {
  return <p className="msg-loading">Loading Facts, Please be patient.....</p>;
}

// receiving props in Header function
function Header({ showForm, setShowForm }) {
  const appTitle = "Fact Fusion";

  return (
    <div>
      <header className="header">
        <div className="logo">
          <img
            src="logo-removebg-preview.png"
            height="68"
            width="68"
            alt="Fact Fusion Logo"
          />
          <h1>Fact Fusion</h1>
        </div>

        <button
          className="btn btn-large btn-open"
          // update state variable;
          onClick={() => setShowForm((show) => !show)}
        >
          {showForm ? "Close" : "Share a Fact"}
        </button>
      </header>
    </div>
  );
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  // function to check if the source url is valid or not
  function isValidURL(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https";
  }

  async function handleSubmit(e) {
    // 1. prevnet browser reload
    e.preventDefault();
    // 2. check if data is valid, If so, create a new fact
    // below if will only return true if all are truthy values
    if (text && isValidURL(source) && category && textLength <= 200) {
      // 3. create a new fact
      // const newFact = {
      //   id: Math.round(Math.random() * 10),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      // upload fact to supabase and receive the new fact object
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      // console.log(newFact);
      // 4. Add the new fact to the UI: add the fact to state
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      // 5. Reset input fields
      setText("");
      setSource("");
      setCategory("");
      // 6. close the form automatically
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <div>
      <aside>
        <ul>
          <li className="category">
            <button
              className="btn btn-all-categories"
              onClick={() => setCurrentCategory("all")}
            >
              All
            </button>
          </li>
          {CATEGORIES?.map((cat) => (
            <li key={cat.name} className="category">
              <button
                className="btn btn-category"
                style={{ backgroundColor: cat.color }}
                onClick={() => setCurrentCategory(cat.name)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="msg-loading">
        No Facts for this category yet ^_^ Why not create one ☺
      </p>
    );
  }
  // else this will be returned
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} /> // passing props
        ))}
      </ul>
      <p>
        There are {facts.length} facts in the database. Add your own to make it
        count!
      </p>
    </section>
  );

  // const { factObj } = props;
  function Fact({ fact, setFacts }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [hasVoted, setHasVoted] = useState(false); // Track if the user has voted
    const isDisputed =
      fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

    async function handleVote(colName) {
      if (hasVoted) return; // Prevent multiple votes

      setIsUpdating(true);

      const { data: updateFact, error } = await supabase
        .from("facts")
        .update({ [colName]: fact[colName] + 1 })
        .eq("id", fact.id)
        .select();

      setIsUpdating(false);

      if (!error) {
        setFacts((facts) =>
          facts.map((f) => (f.id === fact.id ? updateFact[0] : f))
        );
        setHasVoted(true); // Set hasVoted to true after a successful vote
      } else {
        console.error("Error updating vote:", error);
      }
    }

    return (
      <li className="fact">
        <p>
          {isDisputed ? <span className="disputed">[❌DISPUTED]</span> : null}
          {fact.text}
          <a
            className="source"
            href={fact.source}
            target="_blank"
            rel="noopener noreferrer"
          >
            (Source)
          </a>
        </p>
        <span
          className="tag"
          style={{
            backgroundColor: CATEGORIES.find(
              (cat) => cat.name === fact.category
            ).color,
          }}
        >
          {fact.category}
        </span>
        <div className="vote-buttons">
          <button
            onClick={() => handleVote("votesInteresting")}
            disabled={isUpdating || hasVoted}
          >
            👍 {fact.votesInteresting}
          </button>
          <button
            onClick={() => handleVote("votesMindblowing")}
            disabled={isUpdating || hasVoted}
          >
            🤯 {fact.votesMindblowing}
          </button>
          <button
            onClick={() => handleVote("votesFalse")}
            disabled={isUpdating || hasVoted}
          >
            ⛔️ {fact.votesFalse}
          </button>
        </div>
      </li>
    );
  }
}
export default App;

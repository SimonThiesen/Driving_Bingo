"use client";
import { useEffect, useMemo, useState } from "react";
type Cat = "classic" | "letters" | "countries" | "quiz" | "fun";
type Player = { id: string; name: string; color: string };
type Task = {
  id: string;
  category: Cat;
  title: string;
  emoji: string;
  value: number;
  detail?: string;
  choices?: string[];
  answer?: number;
};
const categories = [
  {
    id: "classic",
    label: "Classic bingo",
    short: "Classic",
    emoji: "🔎",
    description: "Vehicles, signs, nature & animals",
  },
  {
    id: "letters",
    label: "Plate alphabet",
    short: "A–Z",
    emoji: "🔤",
    description: "Find every letter on licence plates",
  },
  {
    id: "countries",
    label: "Country cars",
    short: "Countries",
    emoji: "🌍",
    description: "23 country codes with bonus points",
  },
  {
    id: "quiz",
    label: "Road quiz",
    short: "Quiz",
    emoji: "🧠",
    description: "15 rules & geography questions",
  },
  {
    id: "fun",
    label: "Family fun",
    short: "Fun",
    emoji: "🎉",
    description: "Challenges for everyone in the car",
  },
] as const;
const classic = [
  ["Red car", "🚗"],
  ["Motorcycle", "🏍️"],
  ["Camper van", "🚐"],
  ["Tractor", "🚜"],
  ["Fire engine", "🚒"],
  ["Bus", "🚌"],
  ["Electric car charging", "🔌"],
  ["Roadworks", "🚧"],
  ["Roundabout sign", "🔄"],
  ["Pedestrian crossing", "🚸"],
  ["Speed limit sign", "🚦"],
  ["Bridge", "🌉"],
  ["Tunnel", "🚇"],
  ["Wind turbine", "💨"],
  ["Farm", "🚜"],
  ["Lake or sea", "🌊"],
  ["Forest", "🌲"],
  ["Horse", "🐴"],
  ["Cow", "🐄"],
  ["Sheep", "🐑"],
  ["Dog in a car", "🐶"],
  ["Bird of prey", "🦅"],
  ["Yellow flower field", "🌼"],
  ["Church tower", "⛪"],
  ["Big truck", "🚚"],
] as const;
const countries = [
  ["Denmark", "DK", "🇩🇰", 1],
  ["Sweden", "S", "🇸🇪", 1],
  ["Norway", "N", "🇳🇴", 1],
  ["Germany", "D", "🇩🇪", 1],
  ["Netherlands", "NL", "🇳🇱", 2],
  ["Belgium", "B", "🇧🇪", 2],
  ["France", "F", "🇫🇷", 2],
  ["United Kingdom", "UK", "🇬🇧", 2],
  ["Poland", "PL", "🇵🇱", 2],
  ["Czechia", "CZ", "🇨🇿", 2],
  ["Austria", "A", "🇦🇹", 2],
  ["Switzerland", "CH", "🇨🇭", 2],
  ["Italy", "I", "🇮🇹", 3],
  ["Spain", "E", "🇪🇸", 3],
  ["Portugal", "P", "🇵🇹", 3],
  ["Ireland", "IRL", "🇮🇪", 3],
  ["Finland", "FIN", "🇫🇮", 3],
  ["Iceland", "IS", "🇮🇸", 3],
  ["Estonia", "EST", "🇪🇪", 3],
  ["Latvia", "LV", "🇱🇻", 3],
  ["Lithuania", "LT", "🇱🇹", 3],
  ["Croatia", "HR", "🇭🇷", 4],
  ["Slovenia", "SLO", "🇸🇮", 4],
] as const;
const quiz = [
  [
    "What does a red traffic light mean?",
    ["Slow down", "Stop", "Go if clear"],
    1,
  ],
  [
    "Which side of the road do cars drive on in Denmark?",
    ["Right", "Left", "Both"],
    0,
  ],
  [
    "What should everyone wear before the car moves?",
    ["A hat", "A seat belt", "Sunglasses"],
    1,
  ],
  [
    "What shape is a warning road sign in most of Europe?",
    ["Triangle", "Circle", "Square"],
    0,
  ],
  [
    "What does a blue P sign usually mean?",
    ["Petrol", "Parking", "Playground"],
    1,
  ],
  ["Which country is famous for fjords?", ["Norway", "Spain", "Belgium"], 0],
  [
    "What should the driver do before changing lane?",
    ["Check mirrors and look", "Honk twice", "Speed up"],
    0,
  ],
  [
    "What does a zebra crossing help people do?",
    ["Park", "Cross the road", "Ride bikes"],
    1,
  ],
  [
    "Which is the longest river in Europe?",
    ["The Volga", "The Thames", "The Danube"],
    0,
  ],
  [
    "What is a roundabout for?",
    ["Turning safely at a junction", "Washing cars", "Finding petrol"],
    0,
  ],
  [
    "If an emergency vehicle has flashing blue lights, what should cars do?",
    ["Make space safely", "Race it", "Ignore it"],
    0,
  ],
  ["Which direction does the sun set?", ["East", "West", "North"], 1],
  ["What is the capital city of Sweden?", ["Stockholm", "Oslo", "Helsinki"], 0],
  [
    "What colour are motorway direction signs in Denmark?",
    ["Blue", "Pink", "Purple"],
    0,
  ],
  [
    "Why is it important not to distract the driver?",
    [
      "It helps everyone travel safely",
      "It makes the car faster",
      "It finds more snacks",
    ],
    0,
  ],
] as const;
const fun = [
  ["Tell a silly joke", "😄"],
  ["Name three things that are blue", "🔵"],
  ["Make your best animal sound", "🦁"],
  ["Sing one chorus together", "🎵"],
  ["Wave at a friendly driver", "👋"],
  ["Find a cloud shaped like something", "☁️"],
  ["Count 10 red cars", "🔴"],
  ["Say a tongue twister", "👅"],
  ["Everyone names a favourite snack", "🍎"],
  ["Spot the first star", "⭐"],
  ["Make up a new road-trip rule", "📜"],
  ["Guess the next town name", "🗺️"],
  ["Tell a story using three things you see", "📖"],
  ["Everyone does a secret handshake", "🤝"],
  ["Name five animals", "🐾"],
  ["Find something shaped like a circle", "⭕"],
  ["Choose the next music track together", "🎶"],
  ["Say thank you to the driver", "💛"],
  ["Try not to say ‘are we there?’ for 10 minutes", "🤫"],
  ["Give someone a kind compliment", "💬"],
] as const;
const tasks: Task[] = [
  ...classic.map(([title, emoji], i) => ({
    id: `classic-${i}`,
    category: "classic" as const,
    title,
    emoji,
    value: 1,
  })),
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .map((letter) => ({
      id: `letter-${letter}`,
      category: "letters" as const,
      title: `Find the letter ${letter}`,
      emoji: letter,
      detail: "On a licence plate",
      value: 1,
    })),
  ...countries.map(([title, code, emoji, value]) => ({
    id: `country-${code}`,
    category: "countries" as const,
    title,
    emoji,
    detail: `Spot ${code} on a licence plate`,
    value,
  })),
  ...quiz.map(([title, choices, answer], i) => ({
    id: `quiz-${i}`,
    category: "quiz" as const,
    title,
    emoji: "?",
    detail: "Correct answer = 2 points",
    value: 2,
    choices: [...choices],
    answer,
  })),
  ...fun.map(([title, emoji], i) => ({
    id: `fun-${i}`,
    category: "fun" as const,
    title,
    emoji,
    value: 1,
  })),
];
const defaultPlayers: Player[] = [
  { id: "sun", name: "Team Sunshine", color: "#ff6b5f" },
  { id: "ocean", name: "Team Ocean", color: "#3157b7" },
  { id: "forest", name: "Team Forest", color: "#338b65" },
];
const key = "road-bingo-v1";
export default function Home() {
  const [cat, setCat] = useState<Cat>("classic"),
    [players, setPlayers] = useState(defaultPlayers),
    [active, setActive] = useState(defaultPlayers[0].id),
    [done, setDone] = useState<Record<string, string>>({}),
    [ready, setReady] = useState(false),
    [message, setMessage] = useState(
      "Pick a team, then tap a card when you spot it.",
    );
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const p = JSON.parse(saved) as {
          players?: Player[];
          active?: string;
          done?: Record<string, string>;
        };
        if (p.players?.length) setPlayers(p.players.slice(0, 4));
        if (p.active) setActive(p.active);
        if (p.done) setDone(p.done);
      }
    } catch {
      setMessage("Your game will stay in this tab for now.");
    }
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(key, JSON.stringify({ players, active, done }));
      } catch {
        /* Game play does not depend on storage. */
      }
  }, [active, done, players, ready]);
  const shown = tasks.filter((t) => t.category === cat),
    scores = useMemo(
      () =>
        players.map((p) => ({
          ...p,
          score: tasks
            .filter((t) => done[t.id] === p.id)
            .reduce((n, t) => n + t.value, 0),
        })),
      [done, players],
    );
  const claim = (task: Task) => {
    const owner = done[task.id];
    if (owner === active) {
      setDone(({ [task.id]: _, ...rest }) => rest);
      setMessage(`${task.title} is back in play.`);
    } else if (owner) setMessage("That one already belongs to another team.");
    else {
      setDone((prev) => ({ ...prev, [task.id]: active }));
      setMessage(
        `${task.title}: scored for ${players.find((p) => p.id === active)?.name ?? "your team"}!`,
      );
    }
  };
  const rename = (id: string, name: string) => {
    const clean = name
      .replace(/[^\p{L}\p{N} .'-]/gu, "")
      .slice(0, 18)
      .trim();
    setPlayers((all) =>
      all.map((p) => (p.id === id ? { ...p, name: clean || "Road team" } : p)),
    );
  };
  const current = categories.find((c) => c.id === cat)!;
  return (
    <main>
      <section className="hero" aria-labelledby="app-title">
        <div className="hero-copy">
          <p className="eyebrow">THE CAR’S BEST GAME</p>
          <h1 id="app-title">
            Road <span>Bingo</span>
          </h1>
          <p className="hero-text">Find it. Claim it. Win the road trip.</p>
          <div className="hero-badges">
            <span>✦ 109 challenges</span>
            <span>◌ works offline</span>
            <span>♡ no accounts</span>
          </div>
        </div>
        <div className="road-art" aria-hidden="true">
          <div className="sun" />
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
          <div className="hill hill-back" />
          <div className="hill hill-front" />
          <div className="road">
            <i />
            <i />
            <i />
          </div>
          <div className="car">
            <b>●</b>
            <b>●</b>
            <span>▭</span>
          </div>
          <div className="tree tree-one">♠</div>
          <div className="tree tree-two">♠</div>
        </div>
      </section>
      <section className="game-shell" aria-label="Road Bingo game">
        <div className="game-topline">
          <p>
            <strong>{Object.keys(done).length}</strong> of {tasks.length}{" "}
            challenges claimed
          </p>
          <button
            className="reset-button"
            type="button"
            onClick={() => {
              setDone({});
              setMessage("Fresh road trip, fresh bingo board!");
            }}
          >
            Reset game
          </button>
        </div>
        <section className="team-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">WHO’S PLAYING?</p>
              <h2>Pick your team</h2>
            </div>
            <p className="tiny-note">Names only live on this device.</p>
          </div>
          <div className="teams">
            {players.map((p) => {
              const score = scores.find((s) => s.id === p.id)?.score ?? 0;
              return (
                <div
                  className={`team ${active === p.id ? "is-active" : ""}`}
                  style={{ "--team": p.color } as React.CSSProperties}
                  key={p.id}
                >
                  <button
                    className="team-select"
                    type="button"
                    aria-label={`Play as ${p.name}`}
                    aria-pressed={active === p.id}
                    onClick={() => setActive(p.id)}
                  >
                    <span className="team-dot">★</span>
                  </button>
                  <span className="team-name">
                    <input
                      aria-label={`${p.name} name`}
                      value={p.name}
                      maxLength={18}
                      onChange={(e) => rename(p.id, e.target.value)}
                    />
                  </span>
                  <strong>
                    {score}
                    <small> pts</small>
                  </strong>
                </div>
              );
            })}
          </div>
        </section>
        <nav className="category-nav" aria-label="Game categories">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={cat === c.id ? "is-selected" : ""}
              onClick={() => setCat(c.id)}
            >
              <span>{c.emoji}</span>
              <b>{c.short}</b>
              <small>
                {tasks.filter((t) => t.category === c.id && done[t.id]).length}/
                {tasks.filter((t) => t.category === c.id).length}
              </small>
            </button>
          ))}
        </nav>
        <section className="board">
          <div className="board-heading">
            <div>
              <p className="eyebrow">{current.label.toUpperCase()}</p>
              <h2>{current.description}</h2>
            </div>
            <p className="points-key">
              ⭐ 1 point · 🌍 1–4 points · 🧠 2 points
            </p>
          </div>
          <p className="status" aria-live="polite">
            {message}
          </p>
          <div
            className={`task-grid ${cat === "letters" ? "letter-grid" : ""}`}
          >
            {shown.map((t) => {
              const owner = done[t.id],
                winner = players.find((p) => p.id === owner),
                mine = owner === active;
              return (
                <article
                  className={`task-card ${owner ? "is-claimed" : ""}`}
                  style={
                    winner
                      ? ({ "--claim": winner.color } as React.CSSProperties)
                      : undefined
                  }
                  key={t.id}
                >
                  <button
                    type="button"
                    className="task-main"
                    onClick={() => (t.choices ? undefined : claim(t))}
                    aria-label={
                      owner
                        ? `${t.title}, claimed by ${winner?.name}`
                        : `Claim ${t.title}`
                    }
                  >
                    <span className="task-icon">{t.emoji}</span>
                    <span className="task-copy">
                      <b>{t.title}</b>
                      {t.detail && <small>{t.detail}</small>}
                    </span>
                    <span className="value">{t.value}★</span>
                  </button>
                  {t.choices && (
                    <div className="quiz-choices">
                      {t.choices.map((choice, i) => (
                        <button
                          type="button"
                          key={choice}
                          disabled={Boolean(owner)}
                          onClick={() =>
                            i === t.answer
                              ? claim(t)
                              : setMessage("Not quite — have another think!")
                          }
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  )}
                  {owner && (
                    <div className="claimed-by">
                      <span style={{ background: winner?.color }} />
                      {mine ? "Yours! Tap to undo" : `${winner?.name} found it`}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
        <section className="safety-note">
          <span>🧡</span>
          <p>
            <strong>Driver rule:</strong> the driver never taps or searches. Let
            passengers play — safety wins every time.
          </p>
        </section>
      </section>
    </main>
  );
}

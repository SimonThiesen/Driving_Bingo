"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "en" | "da";
type GameType = "car" | "camper";
type Cat = "classic" | "letters" | "countries" | "quiz" | "fun";
type Localized = Record<Lang, string>;
type Player = { id: string; name: string; color: string };
type Task = {
  id: string;
  category: Cat;
  title: Localized;
  emoji: string;
  value: number;
  detail?: Localized;
  choices?: Localized[];
  answer?: number;
};

const t = (en: string, da: string): Localized => ({ en, da });
const ui: Record<Lang, Record<string, string>> = {
  en: {
    brand: "Road Bingo",
    introEyebrow: "THE CAR’S BEST GAME",
    introTitle: "Road Bingo",
    introCopy:
      "A brilliant game for the whole car. Find it, claim it, and win the journey.",
    car: "Car Bingo",
    camper: "Campervan Bingo",
    chooseGame: "Choose your road-trip game",
    rules: "How to play",
    rule1: "Choose a team, then pick a challenge from any category.",
    rule2: "The first team to spot it claims the points.",
    rule3: "Country plates give 1–4 points; a correct quiz answer gives 2.",
    rule4: "Passengers play. The driver keeps eyes on the road.",
    start: "Start game",
    continue: "Continue game",
    language: "Dansk",
    back: "Back to start",
    claimed: "challenges claimed",
    reset: "Reset game",
    fresh: "Fresh road trip, fresh bingo board!",
    chooseTeam: "Choose your team",
    teamHelp: "Tap a full team card to select it.",
    classic: "Classic bingo",
    classicDesc: "Vehicles, signs, nature & animals",
    letters: "Plate alphabet",
    lettersDesc: "Find every letter on licence plates",
    countries: "Country cars",
    countriesDesc: "23 country codes with bonus points",
    quiz: "Road quiz",
    quizDesc: "15 rules & geography questions",
    fun: "Family fun",
    funDesc: "Challenges for everyone",
    points: "1 point · countries 1–4 points · quiz 2 points",
    pick: "Pick a team, then tap a card when you spot it.",
    again: "is back in play.",
    owned: "That one already belongs to another team.",
    scored: "scored for",
    yours: "Yours! Tap to undo",
    found: "found it",
    wrong: "Not quite — have another think!",
    plate: "On a licence plate",
    quizPoints: "Correct answer = 2 points",
    driver: "Driver rule:",
    driverText:
      "the driver never taps or searches. Let passengers play — safety wins every time.",
    all: "all",
    carLabel: "Car",
    camperLabel: "Campervan",
  },
  da: {
    brand: "Road Bingo",
    introEyebrow: "BILTURENS BEDSTE SPIL",
    introTitle: "Bil Bingo",
    introCopy:
      "Et sjovt spil for hele bilen. Find det, tag pointene og vind turen.",
    car: "Bil Bingo",
    camper: "Autocamper Bingo",
    chooseGame: "Vælg jeres spil til køreturen",
    rules: "Sådan spiller I",
    rule1: "Vælg et hold og vælg derefter en udfordring fra en kategori.",
    rule2: "Det første hold, der ser den, får pointene.",
    rule3: "Landekoder giver 1–4 point; et rigtigt quizsvar giver 2.",
    rule4: "Passagererne spiller. Chaufføren holder øjnene på vejen.",
    start: "Start spil",
    continue: "Fortsæt spil",
    language: "English",
    back: "Tilbage til start",
    claimed: "udfordringer fundet",
    reset: "Nulstil spil",
    fresh: "Ny køretur, nyt bingokort!",
    chooseTeam: "Vælg jeres hold",
    teamHelp: "Tryk på hele holdkortet for at vælge.",
    classic: "Klassisk bingo",
    classicDesc: "Køretøjer, skilte, natur og dyr",
    letters: "Nummerplade-alfabet",
    lettersDesc: "Find alle bogstaver på nummerplader",
    countries: "Landebiler",
    countriesDesc: "23 landekoder med bonuspoint",
    quiz: "Vejquiz",
    quizDesc: "15 spørgsmål om regler og geografi",
    fun: "Familiehygge",
    funDesc: "Udfordringer for alle i bilen",
    points: "1 point · lande 1–4 point · quiz 2 point",
    pick: "Vælg et hold, og tryk på et kort, når I ser det.",
    again: "er tilbage i spil.",
    owned: "Den tilhører allerede et andet hold.",
    scored: "gav point til",
    yours: "Jeres! Tryk for at fortryde",
    found: "fandt den",
    wrong: "Ikke helt — tænk en gang mere!",
    plate: "På en nummerplade",
    quizPoints: "Rigtigt svar = 2 point",
    driver: "Chaufførregel:",
    driverText:
      "Chaufføren trykker ikke og leder ikke. Lad passagererne spille — sikkerhed vinder altid.",
    all: "alle",
    carLabel: "Bil",
    camperLabel: "Autocamper",
  },
};

const categoryData: {
  id: Cat;
  emoji: string;
  label: keyof typeof ui.en;
  description: keyof typeof ui.en;
  short: string;
}[] = [
  {
    id: "classic",
    emoji: "🔎",
    label: "classic",
    description: "classicDesc",
    short: "Classic",
  },
  {
    id: "letters",
    emoji: "🔤",
    label: "letters",
    description: "lettersDesc",
    short: "A–Z",
  },
  {
    id: "countries",
    emoji: "🌍",
    label: "countries",
    description: "countriesDesc",
    short: "Countries",
  },
  {
    id: "quiz",
    emoji: "🧠",
    label: "quiz",
    description: "quizDesc",
    short: "Quiz",
  },
  {
    id: "fun",
    emoji: "🎉",
    label: "fun",
    description: "funDesc",
    short: "Fun",
  },
];
const classic = [
  [t("Red car", "Rød bil"), "🚗"],
  [t("Motorcycle", "Motorcykel"), "🏍️"],
  [t("Camper van", "Autocamper"), "🚐"],
  [t("Tractor", "Traktor"), "🚜"],
  [t("Fire engine", "Brandbil"), "🚒"],
  [t("Bus", "Bus"), "🚌"],
  [t("Electric car charging", "Elbil til opladning"), "🔌"],
  [t("Roadworks", "Vejarbejde"), "🚧"],
  [t("Roundabout sign", "Rundkørselsskilt"), "🔄"],
  [t("Pedestrian crossing", "Fodgængerfelt"), "🚸"],
  [t("Speed limit sign", "Fartgrænseskilt"), "🚦"],
  [t("Bridge", "Bro"), "🌉"],
  [t("Tunnel", "Tunnel"), "🚇"],
  [t("Wind turbine", "Vindmølle"), "💨"],
  [t("Farm", "Gård"), "🚜"],
  [t("Lake or sea", "Sø eller hav"), "🌊"],
  [t("Forest", "Skov"), "🌲"],
  [t("Horse", "Hest"), "🐴"],
  [t("Cow", "Ko"), "🐄"],
  [t("Sheep", "Får"), "🐑"],
  [t("Dog in a car", "Hund i en bil"), "🐶"],
  [t("Bird of prey", "Rovfugl"), "🦅"],
  [t("Yellow flower field", "Gul blomstereng"), "🌼"],
  [t("Church tower", "Kirketårn"), "⛪"],
  [t("Big truck", "Stor lastbil"), "🚚"],
] as const;
const countries = [
  [t("Denmark", "Danmark"), "DK", "🇩🇰", 1],
  [t("Sweden", "Sverige"), "S", "🇸🇪", 1],
  [t("Norway", "Norge"), "N", "🇳🇴", 1],
  [t("Germany", "Tyskland"), "D", "🇩🇪", 1],
  [t("Netherlands", "Holland"), "NL", "🇳🇱", 2],
  [t("Belgium", "Belgien"), "B", "🇧🇪", 2],
  [t("France", "Frankrig"), "F", "🇫🇷", 2],
  [t("United Kingdom", "Storbritannien"), "UK", "🇬🇧", 2],
  [t("Poland", "Polen"), "PL", "🇵🇱", 2],
  [t("Czechia", "Tjekkiet"), "CZ", "🇨🇿", 2],
  [t("Austria", "Østrig"), "A", "🇦🇹", 2],
  [t("Switzerland", "Schweiz"), "CH", "🇨🇭", 2],
  [t("Italy", "Italien"), "I", "🇮🇹", 3],
  [t("Spain", "Spanien"), "E", "🇪🇸", 3],
  [t("Portugal", "Portugal"), "P", "🇵🇹", 3],
  [t("Ireland", "Irland"), "IRL", "🇮🇪", 3],
  [t("Finland", "Finland"), "FIN", "🇫🇮", 3],
  [t("Iceland", "Island"), "IS", "🇮🇸", 3],
  [t("Estonia", "Estland"), "EST", "🇪🇪", 3],
  [t("Latvia", "Letland"), "LV", "🇱🇻", 3],
  [t("Lithuania", "Litauen"), "LT", "🇱🇹", 3],
  [t("Croatia", "Kroatien"), "HR", "🇭🇷", 4],
  [t("Slovenia", "Slovenien"), "SLO", "🇸🇮", 4],
] as const;
const quiz = [
  [
    t("What does a red traffic light mean?", "Hvad betyder et rødt trafiklys?"),
    [
      t("Slow down", "Sæt farten ned"),
      t("Stop", "Stop"),
      t("Go if clear", "Kør hvis der er frit"),
    ],
    1,
  ],
  [
    t(
      "Which side of the road do cars drive on in Denmark?",
      "Hvilken side af vejen kører man i Danmark?",
    ),
    [t("Right", "Højre"), t("Left", "Venstre"), t("Both", "Begge")],
    0,
  ],
  [
    t(
      "What should everyone wear before the car moves?",
      "Hvad skal alle have på, før bilen kører?",
    ),
    [
      t("A hat", "En hat"),
      t("A seat belt", "En sele"),
      t("Sunglasses", "Solbriller"),
    ],
    1,
  ],
  [
    t(
      "What shape is a warning road sign in most of Europe?",
      "Hvilken form har et advarselsskilt i det meste af Europa?",
    ),
    [t("Triangle", "Trekant"), t("Circle", "Cirkel"), t("Square", "Firkant")],
    0,
  ],
  [
    t(
      "What does a blue P sign usually mean?",
      "Hvad betyder et blåt P-skilt som regel?",
    ),
    [
      t("Petrol", "Benzin"),
      t("Parking", "Parkering"),
      t("Playground", "Legeplads"),
    ],
    1,
  ],
  [
    t(
      "Which country is famous for fjords?",
      "Hvilket land er kendt for fjorde?",
    ),
    [t("Norway", "Norge"), t("Spain", "Spanien"), t("Belgium", "Belgien")],
    0,
  ],
  [
    t(
      "What should the driver do before changing lane?",
      "Hvad skal chaufføren gøre før et vognbaneskift?",
    ),
    [
      t("Check mirrors and look", "Tjekke spejle og kigge"),
      t("Honk twice", "Dytte to gange"),
      t("Speed up", "Sætte farten op"),
    ],
    0,
  ],
  [
    t(
      "What does a zebra crossing help people do?",
      "Hvad hjælper et fodgængerfelt folk med?",
    ),
    [
      t("Park", "Parkere"),
      t("Cross the road", "Krydse vejen"),
      t("Ride bikes", "Cykle"),
    ],
    1,
  ],
  [
    t(
      "Which is the longest river in Europe?",
      "Hvilken er Europas længste flod?",
    ),
    [
      t("The Volga", "Volga"),
      t("The Thames", "Themsen"),
      t("The Danube", "Donau"),
    ],
    0,
  ],
  [
    t("What is a roundabout for?", "Hvad er en rundkørsel til for?"),
    [
      t("Turning safely at a junction", "At dreje sikkert i et kryds"),
      t("Washing cars", "At vaske biler"),
      t("Finding petrol", "At finde benzin"),
    ],
    0,
  ],
  [
    t(
      "If an emergency vehicle has flashing blue lights, what should cars do?",
      "Hvis et udrykningskøretøj har blinkende blåt lys, hvad skal bilerne så gøre?",
    ),
    [
      t("Make space safely", "Give plads på en sikker måde"),
      t("Race it", "Køre om kap"),
      t("Ignore it", "Ignorere det"),
    ],
    0,
  ],
  [
    t("Which direction does the sun set?", "Hvilken retning går solen ned i?"),
    [t("East", "Øst"), t("West", "Vest"), t("North", "Nord")],
    1,
  ],
  [
    t("What is the capital city of Sweden?", "Hvad hedder Sveriges hovedstad?"),
    [t("Stockholm", "Stockholm"), t("Oslo", "Oslo"), t("Helsinki", "Helsinki")],
    0,
  ],
  [
    t(
      "What colour are motorway direction signs in Denmark?",
      "Hvilken farve har motorvejsskilte i Danmark?",
    ),
    [t("Blue", "Blå"), t("Pink", "Lyserød"), t("Purple", "Lilla")],
    0,
  ],
  [
    t(
      "Why is it important not to distract the driver?",
      "Hvorfor er det vigtigt ikke at forstyrre chaufføren?",
    ),
    [
      t(
        "It helps everyone travel safely",
        "Det hjælper alle med at rejse sikkert",
      ),
      t("It makes the car faster", "Det gør bilen hurtigere"),
      t("It finds more snacks", "Det finder flere snacks"),
    ],
    0,
  ],
] as const;
const fun = [
  [t("Tell a silly joke", "Fortæl en fjollet joke"), "😄"],
  [t("Name three things that are blue", "Nævn tre ting der er blå"), "🔵"],
  [t("Make your best animal sound", "Lav din bedste dyrelyd"), "🦁"],
  [t("Sing one chorus together", "Syng et omkvæd sammen"), "🎵"],
  [t("Wave at a friendly driver", "Vink til en venlig chauffør"), "👋"],
  [
    t("Find a cloud shaped like something", "Find en sky, der ligner noget"),
    "☁️",
  ],
  [t("Count 10 red cars", "Tæl 10 røde biler"), "🔴"],
  [t("Say a tongue twister", "Sig en tungebrækker"), "👅"],
  [t("Everyone names a favourite snack", "Alle nævner en yndlingssnack"), "🍎"],
  [t("Spot the first star", "Se den første stjerne"), "⭐"],
  [t("Make up a new road-trip rule", "Find på en ny regel til turen"), "📜"],
  [t("Guess the next town name", "Gæt navnet på den næste by"), "🗺️"],
  [
    t(
      "Tell a story using three things you see",
      "Fortæl en historie med tre ting I ser",
    ),
    "📖",
  ],
  [
    t("Everyone does a secret handshake", "Alle laver et hemmeligt håndtryk"),
    "🤝",
  ],
  [t("Name five animals", "Nævn fem dyr"), "🐾"],
  [t("Find something shaped like a circle", "Find noget, der er rundt"), "⭕"],
  [
    t("Choose the next music track together", "Vælg den næste sang sammen"),
    "🎶",
  ],
  [t("Say thank you to the driver", "Sig tak til chaufføren"), "💛"],
  [
    t(
      "Try not to say ‘are we there?’ for 10 minutes",
      "Prøv ikke at sige ‘er vi der snart?’ i 10 minutter",
    ),
    "🤫",
  ],
  [t("Give someone a kind compliment", "Giv nogen et sødt kompliment"), "💬"],
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
      title: t(`Find the letter ${letter}`, `Find bogstavet ${letter}`),
      emoji: letter,
      detail: t("On a licence plate", "På en nummerplade"),
      value: 1,
    })),
  ...countries.map(([title, code, emoji, value]) => ({
    id: `country-${code}`,
    category: "countries" as const,
    title,
    emoji,
    detail: t(
      `Spot ${code} on a licence plate`,
      `Se ${code} på en nummerplade`,
    ),
    value,
  })),
  ...quiz.map(([title, choices, answer], i) => ({
    id: `quiz-${i}`,
    category: "quiz" as const,
    title,
    emoji: "?",
    detail: t("Correct answer = 2 points", "Rigtigt svar = 2 point"),
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
const storageKey = "road-bingo-v2";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [gameType, setGameType] = useState<GameType>("car");
  const [showWelcome, setShowWelcome] = useState(true);
  const [cat, setCat] = useState<Cat>("classic");
  const [players, setPlayers] = useState<Player[]>(defaultPlayers);
  const [active, setActive] = useState(defaultPlayers[0].id);
  const [done, setDone] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const words = ui[lang];
  const [message, setMessage] = useState(words.pick);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const state = JSON.parse(saved) as {
          players?: Player[];
          active?: string;
          done?: Record<string, string>;
          lang?: Lang;
          gameType?: GameType;
        };
        if (state.players?.length) setPlayers(state.players.slice(0, 3));
        if (state.active) setActive(state.active);
        if (state.done) setDone(state.done);
        if (state.lang === "en" || state.lang === "da") setLang(state.lang);
        if (state.gameType === "car" || state.gameType === "camper")
          setGameType(state.gameType);
      }
    } catch {
      /* Local storage is optional. */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ players, active, done, lang, gameType }),
        );
      } catch {
        /* Game play does not depend on storage. */
      }
  }, [active, done, gameType, lang, players, ready]);
  useEffect(() => {
    setMessage(words.pick);
  }, [lang, words.pick]);
  const shown = tasks.filter((task) => task.category === cat);
  const scores = useMemo(
    () =>
      players.map((player) => ({
        ...player,
        score: tasks
          .filter((task) => done[task.id] === player.id)
          .reduce((sum, task) => sum + task.value, 0),
      })),
    [done, players],
  );
  const current = categoryData.find((category) => category.id === cat)!;
  const claim = (task: Task) => {
    const owner = done[task.id];
    if (owner === active) {
      setDone(({ [task.id]: _removed, ...rest }) => rest);
      setMessage(`${task.title[lang]} ${words.again}`);
    } else if (owner) setMessage(words.owned);
    else {
      const player = players.find((item) => item.id === active)?.name ?? "";
      setDone((previous) => ({ ...previous, [task.id]: active }));
      setMessage(`${task.title[lang]} ${words.scored} ${player}!`);
    }
  };
  const start = (type: GameType) => {
    setGameType(type);
    setShowWelcome(false);
    setMessage(words.pick);
  };
  if (showWelcome)
    return (
      <main className="welcome-page">
        <section className="welcome-hero">
          <img src="./og.png" alt="Illustrated Road Bingo road trip" />
          <div className="welcome-shade" />
          <div className="welcome-language">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "da" : "en")}
            >
              🌐 {words.language}
            </button>
          </div>
          <div className="welcome-copy">
            <p className="eyebrow">{words.introEyebrow}</p>
            <h1>{words.introTitle}</h1>
            <p>{words.introCopy}</p>
          </div>
        </section>
        <section className="welcome-content">
          <div className="game-picker">
            <p className="eyebrow">{words.chooseGame}</p>
            <div className="start-actions">
              <button
                type="button"
                className="start-card car-start"
                onClick={() => start("car")}
              >
                <span>🚗</span>
                <b>{words.car}</b>
                <small>{words.start}</small>
              </button>
              <button
                type="button"
                className="start-card camper-start"
                onClick={() => start("camper")}
              >
                <span>🚐</span>
                <b>{words.camper}</b>
                <small>{words.start}</small>
              </button>
            </div>
          </div>
          <section className="rules" aria-labelledby="rules-title">
            <div>
              <p className="eyebrow">{words.brand.toUpperCase()}</p>
              <h2 id="rules-title">{words.rules}</h2>
            </div>
            <ol>
              <li>{words.rule1}</li>
              <li>{words.rule2}</li>
              <li>{words.rule3}</li>
              <li>{words.rule4}</li>
            </ol>
          </section>
        </section>
      </main>
    );
  return (
    <main>
      <header className="game-header">
        <button
          type="button"
          className="brand-button"
          onClick={() => setShowWelcome(true)}
        >
          ← {words.back}
        </button>
        <p>
          <b>{gameType === "camper" ? words.camperLabel : words.carLabel}</b> ·{" "}
          {words.brand}
        </p>
        <button
          type="button"
          className="language-button"
          onClick={() => setLang(lang === "en" ? "da" : "en")}
        >
          🌐 {words.language}
        </button>
      </header>
      <section className="game-shell" aria-label={words.brand}>
        <div className="game-topline">
          <p>
            <strong>{Object.keys(done).length}</strong> / {tasks.length}{" "}
            {words.claimed}
          </p>
          <button
            className="reset-button"
            type="button"
            onClick={() => {
              setDone({});
              setMessage(words.fresh);
            }}
          >
            {words.reset}
          </button>
        </div>
        <section className="team-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{words.chooseTeam.toUpperCase()}</p>
              <h2>{words.chooseTeam}</h2>
            </div>
            <p className="tiny-note">{words.teamHelp}</p>
          </div>
          <div className="teams">
            {players.map((player) => {
              const score =
                scores.find((item) => item.id === player.id)?.score ?? 0;
              return (
                <button
                  className={`team ${active === player.id ? "is-active" : ""}`}
                  style={{ "--team": player.color } as React.CSSProperties}
                  type="button"
                  onClick={() => setActive(player.id)}
                  key={player.id}
                  aria-pressed={active === player.id}
                >
                  <span className="team-dot">★</span>
                  <span className="team-name">{player.name}</span>
                  <strong>
                    {score}
                    <small> pts</small>
                  </strong>
                </button>
              );
            })}
          </div>
        </section>
        <nav className="category-nav" aria-label="Game categories">
          {categoryData.map((category) => (
            <button
              key={category.id}
              type="button"
              className={cat === category.id ? "is-selected" : ""}
              onClick={() => setCat(category.id)}
            >
              <span>{category.emoji}</span>
              <b>
                {category.id === "letters"
                  ? category.short
                  : words[category.label]}
              </b>
              <small>
                {
                  tasks.filter(
                    (task) => task.category === category.id && done[task.id],
                  ).length
                }
                /{tasks.filter((task) => task.category === category.id).length}
              </small>
            </button>
          ))}
        </nav>
        <section className="board">
          <div className="board-heading">
            <div>
              <p className="eyebrow">{words[current.label].toUpperCase()}</p>
              <h2>{words[current.description]}</h2>
            </div>
            <p className="points-key">⭐ {words.points}</p>
          </div>
          <p className="status" aria-live="polite">
            {message}
          </p>
          <div
            className={`task-grid ${cat === "letters" ? "letter-grid" : ""}`}
          >
            {shown.map((task) => {
              const owner = done[task.id];
              const winner = players.find((player) => player.id === owner);
              const mine = owner === active;
              return (
                <article
                  className={`task-card ${owner ? "is-claimed" : ""}`}
                  style={
                    winner
                      ? ({ "--claim": winner.color } as React.CSSProperties)
                      : undefined
                  }
                  key={task.id}
                >
                  <button
                    type="button"
                    className="task-main"
                    onClick={() => (task.choices ? undefined : claim(task))}
                    aria-label={
                      owner
                        ? `${task.title[lang]}, ${words.found} ${winner?.name}`
                        : task.title[lang]
                    }
                  >
                    <span className="task-icon">{task.emoji}</span>
                    <span className="task-copy">
                      <b>{task.title[lang]}</b>
                      {task.detail && <small>{task.detail[lang]}</small>}
                    </span>
                    <span className="value">{task.value}★</span>
                  </button>
                  {task.choices && (
                    <div className="quiz-choices">
                      {task.choices.map((choice, index) => (
                        <button
                          type="button"
                          key={choice.en}
                          disabled={Boolean(owner)}
                          onClick={() =>
                            index === task.answer
                              ? claim(task)
                              : setMessage(words.wrong)
                          }
                        >
                          {choice[lang]}
                        </button>
                      ))}
                    </div>
                  )}
                  {owner && (
                    <div className="claimed-by">
                      <span style={{ background: winner?.color }} />
                      {mine ? words.yours : `${winner?.name} ${words.found}`}
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
            <strong>{words.driver}</strong> {words.driverText}
          </p>
        </section>
      </section>
    </main>
  );
}

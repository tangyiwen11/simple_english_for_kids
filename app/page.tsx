import { useEffect, useMemo, useRef, useState } from "react";

const ALPHABET = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
  "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
] as const;

type LetterKey = (typeof ALPHABET)[number];

type WordCard = {
  word: string;
  zh: string;
  emoji: string;
};

type LetterLesson = {
  letter: LetterKey;
  uppercase: string;
  color: string;
  words: WordCard[];
};

type Screen = "home" | "lesson" | "practice" | "mixed" | "blend";

const LESSONS: Record<LetterKey, LetterLesson> = {
  a: {
    letter: "a",
    uppercase: "A",
    color: "#f3a51f",
    words: [
      { word: "apple", zh: "苹果", emoji: "🍎" },
      { word: "ant", zh: "蚂蚁", emoji: "🐜" },
      { word: "ax", zh: "斧头", emoji: "🪓" },
      { word: "alligator", zh: "短吻鳄", emoji: "🐊" },
      { word: "ambulance", zh: "救护车", emoji: "🚑" },
      { word: "astronaut", zh: "宇航员", emoji: "🧑‍🚀" },
    ],
  },
  b: {
    letter: "b",
    uppercase: "B",
    color: "#d96b5f",
    words: [
      { word: "ball", zh: "球", emoji: "⚽" },
      { word: "banana", zh: "香蕉", emoji: "🍌" },
      { word: "bear", zh: "熊", emoji: "🐻" },
      { word: "bed", zh: "床", emoji: "🛏️" },
      { word: "bird", zh: "鸟", emoji: "🐦" },
      { word: "book", zh: "书", emoji: "📖" },
    ],
  },
  c: {
    letter: "c",
    uppercase: "C",
    color: "#57966f",
    words: [
      { word: "cat", zh: "猫", emoji: "🐱" },
      { word: "car", zh: "汽车", emoji: "🚗" },
      { word: "cup", zh: "杯子", emoji: "☕" },
      { word: "cow", zh: "奶牛", emoji: "🐄" },
      { word: "cake", zh: "蛋糕", emoji: "🍰" },
      { word: "corn", zh: "玉米", emoji: "🌽" },
    ],
  },
  d: {
    letter: "d",
    uppercase: "D",
    color: "#617ec7",
    words: [
      { word: "dog", zh: "狗", emoji: "🐶" },
      { word: "duck", zh: "鸭子", emoji: "🦆" },
      { word: "door", zh: "门", emoji: "🚪" },
      { word: "doll", zh: "玩偶", emoji: "🧸" },
      { word: "drum", zh: "鼓", emoji: "🥁" },
      { word: "dad", zh: "爸爸", emoji: "👨" },
    ],
  },
  e: {
    letter: "e",
    uppercase: "E",
    color: "#dc8b32",
    words: [
      { word: "egg", zh: "鸡蛋", emoji: "🥚" },
      { word: "elephant", zh: "大象", emoji: "🐘" },
      { word: "elbow", zh: "手肘", emoji: "💪" },
      { word: "engine", zh: "发动机", emoji: "🚂" },
      { word: "envelope", zh: "信封", emoji: "✉️" },
      { word: "exit", zh: "出口", emoji: "🚪" },
    ],
  },
  f: {
    letter: "f",
    uppercase: "F",
    color: "#9a6db0",
    words: [
      { word: "fish", zh: "鱼", emoji: "🐟" },
      { word: "frog", zh: "青蛙", emoji: "🐸" },
      { word: "fan", zh: "风扇", emoji: "🌬️" },
      { word: "foot", zh: "脚", emoji: "🦶" },
      { word: "fork", zh: "叉子", emoji: "🍴" },
      { word: "flower", zh: "花", emoji: "🌸" },
    ],
  },
  g: {
    letter: "g",
    uppercase: "G",
    color: "#4f9b91",
    words: [
      { word: "goat", zh: "山羊", emoji: "🐐" },
      { word: "game", zh: "游戏", emoji: "🎮" },
      { word: "gift", zh: "礼物", emoji: "🎁" },
      { word: "grapes", zh: "葡萄", emoji: "🍇" },
      { word: "green", zh: "绿色", emoji: "🟢" },
      { word: "girl", zh: "女孩", emoji: "👧" },
    ],
  },
  h: {
    letter: "h",
    uppercase: "H",
    color: "#cf6f8c",
    words: [
      { word: "hat", zh: "帽子", emoji: "🎩" },
      { word: "hand", zh: "手", emoji: "✋" },
      { word: "house", zh: "房子", emoji: "🏠" },
      { word: "horse", zh: "马", emoji: "🐴" },
      { word: "heart", zh: "心", emoji: "❤️" },
      { word: "hippo", zh: "河马", emoji: "🦛" },
    ],
  },
  i: {
    letter: "i",
    uppercase: "I",
    color: "#db8e2f",
    words: [
      { word: "ink", zh: "墨水", emoji: "🖋️" },
      { word: "insect", zh: "昆虫", emoji: "🐞" },
      { word: "igloo", zh: "冰屋", emoji: "🧊" },
      { word: "iguana", zh: "鬣蜥", emoji: "🦎" },
      { word: "itch", zh: "痒", emoji: "😣" },
      { word: "ill", zh: "生病的", emoji: "🤒" },
    ],
  },
  j: {
    letter: "j",
    uppercase: "J",
    color: "#557fbe",
    words: [
      { word: "jam", zh: "果酱", emoji: "🍓" },
      { word: "jet", zh: "喷气式飞机", emoji: "✈️" },
      { word: "juice", zh: "果汁", emoji: "🧃" },
      { word: "jacket", zh: "夹克", emoji: "🧥" },
      { word: "jelly", zh: "果冻", emoji: "🍮" },
      { word: "jump", zh: "跳", emoji: "🤸" },
    ],
  },
  k: {
    letter: "k",
    uppercase: "K",
    color: "#4c9974",
    words: [
      { word: "key", zh: "钥匙", emoji: "🔑" },
      { word: "king", zh: "国王", emoji: "👑" },
      { word: "kite", zh: "风筝", emoji: "🪁" },
      { word: "kitten", zh: "小猫", emoji: "🐱" },
      { word: "kangaroo", zh: "袋鼠", emoji: "🦘" },
      { word: "kitchen", zh: "厨房", emoji: "🍳" },
    ],
  },
  l: {
    letter: "l",
    uppercase: "L",
    color: "#a36da9",
    words: [
      { word: "lion", zh: "狮子", emoji: "🦁" },
      { word: "leg", zh: "腿", emoji: "🦵" },
      { word: "leaf", zh: "叶子", emoji: "🍃" },
      { word: "lamp", zh: "灯", emoji: "💡" },
      { word: "lemon", zh: "柠檬", emoji: "🍋" },
      { word: "lunch", zh: "午餐", emoji: "🍱" },
    ],
  },
  m: {
    letter: "m",
    uppercase: "M",
    color: "#e45d50",
    words: [
      { word: "moon", zh: "月亮", emoji: "🌙" },
      { word: "milk", zh: "牛奶", emoji: "🥛" },
      { word: "map", zh: "地图", emoji: "🗺️" },
      { word: "mouse", zh: "老鼠", emoji: "🐭" },
      { word: "mouth", zh: "嘴巴", emoji: "👄" },
      { word: "monkey", zh: "猴子", emoji: "🐒" },
    ],
  },
  n: {
    letter: "n",
    uppercase: "N",
    color: "#518c9e",
    words: [
      { word: "nose", zh: "鼻子", emoji: "👃" },
      { word: "nest", zh: "鸟巢", emoji: "🪺" },
      { word: "net", zh: "网", emoji: "🥅" },
      { word: "nut", zh: "坚果", emoji: "🥜" },
      { word: "nurse", zh: "护士", emoji: "👩‍⚕️" },
      { word: "night", zh: "夜晚", emoji: "🌙" },
    ],
  },
  o: {
    letter: "o",
    uppercase: "O",
    color: "#df8735",
    words: [
      { word: "octopus", zh: "章鱼", emoji: "🐙" },
      { word: "ox", zh: "公牛", emoji: "🐂" },
      { word: "otter", zh: "水獭", emoji: "🦦" },
      { word: "ostrich", zh: "鸵鸟", emoji: "🐦" },
      { word: "olive", zh: "橄榄", emoji: "🫒" },
      { word: "on", zh: "在上面", emoji: "🔛" },
    ],
  },
  p: {
    letter: "p",
    uppercase: "P",
    color: "#cc6672",
    words: [
      { word: "pig", zh: "猪", emoji: "🐷" },
      { word: "pen", zh: "笔", emoji: "🖊️" },
      { word: "pan", zh: "平底锅", emoji: "🍳" },
      { word: "pizza", zh: "披萨", emoji: "🍕" },
      { word: "panda", zh: "熊猫", emoji: "🐼" },
      { word: "park", zh: "公园", emoji: "🏞️" },
    ],
  },
  q: {
    letter: "q",
    uppercase: "Q",
    color: "#6578be",
    words: [
      { word: "queen", zh: "女王", emoji: "👸" },
      { word: "quilt", zh: "被子", emoji: "🧵" },
      { word: "question", zh: "问题", emoji: "❓" },
      { word: "quiet", zh: "安静的", emoji: "🤫" },
      { word: "quack", zh: "鸭叫声", emoji: "🦆" },
      { word: "quick", zh: "快的", emoji: "⚡" },
    ],
  },
  r: {
    letter: "r",
    uppercase: "R",
    color: "#bf6a95",
    words: [
      { word: "rabbit", zh: "兔子", emoji: "🐰" },
      { word: "rain", zh: "雨", emoji: "🌧️" },
      { word: "red", zh: "红色", emoji: "🔴" },
      { word: "ring", zh: "戒指", emoji: "💍" },
      { word: "robot", zh: "机器人", emoji: "🤖" },
      { word: "run", zh: "跑", emoji: "🏃" },
    ],
  },
  s: {
    letter: "s",
    uppercase: "S",
    color: "#4a9d72",
    words: [
      { word: "sun", zh: "太阳", emoji: "☀️" },
      { word: "sock", zh: "袜子", emoji: "🧦" },
      { word: "soap", zh: "肥皂", emoji: "🧼" },
      { word: "soup", zh: "汤", emoji: "🍲" },
      { word: "seal", zh: "海豹", emoji: "🦭" },
      { word: "sit", zh: "坐下", emoji: "🪑" },
    ],
  },
  t: {
    letter: "t",
    uppercase: "T",
    color: "#5d79d5",
    words: [
      { word: "tiger", zh: "老虎", emoji: "🐯" },
      { word: "tree", zh: "树", emoji: "🌳" },
      { word: "tomato", zh: "番茄", emoji: "🍅" },
      { word: "turtle", zh: "乌龟", emoji: "🐢" },
      { word: "train", zh: "火车", emoji: "🚆" },
      { word: "tent", zh: "帐篷", emoji: "⛺" },
    ],
  },
  u: {
    letter: "u",
    uppercase: "U",
    color: "#da8b32",
    words: [
      { word: "umbrella", zh: "雨伞", emoji: "☂️" },
      { word: "up", zh: "向上", emoji: "⬆️" },
      { word: "under", zh: "在下面", emoji: "⬇️" },
      { word: "uncle", zh: "叔叔", emoji: "👨" },
      { word: "unhappy", zh: "不开心的", emoji: "☹️" },
      { word: "umpire", zh: "裁判", emoji: "⚾" },
    ],
  },
  v: {
    letter: "v",
    uppercase: "V",
    color: "#8a70ae",
    words: [
      { word: "van", zh: "面包车", emoji: "🚐" },
      { word: "vase", zh: "花瓶", emoji: "🏺" },
      { word: "vest", zh: "背心", emoji: "🦺" },
      { word: "violin", zh: "小提琴", emoji: "🎻" },
      { word: "vegetable", zh: "蔬菜", emoji: "🥕" },
      { word: "vacuum", zh: "吸尘器", emoji: "🧹" },
    ],
  },
  w: {
    letter: "w",
    uppercase: "W",
    color: "#4f929b",
    words: [
      { word: "water", zh: "水", emoji: "💧" },
      { word: "watch", zh: "手表", emoji: "⌚" },
      { word: "window", zh: "窗户", emoji: "🪟" },
      { word: "wolf", zh: "狼", emoji: "🐺" },
      { word: "web", zh: "蜘蛛网", emoji: "🕸️" },
      { word: "walk", zh: "走路", emoji: "🚶" },
    ],
  },
  x: {
    letter: "x",
    uppercase: "X",
    color: "#c66d76",
    words: [
      { word: "box", zh: "盒子", emoji: "📦" },
      { word: "fox", zh: "狐狸", emoji: "🦊" },
      { word: "six", zh: "六", emoji: "6️⃣" },
      { word: "taxi", zh: "出租车", emoji: "🚕" },
      { word: "x-ray", zh: "X光", emoji: "🩻" },
      { word: "wax", zh: "蜡", emoji: "🕯️" },
    ],
  },
  y: {
    letter: "y",
    uppercase: "Y",
    color: "#cb8634",
    words: [
      { word: "yellow", zh: "黄色", emoji: "💛" },
      { word: "yak", zh: "牦牛", emoji: "🐂" },
      { word: "yo-yo", zh: "悠悠球", emoji: "🪀" },
      { word: "yogurt", zh: "酸奶", emoji: "🥣" },
      { word: "yarn", zh: "毛线", emoji: "🧶" },
      { word: "yes", zh: "是的", emoji: "✅" },
    ],
  },
  z: {
    letter: "z",
    uppercase: "Z",
    color: "#5b916b",
    words: [
      { word: "zebra", zh: "斑马", emoji: "🦓" },
      { word: "zoo", zh: "动物园", emoji: "🦒" },
      { word: "zip", zh: "拉上拉链", emoji: "🤐" },
      { word: "zero", zh: "零", emoji: "0️⃣" },
      { word: "zigzag", zh: "之字形", emoji: "⚡" },
      { word: "zipper", zh: "拉链", emoji: "🧥" },
    ],
  },
};

const AVAILABLE_LETTERS = Object.keys(LESSONS) as LetterKey[];
const ASSET_BASE = import.meta.env.BASE_URL;
const AUDIO_VERSION = "4";
const assetPath = (path: string) =>
  `${ASSET_BASE}${path.replace(/^\/+/, "")}`;
const audioPath = (path: string) => `${assetPath(path)}?v=${AUDIO_VERSION}`;
const BLEND_WORDS = [
  { word: "at", zh: "在；向", emoji: "📍" },
  { word: "mat", zh: "垫子", emoji: "🟫" },
  { word: "sat", zh: "坐下了", emoji: "🪑" },
  { word: "sit", zh: "坐", emoji: "🪑" },
  { word: "pin", zh: "别针", emoji: "📌" },
  { word: "pan", zh: "平底锅", emoji: "🍳" },
  { word: "tap", zh: "水龙头", emoji: "🚰" },
  { word: "nap", zh: "小睡", emoji: "😴" },
  { word: "cat", zh: "猫", emoji: "🐱" },
  { word: "can", zh: "罐头", emoji: "🥫" },
];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function HighlightedWord({
  word,
  letter,
}: {
  word: string;
  letter: string;
}) {
  const target = letter.toLowerCase() === "q" ? "qu" : letter.toLowerCase();
  const index = word.toLowerCase().indexOf(target);
  if (index < 0) return <>{word}</>;

  return (
    <>
      {word.slice(0, index)}
      <span className="target-letter">
        {word.slice(index, index + target.length)}
      </span>
      {word.slice(index + target.length)}
    </>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedLetter, setSelectedLetter] = useState<LetterKey>("m");
  const [wordIndex, setWordIndex] = useState(0);
  const [visitedLetters, setVisitedLetters] = useState<LetterKey[]>([]);
  const [practiceTarget, setPracticeTarget] = useState(0);
  const [practiceChoices, setPracticeChoices] = useState<number[]>([0, 1, 2]);
  const [practiceMessage, setPracticeMessage] = useState("");
  const [mixedTarget, setMixedTarget] = useState<LetterKey>("m");
  const [mixedChoices, setMixedChoices] = useState<LetterKey[]>(["m", "s"]);
  const [mixedMessage, setMixedMessage] = useState("");
  const [repeatPrompt, setRepeatPrompt] = useState(false);
  const [blendIndex, setBlendIndex] = useState(1);
  const [blendActive, setBlendActive] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blendTimers = useRef<number[]>([]);

  const lesson = LESSONS[selectedLetter];
  const currentWord = lesson.words[wordIndex];
  const availableBlendIndices = BLEND_WORDS.map((item, index) => ({
    index,
    letters: [...new Set(item.word.split(""))] as LetterKey[],
  }))
    .filter(({ letters }) =>
      letters.every((letter) => visitedLetters.includes(letter)),
    )
    .map(({ index }) => index);
  const canBlend = availableBlendIndices.length > 0;

  const playFile = (
    src: string,
    fallbackText: string,
    onEnded?: () => void,
  ) => {
    audioRef.current?.pause();
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onended = () => onEnded?.();
    audio.onerror = () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(fallbackText);
        utterance.lang = "en-GB";
        utterance.rate = 0.82;
        utterance.onend = () => onEnded?.();
        window.speechSynthesis.speak(utterance);
      }
    };
    void audio.play();
  };

  const markLetterHeard = (letter: LetterKey) => {
    setVisitedLetters((previous) => {
      if (previous.includes(letter)) return previous;

      const next = [...previous, letter];
      localStorage.setItem("phonics-visited", JSON.stringify(next));
      return next;
    });
  };

  const playLetterSound = (letter = selectedLetter, onEnded?: () => void) => {
    markLetterHeard(letter);
    playFile(audioPath(`audio/letters/${letter}.mp3`), letter, onEnded);
  };

  const playWord = (word = currentWord.word, onEnded?: () => void) => {
    playFile(audioPath(`audio/words/${word}.mp3`), word, onEnded);
  };

  const openLesson = (letter: LetterKey) => {
    setSelectedLetter(letter);
    setWordIndex(0);
    setRepeatPrompt(false);
    setScreen("lesson");
    window.setTimeout(() => playLetterSound(letter), 180);
  };

  const startPractice = () => {
    const target = Math.floor(Math.random() * lesson.words.length);
    const others = shuffle(
      lesson.words.map((_, index) => index).filter((index) => index !== target),
    ).slice(0, 2);
    setPracticeTarget(target);
    setPracticeChoices(shuffle([target, ...others]));
    setPracticeMessage("");
    setScreen("practice");
    window.setTimeout(() => playWord(lesson.words[target].word), 180);
  };

  const prepareMixedRound = (exclude?: LetterKey) => {
    const learned = visitedLetters.filter((letter) =>
      AVAILABLE_LETTERS.includes(letter),
    );
    const pool = learned.length >= 2 ? learned : AVAILABLE_LETTERS;
    const possibleTargets = pool.filter((letter) => letter !== exclude);
    const target = shuffle(
      possibleTargets.length > 0 ? possibleTargets : pool,
    )[0];
    const choices = shuffle(
      pool.length >= 3
        ? [target, ...shuffle(pool.filter((letter) => letter !== target)).slice(0, 2)]
        : pool,
    );
    setMixedTarget(target);
    setMixedChoices(choices);
    setMixedMessage("");
    window.setTimeout(() => playLetterSound(target), 180);
  };

  const startMixedPractice = () => {
    prepareMixedRound();
    setScreen("mixed");
  };

  const chooseMixedLetter = (choice: LetterKey) => {
    if (choice === mixedTarget) {
      setMixedMessage("听出来了！");
      playLetterSound(choice, () =>
        window.setTimeout(() => prepareMixedRound(mixedTarget), 550),
      );
      return;
    }

    setMixedMessage("再听一听");
    playLetterSound(choice, () =>
      window.setTimeout(() => playLetterSound(mixedTarget), 260),
    );
  };

  const nextPractice = () => {
    const candidates = lesson.words
      .map((_, index) => index)
      .filter((index) => index !== practiceTarget);
    const nextTarget = shuffle(candidates)[0];
    const others = shuffle(
      lesson.words
        .map((_, index) => index)
        .filter((index) => index !== nextTarget),
    ).slice(0, 2);
    setPracticeTarget(nextTarget);
    setPracticeChoices(shuffle([nextTarget, ...others]));
    setPracticeMessage("");
    window.setTimeout(() => playWord(lesson.words[nextTarget].word), 150);
  };

  const choosePractice = (choice: number) => {
    const chosen = lesson.words[choice];
    if (choice === practiceTarget) {
      setPracticeMessage("找到了！");
      playWord(chosen.word, () => window.setTimeout(nextPractice, 550));
      return;
    }

    setPracticeMessage("再听一听");
    playWord(chosen.word, () =>
      window.setTimeout(
        () => playWord(lesson.words[practiceTarget].word),
        250,
      ),
    );
  };

  const playRepeat = () => {
    setRepeatPrompt(false);
    playLetterSound(selectedLetter, () => {
      window.setTimeout(
        () =>
          playWord(currentWord.word, () => {
            setRepeatPrompt(true);
            window.setTimeout(() => setRepeatPrompt(false), 2200);
          }),
        380,
      );
    });
  };

  const playBlend = () => {
    blendTimers.current.forEach((timer) => window.clearTimeout(timer));
    blendTimers.current = [];
    const blend = BLEND_WORDS[blendIndex];

    blend.word.split("").forEach((letter, index) => {
      const start = index * 900;
      blendTimers.current.push(
        window.setTimeout(() => {
          setBlendActive(index);
          playFile(audioPath(`audio/letters/${letter}.mp3`), letter);
        }, start),
      );
    });

    blendTimers.current.push(
      window.setTimeout(() => {
        setBlendActive(null);
        playFile(audioPath(`audio/words/${blend.word}.mp3`), blend.word);
      }, blend.word.length * 900 + 180),
    );
  };

  useEffect(() => {
    const stored = localStorage.getItem("phonics-visited");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LetterKey[];
        setVisitedLetters(
          parsed.filter((letter) => AVAILABLE_LETTERS.includes(letter)),
        );
      } catch {
        localStorage.removeItem("phonics-visited");
      }
    }

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker
        .register(assetPath("sw.js"))
        .catch(() => undefined);
    }

    return () => {
      audioRef.current?.pause();
      blendTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const progressText = useMemo(
    () => `${wordIndex + 1} / ${lesson.words.length}`,
    [lesson.words.length, wordIndex],
  );

  if (screen === "home") {
    return (
      <main className="app-shell home-screen">
        <header className="home-header">
          <div className="eyebrow">MY LITTLE PHONICS</div>
          <h1>点一个字母，听听它的声音</h1>
          <p>一次只学一个。想听几次都可以。</p>
        </header>

        <section className="alphabet-grid" aria-label="英文字母">
          {ALPHABET.map((letter) => {
            const isAvailable = AVAILABLE_LETTERS.includes(letter as LetterKey);
            const isVisited = visitedLetters.includes(letter as LetterKey);
            return (
              <button
                className={`letter-tile ${isAvailable ? "is-ready" : ""}`}
                disabled={!isAvailable}
                key={letter}
                onClick={() => openLesson(letter as LetterKey)}
                aria-label={
                  isAvailable
                    ? `学习字母 ${letter}`
                    : `字母 ${letter}，内容尚未准备`
                }
              >
                <span>{letter}</span>
                {isVisited && <i aria-hidden="true" />}
              </button>
            );
          })}
        </section>

        <footer className="home-footer">
          <span>26 个字母都可以自由选择</span>
          <small>
            <i aria-hidden="true" />
            小圆点表示在这台设备上听过
          </small>
        </footer>

        <button
          className="mixed-entry"
          onClick={startMixedPractice}
          disabled={visitedLetters.length < 2}
        >
          <span aria-hidden="true">🔊</span>
          <span>
            <b>听声音，找字母</b>
            <small>
              {visitedLetters.length < 2
                ? "先听过两个字母音，它就会出现"
                : "把学过的声音放在一起听"}
            </small>
          </span>
          <i aria-hidden="true">→</i>
        </button>
      </main>
    );
  }

  if (screen === "mixed") {
    return (
      <main className="app-shell activity-screen">
        <nav className="top-nav">
          <button className="text-button" onClick={() => setScreen("home")}>
            ← 字母
          </button>
          <span className="activity-kicker">听声音，找字母</span>
          <span className="nav-spacer" />
        </nav>

        <section className="mixed-panel">
          <h2>哪个字母发这个声音？</h2>
          <button
            className="listen-orb"
            onClick={() => playLetterSound(mixedTarget)}
            aria-label="再听一次字母音"
          >
            <span aria-hidden="true">🔊</span>
            <small>再听一次</small>
          </button>

          <div className="mixed-letter-choices">
            {mixedChoices.map((letter) => (
              <button
                key={letter}
                onClick={() => chooseMixedLetter(letter)}
                aria-label={`选择字母 ${letter}`}
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="practice-message" aria-live="polite">
            {mixedMessage || "位置每次都会变"}
          </div>
        </section>
      </main>
    );
  }

  if (screen === "practice") {
    return (
      <main className="app-shell activity-screen">
        <nav className="top-nav">
          <button className="text-button" onClick={() => setScreen("lesson")}>
            ← 返回
          </button>
          <span className="activity-kicker">听一听</span>
          <span className="nav-spacer" />
        </nav>

        <section className="practice-panel">
          <h2>你听到了哪一个？</h2>
          <button
            className="listen-orb"
            onClick={() => playWord(lesson.words[practiceTarget].word)}
            aria-label="再听一次单词"
          >
            <span aria-hidden="true">🔊</span>
            <small>再听一次</small>
          </button>

          <div className="picture-choices">
            {practiceChoices.map((choice) => {
              const item = lesson.words[choice];
              return (
                <button
                  className="picture-choice"
                  key={item.word}
                  onClick={() => choosePractice(choice)}
                  aria-label={`选择${item.zh}`}
                >
                  <span aria-hidden="true">{item.emoji}</span>
                </button>
              );
            })}
          </div>
          <div className="practice-message" aria-live="polite">
            {practiceMessage || "可以反复听，不着急"}
          </div>
        </section>
      </main>
    );
  }

  if (screen === "blend") {
    const blend = BLEND_WORDS[blendIndex];
    return (
      <main className="app-shell activity-screen">
        <nav className="top-nav">
          <button className="text-button" onClick={() => setScreen("home")}>
            ← 字母
          </button>
          <span className="activity-kicker">尝试拼起来</span>
          <span className="nav-spacer" />
        </nav>

        <section className="blend-panel">
          <div className="blend-emoji" aria-hidden="true">
            {blend.emoji}
          </div>
          <div className="blend-letters" aria-label={blend.word}>
            {blend.word.split("").map((letter, index) => (
              <button
                key={`${letter}-${index}`}
                className={blendActive === index ? "is-speaking" : ""}
                onClick={() =>
                  playFile(audioPath(`audio/letters/${letter}.mp3`), letter)
                }
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="blend-arrow" aria-hidden="true">
            ↓
          </div>
          <button
            className="whole-word"
            onClick={() => playWord(blend.word)}
          >
            {blend.word}
          </button>
          <div className="word-translation">{blend.zh}</div>
          <button className="primary-action" onClick={playBlend}>
            <span aria-hidden="true">🔊</span>
            听它们拼起来
          </button>
          <div className="blend-picker" aria-label="选择拼读词">
            {availableBlendIndices.map((index) => {
              const item = BLEND_WORDS[index];
              return (
                <button
                  key={item.word}
                  className={blendIndex === index ? "is-current" : ""}
                  onClick={() => setBlendIndex(index)}
                >
                  {item.word}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className="app-shell lesson-screen"
      style={{ "--lesson-color": lesson.color } as React.CSSProperties}
    >
      <nav className="top-nav">
        <button className="text-button" onClick={() => setScreen("home")}>
          ← 字母
        </button>
        <span className="word-progress">{progressText}</span>
        <button className="text-button" onClick={startPractice}>
          听一听
        </button>
      </nav>

      <section className="lesson-panel">
        <button
          className="letter-sound"
          onClick={() => playLetterSound()}
          aria-label={`播放字母 ${selectedLetter} 的自然拼读音`}
        >
          <span className="uppercase">{lesson.uppercase}</span>
          <span className="case-divider" aria-hidden="true" />
          <span className="lowercase">{lesson.letter}</span>
          <i aria-hidden="true">🔊</i>
        </button>

        <button
          className="word-card"
          onClick={() => playWord()}
          aria-label={`播放单词 ${currentWord.word}`}
        >
          <span className="word-emoji" aria-hidden="true">
            {currentWord.emoji}
          </span>
          <span className="english-word">
            <HighlightedWord
              word={currentWord.word}
              letter={selectedLetter}
            />
          </span>
          <span className="chinese-word">{currentWord.zh}</span>
          <span className="tap-hint">
            <b aria-hidden="true">🔊</b> 点一下听单词
          </span>
        </button>

        <div className="lesson-actions">
          <button
            className="round-arrow"
            onClick={() =>
              setWordIndex(
                (wordIndex - 1 + lesson.words.length) % lesson.words.length,
              )
            }
            aria-label="上一个单词"
          >
            ←
          </button>
          <button className="repeat-action" onClick={playRepeat}>
            <span aria-hidden="true">↻</span>
            跟着读
          </button>
          <button
            className="round-arrow"
            onClick={() =>
              setWordIndex((wordIndex + 1) % lesson.words.length)
            }
            aria-label="下一个单词"
          >
            →
          </button>
        </div>

        <div className="repeat-prompt" aria-live="polite">
          {repeatPrompt ? "轮到你啦" : "\u00A0"}
        </div>

        <div className="lesson-footer-actions">
          <button className="quiet-action" onClick={startPractice}>
            听单词，找图片
          </button>
          <button
            className="quiet-action"
            onClick={() => {
              setBlendIndex(availableBlendIndices[0] ?? 0);
              setScreen("blend");
            }}
            disabled={!canBlend}
          >
            {canBlend ? "尝试拼起来" : "先听过 a 和 t，就能拼 at"}
          </button>
        </div>
      </section>
    </main>
  );
}

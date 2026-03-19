// ==================== Solo Lifemax — App Logic ====================

(() => {
  "use strict";

  // ---- Language Detection ----
  const LANG = (navigator.language || "fr").slice(0, 2) === "fr" ? "fr" : "en";

  // ---- i18n ----
  const I18N = {
    en: {
      level: "LEVEL",
      dashboard: "Dashboard",
      quests: "Quests",
      yourStats: "Your Stats",
      statsSubtitle: "Track your real-life progression",
      xpProgress: "XP Progress",
      todayProgress: "Today's Progress",
      questsCompleted: "Quests completed",
      remixesUsed: "Remixes used",
      dailyQuests: "Daily Quests",
      questsHint: "Complete all quests to maximize your stats.",
      validate: "Validate",
      remix: "Remix",
      completed: "Completed",
      allDoneTitle: "All Quests Completed!",
      allDoneText: "Great work today. Rest and come back tomorrow for new quests.",
      toastRemixed: "Quest remixed!",
      toastLevelUp: (lvl) => `Level Up! You're now level ${lvl}!`,
      toastComplete: (xp) => `Quest complete! +${xp} XP`,
      toastTrollFreeReroll: "Troll quest! Free reroll granted.",
      bonusUnlocked: "Bonus quests unlocked!",
      bonusTitle: "Bonus Quests",
      bonusSubtitle: "You completed all quests. Here are 2 secret challenges!",
      trollTag: "TROLL",
      bonusTag: "BONUS",
      freeReroll: "Free Reroll",
      energy: "Energy",
      discipline: "Discipline",
      health: "Health",
      focus: "Focus",
      happiness: "Happiness",
    },
    fr: {
      level: "NIVEAU",
      dashboard: "Tableau de bord",
      quests: "Quêtes",
      yourStats: "Tes Stats",
      statsSubtitle: "Suis ta progression dans la vraie vie",
      xpProgress: "Progression XP",
      todayProgress: "Progrès du jour",
      questsCompleted: "Quêtes terminées",
      remixesUsed: "Remix utilisés",
      dailyQuests: "Quêtes du jour",
      questsHint: "Termine toutes les quêtes pour maximiser tes stats.",
      validate: "Valider",
      remix: "Remix",
      completed: "Terminée",
      allDoneTitle: "Toutes les quêtes terminées !",
      allDoneText: "Bien joué aujourd'hui. Reviens demain pour de nouvelles quêtes.",
      toastRemixed: "Quête remixée !",
      toastLevelUp: (lvl) => `Niveau supérieur ! Tu es maintenant niveau ${lvl} !`,
      toastComplete: (xp) => `Quête terminée ! +${xp} XP`,
      toastTrollFreeReroll: "Quête troll ! Reroll gratuit offert.",
      bonusUnlocked: "Quêtes bonus débloquées !",
      bonusTitle: "Quêtes Bonus",
      bonusSubtitle: "Tu as tout terminé. Voici 2 défis secrets !",
      trollTag: "TROLL",
      bonusTag: "BONUS",
      freeReroll: "Reroll gratuit",
      energy: "Énergie",
      discipline: "Discipline",
      health: "Santé",
      focus: "Concentration",
      happiness: "Bonheur",
    },
  };

  function t(key) { return I18N[LANG][key]; }

  // ---- Constants ----
  const STATS_CONFIG = [
    { key: "energy",     nameKey: "energy",     icon: "⚡", color: "var(--energy-color)" },
    { key: "discipline", nameKey: "discipline", icon: "🔥", color: "var(--discipline-color)" },
    { key: "health",     nameKey: "health",     icon: "💚", color: "var(--health-color)" },
    { key: "focus",      nameKey: "focus",      icon: "🎯", color: "var(--focus-color)" },
    { key: "happiness",  nameKey: "happiness",  icon: "✨", color: "var(--happiness-color)" },
  ];

  const QUEST_POOL = [
    { title: { en: "Morning Stretch",       fr: "Étirement matinal" },        desc: { en: "Do a 10-minute stretch routine after waking up.",               fr: "Fais une routine d'étirements de 10 min au réveil." },             rewards: { health: 3, energy: 2 } },
    { title: { en: "Read 20 Pages",         fr: "Lire 20 pages" },            desc: { en: "Read at least 20 pages of a book you're currently reading.",    fr: "Lis au moins 20 pages du livre que tu lis en ce moment." },        rewards: { focus: 3, discipline: 2 } },
    { title: { en: "Hydration Check",       fr: "Hydratation" },              desc: { en: "Drink at least 2 liters of water throughout the day.",          fr: "Bois au moins 2 litres d'eau dans la journée." },                  rewards: { health: 3, energy: 1 } },
    { title: { en: "No Social Media",       fr: "Zéro réseaux sociaux" },     desc: { en: "Avoid social media for at least 4 hours straight.",             fr: "Évite les réseaux sociaux pendant au moins 4h d'affilée." },       rewards: { focus: 4, discipline: 2 } },
    { title: { en: "Walk 30 Minutes",       fr: "Marche 30 minutes" },        desc: { en: "Take a 30-minute walk outside, no phone allowed.",              fr: "Fais une marche de 30 min dehors, sans téléphone." },              rewards: { health: 2, happiness: 3, energy: 1 } },
    { title: { en: "Journal Entry",         fr: "Écrire dans son journal" },  desc: { en: "Write at least half a page in your journal about your day.",    fr: "Écris au moins une demi-page dans ton journal sur ta journée." },  rewards: { happiness: 3, focus: 1 } },
    { title: { en: "Cook a Healthy Meal",   fr: "Cuisiner un repas sain" },   desc: { en: "Prepare a balanced, home-cooked meal from scratch.",            fr: "Prépare un repas équilibré et fait maison." },                     rewards: { health: 4, happiness: 1 } },
    { title: { en: "Meditate 10 Minutes",   fr: "Méditer 10 minutes" },       desc: { en: "Sit quietly and meditate for 10 minutes without distractions.",fr: "Assieds-toi et médite 10 min sans distraction." },                 rewards: { focus: 3, happiness: 2, energy: 1 } },
    { title: { en: "Cold Shower",           fr: "Douche froide" },            desc: { en: "Take a cold shower for at least 2 minutes.",                    fr: "Prends une douche froide d'au moins 2 minutes." },                 rewards: { discipline: 4, energy: 2 } },
    { title: { en: "Tidy Your Space",       fr: "Ranger ton espace" },        desc: { en: "Spend 15 minutes cleaning and organizing your room or desk.",   fr: "Passe 15 min à ranger et organiser ta chambre ou ton bureau." },   rewards: { discipline: 2, happiness: 2, focus: 1 } },
    { title: { en: "Practice a Skill",      fr: "Pratiquer une compétence" }, desc: { en: "Spend 30 minutes practicing a skill you're trying to learn.",  fr: "Passe 30 min à pratiquer une compétence que tu apprends." },       rewards: { focus: 3, discipline: 3 } },
    { title: { en: "No Junk Food",          fr: "Zéro malbouffe" },           desc: { en: "Avoid all junk food and processed snacks today.",               fr: "Évite toute la malbouffe et les snacks transformés aujourd'hui." },rewards: { health: 4, discipline: 2 } },
    { title: { en: "Express Gratitude",     fr: "Exprimer sa gratitude" },    desc: { en: "Write down 3 things you're grateful for today.",                fr: "Note 3 choses pour lesquelles tu es reconnaissant aujourd'hui." }, rewards: { happiness: 4, focus: 1 } },
    { title: { en: "Plan Tomorrow",         fr: "Planifier demain" },         desc: { en: "Write a clear plan for tomorrow before going to bed.",          fr: "Écris un plan clair pour demain avant de te coucher." },           rewards: { discipline: 3, focus: 2 } },
    { title: { en: "Power Workout",         fr: "Séance de sport" },          desc: { en: "Complete a 20-minute bodyweight workout session.",               fr: "Fais une séance de 20 min d'exercices au poids du corps." },       rewards: { health: 3, energy: 3, discipline: 1 } },
    { title: { en: "Screen-Free Hour",      fr: "1h sans écran" },            desc: { en: "Spend one full hour without any screen whatsoever.",             fr: "Passe une heure entière sans aucun écran." },                      rewards: { focus: 3, happiness: 2 } },
    { title: { en: "Deep Work Session",     fr: "Session de deep work" },     desc: { en: "Do 45 minutes of uninterrupted, focused work on a project.",   fr: "Fais 45 min de travail concentré et ininterrompu." },              rewards: { focus: 4, discipline: 3 } },
    { title: { en: "Connect With Someone",  fr: "Parler à quelqu'un" },       desc: { en: "Have a meaningful conversation with a friend or family.",       fr: "Aie une conversation sincère avec un proche." },                   rewards: { happiness: 4, energy: 1 } },
    { title: { en: "Learn Something New",   fr: "Apprendre quelque chose" },  desc: { en: "Watch an educational video or read an article on a new topic.", fr: "Regarde une vidéo éducative ou lis un article sur un nouveau sujet." }, rewards: { focus: 2, happiness: 2, discipline: 1 } },
    { title: { en: "Early Wake-Up",         fr: "Réveil matinal" },           desc: { en: "Wake up at least 1 hour earlier than usual.",                   fr: "Réveille-toi au moins 1h plus tôt que d'habitude." },              rewards: { discipline: 4, energy: 2 } },
    { title: { en: "Digital Declutter",     fr: "Tri numérique" },            desc: { en: "Delete 20 unused apps, files, or old emails.",                  fr: "Supprime 20 applis, fichiers ou vieux emails inutilisés." },       rewards: { focus: 2, discipline: 2, happiness: 1 } },
    { title: { en: "Posture Check",         fr: "Vérifier sa posture" },      desc: { en: "Set 5 posture reminders and correct yourself each time.",       fr: "Mets 5 rappels de posture et corrige-toi à chaque fois." },        rewards: { health: 3, discipline: 1 } },
    { title: { en: "Creative Break",        fr: "Pause créative" },           desc: { en: "Spend 20 minutes drawing, writing, or making music.",           fr: "Passe 20 min à dessiner, écrire ou faire de la musique." },        rewards: { happiness: 3, focus: 2 } },
    { title: { en: "Sleep by 11 PM",        fr: "Couché avant 23h" },         desc: { en: "Get into bed by 11 PM with no screens.",                        fr: "Sois au lit avant 23h, sans écran." },                             rewards: { health: 3, energy: 3 } },
    { title: { en: "Breathing Exercise",    fr: "Exercice de respiration" },  desc: { en: "Do a 5-minute box-breathing or deep-breathing exercise.",       fr: "Fais un exercice de respiration profonde de 5 minutes." },         rewards: { focus: 2, energy: 2, happiness: 1 } },
    // ---- Fun quests ----
    { title: { en: "Dance Like Nobody's Watching", fr: "Danse comme si personne ne regardait" }, desc: { en: "Put on your favorite song and dance for 5 minutes straight.",  fr: "Mets ta musique préférée et danse pendant 5 min d'affilée." },  rewards: { happiness: 4, energy: 2 } },
    { title: { en: "Compliment a Stranger",   fr: "Complimente un inconnu" },    desc: { en: "Give a genuine compliment to someone you don't know.",          fr: "Fais un compliment sincère à quelqu'un que tu ne connais pas." }, rewards: { happiness: 3, discipline: 2 } },
    { title: { en: "Smile at 10 People",      fr: "Souris à 10 personnes" },     desc: { en: "Make eye contact and smile at 10 different people today.",       fr: "Regarde et souris à 10 personnes différentes aujourd'hui." },     rewards: { happiness: 3, energy: 1 } },
    { title: { en: "Try a New Food",           fr: "Goûte un nouvel aliment" },   desc: { en: "Eat something you've never tried before today.",                fr: "Mange quelque chose que tu n'as encore jamais goûté." },          rewards: { happiness: 2, health: 2, discipline: 1 } },
    { title: { en: "Sing in the Shower",       fr: "Chante sous la douche" },     desc: { en: "Belt out at least 2 full songs in the shower.",                 fr: "Chante au moins 2 chansons en entier sous la douche." },          rewards: { happiness: 3, energy: 2 } },
    { title: { en: "Take a Selfie With a Tree", fr: "Selfie avec un arbre" },     desc: { en: "Go outside, find a cool tree, and take a selfie with it.",      fr: "Sors, trouve un bel arbre et prends un selfie avec." },           rewards: { happiness: 2, health: 1, energy: 1 } },
    { title: { en: "Left Hand Challenge",      fr: "Défi main gauche" },          desc: { en: "Use your non-dominant hand for everything for 1 hour.",         fr: "Utilise ta main non dominante pour tout pendant 1 heure." },       rewards: { focus: 3, discipline: 2 } },
    { title: { en: "Write a Haiku",            fr: "Écris un haïku" },            desc: { en: "Write a haiku about your current mood (5-7-5 syllables).",      fr: "Écris un haïku sur ton humeur actuelle (5-7-5 syllabes)." },      rewards: { happiness: 2, focus: 2, discipline: 1 } },
    // ---- Troll quests (free reroll) ----
    { title: { en: "Talk to Your Plant",       fr: "Parle à ta plante" },         desc: { en: "Have a 5-minute motivational speech with a houseplant.",         fr: "Fais un discours motivant de 5 min à une plante d'intérieur." },  rewards: { happiness: 5 }, troll: true },
    { title: { en: "Walk Backwards",           fr: "Marche à reculons" },         desc: { en: "Walk backwards for at least 100 steps in your apartment.",      fr: "Fais au moins 100 pas à reculons dans ton appart." },             rewards: { energy: 3, happiness: 3 }, troll: true },
    { title: { en: "Stare at a Wall",          fr: "Fixe un mur" },               desc: { en: "Stare at a blank wall for 5 minutes. No phone. Think.",         fr: "Fixe un mur vide pendant 5 min. Sans tel. Réfléchis." },          rewards: { focus: 4, discipline: 2 }, troll: true },
    { title: { en: "Narrate Your Life",        fr: "Narre ta vie" },              desc: { en: "Narrate everything you do out loud for 10 minutes.",            fr: "Commente à voix haute tout ce que tu fais pendant 10 min." },      rewards: { happiness: 4, focus: 1 }, troll: true },
    { title: { en: "Eat With Chopsticks",      fr: "Mange avec des baguettes" },  desc: { en: "Eat your next meal entirely with chopsticks. Even soup.",       fr: "Mange ton prochain repas entièrement avec des baguettes. Même la soupe." }, rewards: { discipline: 3, happiness: 3 }, troll: true },
    { title: { en: "Stand on One Leg",         fr: "Tiens sur une jambe" },        desc: { en: "Stand on one leg for 2 minutes without holding anything.",      fr: "Tiens-toi sur une jambe pendant 2 min sans rien tenir." },         rewards: { health: 2, focus: 3, discipline: 1 }, troll: true },
    { title: { en: "Compliment Yourself",      fr: "Complimente-toi" },           desc: { en: "Look in a mirror and give yourself 5 genuine compliments.",     fr: "Regarde-toi dans un miroir et fais-toi 5 vrais compliments." },   rewards: { happiness: 5 }, troll: true },
    { title: { en: "Invent a Word",            fr: "Invente un mot" },            desc: { en: "Create a new word, define it, and use it 3 times today.",       fr: "Invente un nouveau mot, définis-le et utilise-le 3 fois aujourd'hui." }, rewards: { happiness: 3, focus: 2 }, troll: true },
    { title: { en: "Speed Clean Boss Mode",    fr: "Ménage mode boss" },          desc: { en: "Set a 3-minute timer and clean as fast as humanly possible.",   fr: "Mets un chrono de 3 min et nettoie aussi vite que possible." },    rewards: { discipline: 3, energy: 2, happiness: 1 }, troll: true },
    { title: { en: "Dramatic Reading",         fr: "Lecture dramatique" },         desc: { en: "Read a random text message out loud like a Shakespeare play.",  fr: "Lis un SMS random à voix haute comme du Shakespeare." },           rewards: { happiness: 4, focus: 1 }, troll: true },
  ];

  // ---- Bonus wacky quest pool (unlocked after completing all daily quests) ----
  const BONUS_POOL = [
    { title: { en: "Moonwalk to the Fridge",   fr: "Moonwalk jusqu'au frigo" },   desc: { en: "Do the moonwalk every time you go to the fridge today.",         fr: "Fais le moonwalk à chaque fois que tu vas au frigo aujourd'hui." }, rewards: { happiness: 5, energy: 1 } },
    { title: { en: "Make Your Bed… With Style", fr: "Fais ton lit… avec style" },  desc: { en: "Make your bed but narrate it like a cooking show.",              fr: "Fais ton lit mais commente-le comme une émission de cuisine." },   rewards: { happiness: 4, discipline: 2 } },
    { title: { en: "Air Guitar Solo",          fr: "Solo de air guitar" },         desc: { en: "Perform a 2-minute air guitar solo with full commitment.",       fr: "Fais un solo de air guitar de 2 min avec conviction totale." },    rewards: { happiness: 5, energy: 2 } },
    { title: { en: "Draw With Your Eyes Closed", fr: "Dessine les yeux fermés" },  desc: { en: "Draw a self-portrait with your eyes closed. Frame it.",          fr: "Dessine ton autoportrait les yeux fermés. Encadre-le." },          rewards: { happiness: 3, focus: 3 } },
    { title: { en: "Talk Like a Pirate",       fr: "Parle comme un pirate" },      desc: { en: "Speak in pirate voice for the next 30 minutes.",                 fr: "Parle en voix de pirate pendant les 30 prochaines minutes." },     rewards: { happiness: 5, discipline: 1 } },
    { title: { en: "Give Your Socks Names",    fr: "Nomme tes chaussettes" },      desc: { en: "Name every pair of socks you own. Create a census.",             fr: "Donne un nom à chaque paire de chaussettes. Fais un recensement." }, rewards: { happiness: 4, focus: 2 } },
    { title: { en: "Invent a Conspiracy",      fr: "Invente un complot" },         desc: { en: "Write a 5-line absurd conspiracy theory and read it aloud.",     fr: "Écris une théorie du complot absurde en 5 lignes et lis-la à voix haute." }, rewards: { happiness: 4, focus: 2 } },
    { title: { en: "Speed Run a Sandwich",     fr: "Sandwich en speed run" },      desc: { en: "Time yourself making a sandwich as fast as possible. Beat it.",  fr: "Chronomètre-toi en faisant un sandwich le plus vite possible. Bats ton record." }, rewards: { energy: 2, discipline: 2, happiness: 2 } },
    { title: { en: "Dramatic Water Drinking",  fr: "Bois de l'eau dramatiquement" }, desc: { en: "Drink a glass of water in the most dramatic way possible.",     fr: "Bois un verre d'eau de la manière la plus dramatique possible." }, rewards: { happiness: 5, health: 1 } },
    { title: { en: "Superhero Landing",        fr: "Atterrissage de super-héros" }, desc: { en: "Do 3 superhero landings in your living room. Full commitment.", fr: "Fais 3 atterrissages de super-héros dans ton salon. Donne tout." }, rewards: { happiness: 4, energy: 2, health: 1 } },
  ];

  const QUESTS_PER_DAY = 5;
  const MAX_STAT = 100;
  const XP_PER_LEVEL = 100;
  const MAX_REMIXES = 1;

  // ---- Helpers ----
  function todayKey() {
    return new Date().toISOString().split("T")[0];
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    const locale = LANG === "fr" ? "fr-FR" : "en-US";
    return d.toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric" });
  }

  function questTitle(q) { return typeof q.title === "object" ? q.title[LANG] : q.title; }
  function questDesc(q)  { return typeof q.desc  === "object" ? q.desc[LANG]  : q.desc; }

  function seededRandom(seed) {
    let s = 0;
    for (let i = 0; i < seed.length; i++) {
      s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
    }
    return function () {
      s = (s * 16807 + 0) % 2147483647;
      return (s & 0x7fffffff) / 2147483647;
    };
  }

  function shuffleWithSeed(arr, seed) {
    const rng = seededRandom(seed);
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // ---- State ----
  function loadState() {
    const raw = localStorage.getItem("soloLifemax");
    if (raw) {
      try { return JSON.parse(raw); } catch { /* fall through */ }
    }
    return {
      stats: { energy: 10, discipline: 10, health: 10, focus: 10, happiness: 10 },
      xp: 0,
      level: 1,
      today: null,
      quests: [],
      completedIndices: [],
      remixesUsed: 0,
      bonusQuests: [],
      bonusUnlocked: false,
    };
  }

  function saveState() {
    localStorage.setItem("soloLifemax", JSON.stringify(state));
  }

  let state = loadState();

  // ---- Quest Generation ----
  function generateDailyQuests() {
    const today = todayKey();
    // Force regenerate if quests are in old format (plain string instead of {en, fr})
    const needsReformat = state.quests.length > 0 && typeof state.quests[0].title === "string";
    if (state.today === today && state.quests.length > 0 && !needsReformat) return;

    state.today = today;
    state.completedIndices = [];
    state.remixesUsed = 0;

    const shuffled = shuffleWithSeed(QUEST_POOL, today);
    state.quests = shuffled.slice(0, QUESTS_PER_DAY).map((q, i) => ({
      id: i,
      title: q.title,
      desc: q.desc,
      rewards: q.rewards,
      troll: !!q.troll,
      completed: false,
    }));
    state.bonusQuests = [];
    state.bonusUnlocked = false;
    // Count troll quests for free rerolls
    countTrollFreeRerolls();
    saveState();
  }

  function countTrollFreeRerolls() {
    state.freeRerolls = state.quests.filter(q => q.troll && !q.completed).length;
  }

  function totalRemixes() {
    return MAX_REMIXES + (state.freeRerolls || 0);
  }

  function remixQuest(questIndex) {
    if (state.remixesUsed >= totalRemixes()) return;
    if (state.quests[questIndex].completed) return;

    const isTrollReroll = state.quests[questIndex].troll && state.freeRerolls > 0;

    const usedTitles = new Set(state.quests.map(q => questTitle(q)));
    const available = QUEST_POOL.filter(q => !q.troll && !usedTitles.has(questTitle(q)));
    if (available.length === 0) return;

    const pick = available[Math.floor(Math.random() * available.length)];
    state.quests[questIndex] = { id: questIndex, title: pick.title, desc: pick.desc, rewards: pick.rewards, troll: !!pick.troll, completed: false };

    if (isTrollReroll) {
      // Free reroll: don't count toward used remixes
      state.freeRerolls--;
    } else {
      state.remixesUsed++;
    }
    saveState();
    renderQuests();
    renderDashboard();
    showToast(isTrollReroll ? t("toastTrollFreeReroll") : t("toastRemixed"));
  }

  function completeQuest(questIndex) {
    const quest = state.quests[questIndex];
    if (quest.completed) return;

    quest.completed = true;
    state.completedIndices.push(questIndex);

    // Apply rewards
    const rewardedStats = [];
    for (const [stat, amount] of Object.entries(quest.rewards)) {
      const prev = state.stats[stat];
      state.stats[stat] = Math.min(MAX_STAT, state.stats[stat] + amount);
      if (state.stats[stat] > prev) rewardedStats.push(stat);
    }

    // XP
    const xpGain = Object.values(quest.rewards).reduce((a, b) => a + b, 0) * 5;
    state.xp += xpGain;

    // Level up
    let leveledUp = false;
    while (state.xp >= XP_PER_LEVEL) {
      state.xp -= XP_PER_LEVEL;
      state.level++;
      leveledUp = true;
    }

    saveState();
    renderQuests();
    renderDashboard();

    // Animate stat cards
    setTimeout(() => {
      rewardedStats.forEach(stat => {
        const card = document.querySelector(`[data-stat="${stat}"]`);
        if (card) {
          card.classList.add("bump");
          card.addEventListener("animationend", () => card.classList.remove("bump"), { once: true });
        }
      });
    }, 100);

    if (leveledUp) {
      showToast(t("toastLevelUp")(state.level), "level-up");
    } else {
      showToast(t("toastComplete")(xpGain), "success");
    }

    // Check if all main quests done → unlock bonus
    checkBonusUnlock();
  }

  function checkBonusUnlock() {
    const mainDone = state.quests.every(q => q.completed);
    if (mainDone && !state.bonusUnlocked) {
      state.bonusUnlocked = true;
      // Pick 2 random bonus quests
      const usedTitles = new Set(state.quests.map(q => questTitle(q)));
      const available = BONUS_POOL.filter(q => !usedTitles.has(questTitle(q)));
      const shuffled = available.sort(() => Math.random() - 0.5);
      state.bonusQuests = shuffled.slice(0, 2).map((q, i) => ({
        id: QUESTS_PER_DAY + i,
        title: q.title,
        desc: q.desc,
        rewards: q.rewards,
        bonus: true,
        completed: false,
      }));
      saveState();
      renderQuests();
      renderDashboard();
      setTimeout(() => showToast(t("bonusUnlocked"), "level-up"), 600);
    }
  }

  function completeBonusQuest(bonusIndex) {
    const quest = state.bonusQuests[bonusIndex];
    if (!quest || quest.completed) return;

    quest.completed = true;

    const rewardedStats = [];
    for (const [stat, amount] of Object.entries(quest.rewards)) {
      const prev = state.stats[stat];
      state.stats[stat] = Math.min(MAX_STAT, state.stats[stat] + amount);
      if (state.stats[stat] > prev) rewardedStats.push(stat);
    }

    const xpGain = Object.values(quest.rewards).reduce((a, b) => a + b, 0) * 8;
    state.xp += xpGain;

    let leveledUp = false;
    while (state.xp >= XP_PER_LEVEL) {
      state.xp -= XP_PER_LEVEL;
      state.level++;
      leveledUp = true;
    }

    saveState();
    renderQuests();
    renderDashboard();

    setTimeout(() => {
      rewardedStats.forEach(stat => {
        const card = document.querySelector(`[data-stat="${stat}"]`);
        if (card) {
          card.classList.add("bump");
          card.addEventListener("animationend", () => card.classList.remove("bump"), { once: true });
        }
      });
    }, 100);

    if (leveledUp) {
      showToast(t("toastLevelUp")(state.level), "level-up");
    } else {
      showToast(t("toastComplete")(xpGain), "success");
    }
  }

  // ---- Apply i18n to static HTML ----
  function applyI18n() {
    document.documentElement.lang = LANG;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
  }

  // ---- Rendering ----
  function renderDashboard() {
    // Stats grid
    const grid = document.getElementById("stats-grid");
    grid.innerHTML = STATS_CONFIG.map(s => {
      const val = state.stats[s.key];
      const pct = Math.min(100, (val / MAX_STAT) * 100);
      return `
        <div class="stat-card" data-stat="${s.key}" style="--stat-color: ${s.color}">
          <span class="stat-icon">${s.icon}</span>
          <div class="stat-name">${t(s.nameKey)}</div>
          <div class="stat-value">${val}</div>
          <div class="stat-bar">
            <div class="stat-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>`;
    }).join("");

    // Level
    document.getElementById("user-level").textContent = state.level;

    // XP bar
    const xpPct = Math.min(100, (state.xp / XP_PER_LEVEL) * 100);
    document.getElementById("xp-fill").style.width = xpPct + "%";
    document.getElementById("xp-text").textContent = `${state.xp} / ${XP_PER_LEVEL}`;

    // Summary
    const done = state.quests.filter(q => q.completed).length;
    const bonusDone = (state.bonusQuests || []).filter(q => q.completed).length;
    const totalDone = done + bonusDone;
    const totalQuests = QUESTS_PER_DAY + (state.bonusUnlocked ? state.bonusQuests.length : 0);
    document.getElementById("quests-done-count").textContent = `${totalDone} / ${totalQuests}`;
    document.getElementById("remix-count").textContent = `${state.remixesUsed} / ${totalRemixes()}`;
  }

  function renderQuests() {
    document.getElementById("quests-date").textContent = formatDate(todayKey());

    const list = document.getElementById("quests-list");
    const allDone = state.quests.every(q => q.completed);
    const canRemix = state.remixesUsed < totalRemixes();

    // Render bonus section if unlocked
    const bonusAllDone = state.bonusUnlocked && state.bonusQuests.every(q => q.completed);

    if (allDone && bonusAllDone) {
      list.innerHTML = renderMainQuests(canRemix) + renderBonusSection() + `
        <div class="all-done">
          <span class="all-done-icon">🏆</span>
          <h2>${t("allDoneTitle")}</h2>
          <p>${t("allDoneText")}</p>
        </div>`;
      document.getElementById("quests-footer").style.display = "none";
      return;
    }

    if (allDone && state.bonusUnlocked) {
      list.innerHTML = renderMainQuests(canRemix) + renderBonusSection();
      document.getElementById("quests-footer").style.display = "none";
      return;
    }

    document.getElementById("quests-footer").style.display = "";

    list.innerHTML = renderMainQuests(canRemix);
  }

  function renderMainQuests(canRemix) {
    return state.quests.map((q, i) => {
      const rewardTags = Object.entries(q.rewards)
        .map(([stat, amt]) => {
          const cfg = STATS_CONFIG.find(s => s.key === stat);
          return `<span class="quest-reward-tag">${cfg ? cfg.icon : ""} +${amt}</span>`;
        }).join("");

      const trollTag = q.troll ? `<span class="quest-troll-tag">🎭 ${t("trollTag")}</span>` : "";

      if (q.completed) {
        return `
          <div class="quest-card completed ${q.troll ? 'troll' : ''}">
            <div class="quest-top">
              <div class="quest-title">${trollTag}${escapeHtml(questTitle(q))}</div>
              <div class="quest-reward">${rewardTags}</div>
            </div>
            <div class="quest-desc">${escapeHtml(questDesc(q))}</div>
            <span class="quest-completed-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              ${t("completed")}
            </span>
          </div>`;
      }

      const remixDisabled = q.troll ? (state.freeRerolls <= 0) : !canRemix;
      const remixLabel = q.troll ? t("freeReroll") : t("remix");

      return `
        <div class="quest-card ${q.troll ? 'troll' : ''}">
          <div class="quest-top">
            <div class="quest-title">${trollTag}${escapeHtml(questTitle(q))}</div>
            <div class="quest-reward">${rewardTags}</div>
          </div>
          <div class="quest-desc">${escapeHtml(questDesc(q))}</div>
          <div class="quest-actions">
            <button class="btn btn-validate" onclick="window._completeQuest(${i})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              ${t("validate")}
            </button>
            <button class="btn btn-remix" onclick="window._remixQuest(${i})" ${remixDisabled ? "disabled" : ""}>
              ↻ ${remixLabel}
            </button>
          </div>
        </div>`;
    }).join("");
  }

  function renderBonusSection() {
    if (!state.bonusUnlocked || !state.bonusQuests.length) return "";

    const header = `
      <div class="bonus-header">
        <h2>🎲 ${t("bonusTitle")}</h2>
        <p>${t("bonusSubtitle")}</p>
      </div>`;

    const cards = state.bonusQuests.map((q, i) => {
      const rewardTags = Object.entries(q.rewards)
        .map(([stat, amt]) => {
          const cfg = STATS_CONFIG.find(s => s.key === stat);
          return `<span class="quest-reward-tag bonus-reward">${cfg ? cfg.icon : ""} +${amt}</span>`;
        }).join("");

      if (q.completed) {
        return `
          <div class="quest-card completed bonus-card">
            <div class="quest-top">
              <div class="quest-title"><span class="quest-bonus-tag">🎲 ${t("bonusTag")}</span>${escapeHtml(questTitle(q))}</div>
              <div class="quest-reward">${rewardTags}</div>
            </div>
            <div class="quest-desc">${escapeHtml(questDesc(q))}</div>
            <span class="quest-completed-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              ${t("completed")}
            </span>
          </div>`;
      }

      return `
        <div class="quest-card bonus-card">
          <div class="quest-top">
            <div class="quest-title"><span class="quest-bonus-tag">🎲 ${t("bonusTag")}</span>${escapeHtml(questTitle(q))}</div>
            <div class="quest-reward">${rewardTags}</div>
          </div>
          <div class="quest-desc">${escapeHtml(questDesc(q))}</div>
          <div class="quest-actions">
            <button class="btn btn-validate btn-bonus" onclick="window._completeBonusQuest(${i})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              ${t("validate")}
            </button>
          </div>
        </div>`;
    }).join("");

    return header + cards;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Toast ----
  let toastEl = null;
  let toastTimeout = null;

  function showToast(message, type = "") {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }

    clearTimeout(toastTimeout);
    toastEl.className = "toast";
    toastEl.textContent = message;

    requestAnimationFrame(() => {
      toastEl.classList.add("show");
      if (type) toastEl.classList.add(type);
    });

    toastTimeout = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2500);
  }

  // ---- Navigation ----
  function initNav() {
    const btns = document.querySelectorAll(".nav-btn");
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.page;
        btns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        const page = document.getElementById("page-" + target);
        if (page) page.classList.add("active");
      });
    });
  }

  // ---- Expose handlers ----
  window._completeQuest = completeQuest;
  window._remixQuest = remixQuest;
  window._completeBonusQuest = completeBonusQuest;

  // ---- Init ----
  function init() {
    applyI18n();
    generateDailyQuests();
    // Re-check bonus on reload (in case completed all before reload)
    checkBonusUnlock();
    renderDashboard();
    renderQuests();
    initNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

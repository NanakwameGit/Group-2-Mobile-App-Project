import PptxGenJS from "pptxgenjs";

const pptx = new PptxGenJS();
pptx.layout  = "LAYOUT_WIDE";
pptx.author  = "Group 2";
pptx.title   = "Personal Expense Tracker – Presentation";

// ── Colour constants (hex strings, no #) ───────────────────────
const C = {
  purple:     "6750A4",
  purpleDeep: "3B1D8A",
  purpleLight:"A78BFA",
  purpleBg:   "F3F0FF",
  teal:       "0D7A6A",
  tealDeep:   "0A2A2A",
  tealLight:  "5EEAD4",
  blueLight:  "93C5FD",
  blueDark:   "0D3A6A",
  orange:     "EA580C",
  orangeDeep: "431407",
  dark:       "0F0F1A",
  darkMid:    "1A1A3E",
  white:      "FFFFFF",
  grey:       "9CA3AF",
  greyDark:   "333355",
  green:      "4ADE80",
  red:        "F87171",
  bgPurple1:  "1A0533",
  bgPurple2:  "3B1D8A",
};

// ── Slide background (solid — gradient only via shapes) ─────────
function setBg(slide, color) {
  slide.background = { color };
}

// ── Full-slide gradient rectangle ───────────────────────────────
function addBgGradient(slide, c1, c2) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: "100%",
    fill: { type: "grad", color: c1, color2: c2, angle: 135 },
    line: { type: "none" },
  });
}

// ── Small uppercase label above title ──────────────────────────
function addLabel(slide, text) {
  slide.addText(text, {
    x: 0.5, y: 0.28, w: 12.33, h: 0.28,
    fontSize: 9, bold: true, color: "777799",
    align: "center", charSpacing: 3,
  });
}

// ── Section title (supports | delimiters for accent colour) ────
function addTitle(slide, text, accentColor) {
  const parts = text.split("|");
  if (parts.length === 1) {
    slide.addText(text, {
      x: 0.5, y: 0.58, w: 12.33, h: 0.9,
      fontSize: 30, bold: true, color: C.white, align: "center",
    });
    return;
  }
  slide.addText(
    [
      { text: parts[0], options: { color: C.white } },
      { text: parts[1], options: { color: accentColor || C.purpleLight } },
      { text: parts[2] || "", options: { color: C.white } },
    ],
    { x: 0.5, y: 0.58, w: 12.33, h: 0.9, fontSize: 30, bold: true, align: "center" }
  );
}

// ── Horizontal divider line ─────────────────────────────────────
function addDivider(slide, y, color) {
  slide.addShape(pptx.ShapeType.line, {
    x: 0.5, y, w: 12.33, h: 0,
    line: { color: color || C.greyDark, width: 0.5 },
  });
}

// ── Rounded pill tag ────────────────────────────────────────────
function addTag(slide, text, x, y, color) {
  const w = Math.max(1.1, text.length * 0.088 + 0.3);
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h: 0.3,
    fill: { color, transparency: 80 },
    line: { color, width: 0.5 },
    rectRadius: 0.15,
  });
  slide.addText(text, {
    x, y, w, h: 0.3,
    fontSize: 8, bold: true, color, align: "center",
  });
}

// ── Feature card ────────────────────────────────────────────────
function addCard(slide, x, y, w, h, icon, title, body) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: "FFFFFF", transparency: 92 },
    line: { color: "FFFFFF", width: 0.5, transparency: 85 },
    rectRadius: 0.15,
  });
  slide.addText(icon,  { x: x+0.15, y: y+0.12, w: 0.5,   h: 0.38, fontSize: 18 });
  slide.addText(title, { x: x+0.15, y: y+0.5,  w: w-0.3, h: 0.32, fontSize: 11, bold: true, color: C.white });
  slide.addText(body,  { x: x+0.15, y: y+0.82, w: w-0.3, h: h-0.98, fontSize: 9, color: C.grey, wrap: true });
}

// ── Check-list row ──────────────────────────────────────────────
function addCheck(slide, x, y, icon, mainText, subText) {
  slide.addText(icon || "✓", { x, y, w: 0.35, h: 0.35, fontSize: 14, valign: "middle" });
  if (subText) {
    slide.addText(mainText, { x: x+0.45, y,       w: 11.4, h: 0.28, fontSize: 11,  bold: true, color: C.white });
    slide.addText(subText,  { x: x+0.45, y: y+0.3,w: 11.4, h: 0.25, fontSize: 9,   color: C.grey });
  } else {
    slide.addText(mainText, { x: x+0.45, y,       w: 11.4, h: 0.32, fontSize: 11,  color: C.white });
  }
}

// ── Flow step box ───────────────────────────────────────────────
function addStep(slide, x, y, label, fillColor) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 1.75, h: 0.52,
    fill: { color: fillColor, transparency: 78 },
    line: { color: fillColor, width: 0.5 },
    rectRadius: 0.1,
  });
  slide.addText(label, {
    x, y, w: 1.75, h: 0.52,
    fontSize: 8.5, bold: true, color: C.white,
    align: "center", valign: "middle", wrap: true,
  });
}

function addArrow(slide, x, y) {
  slide.addText("→", { x, y, w: 0.32, h: 0.52, fontSize: 14, color: C.grey, align: "center", valign: "middle" });
}

// ── Styled table ────────────────────────────────────────────────
function addTable(slide, x, y, w, headers, rows) {
  const colW = headers.map(() => w / headers.length);
  slide.addTable(
    [
      headers.map(h => ({
        text: h,
        options: { bold: true, color: C.white, fontSize: 9, fill: C.purple, align: "left", margin: [4, 6, 4, 6] },
      })),
      ...rows.map((r, ri) =>
        r.map(c => ({
          text: c,
          options: {
            color: "DDDDDD", fontSize: 8.5, align: "left", margin: [4, 6, 4, 6],
            fill: ri % 2 === 0 ? "1A1A2E" : "0F0F1A",
          },
        }))
      ),
    ],
    { x, y, w, colW, border: { type: "none" }, rowH: 0.33 }
  );
}

// ══════════════════════════════════════════════════════════════════
//  SLIDE 1 — TITLE
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  setBg(s, C.bgPurple1);
  addBgGradient(s, C.bgPurple1, C.bgPurple2);

  s.addText("GROUP 2  ·  MOBILE APP DEVELOPMENT", {
    x: 0.5, y: 0.7, w: 12.33, h: 0.3,
    fontSize: 9, bold: true, color: "888888", align: "center", charSpacing: 3,
  });
  s.addText("Personal\nExpense Tracker", {
    x: 1, y: 1.0, w: 11.33, h: 2.7,
    fontSize: 52, bold: true, color: C.white, align: "center",
  });
  s.addText("Flutter Mobile Application", {
    x: 1, y: 3.7, w: 11.33, h: 0.5,
    fontSize: 18, bold: true, color: C.purpleLight, align: "center",
  });
  s.addText(
    "A cross-platform app for logging, categorizing, and reviewing personal finances — with local storage and first-launch onboarding.",
    { x: 2.5, y: 4.35, w: 8.33, h: 0.7, fontSize: 11, color: "BBBBBB", align: "center", wrap: true }
  );
  const tags = [
    { t: "Flutter 3.38",       c: C.purpleLight, x: 2.8  },
    { t: "Dart 3.10",          c: C.purpleLight, x: 4.55 },
    { t: "Material 3",         c: C.purpleLight, x: 6.05 },
    { t: "shared_preferences", c: C.tealLight,   x: 7.5  },
  ];
  tags.forEach(({ t, c, x }) => addTag(s, t, x, 5.3, c));
  s.addText("April 2026", { x: 0.5, y: 7.05, w: 12.33, h: 0.22, fontSize: 8, color: "555566", align: "center" });
}

// ══════════════════════════════════════════════════════════════════
//  SLIDE 2 — PROBLEM
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  setBg(s, C.dark);
  addBgGradient(s, C.dark, C.darkMid);
  addLabel(s, "THE PROBLEM");
  addTitle(s, "Why Do We Need This |App|?", C.purpleLight);

  const items = [
    { i: "💸", t: "No clear picture of spending",       b: "Most people can't say where their money went last month" },
    { i: "📱", t: "Existing apps are overcomplicated",  b: "Budgets, accounts, charts, subscriptions — too much for daily use" },
    { i: "🔒", t: "Privacy concerns with cloud apps",  b: "Many finance apps share data with third parties or require an account" },
    { i: "✅", t: "Our solution: simple, private, offline", b: "All data stays on your device — no backend, no login, no internet needed" },
  ];
  items.forEach(({ i, t, b }, idx) => {
    const y = 1.78 + idx * 1.15;
    addCheck(s, 0.6, y, i, t, b);
    if (idx < items.length - 1) addDivider(s, y + 0.75);
  });
}

// ══════════════════════════════════════════════════════════════════
//  SLIDE 3 — FEATURES
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  setBg(s, C.blueDark);
  addBgGradient(s, "0A1A3A", C.blueDark);
  addLabel(s, "WHAT IT DOES");
  addTitle(s, "Core |Features|", C.purpleLight);

  addCard(s, 0.5,  1.65, 5.9, 2.25, "💳", "Balance Dashboard",  "Gradient card showing balance, total income, and expenses — updates live on every add or delete.");
  addCard(s, 6.93, 1.65, 5.9, 2.25, "📋", "Transaction List",   "Scrollable list with category icons, dates, and colour-coded amounts (red for expense, green for income).");
  addCard(s, 0.5,  4.1,  5.9, 2.25, "➕", "Add Transaction",    "Bottom sheet form — title, amount, category dropdown, date picker, income/expense toggle, inline validation.");
  addCard(s, 6.93, 4.1,  5.9, 2.25, "💾", "Local Storage",      "Transactions survive restarts. JSON-encoded list saved to SharedPreferences — no server needed.");
}

// ══════════════════════════════════════════════════════════════════
//  SLIDE 4 — ONBOARDING
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  setBg(s, C.tealDeep);
  addBgGradient(s, "0A2A2A", "0D4A42");
  addLabel(s, "FIRST LAUNCH");
  addTitle(s, "|Onboarding| Flow", C.tealLight);

  // Flow steps
  const stepW = 1.75, gap = 0.32;
  const steps = [
    { t: "Page 1\nTrack Spending", c: C.blueDark  },
    { t: "Page 2\nCategorize",     c: C.blueDark  },
    { t: "Page 3\nBig Picture",    c: C.blueDark  },
    { t: "Get Started\nsave flag", c: "2D6A4F"    },
    { t: "Home Screen",            c: "2D6A4F"    },
  ];
  steps.forEach(({ t, c }, i) => {
    addStep(s, 0.6 + i * (stepW + gap), 1.65, t, c);
    if (i < steps.length - 1)
      addArrow(s, 0.6 + i * (stepW + gap) + stepW, 1.65);
  });

  addDivider(s, 2.42, "1A4A40");

  const items = [
    { i: "🎨", t: "Each page has a unique colour theme (purple → teal → orange) and a large icon in a tinted circle" },
    { i: "●",  t: "Animated dot indicators — the active dot stretches into a pill shape" },
    { i: "⏭️", t: "Skip link on pages 1 and 2 for users who want to go straight to the app" },
    { i: "🔑", t: "onboarding_done = true written to SharedPreferences when Get Started is tapped" },
  ];
  items.forEach(({ i, t }, idx) => addCheck(s, 0.6, 2.65 + idx * 0.88, i, t));
}

// ══════════════════════════════════════════════════════════════════
//  SLIDE 5 — TECH STACK
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  setBg(s, C.dark);
  addBgGradient(s, C.dark, C.darkMid);
  addLabel(s, "UNDER THE HOOD");
  addTitle(s, "Technical |Stack|", C.purpleLight);

  addTable(s, 0.6, 1.65, 12.13,
    ["Layer", "Technology", "Why?"],
    [
      ["UI Framework",    "Flutter 3.38  ·  Material 3",  "Cross-platform: Android, iOS, Web"],
      ["Language",        "Dart 3.10",                    "Null-safe, strongly typed"],
      ["State",           "StatefulWidget + setState",    "Simple — no extra package needed"],
      ["Storage",         "shared_preferences ^2.5",      "Key-value store; saves JSON array"],
      ["Navigation",      "Flutter Navigator",            "Push / pushReplacement between screens"],
    ]
  );

  const tagData = [
    { t: "0 architecture packages", c: C.purpleLight, x: 1.0 },
    { t: "1 storage package",       c: C.tealLight,   x: 3.5 },
    { t: "4 Dart files total",      c: C.orange,      x: 5.3 },
    { t: "~600 lines of Dart",      c: C.green,       x: 7.0 },
  ];
  tagData.forEach(({ t, c, x }) => addTag(s, t, x, 5.95, c));
}

// ══════════════════════════════════════════════════════════════════
//  SLIDE 6 — PROJECT STRUCTURE
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  setBg(s, C.dark);
  addBgGradient(s, C.dark, C.darkMid);
  addLabel(s, "CODE ORGANIZATION");
  addTitle(s, "Project |Structure|", C.purpleLight);

  // Dark code block
  slide_6_codeblock: {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 1.6, w: 6.0, h: 3.5,
      fill: { color: "050510" },
      line: { color: C.greyDark, width: 0.5 },
      rectRadius: 0.12,
    });
    const lines = [
      { text: "lib/",                             color: "79C0FF" },
      { text: "  main.dart",                      color: "C9D1D9" },
      { text: "    ← entry + theme + AppRouter",  color: "6E7681" },
      { text: "  models/",                        color: "79C0FF" },
      { text: "    transaction.dart",             color: "C9D1D9" },
      { text: "    ← model + toJson/fromJson",    color: "6E7681" },
      { text: "  screens/",                       color: "79C0FF" },
      { text: "    onboarding_screen.dart",       color: "C9D1D9" },
      { text: "    home_screen.dart",             color: "C9D1D9" },
      { text: "    ← all main UI + storage",      color: "6E7681" },
    ];
    lines.forEach(({ text, color }, i) =>
      s.addText(text, {
        x: 0.7, y: 1.73 + i * 0.36, w: 5.6, h: 0.33,
        fontSize: 8.5, font: "Courier New", color,
      })
    );
  }

  // Descriptions on the right
  const desc = [
    { icon: "📄", t: "main.dart",              b: "Theme + AppRouter (checks onboarding_done flag)" },
    { icon: "🗂️", t: "transaction.dart",        b: "Data model with toJson / fromJson for storage" },
    { icon: "🎉", t: "onboarding_screen.dart", b: "First-launch 3-page intro" },
    { icon: "🏠", t: "home_screen.dart",       b: "Balance card, list, add form, delete — all UI" },
  ];
  desc.forEach(({ icon, t, b }, i) => {
    s.addText(icon, { x: 7.0, y: 1.75 + i * 1.02, w: 0.45, h: 0.42, fontSize: 16 });
    s.addText(t,    { x: 7.55, y: 1.75 + i * 1.02,      w: 5.7, h: 0.3,  fontSize: 11, bold: true, color: C.white });
    s.addText(b,    { x: 7.55, y: 1.75 + i * 1.02 + 0.3,w: 5.7, h: 0.28, fontSize: 9,  color: C.grey });
  });
}

// ══════════════════════════════════════════════════════════════════
//  SLIDE 7 — DATA FLOW
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  setBg(s, C.blueDark);
  addBgGradient(s, "0A1A3A", C.blueDark);
  addLabel(s, "HOW IT WORKS");
  addTitle(s, "Data |Flow|", C.blueLight);

  // Top row
  ["App opens", "AppRouter", "Read SharedPreferences"].forEach((t, i) => {
    addStep(s, 0.6 + i * 2.1, 1.62, t, C.blueDark);
    if (i < 2) addArrow(s, 0.6 + i * 2.1 + 1.75, 1.62);
  });

  // Branch — first launch
  s.addText("First launch",   { x: 0.6,  y: 2.35, w: 1.75, h: 0.22, fontSize: 8, color: C.grey, align: "center" });
  addStep(s, 0.6,  2.6,  "OnboardingScreen", "374151");
  s.addText("↓", { x: 0.6, y: 3.12, w: 1.75, h: 0.32, fontSize: 13, color: C.grey, align: "center" });
  addStep(s, 0.6,  3.44, "HomeScreen\n+ seed data", "2D6A4F");

  // Branch — returning
  s.addText("Returning user", { x: 4.7,  y: 2.35, w: 1.75, h: 0.22, fontSize: 8, color: C.grey, align: "center" });
  addStep(s, 4.7,  2.6,  "HomeScreen\ndirectly",   "2D6A4F");
  s.addText("↓", { x: 4.7, y: 3.12, w: 1.75, h: 0.32, fontSize: 13, color: C.grey, align: "center" });
  addStep(s, 4.7,  3.44, "Load JSON\nfrom prefs",  "2D6A4F");

  // Info box
  s.addShape(pptx.ShapeType.roundRect, {
    x: 7.8, y: 1.6, w: 5.0, h: 2.8,
    fill: { color: "FFFFFF", transparency: 92 },
    line: { color: C.blueLight, width: 0.5 },
    rectRadius: 0.12,
  });
  const notes = [
    { label: "Storage key:",       val: '"transactions" → JSON string'     },
    { label: "On add / delete:",   val: "json.encode → prefs.setString"    },
    { label: "On startup:",        val: "prefs.getString → json.decode"    },
    { label: "State update:",      val: "setState() → widget rebuilds"     },
  ];
  notes.forEach(({ label, val }, i) => {
    s.addText(label, { x: 8.0, y: 1.72 + i * 0.65, w: 4.5, h: 0.26, fontSize: 9, bold: true, color: C.blueLight });
    s.addText(val,   { x: 8.0, y: 1.72 + i * 0.65 + 0.26, w: 4.5, h: 0.26, fontSize: 8.5, font: "Courier New", color: "CCCCCC" });
  });

  addDivider(s, 4.55);
  s.addText("setState() triggers a widget rebuild on every change — no BLoC, no Provider, no streams needed", {
    x: 0.5, y: 4.65, w: 12.33, h: 0.28, fontSize: 9, color: C.grey, align: "center", italic: true,
  });
}

// ══════════════════════════════════════════════════════════════════
//  SLIDE 8 — CHALLENGES
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  setBg(s, C.orangeDeep);
  addBgGradient(s, "2A1200", C.orangeDeep);
  addLabel(s, "WHAT WE LEARNED");
  addTitle(s, "Challenges & |Solutions|", C.orange);

  const items = [
    {
      i: "⏳",
      t: "App stuck on the loading spinner",
      b: "Missing WidgetsFlutterBinding.ensureInitialized() — the platform channel wasn't ready before SharedPreferences was called. Fix: make main() async and call it first.",
    },
    {
      i: "🎨",
      t: "Color type removed from Flutter 3.38 public API",
      b: "Replaced explicit Color type annotations with inferred final variables. Passed bool isIncome so each widget computes its own colour. Used .withValues(alpha: x) not .withOpacity().",
    },
    {
      i: "🔐",
      t: "GitHub push 403 even after being added as collaborator",
      b: "Invitation was pending and had never been accepted. Fixed with: gh api --method PATCH user/repository_invitations/{id}, then pushed successfully.",
    },
  ];

  items.forEach(({ i, t, b }, idx) => {
    const y = 1.72 + idx * 1.68;
    addCheck(s, 0.6, y, i, t, b);
    if (idx < items.length - 1) addDivider(s, y + 1.1, "4A2800");
  });
}

// ══════════════════════════════════════════════════════════════════
//  SLIDE 9 — STATS
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  setBg(s, C.bgPurple1);
  addBgGradient(s, C.bgPurple1, C.bgPurple2);
  addLabel(s, "BY THE NUMBERS");
  addTitle(s, "App |Stats|", C.purpleLight);

  const stats = [
    { n: "4",  l: "Dart Files",       c: C.purpleLight },
    { n: "1",  l: "Package Used",     c: C.tealLight   },
    { n: "7",  l: "Categories",       c: C.orange      },
    { n: "3",  l: "Onboarding Pages", c: C.green       },
  ];
  stats.forEach(({ n, l, c }, i) => {
    const x = 0.85 + i * 2.95;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.65, w: 2.6, h: 2.3,
      fill: { color: C.white, transparency: 92 },
      line: { color: c, width: 0.75 },
      rectRadius: 0.18,
    });
    s.addText(n, { x, y: 1.8, w: 2.6, h: 1.1, fontSize: 52, bold: true, color: c, align: "center" });
    s.addText(l, { x, y: 3.0, w: 2.6, h: 0.4, fontSize: 10, color: "BBBBBB", align: "center" });
  });

  const tagData = [
    { t: "No backend",          c: C.purpleLight, x: 0.85 },
    { t: "No authentication",   c: C.purpleLight, x: 2.6  },
    { t: "No BLoC / Riverpod",  c: C.tealLight,   x: 4.65 },
    { t: "Android · iOS · Web", c: C.green,       x: 6.65 },
    { t: "~600 lines of Dart",  c: C.orange,      x: 8.95 },
  ];
  tagData.forEach(({ t, c, x }) => addTag(s, t, x, 4.3, c));
}

// ══════════════════════════════════════════════════════════════════
//  SLIDE 10 — DEMO
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  setBg(s, C.dark);
  addBgGradient(s, C.dark, C.darkMid);
  addLabel(s, "LIVE WALKTHROUGH");
  addTitle(s, "Demo |Flow|", C.purpleLight);

  const steps = [
    { i: "1️⃣", t: "Open the app",          b: "See the 3-page onboarding — tap Next to advance, or Skip to jump straight to the app" },
    { i: "2️⃣", t: "Arrive at Home Screen", b: "Point out the balance card and the pre-loaded sample transactions" },
    { i: "3️⃣", t: "Tap Add",               b: "Fill in the form — title, amount, category, date, type — then submit and watch the balance update" },
    { i: "4️⃣", t: "Delete a transaction",  b: "Tap the bin icon — the list and balance update instantly" },
    { i: "5️⃣", t: "Restart the app",       b: "All transactions are still there — local storage is working" },
  ];
  steps.forEach(({ i, t, b }, idx) => {
    const y = 1.68 + idx * 0.99;
    addCheck(s, 0.6, y, i, t, b);
    if (idx < steps.length - 1) addDivider(s, y + 0.68);
  });
}

// ══════════════════════════════════════════════════════════════════
//  SLIDE 11 — CONCLUSION
// ══════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  setBg(s, C.bgPurple1);
  addBgGradient(s, C.bgPurple1, C.bgPurple2);
  addLabel(s, "WRAP UP");
  addTitle(s, "Conclusion", C.purpleLight);

  s.addText(
    "A fully working, polished Flutter app — built with minimal complexity to demonstrate real mobile development concepts in clean, readable code.",
    { x: 1.5, y: 1.55, w: 10.33, h: 0.75, fontSize: 12.5, color: "BBBBBB", align: "center", wrap: true }
  );

  addCard(s, 0.5,  2.55, 5.9, 2.3, "✅", "What We Covered",
    "State management  ·  Local persistence  ·  Navigation  ·  Form validation  ·  JSON serialization  ·  Onboarding UX");
  addCard(s, 6.93, 2.55, 5.9, 2.3, "🚀", "Possible Extensions",
    "Monthly budget limits  ·  Spending charts  ·  Currency selection  ·  Dark mode  ·  Cloud sync");

  s.addText("github.com/NanakwameGit/Group-2-Mobile-App-Project", {
    x: 0.5, y: 7.05, w: 12.33, h: 0.22, fontSize: 8.5, color: "555566", align: "center",
  });
}

// ── Write file ─────────────────────────────────────────────────
await pptx.writeFile({ fileName: "presentation_slides.pptx" });
console.log("✓  presentation_slides.pptx written");

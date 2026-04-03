import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, ShadingType, PageBreak, UnderlineType,
  HorizontalPositionAlign, VerticalPositionAlign,
} from "docx";
import { writeFileSync } from "fs";

// ── Colour palette ──────────────────────────────────────────────
const PURPLE     = "6750A4";
const PURPLE_BG  = "F3F0FF";
const LIGHT_GREY = "F7F7FB";
const MID_GREY   = "888888";
const DARK       = "1A1A2E";
const WHITE      = "FFFFFF";

// ── Helpers ─────────────────────────────────────────────────────

/** Plain body paragraph */
const body = (text) =>
  new Paragraph({
    children: [new TextRun({ text, size: 22, color: DARK, font: "Calibri" })],
    spacing: { after: 120 },
  });

/** Heading 1 — purple, large */
const h1 = (text) =>
  new Paragraph({
    children: [new TextRun({ text, bold: true, size: 40, color: PURPLE, font: "Calibri" })],
    spacing: { before: 320, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PURPLE_BG, space: 4 } },
  });

/** Heading 2 — dark, medium */
const h2 = (text) =>
  new Paragraph({
    children: [new TextRun({ text, bold: true, size: 26, color: DARK, font: "Calibri" })],
    spacing: { before: 200, after: 80 },
  });

/** Bullet point */
const bullet = (text, bold = false) =>
  new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 22, color: DARK, font: "Calibri", bold })],
    spacing: { after: 60 },
  });

/** Info box paragraph (purple left border via shading) */
const infoBox = (label, text) =>
  new Paragraph({
    children: [
      new TextRun({ text: label + " ", bold: true, size: 22, color: PURPLE, font: "Calibri" }),
      new TextRun({ text, size: 22, color: DARK, font: "Calibri" }),
    ],
    shading: { type: ShadingType.SOLID, fill: PURPLE_BG },
    indent: { left: 200, right: 200 },
    spacing: { before: 80, after: 160, line: 300 },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: PURPLE, space: 6 } },
  });

/** Spacer */
const spacer = () => new Paragraph({ text: "", spacing: { after: 80 } });

/** Code-style inline run */
const code = (text) =>
  new TextRun({ text, font: "Courier New", size: 19, color: PURPLE, shading: { type: ShadingType.SOLID, fill: PURPLE_BG } });

// ── Styled table builder ────────────────────────────────────────
function styledTable(headers, rows) {
  const makeCell = (text, isHeader = false) =>
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text, bold: isHeader, size: isHeader ? 20 : 19, color: isHeader ? WHITE : DARK, font: "Calibri" })],
          alignment: AlignmentType.LEFT,
        }),
      ],
      shading: isHeader
        ? { type: ShadingType.SOLID, fill: PURPLE }
        : { type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      borders: {
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "E8E4F8" },
        top:    { style: BorderStyle.NONE },
        left:   { style: BorderStyle.NONE },
        right:  { style: BorderStyle.NONE },
      },
    });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map((h) => makeCell(h, true)), tableHeader: true }),
      ...rows.map((r, i) =>
        new TableRow({
          children: r.map((c) => makeCell(c)),
          cantSplit: true,
        })
      ),
    ],
    margins: { top: 80, bottom: 80 },
  });
}

// ── Document content ────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22, color: DARK },
        paragraph: { spacing: { line: 276 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: { margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } },
      },
      children: [

        // ── COVER ────────────────────────────────────────────────
        new Paragraph({
          children: [new TextRun({ text: "GROUP 2  ·  MOBILE APP DEVELOPMENT", size: 18, color: MID_GREY, bold: true, font: "Calibri" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Personal Expense Tracker", size: 64, bold: true, color: DARK, font: "Calibri" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Flutter Mobile Application", size: 28, color: PURPLE, bold: true, font: "Calibri" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        styledTable(
          ["Field", "Value"],
          [
            ["Course",     "Mobile App Development"],
            ["Team",       "Group 2"],
            ["Platform",   "Flutter — Android / iOS / Web"],
            ["Language",   "Dart 3.10  ·  Flutter 3.38"],
            ["Date",       "April 2026"],
            ["Repository", "NanakwameGit / Group-2-Mobile-App-Project"],
          ]
        ),
        spacer(),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 1. INTRODUCTION ──────────────────────────────────────
        h1("1.  Introduction"),
        body(
          "Managing personal finances is a challenge many students and young professionals face. " +
          "The Personal Expense Tracker is a mobile application built with Flutter that allows users " +
          "to log, categorize, and review their income and expenses in a clean, easy-to-use interface. " +
          "All data is stored locally on the device — no internet connection, no account, and no server required."
        ),
        body(
          "The app was designed with simplicity and presentation-readiness in mind: it uses a minimal " +
          "number of files, no complex architecture, and relies only on Flutter's built-in widgets " +
          "plus one small storage package (shared_preferences)."
        ),
        spacer(),
        infoBox("Goal:", "Build a working, good-looking Flutter app that demonstrates key mobile " +
          "development concepts — state management, local persistence, navigation, and form validation — " +
          "in the fewest possible lines of code."),

        // ── 2. FEATURES ──────────────────────────────────────────
        h1("2.  Features"),
        bullet("Balance Dashboard — gradient card showing current balance, total income, and total expenses, updated live", true),
        body("     Shows three values at a glance. The balance recalculates instantly on every add or delete."),
        spacer(),
        bullet("Transaction List — scrollable list with category icons, dates, and colour-coded amounts", true),
        body("     Red for expenses, green for income. Each row has a category icon and a delete button."),
        spacer(),
        bullet("Add Transaction — modal bottom sheet form", true),
        body("     Fields: title, amount, category dropdown (7 options), date picker, income/expense toggle. Inline form validation prevents bad data."),
        spacer(),
        bullet("Delete Transaction — tap the bin icon on any row", true),
        body("     Removes the item from the list and immediately re-saves to local storage."),
        spacer(),
        bullet("Local Storage — all transactions survive app restarts", true),
        body("     Uses shared_preferences to store a JSON-encoded list under the key 'transactions'."),
        spacer(),
        bullet("Onboarding — three-page intro shown only on first launch", true),
        body("     Animated dot indicators, Skip link, and a Get Started button that marks onboarding as complete."),

        // ── 3. TECHNICAL STACK ───────────────────────────────────
        h1("3.  Technical Stack"),
        spacer(),
        styledTable(
          ["Layer", "Technology", "Notes"],
          [
            ["UI Framework",    "Flutter 3.38 · Material 3",       "Cross-platform; Android, iOS, Web"],
            ["Language",        "Dart 3.10",                       "Null-safe, strongly typed"],
            ["State management","StatefulWidget + setState",        "No external package needed"],
            ["Local storage",   "shared_preferences ^2.5",         "Key-value store; JSON-encoded list"],
            ["Navigation",      "Flutter Navigator",               "Push / pushReplacement between screens"],
            ["Forms",           "Flutter Form + TextFormField",     "Built-in validation"],
          ]
        ),

        // ── 4. PROJECT STRUCTURE ─────────────────────────────────
        h1("4.  Project Structure"),
        body("The project uses a deliberately flat file structure to stay beginner-friendly:"),
        spacer(),
        new Paragraph({
          children: [
            code("lib/"),
            new TextRun({ text: "", font: "Courier New", size: 19 }),
          ],
          shading: { type: ShadingType.SOLID, fill: "1A1A2E" },
          spacing: { before: 0, after: 0 }, indent: { left: 200, right: 200 },
        }),
        ...[
          "  main.dart                  ← app entry + theme + AppRouter",
          "  models/",
          "    transaction.dart         ← Transaction class + toJson / fromJson",
          "  screens/",
          "    onboarding_screen.dart   ← 3-page first-launch intro",
          "    home_screen.dart         ← all main UI + storage logic",
        ].map((line) =>
          new Paragraph({
            children: [new TextRun({ text: line, font: "Courier New", size: 19, color: "C9D1D9" })],
            shading: { type: ShadingType.SOLID, fill: "1A1A2E" },
            spacing: { before: 0, after: 0 },
            indent: { left: 200, right: 200 },
          })
        ),
        spacer(),
        body("4 Dart files total. No services layer, no repository pattern, no BLoC — just plain Flutter widgets with state."),

        // ── 5. ARCHITECTURE ──────────────────────────────────────
        h1("5.  Architecture & Data Flow"),
        h2("5.1  App Startup"),
        bullet("App opens → AppRouter reads SharedPreferences"),
        bullet("First launch → OnboardingScreen → 'Get Started' → marks onboarding_done = true → HomeScreen"),
        bullet("Subsequent launches → HomeScreen directly → load JSON from prefs → render list"),
        spacer(),
        h2("5.2  State Management"),
        body(
          "All mutable state (the transaction list) lives inside _HomeScreenState. Every user action calls " +
          "setState(), which triggers a rebuild of the widget tree. There is no global state, no provider, " +
          "and no stream — Flutter's built-in reactive model is sufficient for this scale."
        ),
        spacer(),
        h2("5.3  Persistence"),
        body(
          "SharedPreferences stores a single key 'transactions' whose value is a JSON array string. " +
          "On every add or delete, the full list is re-encoded and written. On initState, the string is " +
          "read back and decoded into a List<Transaction>. If the key is absent (first run), sample data " +
          "is seeded and immediately saved."
        ),

        // ── 6. TRANSACTION MODEL ─────────────────────────────────
        h1("6.  Transaction Model"),
        spacer(),
        styledTable(
          ["Field", "Type", "Description"],
          [
            ["id",       "String",          "Unique ID — Unix milliseconds as string"],
            ["title",    "String",          "Short description, e.g. 'Grocery Shopping'"],
            ["amount",   "double",          "Positive value; sign comes from type"],
            ["category", "String",          "Food, Transport, Entertainment, Shopping, Health, Salary, Other"],
            ["date",     "DateTime",        "Stored as ISO-8601 string in JSON"],
            ["type",     "TransactionType", "Enum: income or expense"],
          ]
        ),

        // ── 7. UI SCREENS ────────────────────────────────────────
        h1("7.  UI Screens"),
        h2("7.1  Onboarding Screen"),
        bullet("Three full-screen pages rendered by a PageView"),
        bullet("Each page: large icon in a tinted circle, bold title, descriptive subtitle"),
        bullet("Page colours: purple → teal → orange"),
        bullet("Animated dot indicators — active dot stretches to a pill shape"),
        bullet("Next / Skip / Get Started controls"),
        spacer(),
        h2("7.2  Home Screen"),
        bullet("Balance card: gradient container with balance in large type and income/expense tiles"),
        bullet("Transaction list: ListView.separated inside a SingleChildScrollView"),
        bullet("Each item is a Card with a ListTile — category icon, title, subtitle, amount, delete button"),
        bullet("Empty state: centred message when the list is empty"),
        bullet("FAB: FloatingActionButton.extended opens the add-transaction sheet"),
        spacer(),
        h2("7.3  Add Transaction Sheet"),
        bullet("Modal bottom sheet with rounded top corners"),
        bullet("Padding grows with keyboard via MediaQuery.viewInsets.bottom"),
        bullet("Animated Expense / Income toggle buttons"),
        bullet("TextFormField for title and amount with inline validators"),
        bullet("DropdownButtonFormField for category with 7 options"),
        bullet("Date shown via InputDecorator; tapping opens showDatePicker"),

        // ── 8. CHALLENGES ────────────────────────────────────────
        h1("8.  Challenges & Solutions"),
        spacer(),
        styledTable(
          ["Challenge", "Solution"],
          [
            [
              "App stuck on loading spinner",
              "Added WidgetsFlutterBinding.ensureInitialized() before runApp() so the platform channel is ready before SharedPreferences.getInstance() is called",
            ],
            [
              "Color type removed from Flutter 3.38 public API",
              "Replaced all explicit Color type annotations with type-inferred final variables and bool isIncome parameters; widgets compute their own colours internally",
            ],
            [
              "Deprecated .withOpacity() in Flutter 3.27+",
              "Migrated all calls to .withValues(alpha: x) as required by the new Color API",
            ],
            [
              "GitHub push denied (403) after being added as collaborator",
              "Collaborator invitation was pending; accepted it via the GitHub API using: gh api --method PATCH user/repository_invitations/{id}",
            ],
          ]
        ),

        // ── 9. HOW TO RUN ────────────────────────────────────────
        h1("9.  How to Run"),
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: "Clone the repository:  ", size: 22, bold: true, font: "Calibri" }),
            code("git clone https://github.com/NanakwameGit/Group-2-Mobile-App-Project.git"),
          ],
          spacing: { after: 80 },
        }),
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: "Install dependencies:  ", size: 22, bold: true, font: "Calibri" }),
            code("flutter pub get"),
          ],
          spacing: { after: 80 },
        }),
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: "Run on device/emulator:  ", size: 22, bold: true, font: "Calibri" }),
            code("flutter run"),
          ],
          spacing: { after: 80 },
        }),
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: "Run in Chrome:  ", size: 22, bold: true, font: "Calibri" }),
            code("flutter run -d chrome"),
          ],
          spacing: { after: 80 },
        }),
        spacer(),
        infoBox("Requirements:", "Flutter SDK 3.38+  ·  Dart 3.10+  ·  An Android/iOS emulator, physical device, or Chrome for web"),

        // ── 10. CONCLUSION ───────────────────────────────────────
        h1("10.  Conclusion"),
        body(
          "The Personal Expense Tracker demonstrates that a fully functional, polished mobile app can " +
          "be built with minimal complexity. By using StatefulWidget for state and shared_preferences " +
          "for persistence, the codebase remains small enough to be explained in a single class session " +
          "while still covering real-world mobile development concepts: navigation, form validation, " +
          "async I/O, serialization, and first-launch onboarding."
        ),
        body(
          "The app is ready to be extended — potential next steps include charts/analytics, monthly " +
          "budget limits, currency selection, or cloud sync — but it is deliberately kept minimal " +
          "for the purposes of this presentation."
        ),
        spacer(),
        new Paragraph({
          children: [new TextRun({
            text: "Group 2  ·  Mobile App Development  ·  Flutter Personal Expense Tracker  ·  April 2026",
            size: 18, color: MID_GREY, font: "Calibri",
          })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: PURPLE_BG, space: 8 } },
        }),

      ],
    },
  ],
});

const buf = await Packer.toBuffer(doc);
writeFileSync("project_report.docx", buf);
console.log("✓  project_report.docx written");

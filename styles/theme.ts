// styles/theme.ts
// Dette er kernen i vores design system i koden.
// ALLE farver, afstande, radius og typografi skal komme herfra.

export const theme = {
  // ----------------------------------
  // COLORS
  // ----------------------------------
  colors: {
    // --- Surfaces (baggrunde og flader) ---
    background: "#FFFFFF",   // App-baggrund
    surface: "#DBEAFE",      // Cards, modals, inputs
    labelBg: "#F7F7F7",      // Label-baggrund (fx input labels)
    divider: "#E5E7EB",      // Skillelinjer

    // --- Text colors ---
    textPrimary: "#000000",  // Primær tekst (overskrifter, beløb)
    textSecondary: "#374151",// Sekundær tekst (labels, beskrivelser)
    textOnPrimary: "#FFFFFF",// Tekst oven på primary buttons
    textDisabled: "#9CA3AF", // Disabled tekst / placeholders

    // --- Brand / actions ---
    primary: "#3B82F6",         // Primære knapper (fx "Ny udgift")
    primaryPressed: "#2563EB",  // Hover / pressed state på knapper
    primaryDisabled: "#DBEAFE", // Disabled knapper (lys blå)

    // --- Semantiske farver (betydning) ---
    success: "#39D52E",   // Penge tilbage / positive værdier
    luxury: "#8A2BE2",    // Luksus-udgifter
    danger: "#FE0303",    // Penge brugt / error / slet

    // --- Borders ---
    border: "#D1D5DB",       // Standard border (inputs, cards)
    borderFocus: "#3B82F6",  // Border når input er i fokus
    borderError: "#FE0303",  // Border ved fejl
  },

  // ----------------------------------
  // SPACING
  // ----------------------------------
  // Bruges til padding, margin og gaps.
  spacing: {
    xs: 4,    // Meget små afstande (ikon spacing)
    sm: 8,    // Små afstande
    md: 12,   // Standard spacing mellem elementer
    lg: 16,   // Indvendig padding i cards / sektioner
    xl: 24,   // Afstand mellem større sektioner
    xxl: 32,  // Store afstande
    hero: 64, // Hero spacing (store overskrifter / top sections)
  },

  // ----------------------------------
  // RADIUS
  // ----------------------------------
  // Bruges til afrundede hjørner på UI-elementer.
  radius: {
    sm: 8,      // Små elementer
    md: 12,     // Inputs, cards
    lg: 16,     // Modals
    pill: 999,  // Runde knapper (FAB, primary buttons)
  },

  // ----------------------------------
  // TYPOGRAPHY
  // ----------------------------------
  typography: {
    h1: {
      fontSize: 48,
      lineHeight: 60,
      fontWeight: "700" as const, // Overskrifter (Headline 1)
    },
    h2: {
      fontSize: 34,
      lineHeight: 50,
      fontWeight: "700" as const, // Headline 2
    },
    h3: {
      fontSize: 28,
      lineHeight: 38,
      fontWeight: "700" as const, // Headline 3
    },
    h4: {
      fontSize: 18,
      lineHeight: 22,
      fontWeight: "700" as const, // Labels / mindre overskrifter
    },
    p: {
      fontSize: 14,
      lineHeight: 24,
      fontWeight: "400" as const, // Brødtekst
    },
  },
} as const;

// "as const" gør at TypeScript låser værdierne,
// så de ikke kan ændres utilsigtet andre steder i appen.

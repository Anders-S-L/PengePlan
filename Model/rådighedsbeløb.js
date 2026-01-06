// Konverterer en vilkårlig værdi til et sikkert tal (number)
// Håndterer null, undefined, strings med komma og ugyldige værdier
const toNumber = (value) => {
  // Hvis værdien ikke findes, betragtes den som 0
  if (value === null || value === undefined) return 0;

  // Hvis værdien er en string (fx "123,45")
  if (typeof value === "string") {
    // Erstat komma med punktum og fjern mellemrum
    const normalized = value.replace(",", ".").trim();

    // Forsøg at konvertere til et tal
    const parsed = Number(normalized);

    // Returnér tallet hvis det er gyldigt, ellers 0
    return Number.isFinite(parsed) ? parsed : 0;
  }

  // Håndterer tal og andre typer
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Summerer enten ét tal eller en liste af tal/strings
// Alle værdier normaliseres via toNumber
const sumValues = (values) => {
  // Hvis der ikke er nogen værdier, returnér 0
  if (!values) return 0;

  // Hvis values er en liste, summeres alle elementer
  if (Array.isArray(values)) {
    return values.reduce((sum, v) => sum + toNumber(v), 0);
  }

  // Hvis values er et enkelt tal eller string
  return toNumber(values);
};

// Beregner rådighedsbeløbet ud fra indtægter og udgifter
// fixedIncome + variableIncome - fixedExpenses - variableExpenses
export const calculateDisposableAmount = ({
  fixedIncome = [],
  variableIncome = [],
  fixedExpenses = [],
  variableExpenses = [],
}) => {
  return (
    
    sumValues(fixedIncome) +        // samlede faste indtægter
    sumValues(variableIncome) -     // samlede variable indtægter
    sumValues(fixedExpenses) -      // samlede faste udgifter
    sumValues(variableExpenses)     // samlede variable udgifter
  );
};

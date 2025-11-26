export function fechaMasDias(days = 10) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  cy.log(d);

  //para inputISO
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return {
    inputISO: `${yyyy}-${mm}-${dd}`, // para <input type="date">
  };
}

//Para TC2
export function ultimoDiaMes() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // ISO para el input
  const yyyy = lastDay.getFullYear();
  const mm = String(lastDay.getMonth() + 1).padStart(2, "0");
  const dd = String(lastDay.getDate()).padStart(2, "0");
  const inputISO = `${yyyy}-${mm}-${dd}`;

  // Formateo la fecha según el locale
  const formattedDate = new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(lastDay);

  // Ahora siempre arranco con la fecha
  let expectedText = formattedDate;

  // Agrego reglas de negocio
  if (
    lastDay.getFullYear() === now.getFullYear() &&
    lastDay.getMonth() === now.getMonth() &&
    lastDay.getDate() === now.getDate()
  ) {
    expectedText = `${formattedDate}(Vencido)`;
  } else if (
    lastDay.getFullYear() === now.getFullYear() &&
    lastDay.getMonth() === now.getMonth() &&
    lastDay.getDate() === now.getDate() + 1
  ) {
    expectedText = `${formattedDate}(Próximo a vencer)`;
  }

  return { inputISO, expectedText };
}

//PARA TC5
// 🚀 Nuevo: primer día del mes actual
export function primerDiaDelMes() {
  const now = new Date();
  const fistDay = new Date();
  fistDay.setDate(1); // siempre el día 1

  //AGARRANDO OBJETO DEL DIA ACTUAL SEGUN SUS COMPONENTES PARA DECORARLOS.
  const yyyy = fistDay.getFullYear();
  const mm = String(fistDay.getMonth() + 1).padStart(2, "0");
  const dd = String(fistDay.getDate()).padStart(2, "0"); // será siempre "01"
  const inputISO = `${yyyy}-${mm}-${dd}`;

  // Formateo la fecha según el locale
  const formattedDate = new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(fistDay);

  let expectedText = formattedDate;

  if (
    fistDay.getFullYear() === now.getFullYear() &&
    fistDay.getMonth() === now.getMonth() &&
    fistDay.getDate() === now.getDate()
  ) {
    expectedText = `${formattedDate}(Próximo a vencer)`;
  } else {
    expectedText = `${formattedDate}(Vencido)`;
  }
  return { inputISO, expectedText };
}

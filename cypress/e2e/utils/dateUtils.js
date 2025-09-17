export function fechaMasDias(days = 10) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  cy.log(d);

  //para inputISO
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  //para assertion
  const mmFormated = String(d.getMonth() + 1);

  return {
    inputISO: `${yyyy}-${mm}-${dd}`, // para <input type="date">
    displayDMY: `${dd}/${mmFormated}/${yyyy}`, // para el modal (tu UI)
  };
}

export function ultimosDiasMes() {
  const d = new Date();
  d.setDate(28);

  //para inputISO
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  //para assertion
  const mmFormated = String(d.getMonth() + 1);

  return {
    inputISO: `${yyyy}-${mm}-${dd}`, // para <input type="date">
    displayDMY: `${dd}/${mmFormated}/${yyyy}`, // para el modal (tu UI)
  };
}

// 🚀 Nuevo: primer día del mes actual
export function primerDiaDelMes() {
  const d = new Date();
  d.setDate(1); // siempre el día 1

  //AGARRANDO OBJETO DEL DIA ACTUAL SEGUN SUS COMPONENTES PARA DECORARLOS.
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0"); // será siempre "01"

  //para assertion
  const mmFormated = String(d.getMonth() + 1);
  const ddFormated = String(d.getDate());

  return {
    inputISO: `${yyyy}-${mm}-${dd}`,
    displayDMY: `${ddFormated}/${mmFormated}/${yyyy}(Vencido)`,
  };
}

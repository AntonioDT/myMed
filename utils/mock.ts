export let mockData = [
  {
    id: "1",
    categoria: "Emocromo",
    data: "2025-01-12",
    valori: [
      {
        id: 1,
        nomeValore: "globuliBianchi",
        valore: 6.1,
        unitaMisura: "x10^3/µL",
        range: {
          tipo: "numerico",
          min: 4.0,
          max: 10.0
        },
        stato: "OK"
      },
      {
        id: 2,
        nomeValore: "emoglobina",
        valore: 11.2,
        unitaMisura: "g/dL",
        range: {
          tipo: "numerico",
          min: 13.0,
          max: 17.5
        },
        stato: "KO"
      }
    ]
  },
  {
    id: "2",
    categoria: "Colesterolo",
    data: "2025-01-10",
    valori: [
      {
        id: 3,
        nomeValore: "HDL",
        valore: 100,
        unitaMisura: "mg/dL",
        range: {
          tipo: "numerico",
          min: 45,
          max: null
        },
        stato: "OK"
      },
      {
        id: 4,
        nomeValore: "LDL",
        valore: 165,
        unitaMisura: "mg/dL",
        range: {
          tipo: "numerico",
          min: null,
          max: 130
        },
        stato: "KO"
      }
    ]
  },
  {
    id: "3",
    categoria: "Urine",
    data: "2025-01-08",
    valori: [
      {
        id: 5,
        nomeValore: "ph",
        valore: 6.0,
        unitaMisura: null,
        range: {
          tipo: "numerico",
          min: 5.0,
          max: 7.5
        },
        stato: "normale"
      },
      {
        id: 6,
        nomeValore: "proteine",
        valore: "assenti",
        unitaMisura: null,
        range: {
          tipo: "testuale",
          testo: "assenti"
        },
        stato: "OK"
      }
    ]
  }
];

export const addAnalysis = (newAnalysis: any) => {
  mockData.unshift(newAnalysis);
};

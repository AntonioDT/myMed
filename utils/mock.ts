export const mockData = [
  {
    id: "ref-1",
    data: "2025-01-12",
    laboratorio: "Laboratorio San Marco",
    sezioni: [
      {
        id: "sec-1",
        categoria: "Emocromo",
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
        id: "sec-2",
        categoria: null,
        valori: [
          {
            id: 3,
            nomeValore: "Vitamina D",
            valore: 35.5,
            unitaMisura: "ng/mL",
            range: {
              tipo: "testuale",
              testo: "> 30 Valore ottimale"
            },
            stato: "OK"
          }
        ]
      }
    ]
  },
  {
    id: "ref-2",
    data: "2025-01-10",
    laboratorio: "Ospedale Centrale",
    sezioni: [
      {
        id: "sec-3",
        categoria: "Colesterolo",
        valori: [
          {
            id: 4,
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
            id: 5,
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
        id: "sec-4",
        categoria: "Urine",
        valori: [
          {
            id: 6,
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
            id: 7,
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
    ]
  }
];


export const addAnalysis = (newAnalysis: any) => {
  mockData.unshift(newAnalysis);
};

const pirates = [
  {
    name: 'Jim Hawkins',
    role: 'Giovane Avventuriero',
    abilities: [
      { name: 'Scaltrezza del Giocattolo', effect: 'incrementa_scappare', value: 3 },
      { name: 'Spada di Base', effect: 'incrementa_attacco', value: 4 }
    ],
    stats: {
      health: 80,
      attack: 10,
      defense: 8,
      gold: 20
    },
    inventory: [
      { name: 'Spada di Legno', type: 'arma', effect: 'incrementa_attacco', value: 5 },
      { name: 'Giubba di Tessuto', type: 'armatura', effect: 'incrementa_difesa', value: 3 }
    ]
  },
  {
    name: 'Anne Bonny',
    role: 'Pirata Temuta',
    abilities: [
      { name: 'Spada Feroce', effect: 'incrementa_attacco', value: 8 },
      { name: 'Coraggio Inarrestabile', effect: 'modifica_difesa', value: -4 },
      { name: 'Velocità Improvvisa', effect: 'incrementa_scappare', value: 6 }
    ],
    stats: {
      health: 95,
      attack: 18,
      defense: 14,
      gold: 50
    },
    inventory: [
      { name: 'Spada di Anne', type: 'arma', effect: 'incrementa_attacco', value: 10 },
      { name: 'Fodero di Cuoio', type: 'armatura', effect: 'incrementa_difesa', value: 4 }
    ]
  },
  {
    name: 'Captain Hook',
    role: 'Capitano del Jolly Roger',
    abilities: [
      { name: 'Sparare con il Corno', effect: 'incrementa_attacco', value: 8 },
      { name: 'Stratega Insidioso', effect: 'modifica_difesa', value: -5 },
      { name: 'Maestro della Pirateria', effect: 'incrementa_gold', value: 20 }
    ],
    stats: {
      health: 100,
      attack: 25,
      defense: 10,
      gold: 100
    },
    inventory: [
      { name: 'Spada di Ferro', type: 'arma', effect: 'incrementa_attacco', value: 10 },
      { name: 'Cappello a Tre Punte', type: 'armatura', effect: 'incrementa_difesa', value: 5 }
    ]
  },
  {
    name: 'Long John Silver',
    role: 'Secondo in Comando',
    abilities: [
      { name: 'Carisma Persuasivo', effect: 'incrementa_gold', value: 15 },
      { name: 'Combattente Implacabile', effect: 'incrementa_attacco', value: 7 },
      { name: 'Evasione Agile', effect: 'modifica_difesa', value: -3 }
    ],
    stats: {
      health: 110,
      attack: 22,
      defense: 12,
      gold: 80
    },
    inventory: [
      { name: 'Pistola del Capitano', type: 'arma', effect: 'incrementa_attacco', value: 8 },
      { name: 'Gilet di Cuoio', type: 'armatura', effect: 'incrementa_difesa', value: 7 }
    ]
  },
  {
    name: 'Davy Jones',
    role: 'Signore del Mare',
    abilities: [
      { name: 'Maleficio Marittimo', effect: 'incrementa_attacco', value: 12 },
      { name: 'Scudo di Corallo', effect: 'incrementa_difesa', value: 10 },
      { name: 'Infiltrazione Spettrale', effect: 'modifica_difesa', value: -6 }
    ],
    stats: {
      health: 120,
      attack: 30,
      defense: 20,
      gold: 150
    },
    inventory: [
      { name: 'Spada Spettrale', type: 'arma', effect: 'incrementa_attacco', value: 15 },
      { name: 'Corazza di Alga', type: 'armatura', effect: 'incrementa_difesa', value: 8 }
    ]
  }
];

let player = null;

function getRandom(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function createNewPirate(name, desc) {
  const health = getRandom(40, 80);
  const attack = getRandom(1, 15);
  const defense = getRandom(1, 15);

  player = {
    name,
    role: desc,
    stats: {
      health,
      attack,
      defense,
      gold: 0,
    },
    inventory: [],
    level: 1,
  }
  console.log(player);
}

document.querySelector("#createPirateButton").addEventListener("click", function() {
  const name = document.querySelector("#createPirateName").value;
  const desc = document.querySelector("#createPirateDesc").value;
  
  createNewPirate(name, desc);
  document.querySelector("#createPirateName").value = "";
  document.querySelector("#createPirateDesc").value = "";
})

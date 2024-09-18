const STAT_IMG_PATH = {
  strength: "strength.webp",
  dexterity: "dexterity.webp",
  endurance: "endurance.webp",
  luck: "luck.webp",
  gold: "gold.webp",
  health: "health.webp",
}

let ITEMS = [];
let CLASSES = [];

const player = {
  name: "",
  className: "", // Classe del pirata, es. "Capitano", "Artigliere", ecc.
  stats: {
    strength: 14,      // Forza fisica per attacchi corpo a corpo
    dexterity: 12,     // Abilità e velocità nei movimenti
    endurance: 10,     // Resistenza fisica e capacità di sopportare danni
    luck: 8,           // Fortuna, può influire su eventi casuali o colpi critici
    health: 100,       // Punti salute
    gold: 0,           // Quantità di oro posseduta dal pirata
  },
  equipment: {
    weapon: "",  // Arma attuale del pirata
    armor: "",  // Armatura attuale
  },
  calculateHitChance(target) {
    const baseHitChance = 50;  // Base % di probabilità di colpire
    const dexterityBonus = this.stats.dexterity * 2; // La destrezza aggiunge precisione
    const evasion = target.stats.dexterity * 2; // La destrezza del bersaglio riduce la probabilità di colpire

    return baseHitChance + dexterityBonus - evasion;
  },
  attack(target) {
    renderBattleLog(`${this.name} attacca ${target.name}`);
    const hitChance = this.calculateHitChance(target);
    const hitRoll = Math.random() * 100;  // Tira un numero tra 0 e 100

    if (hitRoll < hitChance) {
      // Colpo riuscito
      let baseDamage = this.stats.strength;  // Danno basato sulla forza
      const criticalChance = this.stats.luck;  // Usa la fortuna per determinare i critici
      const criticalRoll = Math.random() * 100;
      
      // Se il roll critico è inferiore alla fortuna, infliggi un critico
      if (criticalRoll < criticalChance) {
        baseDamage *= 2;  // Danno critico (raddoppiato)
      }
      
      const totalDamage = baseDamage;
      // Applica danno al bersaglio
      target.takeDamage(totalDamage);
      renderBattleLog(`${target.name} subisce un attacco di ${totalDamage}. La sua salute scende a ${target.stats.health}`);
    } else {
      renderBattleLog(`${this.name} ha mancato l'attacco!`);
    }
  },
  takeDamage(damage) {
    const reducedDamage = damage - this.stats.endurance;
    
    this.stats.health -= Math.max(reducedDamage, 0);

    if (this.stats.health < 0) this.stats.health = 0;
  },
}

const enemies = [
  {
    name: "Pirata Principiante",
    className: "Corsaro",
    stats: {
      strength: 5,
      dexterity: 5,
      endurance: 5,
      luck: 5,
      health: 50,
      gold: 50,
    },
    equipment: {
      weapon: "Pugnale",
      armor: "",
    },
    calculateHitChance(target) {
      const baseHitChance = 50;
      const dexterityBonus = this.stats.dexterity * 2;
      const evasion = target.stats.dexterity * 2;
  
      return baseHitChance + dexterityBonus - evasion;
    },
    attack(target) {
      renderBattleLog(`${this.name} attacca ${target.name}`);
      const hitChance = this.calculateHitChance(target);
      const hitRoll = Math.random() * 100;
  
      if (hitRoll < hitChance) {
        // Colpo riuscito
        let baseDamage = this.stats.strength;
        const weaponBonus = this.getWeaponBonus();
        const criticalChance = this.stats.luck;
        const criticalRoll = Math.random() * 100;
        
        if (criticalRoll < criticalChance) {
          baseDamage *= 2;
        }

        const totalDamage = baseDamage + weaponBonus;
        target.takeDamage(totalDamage);

        renderBattleLog(`${target.name} subisce un attacco di ${totalDamage}. La sua salute scende a ${target.stats.health}`);
      } else {
        renderBattleLog(`${this.name} ha mancato l'attacco!`);
      }
    },
    takeDamage(damage) {
      const reducedDamage = damage - this.stats.endurance;  // Applica la riduzione del danno
      
      this.stats.health -= Math.max(reducedDamage, 0);
  
      if (this.stats.health < 0) this.stats.health = 0;
    },
    getWeaponBonus() {
      return 1;
    }
  },
  {
    name: "Pirata Esperto",
    className: "Assassino del Porto",
    stats: {
      strength: 10,
      dexterity: 12,
      endurance: 10,
      luck: 8,
      health: 100,
      gold: 150,
    },
    equipment: {
      weapon: "Sciabola",
      armor: "Leggera",
    },
    calculateHitChance(target) {
      const baseHitChance = 50;
      const dexterityBonus = this.stats.dexterity * 2;
      const evasion = target.stats.dexterity * 2;
  
      return baseHitChance + dexterityBonus - evasion;
    },
    attack(target) {
      renderBattleLog(`${this.name} attacca ${target.name}`);
      const hitChance = this.calculateHitChance(target);
      const hitRoll = Math.random() * 100;
  
      if (hitRoll < hitChance) {
        // Colpo riuscito
        let baseDamage = this.stats.strength;
        const weaponBonus = this.getWeaponBonus();
        const criticalChance = this.stats.luck;
        const criticalRoll = Math.random() * 100;
        
        if (criticalRoll < criticalChance) {
          baseDamage *= 2;
        }

        const totalDamage = baseDamage + weaponBonus;
        target.takeDamage(totalDamage);

        renderBattleLog(`${target.name} subisce un attacco di ${totalDamage}. La sua salute scende a ${target.stats.health}`);
      } else {
        renderBattleLog(`${this.name} ha mancato l'attacco!`);
      }
    },
    takeDamage(damage) {
      const reducedDamage = damage - this.stats.endurance;  // Applica la riduzione del danno
      
      this.stats.health -= Math.max(reducedDamage, 0);
  
      if (this.stats.health < 0) this.stats.health = 0;
    },
    getWeaponBonus() {
      return 3;
    }
  },
  {
    name: "Pirata Veterano",
    className: "Mastro d'Armi",
    stats: {
      strength: 15,
      dexterity: 14,
      endurance: 12,
      luck: 12,
      health: 100,
      gold: 300,
    },
    equipment: {
      weapon: "Alabarda",
      armor: "Media",
    },
    calculateHitChance(target) {
      const baseHitChance = 50;
      const dexterityBonus = this.stats.dexterity * 2;
      const evasion = target.stats.dexterity * 2;
  
      return baseHitChance + dexterityBonus - evasion;
    },
    attack(target) {
      renderBattleLog(`${this.name} attacca ${target.name}`);
      const hitChance = this.calculateHitChance(target);
      const hitRoll = Math.random() * 100;
  
      if (hitRoll < hitChance) {
        // Colpo riuscito
        let baseDamage = this.stats.strength;
        const weaponBonus = this.getWeaponBonus();
        const criticalChance = this.stats.luck;
        const criticalRoll = Math.random() * 100;
        
        if (criticalRoll < criticalChance) {
          baseDamage *= 2;
        }

        const totalDamage = baseDamage + weaponBonus;
        target.takeDamage(totalDamage);

        renderBattleLog(`${target.name} subisce un attacco di ${totalDamage}. La sua salute scende a ${target.stats.health}`);
      } else {
        renderBattleLog(`${this.name} ha mancato l'attacco!`);
      }
    },
    takeDamage(damage) {
      const reducedDamage = damage - this.stats.endurance;  // Applica la riduzione del danno
      
      this.stats.health -= Math.max(reducedDamage, 0);
  
      if (this.stats.health < 0) this.stats.health = 0;
    },
    getWeaponBonus() {
      return 5;
    }
  }
];

let currentLevel = 0;

function combat() {
  emptyBattleLog();
  const enemy = enemies[currentLevel];
  player.attack(enemy);
  enemy.attack(player);

  if (enemy.stats.health <= 0) {
    player.stats.gold += enemy.stats.gold;
    player.stats.strength += 2;
    player.stats.dexterity += 2;
    player.stats.endurance += 2;
    player.stats.luck += 2;
    player.stats.health += 20;
    currentLevel++;
  }

  updateUI();
}

function emptyBattleLog() {
  document.querySelector("#battle-log").innerHTML = "";
}

function renderBattleLog(text) {
  const newLog = document.createElement("li");
  newLog.textContent = text;

  const ul = document.querySelector("#battle-log");
  ul.appendChild(newLog);

  setTimeout(() => {
    newLog.classList.add("fade-in");
  }, 10);
}

function renderStats(character, tagId) {
  document.querySelector(tagId).innerHTML = "";
  Object.keys(character.stats).forEach((stat) => {
    document.querySelector(tagId).innerHTML += `
      <li><img src="assets/${stat}.webp" alt="${stat}"><span class="stat-value">${character.stats[stat]}</span><span class="stat-name">${stat}</span></li>
    `;
  })
}

function renderBattleInventory(character, tagId) {
  document.querySelector(tagId).innerHTML = "";
  Object.keys(character.equipment).forEach((key) => {
    if (character.equipment[key]) {
      document.querySelector(tagId).innerHTML += `
        <li><img src="assets/${key}.webp" alt="${key}"><span>${character.equipment[key]}</span></li>
      `;
    }
  })
}

function renderPlayer() {
  document.querySelector("#player-name").innerText = player.name;
  renderStats(player, "#player-stats");
  renderBattleInventory(player, "#player-inventory");
}

function renderEnemy() {
  const enemy = enemies[currentLevel];
  document.querySelector("#level").innerText = `Level ${currentLevel+1}`;
  document.querySelector("#enemy-name").innerText = enemy.name;
  renderStats(enemy, "#enemy-stats");
  renderBattleInventory(enemy, "#enemy-inventory");
}

function buyItem() {
  const inventoryItem = ITEMS.find(item => {
    return item.name === this.dataset.item;
  });
  if (inventoryItem && player.stats.gold >= inventoryItem.cost) {
    switch(inventoryItem.type) {
      case "weapon":
        player.equipment.weapon = inventoryItem.name;
        break;
      case "armor":
        player.equipment.armor = inventoryItem.name;
        break;
    }
    Object.keys(inventoryItem.bonus).forEach(property => {
      player.stats[property] += inventoryItem.bonus[property];
    })
    player.stats.gold -= inventoryItem.cost;
    renderPlayer();
  } else {
    Toastify({
      text: "You don't have enough gold!",
      style: {
        color: "#222",
        background: "linear-gradient(90deg, rgba(100,104,110,1) 0%, rgba(85,239,196,1) 100%)"
      }
    }).showToast();
  }
}

function renderInventory() {
  document.querySelectorAll(".item-buy-button").forEach(button => {
    button.removeEventListener("click", buyItem);
  });
  document.querySelector("#inventory").innerHTML = "";
  ITEMS.forEach(({ name, type, bonus, cost }) => {
    let bonusText = "";
    Object.keys(bonus).forEach(effect => {
      bonusText += `${effect}: +${bonus[effect]}\n`;
    })
    document.querySelector("#inventory").innerHTML += `
      <div class="item">
        <img src="assets/${type}.webp" />
        <p class="item-cost">$${cost} <button data-item="${name}" class="item-buy-button">Buy!</button></p>
        <p class="item-name">${name}</p>
        <p class="item-effect">${bonusText}</p>
      </div>
    `;
  });
  document.querySelectorAll(".item-buy-button").forEach(button => {
    button.addEventListener("click", buyItem);
  });
}

function updateUI() {
  renderPlayer();
  renderEnemy();
  renderInventory();
}

function startGame() {
  document.querySelector("#your-character").style.display = "none";
  document.querySelector("#battle").style.display = "flex";
  document.querySelector("#inventory-container").style.display = "block";
  updateUI();
}

async function getEntity(entity) {
  try {
    const response = await fetch(`http://localhost:3001/${entity}`);

    if (response.ok) {
      return await response.json();
    }
  } catch(error) {
    console.log(error);
  }
}

window.addEventListener("load", async function() {
  ITEMS = await getEntity("items");
  CLASSES = await getEntity("classes");

  // Creazione Select Classe Personaggio
  document.querySelector("#character-class").innerHTML = `
    <option value="" selected disabled>Select class</option>
  `;
  CLASSES.forEach(item => {
    document.querySelector("#character-class").innerHTML += `
      <option value="${item.className}">${item.className}</option>
    `;
  });

  // Gestione Select Classe Personaggio
  document.querySelector("#character-class").addEventListener("change", function(e) {
    document.querySelector("#start-button").style.display = "block";
    document.querySelector("#create-character-stats").innerHTML = "";
    document.querySelector("#character-class-description").innerHTML = "";
    const pirateClass = CLASSES.find(item => item.className === e.target.value);
    document.querySelector("#character-class-description").innerHTML = `
      <p>${pirateClass.description}</p>
    `;
    Object.keys(pirateClass.stats).forEach(stat => {
      document.querySelector("#create-character-stats").innerHTML += `
        <div class="character-stat">
          <img src="assets/${STAT_IMG_PATH[stat]}">
          <p class="stat-value">${pirateClass.stats[stat]}</p>
          <p class="stat-name">${stat}</p>
        </div>
      `;
    })
    player.className = pirateClass.className;
    player.stats = { ...pirateClass.stats };
    
  })

  // Gestione input nome
  document.querySelector("#character-name").addEventListener("change", function(e) {
    player.name = e.target.value;
  });

  // Gestione pulsante START
  document.querySelector("#start-button").addEventListener("click", function() {
    if(player.name === "" || player.className ===  "") {
      Toastify({
        text: "You need a class and a name to play!",
        style: {
          color: "#222",
          background: "linear-gradient(90deg, rgba(100,104,110,1) 0%, rgba(85,239,196,1) 100%)"
        }
      }).showToast();
    } else {
      startGame();
    }
  })

  // Gestione pulsante attacco
  document.querySelector("#attack-button").addEventListener("click", function() {
    combat();
  })
})
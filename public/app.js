/** Utils */
const STAT_IMG_PATH = {
  strength: "strength.webp",
  dexterity: "dexterity.webp",
  endurance: "endurance.webp",
  luck: "luck.webp",
  gold: "gold.webp",
  health: "health.webp",
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

function createCharacter(name, className, stats, equipment, bonus = 0) {
  return {
    name,
    className,
    stats,
    equipment,
    calculateHitChance(target) {
      const baseHitChance = 50;  // Base % di probabilità di colpire
      const dexterityBonus = this.stats.dexterity * 2; // La destrezza aggiunge precisione
      const evasion = target.stats.dexterity * 2; // La destrezza del bersaglio riduce la probabilità di colpire
  
      return baseHitChance + dexterityBonus - evasion;
    },
    attack(target) {
      const hitChance = this.calculateHitChance(target);
      const hitRoll = Math.random() * 100;  // Tira un numero tra 0 e 100
  
      if (hitRoll < hitChance) {
        // Colpo riuscito
        let baseDamage = this.stats.strength;  // Danno basato sulla forza
        const weaponBonus = bonus;
        const criticalChance = this.stats.luck;  // Usa la fortuna per determinare i critici
        const criticalRoll = Math.random() * 100;
        
        // Se il roll critico è inferiore alla fortuna, infliggi un critico
        if (criticalRoll < criticalChance) {
          baseDamage *= 2;  // Danno critico (raddoppiato)
        }
        
        // Applica danno al bersaglio
        target.takeDamage(baseDamage + weaponBonus);
      }
    },
    takeDamage(damage) {
      const reducedDamage = damage - this.stats.endurance;
      this.stats.health -= Math.max(reducedDamage, 0);
      return this.stats.health <= 0;
    },
  }
}

/* Game data */
let DEFAULT_INCREMENT = 2;
let HEALTH_INCREMENT = 20;
let items = [];
let classes = [];
let player = null;
let selectedClass = null;
let currentLevel = 0;
const enemies = [
  createCharacter("Pirata Principiante", "Corsaro", {
    strength: 5,
    dexterity: 5,
    endurance: 5,
    luck: 5,
    health: 50,
    gold: 50,
  }, {
    weapon: "Pugnale",
    armor: "",
  }, 1),
  createCharacter("Pirata Esperto", "Assassino del Porto", {
    strength: 10,
    dexterity: 12,
    endurance: 10,
    luck: 8,
    health: 100,
    gold: 150,
  }, {
    weapon: "Sciabola",
    armor: "Leggera",
  }, 3),
  createCharacter("Pirata Veterano", "Mastro d'Armi", {
    strength: 15,
    dexterity: 14,
    endurance: 12,
    luck: 12,
    health: 100,
    gold: 300,
  }, {
    weapon: "Alabarda",
    armor: "Media",
  }, 5),
];

/** Funzioni di Rendering */
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

function renderPlayerInfo() {
  document.querySelector("#player-name").innerText = player.name;
  renderStats(player, "#player-stats");
  renderBattleInventory(player, "#player-inventory");
}

function renderEnemyInfo() {
  const enemy = enemies[currentLevel];
  document.querySelector("#level").innerText = `Level ${currentLevel+1}`;
  document.querySelector("#enemy-name").innerText = enemy.name;
  renderStats(enemy, "#enemy-stats");
  renderBattleInventory(enemy, "#enemy-inventory");
}

function renderInventory() {
  document.querySelectorAll(".item-buy-button").forEach(button => {
    button.removeEventListener("click", buyItem);
  });
  document.querySelector("#inventory").innerHTML = "";
  items.forEach(({ name, type, bonus, cost }) => {
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

/** Funzioni di Gioco */
function combat() {
  emptyBattleLog();
  const enemy = enemies[currentLevel];
  const enemyHealthBeforeAttack = enemy.stats.health;
  const playerHealthBeforeAttack = player.stats.health;

  player.attack(enemy);
  enemy.attack(player);

  if (enemy.stats.health < enemyHealthBeforeAttack) {
    renderBattleLog(`${player.name} subisce un attacco: la sua salute scende a ${enemy.stats.health}`);
  } else {
    renderBattleLog(`${player.name} ha mancato l'attacco!`);
  }

  if (player.stats.health < playerHealthBeforeAttack) {
    renderBattleLog(`${player.name} subisce un attacco: la sua salute scende a ${player.stats.health}`);
  } else {
    renderBattleLog(`${enemy.name} ha mancato l'attacco!`);
  }

  // Nemico sconfitto
  if (enemy.stats.health <= 0) {
    player.stats.gold += enemy.stats.gold;
    player.stats.strength += DEFAULT_INCREMENT;
    player.stats.dexterity += DEFAULT_INCREMENT;
    player.stats.endurance += DEFAULT_INCREMENT;
    player.stats.luck += DEFAULT_INCREMENT;
    player.stats.health += HEALTH_INCREMENT;
    currentLevel++;
  }

  update();
}

function buyItem() {
  const inventoryItem = items.find(item => {
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
    renderPlayerInfo();
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

function update() {
  renderPlayerInfo();
  renderEnemyInfo();
}

/** Main function */
window.addEventListener("load", async function() {
  // API per ottenere items e classi personaggi
  items = await getEntity("items");
  classes = await getEntity("classes");

  // Creazione Select Classe Personaggio
  document.querySelector("#character-class").innerHTML = `
    <option value="" selected disabled>Select class</option>
  `;
  classes.forEach(item => {
    document.querySelector("#character-class").innerHTML += `
      <option value="${item.className}">${item.className}</option>
    `;
  });

  // Gestione Select Classe Personaggio
  document.querySelector("#character-class").addEventListener("change", function(e) {
    document.querySelector("#create-character-stats").innerHTML = "";
    document.querySelector("#character-class-description").innerHTML = "";
    selectedClass = classes.find(item => item.className === e.target.value);
    document.querySelector("#character-class-description").innerHTML = `
      <p>${selectedClass.description}</p>
    `;
    Object.keys(selectedClass.stats).forEach(stat => {
      document.querySelector("#create-character-stats").innerHTML += `
        <div class="character-stat">
          <img src="assets/${STAT_IMG_PATH[stat]}">
          <p class="stat-value">${selectedClass.stats[stat]}</p>
          <p class="stat-name">${stat}</p>
        </div>
      `;
    })
  })

  // Gestione pulsante START
  document.querySelector("#start-button").addEventListener("click", function() {
    const playerName = document.querySelector("#character-name").value;
    const playerClass = document.querySelector("#character-class").value;
    
    if(playerName === "" || playerClass ===  "") {
      Toastify({
        text: "You need a class and a name to play!",
        style: {
          color: "#222",
          background: "linear-gradient(90deg, rgba(100,104,110,1) 0%, rgba(85,239,196,1) 100%)"
        }
      }).showToast();
    } else {
      document.querySelector("#your-character").style.display = "none";
      document.querySelector("#battle").style.display = "flex";
      document.querySelector("#inventory-container").style.display = "block";
      player = createCharacter(playerName, playerClass, selectedClass.stats, { weapon: null, armor: null });
      renderInventory();
      update();
    }
  })

  // Gestione pulsante ATTACK
  document.querySelector("#attack-button").addEventListener("click", combat);

  /* DEBUG ONLY */
  document.querySelector("#your-character").style.display = "none";
  document.querySelector("#battle").style.display = "flex";
  document.querySelector("#inventory-container").style.display = "block";
  playerClass = "Corsaro";
  selectedClass = classes[0];
  player = createCharacter("Adriano", playerClass, selectedClass.stats, { weapon: null, armor: null });
  renderInventory();
  update();
})
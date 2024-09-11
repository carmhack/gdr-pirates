const STAT_IMG_PATH = {
  strength: "strength.webp",
  dexterity: "dexterity.webp",
  endurance: "endurance.webp",
  luck: "luck.webp",
  gold: "gold.webp",
  health: "health.webp",
}

const pirateClasses = [
  {
    className: "Corsaro",
    description: "Un abile combattente specializzato nell'uso della sciabola e nelle battaglie corpo a corpo. I Corsari sono avventurieri impavidi, noti per la loro forza e coraggio sul campo di battaglia. Esperti di assalti navali, sono i leader dell'equipaggio durante gli scontri.",
    stats: {
      strength: 14,
      dexterity: 12,
      endurance: 10,
      luck: 8
    }
  },
  {
    className: "Sciamano del Mare",
    description: "Un mistico legato agli spiriti del mare e alle forze oceaniche. Lo Sciamano del Mare usa antichi poteri e incantesimi per controllare le acque, evocare creature marine o proteggere l'equipaggio dalle tempeste e dalle maledizioni.",
    stats: {
      strength: 8,
      dexterity: 10,
      endurance: 12,
      luck: 14
    }
  },
  {
    className: "Assassino del Porto",
    description: "Un maestro della furtività e degli attacchi rapidi e letali. L'Assassino del Porto è un pirata ombra, capace di muoversi inosservato e colpire silenziosamente, spesso eliminando i nemici prima che possano reagire.",
    stats: {
      strength: 10,
      dexterity: 16,
      endurance: 8,
      luck: 12
    }
  },
  {
    className: "Mastro d'Armi",
    description: "Un guerriero esperto nell'uso di diverse armi, dalle spade ai cannoni. Il Mastro d'Armi è una forza temibile in combattimento, capace di resistere ai colpi più duri e infliggere danni devastanti ai nemici, sia a bordo della nave che sul campo.",
    stats: {
      strength: 16,
      dexterity: 10,
      endurance: 14,
      luck: 8
    }
  },
  {
    className: "Contrabbandiere",
    description: "Un mercante illegale e astuto trafficante, il Contrabbandiere è maestro nel fare affari e nel muoversi nell'ombra. Sempre pronto a sfruttare ogni opportunità, riesce a eludere le autorità e a fare fortuna con carichi proibiti.",
    stats: {
      strength: 10,
      dexterity: 12,
      endurance: 10,
      luck: 14
    }
  },
  {
    className: "Mozzo Avventuriero",
    description: "Il giovane e inesperto mozzo, pronto a tutto pur di vivere avventure emozionanti. Sebbene non ancora esperto come i pirati veterani, il Mozzo Avventuriero è pieno di entusiasmo e fortuna, sempre alla ricerca di tesori e opportunità.",
    stats: {
      strength: 10,
      dexterity: 12,
      endurance: 12,
      luck: 14
    }
  },
  {
    className: "Spadaccino",
    description: "Un maestro del duello e dell'arte della spada, lo Spadaccino è preciso e letale nei combattimenti uno contro uno. Grazie alla sua incredibile destrezza e abilità con la lama, è in grado di sconfiggere nemici più potenti con eleganza e rapidità.",
    stats: {
      strength: 12,
      dexterity: 16,
      endurance: 10,
      luck: 8
    }
  }
];

const player = {
  name: "Adriano",
  className: "Corsaro", // Classe del pirata, es. "Capitano", "Artigliere", ecc.
  gold: 0,  // Quantità di oro posseduta dal pirata
  stats: {
    strength: 14,      // Forza fisica per attacchi corpo a corpo
    dexterity: 12,     // Abilità e velocità nei movimenti
    endurance: 10,     // Resistenza fisica e capacità di sopportare danni
    luck: 8,           // Fortuna, può influire su eventi casuali o colpi critici
    health: 100,       // Punti salute
  },
  equipment: {
    weapon: "Pistola Mezza Rotta",  // Arma attuale del pirata
    armor: "Leggera",  // Armatura attuale
  },
  calculateHitChance(target) {
    const baseHitChance = 50;  // Base % di probabilità di colpire
    const dexterityBonus = this.stats.dexterity * 2; // La destrezza aggiunge precisione
    const evasion = target.stats.dexterity * 2; // La destrezza del bersaglio riduce la probabilità di colpire

    return baseHitChance + dexterityBonus - evasion;
  },
  attack(target) {
    console.log(`${this.name} attacca ${target.name}`);
    const hitChance = this.calculateHitChance(target);
    const hitRoll = Math.random() * 100;  // Tira un numero tra 0 e 100

    if (hitRoll < hitChance) {
      // Colpo riuscito
      const baseDamage = this.stats.strength;  // Danno basato sulla forza
      const weaponBonus = this.getWeaponBonus();
      const criticalChance = this.stats.luck;  // Usa la fortuna per determinare i critici
      const criticalRoll = Math.random() * 100;
      
      // Se il roll critico è inferiore alla fortuna, infliggi un critico
      if (criticalRoll < criticalChance) {
        baseDamage *= 2;  // Danno critico (raddoppiato)
      }
      
      const totalDamage = baseDamage + weaponBonus;
      // Applica danno al bersaglio
      target.takeDamage(totalDamage);
      console.log(`${target.name} subisce un attacco di ${totalDamage}. La sua salute scende a ${target.stats.health}`);
    } else {
      console.log(`${this.name} ha mancato l'attacco!`);
    }
  },
  takeDamage(damage) {
    const armorBonuses = {
      lightArmor: { damageReduction: 1, dexterityPenalty: 0 },
      mediumArmor: { damageReduction: 3, dexterityPenalty: -1 },
      heavyArmor: { damageReduction: 5, dexterityPenalty: -3 }
    };
    
    // Ottiene il bonus dell'armatura
    const damageReduction = armorBonuses[this.equipment.armor]?.damageReduction || 0;
    const reducedDamage = damage - damageReduction - this.stats.endurance;  // Applica la riduzione del danno
    
    this.stats.health -= Math.max(reducedDamage, 0);

    if (this.stats.health < 0) this.stats.health = 0;
  },
  getWeaponBonus() {
    if (this.equipment.weapon === "Sciabola") {
      return 5;
    } else {
      return 0;
    }
  }
}

const enemies = [
  {
    name: "Pirata Principiante",
    className: "Corsaro",
    gold: 50,
    stats: {
      strength: 5,
      dexterity: 5,
      endurance: 5,
      luck: 5,
      health: 50,
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
      console.log(`${this.name} attacca ${target.name}`);
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

        console.log(`${target.name} subisce un attacco di ${totalDamage}. La sua salute scende a ${target.stats.health}`);
      } else {
        console.log(`${this.name} ha mancato l'attacco!`);
      }
    },
    takeDamage(damage) {
      const armorBonuses = {
        lightArmor: { damageReduction: 1, dexterityPenalty: 0 },
        mediumArmor: { damageReduction: 3, dexterityPenalty: -1 },
        heavyArmor: { damageReduction: 5, dexterityPenalty: -3 }
      };
      
      const damageReduction = armorBonuses[this.equipment.armor]?.damageReduction || 0;
      const reducedDamage = damage - damageReduction - this.stats.endurance;  // Applica la riduzione del danno
      
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
    gold: 150,
    stats: {
      strength: 10,
      dexterity: 12,
      endurance: 10,
      luck: 8,
      health: 100,
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
        
        target.takeDamage(baseDamage + weaponBonus);
      } else {
        console.log(`${this.name} ha mancato l'attacco!`);
      }
    },
    takeDamage(damage) {
      const armorBonuses = {
        lightArmor: { damageReduction: 1, dexterityPenalty: 0 },
        mediumArmor: { damageReduction: 3, dexterityPenalty: -1 },
        heavyArmor: { damageReduction: 5, dexterityPenalty: -3 }
      };
      
      const damageReduction = armorBonuses[this.equipment.armor]?.damageReduction || 0;
      const reducedDamage = damage - damageReduction - this.stats.endurance;  // Applica la riduzione del danno
      
      this.health -= Math.max(reducedDamage, 0);
  
      if (this.health < 0) this.health = 0;
    },
    getWeaponBonus() {
      return 3;
    }
  },
  {
    name: "Pirata Veterano",
    className: "Mastro d'Armi",
    gold: 300,
    stats: {
      strength: 15,
      dexterity: 14,
      endurance: 12,
      luck: 12,
      health: 100,
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
        
        target.takeDamage(baseDamage + weaponBonus);
      } else {
        console.log(`${this.name} ha mancato l'attacco!`);
      }
    },
    takeDamage(damage) {
      const armorBonuses = {
        lightArmor: { damageReduction: 1, dexterityPenalty: 0 },
        mediumArmor: { damageReduction: 3, dexterityPenalty: -1 },
        heavyArmor: { damageReduction: 5, dexterityPenalty: -3 }
      };
      
      const damageReduction = armorBonuses[this.equipment.armor]?.damageReduction || 0;
      const reducedDamage = damage - damageReduction - this.stats.endurance;  // Applica la riduzione del danno
      
      this.health -= Math.max(reducedDamage, 0);
  
      if (this.health < 0) this.health = 0;
    },
    getWeaponBonus() {
      return 5;
    }
  }
];
let currentLevel = 0;

function combat() {
  const enemy = enemies[currentLevel];
  player.attack(enemy);
  enemy.attack(player);

  /*
  let battleLog = `${player.name} attacca ${enemy.name}!\n`;

  // Calcolo del danno inflitto
  const playerDamage = Math.max(0, player.stats.attack - enemy.stats.defense);
  const enemyDamage = Math.max(0, enemy.stats.attack - player.stats.defense);

  // Applicare il danno
  enemy.stats.health -= playerDamage;
  player.stats.health -= enemyDamage;

  battleLog += `${player.name} infligge ${playerDamage} danni a ${enemy.name}.\n`;
  battleLog += `${enemy.name} ha ora ${enemy.stats.health} salute rimanente.\n`;
  battleLog += `${player.name} ha ora ${player.stats.health} salute rimanente.\n`;

  if (enemy.stats.health <= 0) {
    battleLog += `${enemy.name} è stato sconfitto!\n`;
    // Ho vinto
    player.stats.gold += enemy.stats.gold;
    currentLevel++;
    updateUI(player);
  } else if (player.stats.health <= 0) {
    // Ho perso
    battleLog += `${player.name} è stato sconfitto!\n`;
  }

  return battleLog;
  */
}

function renderBattleLog(text) {
  console.log(text);
  document.querySelector("#battle-log").innerHTML += `<p>${text}</p>`;
}

function renderStats(character, tagId) {
  document.querySelector(tagId).innerHTML = "";
  Object.keys(character.stats).forEach((stat) => {
    document.querySelector(tagId).innerHTML += `
      <li><img src="assets/${stat}.webp" alt="${stat}"><span class="stat-value">${character.stats[stat]}</span><span class="stat-name">${stat}</span></li>
    `;
  })
}

function renderInventory(character, tagId) {
  document.querySelector(tagId).innerHTML = "";
  Object.keys(character.equipment).forEach((key) => {
    document.querySelector(tagId).innerHTML += `
      <li><img src="assets/${key}.webp" alt="${key}"><span>${character.equipment[key]}</span></li>
    `;
  })
}

function renderPlayer() {
  document.querySelector("#player-name").innerText = player.name;
  renderStats(player, "#player-stats");
  renderInventory(player, "#player-inventory");
}

function renderEnemy() {
  const enemy = enemies[currentLevel];
  document.querySelector("#enemy-name").innerText = enemy.name;
  renderStats(enemy, "#enemy-stats");
  renderInventory(enemy, "#enemy-inventory");
}

function updateUI() {
  renderPlayer();
  renderEnemy();
}

function startGame() {
  document.querySelector("#your-character").style.display = "none";
  document.querySelector("#battle").style.display = "flex";
  updateUI();
}

window.addEventListener("load", function() {
  // Gestione select classe
  document.querySelector("#character-class").innerHTML = `
    <option value="" selected disabled>Select class</option>
  `;
  pirateClasses.forEach(item => {
    document.querySelector("#character-class").innerHTML += `
      <option value="${item.className}">${item.className}</option>
    `;
  });

  document.querySelector("#character-class").addEventListener("change", function(e) {
    document.querySelector("#create-character-stats").innerHTML = "";
    document.querySelector("#character-class-description").innerHTML = "";
    const pirateClass = pirateClasses.find(item => item.className === e.target.value);
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
      alert("Name and class are required!");
    } else {
      startGame();
    }
  })

  // Gestione pulsante attacco
  document.querySelector("#attack-button").addEventListener("click", function() {
    const log = combat();
    document.querySelector("#battle-log").innerText = log;
  })

  startGame();
})
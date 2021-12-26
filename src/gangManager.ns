const settings = {
  keys: {
    maxEquipment: 'BB_MAX_EQUIPMENT',
    allEquipment: 'BB_ALL_EQUIPMENT',
  },
}

function getItem(key) {
  let item = localStorage.getItem(key)

  return item ? JSON.parse(item) : undefined
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const gangMemberNamesList = [
  'Darth Vader',
  'Joker',
  'Two-Face',
  'Warden Norton',
  'Hannibal Lecter',
  'Sauron',
  'Bane',
  'Tyler Durden',
  'Agent Smith',
  'Gollum',
  'Vincent Vega',
  'Saruman',
  'Loki',
  'Vito Corleone',
  'Balrog',
  'Palpatine',
  'Michael Corleone',
  'Talia al Ghul',
  'John Doe',
  'Scarecrow',
  'Commodus',
  'Jabba the Hutt',
  'Scar',
  'Grand Moff Tarkin',
  'Boba Fett',
  'Thanos',
  'Terminator',
  'Frank Costello',
  'Hector Barbossa',
  'Xenomorph',
]

const equipmentTypes = ['Weapon', 'Armor', 'Vehicle', 'Rootkit', 'Augmentation']
const allEquipment = getItem(settings.keys.allEquipment) || ns.gang.getEquipmentNames()

function localeHHMMSS(ms = 0) {
  if (!ms) {
    ms = new Date().getTime()
  }

  return new Date(ms).toLocaleTimeString()
}

function getMyGangInformation(ns) {
  return ns.gang.getGangInformation()
}

function getMemberNames(ns) {
  return ns.gang.getMemberNames()
}

function getMemberInformation(ns, name) {
  return ns.gang.getMemberInformation(name)
}

function getMemberAbilities(ns, name) {
  const gangMemberInfo = getMemberInformation(ns, name)
  const terrorismAbilities = gangMemberInfo.hack + gangMemberInfo.str + gangMemberInfo.def + gangMemberInfo.dex + gangMemberInfo.cha
  const vigilantieAbilities = gangMemberInfo.hack + gangMemberInfo.str + gangMemberInfo.def + gangMemberInfo.dex + gangMemberInfo.agi

  return { terrorismAbilities, vigilantieAbilities, str: gangMemberInfo.str }
}

const SORT_TYPES = {
  VIGILANTIE: 'Vigilantie',
  TERRORISM: 'Terrorism',
  REPUTATION: 'Reputation',
  STR: 'Strength',
  STR_MULT: 'Strength Multiplier',
  STR_ASC_MULT: 'Strength Ascencion Multiplier',
}
const DIRECTIONS = {
  ASC: 'Ascending',
  DESC: 'Descending',
}
function sortBy(ns, sortType = null, direction = DIRECTIONS.ASC) {
  return function (a, b) {
    const memberInfoA = getMemberInformation(ns, a)
    const memberInfoB = getMemberInformation(ns, b)

    let statA
    let statB

    if (sortType === SORT_TYPES.VIGILANTIE) {
      statA = memberInfoA.hack + memberInfoA.str + memberInfoA.def + memberInfoA.dex + memberInfoA.agi
      statB = memberInfoB.hack + memberInfoB.str + memberInfoB.def + memberInfoB.dex + memberInfoB.agi
    } else if (sortType === SORT_TYPES.TERRORISM) {
      statA = memberInfoA.hack + memberInfoA.str + memberInfoA.def + memberInfoA.dex + memberInfoA.cha
      statB = memberInfoB.hack + memberInfoB.str + memberInfoB.def + memberInfoB.dex + memberInfoB.cha
    } else if (sortType === SORT_TYPES.REPUTATION) {
      statA = memberInfoA.earnedRespect
      statB = memberInfoB.earnedRespect
    } else if (sortType === SORT_TYPES.STR) {
      statA = memberInfoA.str
      statB = memberInfoB.str
    } else if (sortType === SORT_TYPES.STR_MULT) {
      statA = memberInfoA.str_mult
      statB = memberInfoB.str_mult
    } else if (sortType === SORT_TYPES.STR_ASC_MULT) {
      statA = memberInfoA.str_asc_mult
      statB = memberInfoB.str_asc_mult
    } else {
      const indexA = gangMemberNamesList.findIndex((name) => name === memberInfoA.name)
      const indexB = gangMemberNamesList.findIndex((name) => name === memberInfoB.name)

      return indexA - indexB
    }

    if (statA === statB) {
      return 0
    }

    if (direction === DIRECTIONS.ASC) {
      return statA - statB
    } else {
      return statB - statA
    }
  }
}

const allEquipmentInfo = []
class Equipment {
  constructor(ns, equipment) {
    this.name = equipment;
    this.type = ns.gang.getEquipmentType(equipment);
    this.stats = ns.gang.getEquipmentStats(equipment);
    this.cost = ns.gang.getEquipmentCost(equipment);
  }

}

function getEquipmentInfo(ns,allEquipment){
  const output = []
  for (const equipment in allEquipment) {
    output += new Equipment(ns,equipment)
  }
  return output
}

async function checkGangEquipment(ns, gangMemberNames) {
  let maxEquipment = getItem(settings.keys.maxEquipment)
  let maxType = 3
  const allEquipment = ns.gang.getEquipmentNames();//getItem(settings.keys.allEquipment)
  //const allEquipmentInfo = getEquipmentInfo(ns,allEquipment)
  let equipmentsToBuy = allEquipment.slice(0, maxEquipment)
  let hasAllEq = false
  let totalEquipmentCount = 0
  if (maxEquipment > 6) {
    return
  }
  while (!hasAllEq) {
    gangMemberNames.forEach((gangMemberName) => {
      if (maxEquipment > 3) {
        totalEquipmentCount += buyEquipment(ns, allEquipment[maxEquipment], gangMemberName)
      } else {
        for (const index in equipmentsToBuy) {
          totalEquipmentCount += buyEquipment(ns, equipmentsToBuy[index], gangMemberName)
        }
      }
    })
    if (totalEquipmentCount >= gangMemberNames.length * equipmentsToBuy.length || (totalEquipmentCount >= gangMemberNames.length && maxEquipment > 3)) {
      hasAllEq = true
      maxEquipment = (maxEquipment + 1) > allEquipment.length ? allEquipment.length : maxEquipment + 1
    }
    await ns.sleep(5000)
  }
  setItem(settings.keys.maxEquipment, maxEquipment)
}

async function buyEquipment(ns, equipment, gangMemberName) {
  let totalCash = (ns.getPlayer()).money
  const gangMemberInfo = getMemberInformation(ns, gangMemberName)
  if ((!gangMemberInfo.upgrades.includes(equipment) || !gangMemberInfo.augmentations.includes(equipment)) && ns.gang.getEquipmentCost(equipment) < totalCash) {
    ns.gang.purchaseEquipment(gangMemberName, equipment)
    //ns.print(`[${localeHHMMSS()}] Bought ${equipment} for ${gangMemberName}`)
    return 1
  }
  //ns.print(`[${localeHHMMSS()}] Tried to buy ${equipment} for ${gangMemberName}`)
  //ns.print(`[${localeHHMMSS()}] ${ns.nFormat((ns.getPlayer()).money, "$0.0a")} of ${ns.nFormat(ns.gang.getEquipmentCost(equipment), "$0.0a")} needed`)
  return 0
}
/*
function checkGangAugments(ns, gangMemberNames) {
  if (hasAllEq) {


    let hasAllNonHackAug = true

    gangMemberNames.forEach((gangMemberName) => {
      const gangMemberInfo = getMemberInformation(ns, gangMemberName)
      ns.print(`Checking ${gangMemberName}'s Augments`)

      augumentationssToBuy
        .filter((aug) => !aug.hack)
        .forEach((equipment) => {
          if (gangMemberInfo.augmentations.includes(equipment.name)) return

          const boughtEquipment = ns.gang.purchaseEquipment(gangMemberName, equipment.name)

          if (boughtEquipment) {
            ns.print(`[${localeHHMMSS()}] Bought ${equipment.name} (${equipment.type}) for ${gangMemberName}`)
          } else {
            hasAllNonHackAug = false
          }
        })
    })

    if (hasAllNonHackAug) {
      gangMemberNames.forEach((gangMemberName) => {
        const gangMemberInfo = getMemberInformation(ns, gangMemberName)

        augumentationssToBuy
          .filter((aug) => aug.hack)
          .forEach((equipment) => {
            if (gangMemberInfo.augmentations.includes(equipment.name)) return

            const boughtEquipment = ns.gang.purchaseEquipment(gangMemberName, equipment.name)

            if (boughtEquipment) {
              ns.print(`[${localeHHMMSS()}] Bought ${equipment.name} (${equipment.type}) for ${gangMemberName}`)
            }
          })
      })
    }
  }
}
*/
function getMaxEquipment(ns, gangMemberNames) {//get current max equipment level (need to upgrade to take type into account)
  let counter = 0
  //let allEquipment = ns.gang.getEquipmentNames()
  gangMemberNames.forEach((gangMemberName) => {
    const gangMemberInfo = getMemberInformation(ns, gangMemberName)
    allEquipment.forEach((equipment) => {
      if (gangMemberInfo.upgrades.includes(equipment) || gangMemberInfo.augmentations.includes(equipment)) {
        counter++
      }
    })
  })
  return Math.max(3, Math.floor(counter / gangMemberNames.length))
}

export async function main(ns) {

  /*const allEquipment = getItem(settings.keys.allEquipment) || ns.gang.getEquipmentNames()
  setItem(settings.keys.allEquipment, allEquipment)*/

  //ns.disableLog('ALL')

  ns.tprint(`[${localeHHMMSS()}] Starting gangManager.ns`)
  let sleepT = 5000
  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Exception('Run the script from home')
  }

  let nextAscensionAttempt = new Date().getTime() + 30 * 1000
  let loopCount = 0

  while (true) {//main loop start
    const doAscension = true
    const buyEquipment = true
    const strengthAscensionMultHardLimit = 10

    while (ns.gang.canRecruitMember()) {
      const gangMemberNames = getMemberNames(ns)
      ns.gang.recruitMember(gangMemberNamesList[gangMemberNames.length])
      ns.tprint(`[${localeHHMMSS()}] Recruited ${gangMemberNamesList[gangMemberNames.length]}`)
    }

    const gangMemberNames = getMemberNames(ns)
    const maxEquipment = getMaxEquipment(ns, gangMemberNames)
    setItem(settings.keys.maxEquipment, maxEquipment)

    gangMemberNames
      .sort(sortBy(ns, SORT_TYPES.STR, DIRECTIONS.DESC))
      .sort(sortBy(ns, SORT_TYPES.STR_MULT, DIRECTIONS.DESC))
      .sort(sortBy(ns, SORT_TYPES.STR_ASC_MULT, DIRECTIONS.DESC))
    if (buyEquipment && maxEquipment < allEquipment.length) {
      await checkGangEquipment(ns, gangMemberNames)
    }

    if (gangMemberNames.length && new Date().getTime() > nextAscensionAttempt && doAscension) {
      let strAscMultExpected = 0
      let minimumStrengthAscensionMult = Infinity
      gangMemberNames.forEach((gangMemberName) => {
        const gangMemberInfo = getMemberInformation(ns, gangMemberName)

        minimumStrengthAscensionMult = Math.min(minimumStrengthAscensionMult, gangMemberInfo.str_asc_mult)
      })

      strAscMultExpected = Math.max(0, minimumStrengthAscensionMult) + 2
      strAscMultExpected = Math.min(strAscMultExpected, strengthAscensionMultHardLimit)

      const isEarlyAscension = minimumStrengthAscensionMult < 2 ? true : false
      const gangMembersToAscend = []

      gangMemberNames.forEach((gangMemberName) => {
        const gangMemberInfo = getMemberInformation(ns, gangMemberName)
        if (gangMemberInfo.str_asc_mult < strAscMultExpected) {
          const boughtEquipment = allEquipment.filter((equipment) => gangMemberInfo.upgrades.includes(equipment.name))

          if ((isEarlyAscension && boughtEquipment.length > 10) || boughtEquipment.length === allEquipment.length) {
            gangMembersToAscend.push(gangMemberName)
          }
        }
      })

      const maxMembersToAscend = Math.min(5, Math.ceil(gangMemberNames.length / 3))
      gangMembersToAscend
        .sort(sortBy(ns, SORT_TYPES.REPUTATION, DIRECTIONS.ASC))
        .slice(0, maxMembersToAscend)
        .forEach((gangMemberName) => {
          ns.gang.ascendMember(gangMemberName)
          ns.tprint(`[${localeHHMMSS()}] Ascended ${gangMemberName}`)
        })

      nextAscensionAttempt = new Date().getTime() + 10 * 60 * 1000
    }

    // ns.exit()  //--------------------------------------------------------------
    const myGang = getMyGangInformation(ns)
    const minimumWanted = 10
    const wantedToRespectRatio = 10
    const wantToReduceWanted =
      myGang.wantedLevel > minimumWanted &&
      ((myGang.respectGainRate < myGang.wantedLevelGainRate * wantedToRespectRatio && myGang.wantedLevelGainRate) ||
        myGang.wantedLevel * wantedToRespectRatio > myGang.respect)

    let gangMembersTaskTargets = {
      wanted: 0,
      terrorism: 0,
      traffick: 0,
    }

    const terrorismDividerRate = myGang.wantedLevel > myGang.respect || myGang.respect < 2500000 ? 2 : 4

    gangMembersTaskTargets.wanted = wantToReduceWanted ? Math.ceil(gangMemberNames.length / 3) : 0
    gangMembersTaskTargets.terrorism = Math.max(0, Math.ceil((gangMemberNames.length - gangMembersTaskTargets.wanted) / terrorismDividerRate))
    gangMembersTaskTargets.traffick = Math.max(0, gangMemberNames.length - gangMembersTaskTargets.wanted - gangMembersTaskTargets.terrorism)

    gangMemberNames.sort(sortBy(ns, SORT_TYPES.TERRORISM, DIRECTIONS.DESC)).sort(sortBy(ns, SORT_TYPES.VIGILANTIE, DIRECTIONS.DESC))

    gangMemberNames.forEach((gangMemberName) => {
      const terrorismAbilities = getMemberAbilities(ns, gangMemberName).terrorismAbilities
      const isTerrorismRisky = terrorismAbilities > 620 && terrorismAbilities < 710

      if (gangMembersTaskTargets.wanted > 0) {
        ns.gang.setMemberTask(gangMemberName, 'Vigilante Justice')
        gangMembersTaskTargets.wanted -= 1
      } else if (!isTerrorismRisky && gangMembersTaskTargets.terrorism > 0) {
        ns.gang.setMemberTask(gangMemberName, 'Terrorism')
        gangMembersTaskTargets.terrorism -= 1
      } else if (terrorismAbilities > 800 && gangMembersTaskTargets.traffick > 0) {
        ns.gang.setMemberTask(gangMemberName, 'Traffick Illegal Arms')
        gangMembersTaskTargets.traffick -= 1
      } else {
        if (gangMemberNames.length < 30 && getMemberAbilities(ns, gangMemberName).str > 20 && getMemberAbilities(ns, gangMemberName).str < 120) {
          ns.gang.setMemberTask(gangMemberName, 'Mug People')
        } else if (isTerrorismRisky) {
          if (getMemberAbilities(ns, gangMemberName).str > 120) {
            ns.gang.setMemberTask(gangMemberName, 'Strongarm Civilians')
          } else if (getMemberAbilities(ns, gangMemberName).str > 20) {
            ns.gang.setMemberTask(gangMemberName, 'Mug People')
          } else {
            ns.gang.setMemberTask(gangMemberName, 'Vigilante Justice')
            gangMembersTaskTargets.wanted -= 1
          }
        } else {
          ns.gang.setMemberTask(gangMemberName, 'Terrorism')
          gangMembersTaskTargets.terrorism -= 1
        }
      }
    })
    loopCount++
    //ns.print(`End Loop # ${loopCount}, Sleeping for ${sleepT / 1000} seconds.`)
    await ns.sleep(sleepT)
  }
}
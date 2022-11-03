export function settings() {
  return {
    minSecurityLevelOffset: 2,
    maxMoneyMultiplayer: 0.9,
    minSecurityWeight: 100,
    mapRefreshInterval: 24 * 60 * 60 * 1000,
    keys: {
      serverMap: 'BB_SERVER_MAP',
      hackTarget: 'BB_HACK_TARGET',
      action: 'BB_ACTION',
    },
  }
}

export function logEvent(logType, message, logLevel) {
  const localeHHMMSS = () => new Date(new Date().getTime()).toLocaleTimeString();
  ns.tprint(`[${localeHHMMSS()}] ${logLevel ? logLevel.toUpper() + ': ' : ''}${logType.toUpper()}: ${message}`);
}

export function getItem(key) {
  let item = localStorage.getItem(key)

  return item ? JSON.parse(item) : undefined
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export async function main(ns) {
  return {
    settings,
    getItem,
    setItem,
  }
}

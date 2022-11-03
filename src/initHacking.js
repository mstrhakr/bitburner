import { logEvent } from './common.js'
const baseUrl = 'https://raw.githubusercontent.com/mstrhakr/bitburner/master/src/'
const filesToDownload = [
  'common.js',
  'mainHack.js',
  'spider.js',
  'grow.js',
  'hack.js',
  'weaken.js',
  'playerServers.js',
  'killAll.js',
  'runHacking.js',
  'find.js',
  'sellAllStock.js',
  'stockMarketer.js',
]
const valuesToRemove = ['BB_SERVER_MAP']

export async function main(ns) {
  logEvent('start', 'Starting initHacking.ns', 'verbose')

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Exception('Run the script from home')
  }

  for (let i = 0; i < filesToDownload.length; i++) {
    const filename = filesToDownload[i]
    const path = baseUrl + filename
    await ns.scriptKill(filename, 'home')
    await ns.rm(filename)
    await ns.sleep(200)
    ns.tprint(`[${localeHHMMSS()}] Trying to download ${path}`)
    await ns.wget(path + '?ts=' + new Date().getTime(), filename)
  }

  valuesToRemove.map((value) => localStorage.removeItem(value))

  ns.tprint(`[${localeHHMMSS()}] Spawning killAll.ns`)
  ns.spawn('killAll.ns', 1, 'runHacking.ns')
}

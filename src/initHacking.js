const baseUrl = 'https://raw.githubusercontent.com/mstrhakr/bitburner/master/src/';
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
  'stockMarketer4S.js',
  'commitCrime.js',
  'contracter.js',
  'getCrimesData.js',
  'monitor.js',
  'hackingMission.js',
  'gangManager.js',
  'gangFastAscender.js',
  'prepareGang.js',
  'karmaReducer.js',
];
const valuesToRemove = ['BB_SERVER_MAP'];

export async function main(ns) {
  function logEvent(logType, message, logLevel) {
    const time = () => new Date(new Date().getTime()).toLocaleTimeString();
    ns.tprint(`[${time()}] ${logLevel ? logLevel.toUpperCase() + ': ' : ''}${logType.toUpperCase()}: ${message}`);
  }
  logEvent('start', 'Starting initHacking.js', 'verbose');

  let hostname = ns.getHostname();

  if (hostname !== 'home') {
    throw new Exception('Run the script from home');
  }

  for (let i = 0; i < filesToDownload.length; i++) {
    const filename = filesToDownload[i];
    const path = baseUrl + filename;
    await ns.scriptKill(filename, 'home');
    await ns.rm(filename);
    await ns.sleep(200);
    logEvent('downloading', path, 'info');
    await ns.wget(path + '?ts=' + new Date().getTime(), filename);
  }

  valuesToRemove.map((value) => localStorage.removeItem(value));

  const nextScript = 'killAll.js';
  const scriptAfterNext = 'runHacking.js';
  logEvent('spawing', nextScript, 'info');
  ns.spawn(nextScript, 1, scriptAfterNext);
}

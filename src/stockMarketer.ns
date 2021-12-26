const settings = {
    delay: 5,
    counter: 0,
    startTime: new Date(new Date().getTime()).toLocaleTimeString(),
    keys: {
        netWorthChangeLog: 'BB_NET_WORTH_CHANGE_LOG',
        netWorth: 'BB_NET_WORTH',
        stockProfit: 'BB_STOCK_PROFIT',
    },
}

function getItem(key) {
    let item = localStorage.getItem(key)

    return item ? JSON.parse(item) : undefined
}

function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

const startTime = new Date(new Date().getTime()).toLocaleTimeString();
const c = { ounter: 0 };

function tendStocks(ns) {
    const allStocks = getAllStocks(ns);

    // select stocks with <51% chance to increase price
    const stocksToSell = getBearStocks(allStocks, 0.51);
    // sell all those stocks
    sellStocks(ns, stocksToSell);

    // select stocks with >55% chance to increase price
    const stocksToBuy = getBullStocks(allStocks, 0.55);
    // buy the highest-rated stocks available
    buyStocks(ns, stocksToBuy);

}

function getAllStocks(ns) {
    // make a lookup table of all stocks and all their properties
    const stockSymbols = ns.stock.getSymbols();
    const stocks = {};
    for (const symbol of stockSymbols) {

        const pos = ns.stock.getPosition(symbol);
        const stock = {
            symbol: symbol,
            forecast: ns.stock.getForecast(symbol),
            volatility: ns.stock.getVolatility(symbol),
            askPrice: ns.stock.getAskPrice(symbol),
            bidPrice: ns.stock.getBidPrice(symbol),
            maxShares: ns.stock.getMaxShares(symbol),
            shares: pos[0],
            sharesAvgPrice: pos[1],
            sharesShort: pos[2],
            sharesAvgPriceShort: pos[3]
        };
        stock.summary = `${stock.symbol}: ${stock.forecast.toFixed(3)} ± ${stock.volatility.toFixed(3)}`;
        stocks[symbol] = stock;
    }
    return stocks;
}

function getPortfolioValue(stocks) {
    let value = 0;
    for (const stock of Object.values(stocks)) {
        value += stock.bidPrice * stock.shares - stock.askPrice * stock.sharesShort;
    }
    return value;
}

function getBullStocks(stocks, threshold = 0.55) {
    // select stocks with at least threshold % chance to increase each cycle
    const bullStocks = [];
    for (const stock of Object.values(stocks)) {
        if (stock.forecast - stock.volatility > threshold) {
            bullStocks.push(stock);
        }
    }
    return bullStocks;
}

function getBearStocks(stocks, threshold = 0.48) {
    // select stocks with at most threshold % chance to increase each cycle
    const bearStocks = [];
    for (const stock of Object.values(stocks)) {
        if (stock.forecast - stock.volatility < threshold) {
            bearStocks.push(stock);
        }
    }
    return bearStocks;
}

function recordProfit(profit) {
    var prevProfit = getItem(settings.keys.stockProfit);
    var totalProfit = prevProfit + profit;
    setItem(settings.keys.stockProfit, totalProfit);
}

function sellStocks(ns, stocksToSell) {
    for (const stock of stocksToSell) {
        if (stock.shares > 0) {
            const salePrice = ns.stock.sell(stock.symbol, stock.shares);
            if (salePrice != 0) {
                const saleTotal = salePrice * stock.shares;
                const saleCost = stock.sharesAvgPrice * stock.shares;
                const saleProfit = saleTotal - saleCost;
                stock.shares = 0;
                ns.tprint(`Sold ${stock.summary} stock for ${ns.nFormat(saleProfit, "$0.0a")} profit`);
                recordProfit(saleProfit);
            }
        }
    }
}

function buyStocks(ns, stocksToBuy) {
    // buy stocks, spending more money on higher rated stocks
    const bestStocks = stocksToBuy.sort((a, b) => {
        return b.forecast - a.forecast; // descending
    });

    let transactions = 0;
    if (ns.args[0]) { var maxTransactions = ns.args[0]; } else { var maxTransactions = 4; };
    if (ns.args[1]) { var savings = ns.args[1]; } else { var savings = 5000000 };
    for (const stock of bestStocks) {
        const moneyRemaining = ns.getPlayer().money;
        // don't spend the last 5 million bux
        if (moneyRemaining < savings || transactions >= maxTransactions) {
            return;
        }
        // spend up to half the money available on the highest rated stock
        // (the following stock will buy half as much)
        const moneyThisStock = moneyRemaining / 2 - 100000;
        let numShares = moneyThisStock / stock.askPrice;

        numShares = Math.min(numShares, stock.maxShares - stock.shares - stock.sharesShort);
        var estCost = numShares * ns.stock.getPrice(stock.symbol);
        if (savings > (moneyRemaining - estCost)) {
            return;
        };
        const boughtPrice = ns.stock.buy(stock.symbol, numShares);
        if (boughtPrice != 0) {
            const boughtTotal = boughtPrice * numShares;
            transactions += 1;
            stock.shares += numShares;
            ns.tprint(`Bought ${ns.nFormat(boughtTotal, "$0.0a")} of ${stock.summary}`);
        }
    }
}

function calculateAverage(array) {
    var total = 0.0;
    var count = 0;

    array.forEach(function (item, index) {
        total += item;
        count++;
    });

    return total / count;
}

function netWorth(ns) {
    const netWorthChangeLog = getItem(settings.keys.netWorthChangeLog);
    const netWorthItem = getItem(settings.keys.netWorth);
    const allStocks = getAllStocks(ns);
    const portfolioValue = getPortfolioValue(allStocks);
    const cashValue = ns.getPlayer().money;
    const netWorth = portfolioValue + cashValue;
    let prevNetWorth = 0
    const logLength = 50;
    if (netWorthItem == 0) {
        prevNetWorth = netWorth;
    } else {
        prevNetWorth = netWorthItem
    }
    let netWorthChange = 0;
    if (prevNetWorth != netWorth) {
        netWorthChange = (netWorth / prevNetWorth)-1;
    }
    //ns.print(prevNetWorth);
    //ns.print(netWorth);
    //ns.print(netWorthChange);
    if (netWorthChangeLog.length >= logLength) { netWorthChangeLog.pop() }
    if (netWorthChange != 0) { netWorthChangeLog.push(netWorthChange) }
    //ns.print(netWorthChangeLog)
    setItem(settings.keys.netWorthChangeLog, netWorthChangeLog);
    setItem(settings.keys.netWorth, netWorth);
    ns.clearLog()
    ns.print(`
            [StockMarketer Summary]
        Previous Net Worth: ${ns.nFormat(prevNetWorth, "$0.000a")}
                 Net Worth: ${ns.nFormat(netWorth, "$0.000a")}
          Net Worth Change: ${ns.nFormat(netWorth - prevNetWorth, "$0.000a")} (${ns.nFormat(netWorthChange, "%0.000")})
  Average Net Worth Change: ${ns.nFormat(calculateAverage(netWorthChangeLog), "%0.000")}
              Stocks Value: ${ns.nFormat(portfolioValue, "$0.000a")}
                Cash Value: ${ns.nFormat(cashValue, "$0.000a")}`);
}

export async function main(ns) {
    setItem(settings.keys.netWorthChangeLog, []);
    setItem(settings.keys.netWorth, 0);
    if (ns.args[2]) {
        settings.delay = ns.args[2];
    }
    const delayMS = settings.delay * 1000;
    ns.disableLog("sleep");
    ns.disableLog("stock.buy");
    ns.disableLog("stock.sell");
    netWorth(ns);
    ns.tail()
    while (true) {
        tendStocks(ns);
        settings.counter += 1;
        if (settings.counter % settings.delay == 0) {
            netWorth(ns);
        }
        await ns.sleep(delayMS);
    }
}
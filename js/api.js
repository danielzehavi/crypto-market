const coins = [];
const callbacks = [];
let inProgress = false;
let isSuccess = false;

function getCoins(callback) {
  if (inProgress) {
    callbacks.push(callback);
    return;
  }

  if (isSuccess) {
    callback(coins);
    return;
  }

  // we still don't have data, so we'll make an Ajax request
  callbacks.push(callback);
  inProgress = true;
  $.ajax({
    url: "https://api.coingecko.com/api/v3/coins",
    success: (data) => {
      isSuccess = true;
      inProgress = false;
      // emptying the array before setting the new data
      coins.splice(0, coins.length);
      coins.push(...data);
      callbacks.forEach((cb) => cb(coins));
      callbacks.splice(0, callbacks.length);
    },
    error: (err) => {
      inProgress = false;
      alert(err.status);
    },
  });
}

function getCoinByIdOrSymbol(val) {
  const coin = coins.find((coin) => val === coin.id || val === coin.symbol);
  return coin;
}

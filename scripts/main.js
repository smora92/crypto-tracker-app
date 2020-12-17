const coins = [
  "BTC",
  "ETH",
  "XRP",
  "USDT",
  "LTC",
  "LINK",
  "BCH",
  "ADA",
  "DOT",
  "BNB",
];

const sortPrices = (prices) => {
  const allPrices = [];
  coins.forEach((coin) => {
    const coinData = { name: coin };
    const coinResponseData = prices.find((price) => {
      return price.asset_id_quote === coin;
    });

    if (coinResponseData) {
      coinData.price = coinResponseData.rate.toFixed(2);
      coinData.time = coinResponseData.time;

      allPrices.push(coinData);
    }
  });

  return allPrices;
};

const getPortfolioAll = () => {
  const data = localStorage.getItem("portfolio");

  if (data) {
    return JSON.parse(data);
  }

  return {};
};

const savePortfolio = (portfolio) => {
  const portfolioString = JSON.stringify(portfolio);
  localStorage.setItem("portfolio", portfolioString);
};

const addCoin = (coin, value) => {
  const currentPortfolio = getPortfolioAll();

  currentPortfolio[coin] = value;
  savePortfolio(currentPortfolio);
};

const removeCoin = (coin) => {
  const currentPortfolio = getPortfolioAll();

  delete currentPortfolio[coin];
  savePortfolio(currentPortfolio);
};

const updatePortfolioValue = (coin, newValue) => {
  const currentPrice = Number($(`#${coin}-price`).text());
  const currentPortfolioValue = (newValue * currentPrice).toFixed(2);

  $(`#${coin}-portfolio-value`).text(currentPortfolioValue);
};

const addPortfolio = (coin) => {
  const coinUnitsOwned = $(`#${coin}-input`).val();

  if (!isNaN(Number(coinUnitsOwned))) {
    addCoin(coin, Number(coinUnitsOwned));
    updatePortfolioValue(coin, coinUnitsOwned);
    return;
  }
  alert("Please enter a number");
  return;
};

$(document).ready(() => {
  $("#filter-input-box").on("keyup", function () {
    const searchVal = $("#filter-input-box").val().toUpperCase();
    $("#coin-list-table tr").filter(function () {
      $(this).toggle($(this).text().indexOf(searchVal) > -1);
    });
  });

  const displayPrices = (prices) => {
    const portfolio = getPortfolioAll();

    prices.forEach((coin) => {
      // append the data to the coin-wrapper
      const { name, price, time } = coin;

      const innerHTML = `
             <tr>
                <td class='coin-name'">${name}</td>
                <td id="${name}-price">${price}</td>
                <td>${moment(time).format("h:mm:ss a")}</td>
              
                 <td>
                 <form onsubmit="addPortfolio('${name}')">
                    <input size="4" id="${name}-input" value='${
        portfolio[name] ? portfolio[name] : 0
      }' /></form> 
                 </td>

                <td id="${name}-portfolio-value">${
        portfolio[name] ? (price * portfolio[name]).toFixed(2) : 0
      }</td>

            </tr>
        `;
      $("#coin-list-table").append(innerHTML);
    });
    // $('#coin-wrapper')
  };
  const apiKey = "7A224DAC-9286-42A8-B2D8-BB400EEB77D5";

  fetch(
    `https://rest-sandbox.coinapi.io/v1/exchangerate/USD?apikey=${apiKey}&invert=true`
  )
    .then((response) => response.json())
    .then((data) => {
      const sortedCoinPrices = sortPrices(data.rates);
      displayPrices(sortedCoinPrices);
    })
    .catch((err) => {
      console.log("error", err);
    });
  // const getMarketResponse = await fetch(
  //   `https://rest-sandbox.coinapi.io/v1/exchangerate/USD?apikey=${apiKey}&invert=true`
  // );
  // const getResponseJSON = await getMarketResponse.json()
});

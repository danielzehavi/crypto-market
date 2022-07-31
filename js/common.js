function defineEventHandlers() {
  $(document).on("click", "#reportsButton", renderLiveReports);

  $(document).on("click", "#homeButton", renderListPage);
  $(document).on("click", "#aboutButton", renderAboutLayout);

  $(document).on("click", "#modalCancelButton", function () {
    $("#exampleModal").modal("hide");
  });

  $(document).on("click", "#searchBarButton", searchCoin);

  function searchCoin() {
    const query = $("#searchBar").val();
    getCoins((coins) => {
      const matchingCoins = coins.filter((coin) => coin.symbol.includes(query));
      renderCards(matchingCoins);
    });
  }

  $(document).on(
    "click",
    ".form-check-input-list",
    function liveToggleHandler(e) {
      let id = $(this)
        .parent("div")
        .parent("div")
        .parent("div")
        .parent("div")[0].id;
      const coin = getCoinByIdOrSymbol(id);
      const reportsCoins = coins.filter((coin) => coin.shouldLiveTrack);

      if (reportsCoins.length >= 5) {
        e.target.checked = false;
        let content = "";
        for (let coin of reportsCoins) {
          content +=
            /*html*/
            `<div class="form-check form-switch">
              <input
              class="form-check-inputs"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefaultModal-${coin.symbol}"
              checked
              />
              <img src="${coin.image.thumb}" alt="">
              <label class="form-check-label" for="flexSwitchCheckDefaultModal-${
                coin.symbol
              }">
              ${coin.symbol.toUpperCase()}
              </label>
              </div> 
           `;
        }
        $(".modal-body").html(content);
        $(document).on("change", ".form-check-inputs", function (evt) {
          const htmlId = $(evt.target).attr("id");
          const coinSymbol = htmlId.replace("flexSwitchCheckDefaultModal-", "");
          const selectedCoin = getCoinByIdOrSymbol(coinSymbol);
          if (selectedCoin.shouldLiveTrack) {
            selectedCoin.shouldLiveTrack = false;
          } else {
            selectedCoin.shouldLiveTrack = true;
          }
          getCoins(renderCards);
        });
        $("#exampleModal").modal("show");
      } else {
        coin.shouldLiveTrack = true;
      }
    }
  );

  $(document).on("click", "#infoButton", function () {
    let id = $(this)
      .parent("div")
      .parent("div")
      .parent("div")
      .parent("div")[0].id;
    if (!localStorage.getItem(id)) {
      showProgressBar(id);

      $.ajax({
        url: `https://api.coingecko.com/api/v3/coins/${id}`,
        success: (data) => {
          saveCurrencyToLocalStorage(data);
          $(".container i").remove();
        },
        error: (err) => {
          alert(err.status);
          $(".container i").remove();
        },
      });
    }
  });

  $(document).submit(function (e) {
    e.preventDefault();
  });
}

function showProgressBar(data) {
  let content = `<div class="container">	
    <i>0%</i>	
    <div class="Loading">
    <span data-charge='100'></span>
    </div>
    </div>`;
  $(`#${data}`).append(content);
  $(".Loading span").animate(
    {
      width: $(".Loading span").data("charge") + "%",
    },
    1000
  );
  let getCounter = parseInt($(".container i").text());
  let MyCounter = setInterval(function () {
    if (getCounter !== 101) {
      $(".container i").text(getCounter++ + "%");
    } else {
      clearInterval(MyCounter);
    }
  }, 10);
}

function saveCurrencyToLocalStorage(data) {
  const currencies = {
    id: data.id,
    name: data.name,
    symbol: data.symbol,
    usd: data.market_data.current_price.usd,
    eur: data.market_data.current_price.eur,
    ils: data.market_data.current_price.ils,
    isAjaxCall: true,
  };
  localStorage.setItem(data.id, JSON.stringify(currencies));
  setTimeout(() => {
    localStorage.removeItem(data.id);
  }, 1000 * 60 * 2);
  renderCoinInfo(currencies, true);
}

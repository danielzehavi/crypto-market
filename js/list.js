/// <reference path="jquery-3.6.0.js" />

function renderCards(data) {
  let content = "";
  let existInLocalStorage = [];
  let maxIndex = Math.min(30, data.length);
  try {
    $("#cards-list").empty();
    for (let i = 0; i < maxIndex; i++) {
      content +=
        /*html*/
        `<div class="col ${data[i].symbol}">
      <div class="card text-white shadow-sm bg-dark" id="${data[i].id}">
        <div class="card-body">
          <p class="card-text">
          <img src="${data[i].image.thumb}" alt="">
          ${data[i].symbol.toUpperCase()}
          </p>
          <p class="card-text">${data[i].name}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
            <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            data-bs-toggle="collapse"
            data-bs-target="#collapseInfo${data[i].symbol}"
            
            id="infoButton"
          >
            More Info
          </button>
            </div>
            <div class="form-check form-switch">
              <input
                class="form-check-input form-check-input-list"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault-${data[i].symbol}"
                ${data[i].shouldLiveTrack ? "checked" : ""}
              />
              <label class="form-check-label" for="flexSwitchCheckDefault-${
                data[i].symbol
              }">
              </label>
              </div>
              </div>
        </div>
      </div>
    </div>`;
      if (localStorage.getItem(data[i].id)) {
        existInLocalStorage.push(JSON.parse(localStorage.getItem(data[i].id)));
      }
    }
    $("#cards-list").append(content);
    existInLocalStorage.forEach((data) => {
      renderCoinInfo(data);
    });
  } catch (error) {
    console.log(error);
  }
}

function renderCoinInfo(coin, shouldOpen = false) {
  let content = `
  <div class="collapse" id="collapseInfo${coin.symbol}" >
  <div class="card-body">
    <p class="card-text">
      1 ${coin.name} = ${coin.usd}$
    </p>
    <p class="card-text">
      1 ${coin.name} = ${coin.eur}€
    </p>
    <p class="card-text">
      1 ${coin.name} = ${coin.ils}₪
    </p>
    </div>
  </div>`;
  $(`#${coin.id}`).append(content);
  if (shouldOpen) {
    $(`#collapseInfo${coin.symbol}`).collapse();
  }
}

function renderHomeLayout() {
  let html = /*html*/ `
  <div class="parallax">
      <!-- in charge of search bar -->
      <section class="py-2 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <form class="d-inline-flex" onsubmit="">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Type in coin name"
                aria-label="Search"
                id="searchBar"
              />
              <button class="btn btn-secondary" type="submit" id="searchBarButton">Search</button>
            </form>
          </div>
        </div>
      </section>

      <!-- div in charge of the cards -->
      <section>
        <div class="album py-5">
          <div class="container">
            <div
              id="cards-list"
              class="row row-cols-1 row-cols-sm-3 row-cols-md-3 g-2"
            ></div>
          </div>
        </div>
      </section>

      <!-- in charge of Modal HTML -->
      <section>
        <div class="bs-example">
          <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">You can only select 5 coins, 
                    Do you wish to remove one of the coins?</h5>
                </div>
                <!-- selected coins inserted here -->
                <div class="modal-body">                 
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal" id="modalCancelButton">Close</button>
                </div>
              </div>
            </div>
          </div>
      </section>
    </div>
  `;
  $("#main-content").html(html);
}

function renderListPage() {
  renderHomeLayout();
  getCoins(renderCards);
}

function setUpList() {
  defineEventHandlers();
}

setUpList();

renderListPage();

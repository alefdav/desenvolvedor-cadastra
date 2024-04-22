import { Product } from "./Product";

const productsEndPoint = "http://localhost:5000/products";
const productsList: Product[] = JSON.parse(localStorage.getItem("products"));
const colors = JSON.parse(localStorage.getItem("colors"));
const filterC: string[] = [];
const filterS: string[] = [];

function main() {
  getProducts(productsEndPoint);
  getColors(productsList);
  setColorsInHtml(colors, document.querySelector(".contentColors"));
  addToCart();
  openModalsMobile();
  filterColors();
  filterSizes();

  setCardInHtml(productsList);
  // loadCards();

  updateCardsWithFilters();
}

document.addEventListener("DOMContentLoaded", main);

async function getProducts(serverUrl: string) {
  if (localStorage.getItem("products")) {
    return;
  }
  const response = await fetch(serverUrl);

  let data: string;
  if (response.ok) {
    data = await response.text();

    localStorage.setItem("products", data);
  }

  return;
}

function getColors(products: Object) {
  if (localStorage.getItem("colors")) {
    return;
  }

  const colors: string[] = [];

  Object.entries(products).forEach(([key, value]) => {
    if (!colors.includes(value.color)) {
      colors.push(value.color);
    }
  });

  return localStorage.setItem("colors", JSON.stringify(colors));
}

function setColorsInHtml(colors: Object, div: HTMLElement) {
  const divHTML = div;
  const divName = "display-flex-row-align-center";

  Object.entries(colors).forEach(([key, value]) => {
    const newDiv = document.createElement("div");
    const newLabel = document.createElement("label");
    const newInput = document.createElement("input");

    newLabel.innerHTML = "<label for=" + value + ">" + value + "</label>";
    newInput.type = "radio";
    newInput.name = value;
    newInput.id = value;
    newInput.classList.add("wBefore");
    newDiv.classList.add(divName);
    newInput.classList.add("clickFilter");
    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);
    divHTML.appendChild(newDiv);
  });
}

function addToCart() {
  const cart: Array<Object> = [];

  const buttons = document.querySelectorAll(".card button");

  const cartDiv = document.querySelector(".cartNum") as HTMLElement;

  buttons.forEach((element) => {
    element.addEventListener("click", () => {
      cart.push(
        productsList.find(
          (objeto) =>
            objeto.id == element.attributes.getNamedItem("idproduct").value
        )
      );

      cartDiv.innerText = cart.length.toString();
    });
  });
}

function openModalsMobile() {
  const div = document.querySelector(".buttonsMobile");
  const body = document.querySelector("body");
  const closeButtons = document.querySelectorAll(".closeButton");
  const filter = document.querySelector(".filterMobile");
  const order = document.querySelector(".orderMobile");

  div.addEventListener("click", (e) => {
    if ((e.target as HTMLInputElement).innerText == "Filtrar") {
      body.classList.add("noScroll");
      filter.classList.remove("displayNone");

      setColorsInHtml(colors, document.querySelector(".filterMobileColors"));

      closeButtons[0].addEventListener("click", () => {
        filter.classList.add("displayNone");
        body.classList.remove("noScroll");
      });
      return;
    }

    if ((e.target as HTMLInputElement).innerText == "Ordenar") {
      body.classList.add("noScroll");
      order.classList.remove("displayNone");

      closeButtons[1].addEventListener("click", () => {
        order.classList.add("displayNone");
        body.classList.remove("noScroll");
      });

      return;
    }
  });
}

function filterColors() {
  // let colorsSelected: String[] = [];
  const divColors = document.querySelectorAll(".contentColors input");

  divColors.forEach((element) => {
    element.addEventListener("click", () => {
      if (!filterC.includes(element.id)) {
        filterC.push(element.id);
        element.classList.add("wBefore");

        return filterC;
      }

      if (filterC.includes(element.id)) {
        if (filterC.indexOf(element.id) !== -1) {
          filterC.splice(filterC.indexOf(element.id), 1);
        }

        element.classList.remove("wBefore");

        return filterC;
      }
    });
  });
}

function filterSizes() {
  const buttonsSize = document.querySelectorAll(".contentSizes span");
  const div = Array.from(document.querySelector(".centerSideContent").children);

  buttonsSize.forEach((element) => {
    element.addEventListener("click", () => {
      if (!filterS.includes(element.innerHTML)) {
        filterS.push(element.innerHTML);
        element.classList.add("selected");

        return filterS;
      }

      if (filterS.includes(element.innerHTML)) {
        if (filterS.indexOf(element.innerHTML) !== -1) {
          filterS.splice(filterS.indexOf(element.innerHTML), 1);
        }
        element.classList.remove("selected");

        return filterS;
      }
    });
  });
}

function loadCards() {
  const loadMore = document.getElementById("loadMore");
  const hid = Array.from(document.querySelectorAll(".card.hidden"));

  if (window.innerWidth <= 425) {
    hid.splice(0, 4).forEach((elem) => elem.classList.remove("hidden"));
  } else {
    hid.splice(0, 6).forEach((elem) => elem.classList.remove("hidden"));
  }

  loadMore.addEventListener("click", function (e) {
    e.preventDefault();

    if (window.innerWidth <= 425) {
      hid.splice(0, 4).forEach((elem) => elem.classList.remove("hidden"));
    } else {
      hid.splice(0, 6).forEach((elem) => elem.classList.remove("hidden"));
    }

    if (hid.length == 0) {
      loadMore.classList.add("hidden");
    }
  });
}

function setCardInHtml(products: Object) {
  const div = document.querySelector(".centerSideContent");
  div.innerHTML = "";

  Object.entries(products).forEach(([key, value]) => {
    const newDiv = document.createElement("div");
    const newImage = document.createElement("img");
    const newTitle = document.createElement("h4");
    const newPrice = document.createElement("span");
    const newPriceDetail = document.createElement("span");
    const newButton = document.createElement("button");

    newDiv.classList.add("card");
    // newDiv.classList.add("hidden");
    newImage.src = value.image;
    newTitle.innerText = value.name;
    newPrice.innerText = "R$ " + value.price;
    newPrice.classList.add("priceCard");
    newPriceDetail.innerText =
      "até " + value.parcelamento[0] + "x de " + "R$" + value.parcelamento[1];
    newPriceDetail.classList.add("priceDetailCard");
    newButton.innerText = "COMPRAR";

    newButton.setAttribute("idProduct", value.id);
    newDiv.setAttribute("idProduct", value.id);
    newDiv.setAttribute("dateProduct", value.date);
    newDiv.setAttribute("colorProduct", value.color);
    newDiv.setAttribute("priceProduct", value.price.toFixed(0));
    newDiv.setAttribute("sizeProduct", value.size);

    newDiv.appendChild(newImage);
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newPrice);
    newDiv.appendChild(newPriceDetail);
    newDiv.appendChild(newButton);

    div.appendChild(newDiv);
  });
}

function filter(cores?: string[], tamanhos?: string[]) {
  if (cores.length == 0 && tamanhos.length == 0) {
    return productsList;
  }

  if (cores.length == 0) {
    return productsList.filter((produto) =>
      produto.size.some((s) => tamanhos!.includes(s))
    );
  }

  if (tamanhos.length == 0) {
    return productsList.filter((produto) => cores.includes(produto.color));
  }

  return productsList.filter(
    (produto) =>
      cores.includes(produto.color) &&
      produto.size.some((s) => tamanhos.includes(s))
  );
}

function updateCardsWithFilters() {
  const divInputs = document.querySelectorAll(".clickFilter");

  divInputs.forEach((element) => {
    element.addEventListener("click", () => {
      setCardInHtml(filter(filterC, filterS));
    });
  });
}

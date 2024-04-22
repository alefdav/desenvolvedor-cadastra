import { Product } from "./Product";

const productsEndPoint = "http://localhost:5000/products";
const productsList: Product[] = JSON.parse(localStorage.getItem("products"));
const colors = JSON.parse(localStorage.getItem("colors"));

function main() {
  getProducts(productsEndPoint);
  getColors(productsList);
  setColorsInHtml(colors, document.querySelector(".contentColors"));
  setCardInHtml(productsList);
  addToCart();
  openModalsMobile();
  filterColors();
  loadCards();
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

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);
    divHTML.appendChild(newDiv);
  });
}

function setCardInHtml(productsList: Object) {
  const div = document.querySelector(".centerSideContent");

  Object.entries(productsList).forEach(([key, value]) => {
    const newDiv = document.createElement("div");
    const newImage = document.createElement("img");
    const newTitle = document.createElement("h4");
    const newPrice = document.createElement("span");
    const newPriceDetail = document.createElement("span");
    const newButton = document.createElement("button");

    newDiv.classList.add("card");
    newDiv.classList.add("hidden");
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

    newDiv.appendChild(newImage);
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newPrice);
    newDiv.appendChild(newPriceDetail);
    newDiv.appendChild(newButton);

    div.appendChild(newDiv);
  });
}

function addToCart() {
  const cart: Array<Object> = [];

  const buttons = document.querySelectorAll(".card button");

  const cartDiv = document.querySelector(".cartNum") as HTMLElement;

  buttons.forEach((element) => {
    element.addEventListener("click", () => {
      console.log(true);
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
      });
      return;
    }

    if ((e.target as HTMLInputElement).innerText == "Ordenar") {
      body.classList.add("noScroll");
      order.classList.remove("displayNone");

      closeButtons[1].addEventListener("click", () => {
        order.classList.add("displayNone");
      });

      return;
    }
  });
}

function filterColors() {
  let colorsSelected: Array<String> = [];

  const div = Array.from(document.querySelector(".centerSideContent").children);
  const divColors = document.querySelectorAll(".contentColors input");

  divColors.forEach((element) => {
    element.addEventListener("click", () => {
      if (!colorsSelected.includes(element.id)) {
        colorsSelected.push(element.id);
        element.classList.add("wBefore");

        div.forEach((element) => {
          if (
            !colorsSelected.includes(
              element.attributes.getNamedItem("colorproduct").value
            )
          ) {
            element.classList.add("displayNone");
          }

          if (
            colorsSelected.includes(
              element.attributes.getNamedItem("colorproduct").value
            )
          ) {
            element.classList.remove("displayNone");
          }
        });

        return;
      }

      if (colorsSelected.includes(element.id)) {
        div.forEach((element_color) => {
          if (
            element.id ==
            element_color.attributes.getNamedItem("colorproduct").value
          ) {
            element_color.classList.add("displayNone");
          }
        });

        if (colorsSelected.indexOf(element.id) !== -1) {
          colorsSelected.splice(colorsSelected.indexOf(element.id), 1);
        }

        element.classList.remove("wBefore");

        if (colorsSelected.length == 0) {
          div.forEach((element_color) => {
            element_color.classList.remove("displayNone");
          });
        }

        return;
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

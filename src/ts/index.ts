import { Product } from "./Product";

const productsEndPoint = "http://localhost:5000/products";
const productsList: Product[] = JSON.parse(localStorage.getItem("products"));
const colors = JSON.parse(localStorage.getItem("colors"));
let filtered: boolean = false;
const filterC: string[] = [];
const filterS: string[] = [];
let filterP: string = "0,9999";

function main() {
  getProducts(productsEndPoint);
  getColors(productsList);
  setColorsInHtml(colors, document.querySelector(".contentColors"));
  if (!document.querySelector(".filterMobileColors .clickFilter")) {
    setColorsInHtml(colors, document.querySelector(".filterMobileColors"));
  }
  openModalsMobile();
  filterColors();
  filterSizes();
  filterPrice();
  setCardInHtml(productsList);
  loadCards();

  updateCardsWithFilters();
  addToCart();
  changeOrder();
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
    newLabel.htmlFor = value;
    newLabel.innerText = value;
    newInput.type = "radio";
    newInput.name = value;
    newInput.id = value;
    newInput.classList.add("clickFilter");
    newInput.classList.add("wBefore");
    newDiv.classList.add(divName);
    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);
    divHTML.appendChild(newDiv);
  });
}

function addToCart() {
  let cart: Array<Object> = [];

  const buttons = document.querySelectorAll(".card button");

  const cartDiv = document.querySelector(".cartNum") as HTMLElement;

  if (sessionStorage.getItem("cart") !== null) {
    cart = JSON.parse(sessionStorage.getItem("cart"));
    cartDiv.innerText = cart.length.toString();
  }

  buttons.forEach((element) => {
    element.addEventListener("click", () => {
      cart.push(
        productsList.find(
          (objeto) =>
            objeto.id == element.attributes.getNamedItem("idproduct").value
        )
      );
      cartDiv.innerText = cart.length.toString();
      sessionStorage.setItem("cart", JSON.stringify(cart));
    });
  });
}

function openModalsMobile() {
  const div = document.querySelector(".buttonsMobile");
  const body = document.querySelector("body");
  const closeButtons = document.querySelectorAll(".closeButton");
  const buttons = document.querySelectorAll(".buttons button");
  const filter = document.querySelector(".filterMobile");
  const order = document.querySelector(".orderMobile");

  buttons.forEach((element) => {
    element.addEventListener("click", () => {
      event.preventDefault();

      filter.classList.add("displayNone");
      body.classList.remove("noScroll");
    });
  });

  div.addEventListener("click", (e) => {
    if ((e.target as HTMLInputElement).innerText == "Filtrar") {
      body.classList.add("noScroll");
      filter.classList.remove("displayNone");

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
  const divColors =
    window.innerWidth > 425
      ? document.querySelectorAll(".contentColors input")
      : document.querySelectorAll(".filterMobileColors .clickFilter");

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
  const buttonsSize =
    window.innerWidth >= 425
      ? document.querySelectorAll(".contentSizes span")
      : document.querySelectorAll(".filterMobileSize span");

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
  const loadMore = document.getElementById("loadMore");
  div.innerHTML = "";

  if (filtered) {
    loadMore.classList.add("displayNone");
  }

  Object.entries(products).forEach(([key, value]) => {
    const newDiv = document.createElement("div");
    const newImage = document.createElement("img");
    const newTitle = document.createElement("h4");
    const newPrice = document.createElement("span");
    const newPriceDetail = document.createElement("span");
    const newButton = document.createElement("button");

    newDiv.classList.add("card");
    if (!filtered) {
      newDiv.classList.add("hidden");
    }
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

function filter(cores?: string[], tamanhos?: string[], preco?: string) {
  const precoIntervalo = getPrecoIntervalo(preco);
  filtered = true;

  if (cores.length === 0 && tamanhos.length === 0 && preco.length === 0) {
    return productsList;
  }

  if (cores.length === 0 && tamanhos.length !== 0 && preco.length !== 0) {
    return productsList.filter(
      (produto) =>
        produto.price >= precoIntervalo[0] &&
        produto.price <= precoIntervalo[1] &&
        produto.size.some((s) => tamanhos.includes(s))
    );
  }

  if (tamanhos.length === 0 && cores.length !== 0 && preco.length !== 0) {
    return productsList.filter(
      (produto) =>
        produto.price >= precoIntervalo[0] &&
        produto.price <= precoIntervalo[1] &&
        cores.includes(produto.color)
    );
  }

  if (preco.length === 0 && cores.length !== 0 && tamanhos.length !== 0) {
    return productsList.filter(
      (produto) =>
        cores.includes(produto.color) &&
        produto.size.some((s) => tamanhos.includes(s))
    );
  }

  if (cores.length == 0 && preco.length === 0) {
    return productsList.filter((produto) =>
      produto.size.some((s) => tamanhos!.includes(s))
    );
  }

  if (tamanhos.length === 0 && preco.length === 0) {
    return productsList.filter((produto) => cores.includes(produto.color));
  }

  if (tamanhos.length === 0 && cores.length === 0) {
    return productsList.filter(
      (produto) =>
        produto.price >= precoIntervalo[0] && produto.price <= precoIntervalo[1]
    );
  }

  return productsList.filter(
    (produto) =>
      cores.includes(produto.color) &&
      produto.size.some((s) => tamanhos.includes(s)) &&
      produto.price >= precoIntervalo[0] &&
      produto.price <= precoIntervalo[1]
  );
}

function getPrecoIntervalo(preco: string): [number, number] {
  switch (preco) {
    case "0-50":
      return [0, 50];
    case "51-150":
      return [51, 150];
    case "151-300":
      return [151, 300];
    case "301-500":
      return [301, 500];
    case "500":
      return [500, Infinity];
    default:
      return [0, Infinity];
  }
}

function updateCardsWithFilters() {
  const divInputs = document.querySelectorAll(".clickFilter");

  divInputs.forEach((element) => {
    element.addEventListener("click", () => {
      setCardInHtml(filter(filterC, filterS, filterP));
    });
  });
}

function filterPrice() {
  const radios =
    window.innerWidth >= 425
      ? document.querySelectorAll(".contentPrices input")
      : document.querySelectorAll(".filterMobilePrice input");
  radios.forEach((element) => {
    element.addEventListener("click", () => {
      element.classList.add("wBefore");

      filterP = element.attributes.getNamedItem("pricedata").value;
    });
  });
}

function changeOrder() {
  const select = document.querySelector(
    ".centerSide select"
  ) as HTMLSelectElement;

  const selectMobile = document.querySelectorAll(".orderMobileContent span");

  select.addEventListener("change", () => {
    setCardInHtml(
      ordenarProdutos(select.value, filter(filterC, filterS, filterP))
    );
  });

  selectMobile.forEach((element) => {
    element.addEventListener("click", () => {
      if (!element.classList.value.includes("selected")) {
        setCardInHtml(
          ordenarProdutos(element.id, filter(filterC, filterS, filterP))
        );
      }
    });
  });
}

function ordenarProdutos(order: string, product: any): Product[] {
  switch (order) {
    case "maiorPreco":
      return product.slice().sort((a: any, b: any) => b.price - a.price);
    case "menorPreco":
      return product.slice().sort((a: any, b: any) => a.price - b.price);
    case "recentes":
      return product
        .slice()
        .sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    default:
      return product;
  }
}

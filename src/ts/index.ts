import { Product } from "./Product";

const productsEndPoint = "http://localhost:5000/products"
const productsList = JSON.parse(localStorage.getItem('products'));
const colors = JSON.parse(localStorage.getItem('colors'));

function main() {
  getProducts(productsEndPoint);
  getColors(productsList);
  setColorsInHtml(colors);
  setCardInHtml(productsList);
}

document.addEventListener("DOMContentLoaded", main);

async function getProducts(serverUrl:string){
  if(localStorage.getItem('products')){
    
    return
  }
  const response = await fetch(serverUrl)

  let data:string;
  if(response.ok){
    data = await response.text()

    localStorage.setItem('products', data);
  }

  return
}

function getColors(products:Object){
  if(localStorage.getItem('colors')){
    
    return
  }

  const colors:string[] = [];

  Object.entries(products).forEach(([key, value]) => {
    if(!colors.includes(value.color)){
      colors.push(value.color)
    }

  });

  return localStorage.setItem('colors',JSON.stringify(colors));
  
}

function setColorsInHtml(colors:Object){
  const div = document.querySelector('.contentColors');
  const divChildrens = Array.from(document.querySelector('.contentColors').children);
  const divName = 'display-flex-row-align-center';

  Object.entries(colors).forEach(([key, value])=> {
    const newDiv = document.createElement('div');
    const newLabel = document.createElement('label');
    const newInput = document.createElement('input');

    newLabel.innerHTML = '<label for='+value+'>'+value+'</label>';
    newInput.type = 'radio';
    newInput.name = value;
    newInput.id = value;
    // newInput.innerHTML = '<input type="radio" name="'+value+'" id='+value+'></input>';
    newDiv.classList.add(divName);

    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);
    div.appendChild(newDiv);
  });
}

function setCardInHtml(productsList:Object){
  const div = document.querySelector('.centerSideContent');

  Object.entries(productsList).forEach(([key, value])=>{
    const newDiv = document.createElement('div');
    const newImage = document.createElement('img');
    const newTitle = document.createElement('h4');
    const newPrice = document.createElement('span');
    const newPriceDetail = document.createElement('span');
    const newButton = document.createElement('button');

    newDiv.classList.add('card');
    newImage.src = value.image;
    newTitle.innerText = value.name;
    newPrice.innerText = 'R$ ' +value.price;
    newPrice.classList.add('priceCard');
    newPriceDetail.innerText = 'até ' + value.parcelamento[0] + 'x de ' + 'R$' +value.parcelamento[1];
    newPriceDetail.classList.add('priceDetailCard');
    newButton.innerText = 'COMPRAR';

    newDiv.appendChild(newImage);
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newPrice);
    newDiv.appendChild(newPriceDetail);
    newDiv.appendChild(newButton);

    div.appendChild(newDiv);
  });

}

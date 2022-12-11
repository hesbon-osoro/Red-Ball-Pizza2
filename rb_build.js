"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Case Problem 3

   Author: Hesbon Osoro
   Date: 12/11/22 
   
   Filename: rb_build.js

*/

window.addEventListener("load", function () {
  // Preview image of the pizza
  var pizzaPreviewBox = document.getElementById("previewBox");
  // Summary of the pizza order
  var pizzaSummary = document.getElementById("pizzaSummary");
  // Pizza size selection list
  var pizzaSizeBox = document.getElementById("pizzaSize");
  // Pizza crust selection list
  var pizzaCrustBox = document.getElementById("pizzaCrust");
  // Pizza double sauce checkbox
  var pizzaDoubleSauceBox = document.getElementById("doubleSauce");
  // Pizza double cheese checkbox
  var pizzaDoubleCheeseBox = document.getElementById("doubleCheese");
  // Pizza topping option buttons
  var toppingOptions = document.querySelectorAll("input.topping");
  // Pizza quantity selection list
  var pizzaQuantityBox = document.getElementById("pizzaQuantity");
  // Add to cart button
  var addToCartButton = document.getElementById("addToCart");
  // Order table displaying the items in the shopping cart
  var cartTableBody = document.querySelector("table#cartTable tbody");
  // Shopping cart total box
  var cartTotalBox = document.getElementById("cartTotal");

  pizzaSizeBox.onchange = drawPizza;
  pizzaCrustBox.onchange = drawPizza;
  pizzaDoubleSauceBox.onclick = drawPizza;
  pizzaDoubleCheeseBox.onclick = drawPizza;
  pizzaQuantityBox.onchange = drawPizza;
  for (var i = 0; i < toppingOptions.length; i++) {
    toppingOptions[i].onclick = drawPizza;
  }

  var myCart = new cart();
  addToCartButton.onclick = addPizzaToCart;

  // Function to build the pizza
  function buildPizza(newPizza) {
    newPizza.qty = pizzaQuantityBox.selectedValue();
    newPizza.size = pizzaSizeBox.selectedValue();
    newPizza.crust = pizzaCrustBox.selectedValue();
    newPizza.doubleSauce = pizzaDoubleSauceBox.checked;
    newPizza.doubleCheese = pizzaDoubleCheeseBox.checked;
    var checkedToppings = document.querySelectorAll("input.topping:checked");
    for (var i = 0; i < checkedToppings.length; i++) {
      if (checkedToppings[i].value !== "none") {
        var myTopping = new topping();
        myTopping.name = checkedToppings[i].name;
        myTopping.side = checkedToppings[i].value;
        if (checkedToppings[i].value === "full") {
          myTopping.qty = 1;
        } else {
          myTopping.qty = 0.5;
        }
        newPizza.addTopping(myTopping);
      }
    }
  }

  // Function to add the built pizza to the shopping cart
  function addPizzaToCart() {
    var myPizza = new pizza();
    buildPizza(myPizza);
    myPizza.addToCart(myCart);
    var newItemRow = document.createElement("tr");
    var summaryCell = document.createElement("td");
    var qtyCell = document.createElement("td");
    var priceCell = document.createElement("td");
    var removeCell = document.createElement("td");
    var removeButton = document.createElement("input");
    removeButton.type = "button";
    removeButton.value = "X";
    summaryCell.textContent = pizzaSummary.textContent;
    qtyCell.textContent = myPizza.qty;
    priceCell.textContent = myPizza.calcPizzaPrice().toLocaleString();
    removeCell.appendChild(removeButton);
    newItemRow.appendChild(summaryCell);
    newItemRow.appendChild(qtyCell);
    newItemRow.appendChild(priceCell);
    newItemRow.appendChild(removeCell);
    cartTableBody.appendChild(newItemRow);
    cartTotalBox.value = myCart.calcCartTotal().toLocaleString();
    console.log(myCart);
    removeButton.onclick = function () {
      myPizza.removeFromCart(myCart);
      cartTableBody.removeChild(newItemRow);
      cartTotalBox.value = myCart.calcCartTotal().toLocaleString();
      console.log(myCart);
      resetDrawPizza();
    };
  }

  /* Function to draw the pizza image on the page */
  function drawPizza() {
    pizzaPreviewBox.removeChildren();
    var pizzaDescription = "";

    pizzaDescription += pizzaSizeBox.selectedValue() + '" pizza ';
    pizzaDescription += pizzaCrustBox.selectedValue() + ", ";
    if (pizzaDoubleSauceBox.checked) {
      var sauceImg = document.createElement("img");
      sauceImg.src = "rb_doublesauce.png";
      pizzaPreviewBox.appendChild(sauceImg);
      pizzaDescription += "double sauce, ";
    }
    if (pizzaDoubleCheeseBox.checked) {
      var cheeseImg = document.createElement("img");
      cheeseImg.src = "rb_doublecheese.png";
      pizzaPreviewBox.appendChild(cheeseImg);
      pizzaDescription += "double cheese, ";
    }

    var checkedToppings = document.querySelectorAll("input.topping:checked");
    for (var i = 0; i < checkedToppings.length; i++) {
      if (checkedToppings[i].value !== "none") {
        pizzaDescription +=
          checkedToppings[i].name + "(" + checkedToppings[i].value + "), ";
        var toppingImage = document.createElement("img");
        toppingImage.src = "rb_" + checkedToppings[i].name + ".png";
        pizzaPreviewBox.appendChild(toppingImage);

        if (checkedToppings[i].value === "left") {
          toppingImage.style.clip = "rect(0px, 150px, 300px, 0px)";
        } else if (checkedToppings[i].value === "right") {
          toppingImage.style.clip = "rect(0px, 300px, 300px, 150px)";
        }
      }
    }

    pizzaSummary.textContent = pizzaDescription;
  }

  // Function to reset the pizza drawing
  function resetDrawPizza() {
    // Object collection of all topping option buttons with a value of 'none'
    var noTopping = document.querySelectorAll("input.topping[value='none']");

    pizzaSizeBox.selectedIndex = 1;
    pizzaCrustBox.selectedIndex = 0;
    pizzaDoubleSauceBox.checked = false;
    pizzaDoubleCheeseBox.checked = false;

    for (var i = 0; i < noTopping.length; i++) {
      noTopping[i].checked = true;
    }
    pizzaSummary.textContent = '14" pizza, thin';
    pizzaPreviewBox.removeChildren();
    pizzaQuantityBox.selectedIndex = 0;
  }
});

/*-------------------- Custom Methods --------------------*/

/* Method added to any DOM element that removes all child nodes of element */
HTMLElement.prototype.removeChildren = function () {
  while (this.firstChild) {
    this.removeChild(this.firstChild);
  }
};

/* Method added to the select element to return the value of the selected option */
HTMLSelectElement.prototype.selectedValue = function () {
  var sIndex = this.selectedIndex;
  return this.options[sIndex].value;
};

/*-------------------- JavaScript Objects --------------------*/

// Object literal to store pizza prices
var pizzaPrice = {
  size12: 11,
  size14: 13,
  size16: 16,
  stuffed: 3,
  pan: 2,
  doubleSauce: 1.5,
  doubleCheese: 1.5,
  topping: 1.5,
};

// Constructor function for the cart object class
function cart() {
  this.totalCost = 0;
  this.items = [];
}

// Constructor function for the foodItem object class
function foodItem() {
  this.price;
  this.qty;
}

// Method to calculate the cost of an individual item
foodItem.prototype.calcItemCost = function () {
  return this.price * this.qty;
};

// Method to calculate the total cost of all items in the cart
cart.prototype.calcCartTotal = function () {
  var cartTotal = 0;
  for (var i = 0; i < this.items.length; i++) {
    cartTotal += this.items[i].calcItemCost();
  }
  this.totalCost = cartTotal;
  return cartTotal;
};

// Method to add an item to the cart
foodItem.prototype.addToCart = function (cart) {
  cart.items.push(this);
};

// Method to remove an item from the cart
foodItem.prototype.removeFromCart = function (cart) {
  for (var i = 0; i < cart.items.length; i++) {
    if (cart.items[i] === this) {
      cart.items.splice(i, 1);
      break;
    }
  }
};

// Pizza

function pizza() {
  this.size;
  this.crust;
  this.doubleSauce;
  this.doubleCheese;
  this.toppings = [];
}

pizza.prototype.addTopping = function (topping) {
  this.toppings.push(topping);
};

pizza.prototype.calcPizzaPrice = function () {
  switch (this.size) {
    case "12":
      this.price = pizzaPrice.size12;
      break;
    case "14":
      this.price = pizzaPrice.size14;
      break;
    case "16":
      this.price = pizzaPrice.size16;
      break;
  }
  if (this.crust === "stuffed" || this.crust === "pan") {
    this.price += pizzaPrice[this.crust];
  }
  if (this.doubleSauce) {
    this.price += pizzaPrice.doubleSauce;
  }

  if (this.doubleCheese) {
    this.price += pizzaPrice.doubleCheese;
  }

  for (var i = 0; i < this.toppings.length; i++) {
    this.price += this.toppings[i].qty * pizzaPrice.topping;
  }
  return this.price;
};

function topping() {
  this.name;
  this.side;
}
//TODO:  Comment and uncomment according to the test
// pizza.prototype = new foodItem()
// topping.prototype = new foodItem()

// topping.__proto__ = foodItem;
// pizza.__proto__ = foodItem;

//TODO: HACKY SOLUTION, prototype inheritance is not working
// Method to calculate the cost of an individual item
topping.prototype.calcItemCost = function () {
  return this.price * this.qty;
};
// Method to add an item to the cart
topping.prototype.addToCart = function (cart) {
  cart.items.push(this);
};

// Method to remove an item from the cart
topping.prototype.removeFromCart = function (cart) {
  for (var i = 0; i < cart.items.length; i++) {
    if (cart.items[i] === this) {
      cart.items.splice(i, 1);
      break;
    }
  }
};

// Method to calculate the cost of an individual item
pizza.prototype.calcItemCost = function () {
  return this.price * this.qty;
};
// Method to add an item to the cart
pizza.prototype.addToCart = function (cart) {
  cart.items.push(this);
};

// Method to remove an item from the cart
pizza.prototype.removeFromCart = function (cart) {
  for (var i = 0; i < cart.items.length; i++) {
    if (cart.items[i] === this) {
      cart.items.splice(i, 1);
      break;
    }
  }
};

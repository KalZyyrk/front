const API_URL = 'http://localhost:3000/api/products/';

const fetchProduct = async (productId) => {
  let res = await fetch(API_URL + productId)
  return await res.json()
}

const getCart = () => {
  let storage = localStorage.getItem('cart')
  return JSON.parse(storage)
}

const saveCart = (cart) => {

  localStorage.setItem('cart', JSON.stringify(cart))

}

const postAPI = async (order) => {
  let res = await fetch(API_URL + 'order', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(order),
  })

  let result = await res.json()

  window.location.href = `confirmation.html?orderId=${result.orderId}`

}

//--- Affichage du Panier ---//

const displayCart = async (productsInCart) => {
  let displayHtmlProduct = ''
  let lastProductId
  let fetchProductJson


  for (let product of productsInCart) {

    if (product.id !== lastProductId) {
      lastProductId = product.id
      fetchProductJson = await fetchProduct(product.id)
    }
    displayHtmlProduct += displayAProduct(product, fetchProductJson)
  }
  document.getElementById('cart__items').insertAdjacentHTML('beforeend', displayHtmlProduct)

  setTotalQuantity()
  setTotalPrice()
}
/**
 *  Create the DOM elements for the product with json data
 * @param {JSON} product 
 * @param {JSON} fetchProductJson 
 * @returns {String}
 */
const displayAProduct = (product, fetchProductJson) => {
  let productElt =
    `
             <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${fetchProductJson.imageUrl}" alt="${fetchProductJson.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${fetchProductJson.name}</h2>
                    <p>${product.color}</p>
                    <p>${fetchProductJson.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
         `
  return productElt
}

const setTotalQuantity = () => {
  let quantityCart = []
  for (let product of cart) {
    quantityCart.push(parseInt(product.quantity))
  }
  quantityCart = quantityCart.reduce((a, b) => a + b, 0)
  document.getElementById('totalQuantity').textContent = quantityCart;
}

const setTotalPrice = async () => {
  let lastProductId
  let fetchProductJson
  let productPrice = 0
  for (let product of cart) {
    if (product.id !== lastProductId) {
      lastProductId = product.id
      fetchProductJson = await fetchProduct(product.id)
    }
    productPrice += product.quantity * fetchProductJson.price
  }

  document.getElementById("totalPrice").textContent = productPrice
}

//--- Add the Listener ---//

const addListeners = async () => {
  document.querySelectorAll('.itemQuantity').forEach(inputQty => inputQty.addEventListener('change', (e) => updateCart(inputQty, e.target.value)));

  document.querySelectorAll('.deleteItem').forEach(buttonSuppr => buttonSuppr.addEventListener('click', () => (updateCart(buttonSuppr, 0))))

  document.getElementById('order').addEventListener('click', postOrder)

}

const updateCart = (dom, quantityValue) => {

  // Check if the quantity is a number if not transform to a number
  if (typeof quantityValue !== "number") {
    quantityValue = parseInt(quantityValue)
  }

  let article = dom.closest("article")
  let articleId = article.getAttribute('data-id')
  let articleColor = article.getAttribute('data-color')

  // Find the current product in the cart and update the value 
  let foundProduct = cart.find(product => product.id == articleId && product.color == articleColor)
  foundProduct.quantity = quantityValue

  // Remove the product of the cart and the DOM 
  if (foundProduct.quantity <= 0) {
    cart.splice(cart.indexOf(foundProduct), 1)
    article.remove()
  }
  setTotalPrice()
  setTotalQuantity()

  // Save in the localStorage
  saveCart(cart)
}

// --- Order Button ---//

const checkIfValid = (input) => {

  const validRegex = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/
  const validRegexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  const validRegexCity = /^([0-9]{5}).[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/
  const validRegexAddress = /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s\,\'\-]*$/

  const currentInput = document.getElementById(input.name);
  const currentInputLength = currentInput.value.parse(' ').length

  const inputErrMsg = document.getElementById(currentInput.name + "ErrorMsg")

  debugger
  switch (currentInput.name) {
    case 'firstName' || 'lastName':
      if (!validRegex.test(currentInput.value)) {
        inputErrMsg.textContent = "Le champ doit contenir un minimum de 2 caractères et ne pas contenir de chiffres"
        inputErrMsg.style.color = "yellow"
        return true
      }
      break;
    case 'lastName':
      if (!validRegex.test(currentInput.value)) {
        inputErrMsg.textContent = "Le champ doit contenir un minimum de 2 caractères et ne pas contenir de chiffres"
        inputErrMsg.style.color = "yellow"
        return true
      }
      break;
    case 'address':
      if (!validRegexAddress.test(currentInput.value) || !(currentInputLength > 2)) {
        inputErrMsg.textContent = "Le champ doit contenir un format d'adresse valide et au moins 2 mots"
        inputErrMsg.style.color = "orange"
        return true
      }
      break;
    case 'city':
      if (!validRegexCity.test(currentInput.value)) {
        inputErrMsg.textContent = "Le champ doit contenir le code postal et la ville (ex: 75000 Paris)"
        inputErrMsg.style.color = 'orange'
        return true
      }
      break;
    case 'email':
      if (!validRegexEmail.test(currentInput.value)) {
        inputErrMsg.textContent = "Le champ doit contenir un email valide"
        inputErrMsg.style.color = 'orange'
        return true;
      };
      break;
    default:
      console.log('ca marche pas');
  }
}

const postOrder = (event) => {

  event.preventDefault()

  if (cart.length === 0) {
    alert("Votre panier est vide")
    return
  }
  let err = false;

  let firstName = document.getElementById('firstName')
  err = checkIfValid(firstName)

  let lastName = document.getElementById('lastName')
  err = checkIfValid(lastName)

  let address = document.getElementById('address')
  err = checkIfValid(address)

  let city = document.getElementById('city')
  err = checkIfValid(city)

  let email = document.getElementById('email')
  err = checkIfValid(email)

  productId = cart.map(product => product.id)

  if (!err) {
    orderObj = {
      contact: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email,
      },
      products: productId
    }

    postAPI(orderObj)

  }

}

//--- Application ---//

let cart = getCart()

displayCart(cart)
addListeners()

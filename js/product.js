const API_URL = 'http://localhost:3000/api/products/';
const url = new URL(window.location.href) // Get the URL of the window
const productId = url.searchParams.get("id") // Get the parameter value of the URL item 'id'


/**
 * Function that pick the data of the product from the product id
 * @returns {Promise<JSON>} return the data of the product
 */
const fetchProduct = async (productId) => {
    let res = await fetch(API_URL + productId)
    return await res.json()
}

//--- Display Function ---//

/**
 * Display all the product infos
 * @param {JSON} jsonInfo
 */
const displayProduct = (jsonInfo) => {

    addProductImg(jsonInfo.imageUrl, jsonInfo.altTxt)
    addProductName(jsonInfo.name)
    addProductPrice(jsonInfo.price)
    addProductDesc(jsonInfo.description)
    addProductColors(jsonInfo.colors)

}

/**
 * Add <img> node with the attribute 
 * @param {String} imageUrl - image url from the API
 * @param {String} altTxt - alt text from the API
 */
const addProductImg = (imageUrl, altTxt) => {
    let img = document.createElement('img')
    img.setAttribute('src', imageUrl)
    img.setAttribute('alt', altTxt)
    console.log(img);

    document.getElementsByClassName('item__img')[0].appendChild(img)
}

/**
 * Add the name of the product
 * @param {String} productName - name of the product from the API
 */
const addProductName = (productName) => {
    document.getElementById('title').innerText = productName;
}

/**
 * Add the price of the product
 * @param {String} productPrice - price of the product from the API
 */
const addProductPrice = (productPrice) => {
    document.getElementById('price').innerText = productPrice;
}

/**
 * Add the description of the product
 * @param {String} productDesc - description of the product from the API
 */
const addProductDesc = (productDesc) => {
    document.getElementById('description').innerText = productDesc;
}

/**
 * Add colors option info
 * @param {String[]} productColors - array of color choice for the product 
 */
const addProductColors = (productColors) => {
    let optionParent = document.getElementById('colors')

    // Create the DOM option elements and insert to the colors options values
    for (let color of productColors) {
        let newOption = document.createElement('option')
        newOption.innerText = color
        optionParent.appendChild(newOption)
    }
}

//--- Function Add to Cart ---//
const addCart = () => {
    let localCart = getCart() || [];
    const productName = document.getElementById('title').innerText;
    const colorChoice = document.getElementById('colors').options[colors.selectedIndex].innerText;
    const productQty = document.getElementById('quantity').value;

    // If same product already exists increase its quantity, otherwise create the object data and send it to localStorage
    if (colorChoice != "--SVP, choisissez une couleur --" && productQty > 0 && productQty <= 100) {

        let foundProduct = localCart.findIndex(element => element.id == productId && element.color == colorChoice)

        if (foundProduct >= 0) {
            localCart[foundProduct].quantity = parseInt(localCart[foundProduct].quantity) + parseInt(productQty)
            if (localCart[foundProduct].quantity > 100) {
                localCart[foundProduct].quantity = 100
                alert("100 article max")
            }
        } else {
            let item = {
                id: productId,
                name: productName,
                color: colorChoice,
                quantity: productQty
            }
            localCart.push(item)
        }

        saveCart(localCart);

        alert(`${productQty} ${productName} de couleur ${colorChoice} a bien été ajouté au panier !`)
    } else {
        alert("Merci de saisir une quantité (entre 1 et 100) et une couleur")
    }
}

/**
 * Get the Cart from the localStorage
 * @returns {JSON} 
 */
const getCart = () => {
    let storage = localStorage.getItem('cart')
    return JSON.parse(storage)
}

const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.getElementById('addToCart').addEventListener('click', addCart)
//--- Application ---//

fetchProduct(productId)
    .then(jsonInfo => displayProduct(jsonInfo))

const API_URL = 'http://localhost:3000/api/products'; // Url of the API


/**
 * Function that extract all data from the API
 * @returns {Promise<JSON>} Promise object represents the Json of the API
 */
const fetchAllProduct = async () => {
    let res = await fetch(API_URL)
    return await res.json()
}

/**
 * Function that loop to write the html content
 * @param {JSON} productsJson - API product result
 */
const displayAllProduct = (productsJson) => {

    let displayHtml = '';
    // Loop to create an item for each products in the data
    for (product of productsJson) {
        displayHtml += `
            <a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}>
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>
        `
    }
    // Get parent element and insert to the html code
    document.getElementById('items').insertAdjacentHTML('beforeend', displayHtml)
}


//--- Application ---//

fetchAllProduct()
    .then(json => displayAllProduct(json))
    .catch(err => document.getElementById('items').innerHTML = `<p style="color:red>${err} Merci de démarrer votre back-end </p>`);
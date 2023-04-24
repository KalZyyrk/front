let url = new URL(window.location.href)
let orderId = url.searchParams.get('orderId')

const displayOrderId = () => {
    document.getElementById('orderId').innerText = orderId
}

displayOrderId()
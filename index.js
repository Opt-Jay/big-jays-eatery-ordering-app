import { menuArray } from "./data/menu.js"
import { calculateOrderSummary } from "./utils/pricing.js"

let cartArray = []

document.getElementById("app").innerHTML = `
    <div class="container">
        <header class="hero">
            <h1>Big Jay's Eatery</h1>
            <p>The best burgers and pizzas in town</p>
        </header>

        <main>
            <section id="menu"></section>

            <section id="order-section"></section>
        </main>

        <div class="modal hidden" id="modal">
            <div class="modal-inner">
                <h2>Enter card details</h2>
                <form id="payment-form">
                    <input type="text" name="fullName" placeholder="Enter your name" required>
                    <input type="text" name="cardNumber" placeholder="Enter card number" required>
                    <input type="text" name="cvv" placeholder="Enter CVV" required>
                    <button type="submit">Pay</button>
                </form>
            </div>
        </div>
    </div>
`

const menuEl = document.getElementById("menu")
const orderSectionEl = document.getElementById("order-section")
const modalEl = document.getElementById("modal")
const paymentForm = document.getElementById("payment-form")

renderMenu()

document.addEventListener("click", function (e) {
    if (e.target.dataset.add) {
        handleAddItem(Number(e.target.dataset.add))
    }

    if (e.target.dataset.remove) {
        handleRemoveItem(Number(e.target.dataset.remove))
    }

    if (e.target.id === "complete-order-btn") {
        modalEl.classList.remove("hidden")
    }
})

paymentForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const formData = new FormData(paymentForm)
    const fullName = formData.get("fullName")

    modalEl.classList.add("hidden")

    orderSectionEl.innerHTML = `
        <div class="success-message">
            Thanks, ${fullName}! Your order is on its way!
        </div>
    `
})

function renderMenu() {
    menuEl.innerHTML = menuArray.map(function (item) {
        return `
            <div class="menu-item">
                <div class="menu-left">
                    <div class="emoji">${item.emoji}</div>
                    <div>
                        <h2>${item.name}</h2>
                        <p>${item.ingredients.join(", ")}</p>
                        <h3>$${item.price}</h3>
                    </div>
                </div>
                <button class="add-btn" data-add="${item.id}">+</button>
            </div>
        `
    }).join("")
}

function handleAddItem(itemId) {
    const selectedItem = menuArray.find(function (item) {
        return item.id === itemId
    })

    cartArray.push(selectedItem)
    renderOrder()
}

function handleRemoveItem(indexToRemove) {
    cartArray.splice(indexToRemove, 1)
    renderOrder()
}

function renderOrder() {
    if (cartArray.length === 0) {
        orderSectionEl.innerHTML = ""
        return
    }

    const orderItemsHtml = cartArray.map(function (item, index) {
        return `
            <div class="order-item">
                <div>
                    <span class="order-name">${item.name}</span>
                    <button class="remove-btn" data-remove="${index}">remove</button>
                </div>
                <span>$${item.price}</span>
            </div>
        `
    }).join("")

    const orderSummary = calculateOrderSummary(cartArray)

    const dealsHtml = orderSummary.appliedDeals.map(function (deal) {
        return `<p class="deal-msg">${deal.name} applied x${deal.count}</p>`
    }).join("")

    orderSectionEl.innerHTML = `
        <div class="order-wrapper">
            <h2>Your order</h2>
            <div class="order-items">
                ${orderItemsHtml}
                ${dealsHtml}
            </div>
            <div class="total-row">
                <span>Total price:</span>
                <span>$${orderSummary.total}</span>
            </div>
            <button id="complete-order-btn">Complete order</button>
        </div>
    `
}
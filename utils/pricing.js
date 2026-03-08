import { menuArray } from "../data/menu.js"
import { deals } from "../data/deals.js"

export function calculateOrderSummary(cartArray) {

    const subtotal = cartArray.reduce((total, item) => total + item.price, 0)

    let remainingItems = [...cartArray]
    let totalDiscount = 0
    let appliedDeals = []

    deals.forEach(function (deal) {

        let dealCount = 0

        while (canApplyDeal(deal, remainingItems)) {

            dealCount++

            const normalPrice = deal.itemIds.reduce(function (sum, dealId) {

                const menuItem = menuArray.find(item => item.id === dealId)

                return sum + menuItem.price

            }, 0)

            totalDiscount += normalPrice - deal.dealPrice

            deal.itemIds.forEach(function (dealId) {

                const index = remainingItems.findIndex(item => item.id === dealId)

                remainingItems.splice(index, 1)

            })
        }

        if (dealCount > 0) {

            appliedDeals.push({
                name: deal.name,
                count: dealCount
            })
        }

    })

    return {
        subtotal,
        total: subtotal - totalDiscount,
        appliedDeals
    }
}

function canApplyDeal(deal, items) {

    return deal.itemIds.every(function (dealId) {

        return items.some(function (item) {

            return item.id === dealId

        })

    })
}
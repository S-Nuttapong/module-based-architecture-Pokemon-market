import { IPokemonCartServices } from '../../@types/pokemonCart'
import { pokemonCartStoreFactory } from '../pokemon-cart'

const mock = {
    "id": "HZSx7l5LsL4Nzyxpqvh3c",
    "item": {
        "id": "xy5-1",
        "name": "Weedle",
        "supertype": "Pokémon",
        "subtypes": [
            "Basic"
        ],
        "hp": "50",
        "types": [
            "Grass"
        ],
        "evolvesTo": [
            "Kakuna"
        ],
        "attacks": [
            {
                "name": "Multiply",
                "cost": [
                    "Grass"
                ],
                "convertedEnergyCost": 1,
                "damage": "",
                "text": "Search your deck for Weedle and put it onto your Bench. Shuffle your deck afterward."
            }
        ],
        "weaknesses": [
            {
                "type": "Fire",
                "value": "×2"
            }
        ],
        "retreatCost": [
            "Colorless"
        ],
        "convertedRetreatCost": 1,
        "set": {
            "id": "xy5",
            "name": "Primal Clash",
            "series": "XY",
            "printedTotal": 160,
            "total": 164,
            "legalities": {
                "unlimited": "Legal",
                "expanded": "Legal"
            },
            "ptcgoCode": "PRC",
            "releaseDate": "2015/02/04",
            "updatedAt": "2020/05/01 16:06:00",
            "images": {
                "symbol": "https://images.pokemontcg.io/xy5/symbol.png",
                "logo": "https://images.pokemontcg.io/xy5/logo.png"
            }
        },
        "number": "1",
        "artist": "Midori Harada",
        "rarity": "Common",
        "flavorText": "Its poison stinger is very powerful. Its bright-colored body is intended to warn off its enemies.",
        "nationalPokedexNumbers": [
            13
        ],
        "legalities": {
            "unlimited": "Legal",
            "expanded": "Legal"
        },
        "images": {
            "small": "https://images.pokemontcg.io/xy5/1.png",
            "large": "https://images.pokemontcg.io/xy5/1_hires.png"
        },
        "tcgplayer": {
            "url": "https://prices.pokemontcg.io/tcgplayer/xy5-1",
            "updatedAt": "2022/10/04",
            "prices": {
                "normal": {
                    "low": 0.06,
                    "mid": 0.2,
                    "high": 1.07,
                    "market": 0.16
                },
                "reverseHolofoil": {
                    "low": 0.2,
                    "mid": 0.4,
                    "high": 3.63,
                    "market": 0.27,
                    "directLow": 0.25
                }
            }
        },
        "cardmarket": {
            "url": "https://prices.pokemontcg.io/cardmarket/xy5-1",
            "updatedAt": "2022/10/04",
            "prices": {
                "averageSellPrice": 0.1,
                "lowPrice": 0.02,
                "trendPrice": 0.1,
                "reverseHoloSell": 0.38,
                "reverseHoloLow": 0.09,
                "reverseHoloTrend": 0.62,
                "lowPriceExPlus": 0.03,
                "avg1": 0.1,
                "avg7": 0.09,
                "avg30": 0.08,
                "reverseHoloAvg1": 0.1,
                "reverseHoloAvg7": 0.64,
                "reverseHoloAvg30": 0.42
            }
        },
        "price": 2.29,
        "isOutOfStock": false
    },
    "quantity": 1,
    "itemTotal": 2.29
}

const stubPokemonCartServices: IPokemonCartServices = {
    'addToCart': async (item) => ({
        'cartItemById': {},
        'cartItemIds': [],
        'currency': 'USD',
        'item': {},
        'total': 10
    }),
    'clearAllItems': async () => ({
        'status': 'Success'
    }),
    'fetch': async () => ({

    }),
    'updateItemQuantity': async () => ({

    })
}

// const usePokemonCartStore = pokemonCartStoreFactory()

describe('usePokemonCartStore', () => {
    it.todo('')
}) 
import { Numeric } from "../@types/common"

const addFixedPoint = (point: number) => (n: number) => n.toFixed(point)

/**
 * @todo: add round, commas, any number format utility here
 */
export const numberFormatter = { addFixedPoint }

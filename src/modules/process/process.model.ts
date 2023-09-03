import { Result } from '../../lib/result/index.js'

export interface Process<T = any> {
    farmId: number
    perform(): Result<T>
}
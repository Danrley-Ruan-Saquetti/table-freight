import { Process } from '../../process/process.model.js'
import { OrderTableDeadlineProcess } from './order-table-deadline.process.js'
import { ValidZipCodeProcess } from './valid-zip-code.process.js'

export enum EnumProcess {
    ValidZipCode = 'ValidZipCode',
    OrderTableDeadline = 'OrderTableDeadline',
}

export const ProcessInstance: { [x in keyof typeof EnumProcess]: new (farmId: number) => Process } = {
    ValidZipCode: ValidZipCodeProcess,
    OrderTableDeadline: OrderTableDeadlineProcess,
}

export type ProcessRelation = { active?: boolean }

export const ProcessRelations: { [x in keyof typeof EnumProcess]: ProcessRelation } = {
    OrderTableDeadline: {},
    ValidZipCode: {}
}
import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { OrderTableProcess } from './order-table.process.js'
import { ValidZipCodeContainedProcess } from './valid-zip-code-contained.process.js'

export enum EnumProcess {
    OrderTable = 'OrderTable',
    ValidZipCodeContained = 'ValidZipCodeContained',
}

export const ProcessInstance: { [x in keyof typeof EnumProcess]: new (args: ProcessChildrenCreate) => Process } = {
    OrderTable: OrderTableProcess,
    ValidZipCodeContained: ValidZipCodeContainedProcess,
}

export type ProcessRelation = { name: string; active?: boolean;  hidden?: boolean }

export const ProcessRelations: { [x in keyof typeof EnumProcess]: ProcessRelation } = {
    OrderTable: { name: 'Order Plant', hidden: true },
    ValidZipCodeContained: { name: 'Valid Zip Code Contained in Plant' },
}

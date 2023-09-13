import { FindManyResponse } from '../../../lib/repository-memory/index.js'
import { Result } from '../../../lib/result/index.js'
import { HeaderController } from '../../header/header.controller.js'
import { HeaderModel, HeaderModelArgs, HeaderType } from '../../header/header.model.js'
import { PlantController } from '../../plant/plant.controller.js'
import { Plant, PlantType } from '../../plant/plant.model.js'
import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { EnumProcess } from './constants.js'

export type PerformResult = { message: string; details: Result<{ message: string; plant: string }>[] }

export type ProcessParams = {
    joinSelectionCriteria: string
}
export type PlantWhithHeaders = Plant & {
    headers: FindManyResponse<HeaderModelArgs>
}

export class ProcvFreightToTotalProcess extends Process<PerformResult> {
    static readonly ProcessName = 'Procv Freight To Total'
    private readonly plantController: PlantController
    private readonly headerController: HeaderController
    params: ProcessParams[]

    constructor(args: ProcessChildrenCreate<PerformResult, ProcessParams>) {
        super({ ...args, name: ProcvFreightToTotalProcess.ProcessName, type: EnumProcess.ProcvFreightToTotal, order: 5 })

        this.params = [{joinSelectionCriteria: (args.params || [])[0]?.joinSelectionCriteria || ' '}]

        this.plantController = new PlantController()
        this.headerController = new HeaderController()
    }

    // # Use Case
    perform() {
        const results = this.performProcv()

        this.result = Result.success<PerformResult>({
            message: `${this.name} successfully`,
            details: [],
        })
    }

    // # Logic
    private performProcv() {
        const {joinSelectionCriteria} = this.params[0]

        const plantTotal = this.getPlantByType(PlantType.Total)
        const plantFreight = this.getPlantByType(PlantType.Freight)

        const headersTotal = this.getHeaderByTypes(plantTotal.headers, HeaderType.CriteriaSelection)
        const headersFreight = this.getHeaderByTypes(plantFreight.headers, HeaderType.CriteriaSelection, HeaderType.Excess, HeaderType.Freight)
        const headersFreightToTotal = this.getHeaderByTypes(plantFreight.headers, HeaderType.Excess, HeaderType.Freight)

        const headerTotalCriteriaSelection = this.getHeaderByTypes(headersTotal, HeaderType.CriteriaSelection)
        const headerFreightCriteriaSelection = this.getHeaderByTypes(headersFreight, HeaderType.CriteriaSelection)

        headersFreightToTotal.map((headerFreightToTotal, j) => {
            plantTotal.table[0][plantTotal.table[0].length] = plantFreight.table[0][headerFreightToTotal.column]
        })

        for(let i = 1; i < plantTotal.table.length; i++) {
            const selectionCriteriaTotal = headerTotalCriteriaSelection.map(header => plantTotal.table[i][header.column]).join(joinSelectionCriteria)

            const index = plantFreight.table.findIndex(line => {
                const selectionCriteriaFreight = headerFreightCriteriaSelection.map(header => line[header.column]).join(joinSelectionCriteria)

                return selectionCriteriaTotal == selectionCriteriaFreight
            })

            if (index < 0) {
                continue
            }

            headersFreightToTotal.map((headerFreightToTotal, j) => {
                plantTotal.table[i][plantTotal.table[i].length] = plantFreight.table[i][headerFreightToTotal.column]
            })
        }

        this.plantController.update({
            where: {id: {equals: plantTotal.id}},
            data: {
                table: plantTotal.table
            }
        })

        this.headerController.createMany({
            data: headersFreightToTotal.map((header, j) => ({...header, tableId: plantTotal.id, column: headersFreightToTotal.length + j}))
        })
    }

    private getHeaderByTypes(headers: HeaderModel[], ...types: HeaderType[]) {
        return types.map(type => this.headerController.filterHeadersByType(headers, type)).reduce(function (resultado, fila) {
            return resultado.concat(fila)
          }, [])
    }

    // # Utils
    private getPlantByType(type: PlantType) {
        return this.plantController.findFirstIncludeHeaders({ where: { farmId: { equals: this.farmId }, type: { equals: type } } }) as PlantWhithHeaders
    }
}

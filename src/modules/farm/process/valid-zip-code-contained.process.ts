import { FindManyResponse } from '../../../lib/repository-memory/index.js'
import { Result } from '../../../lib/result/index.js'
import { HeaderController } from '../../header/header.controller.js'
import { HeaderModel, HeaderModelArgs, HeaderType } from '../../header/header.model.js'
import { PlantController } from '../../plant/plant.controller.js'
import { Plant, PlantType } from '../../plant/plant.model.js'
import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { OrderTableUtil } from '../util/order-table.js'
import { EnumProcess } from './constants.js'

export type PerformResult = { message: string; details: { message: string; plant: string }[] }

export type ProcessParams = {
    plantType: PlantType
}
export type PlantWhithHeaders = Plant & {
    headers: FindManyResponse<HeaderModelArgs>
}

export class ValidZipCodeContainedProcess extends Process<PerformResult> {
    static readonly ProcessName = 'Valid Zip Code Contained'
    private readonly plantController: PlantController
    private readonly headerController: HeaderController
    private readonly orderTableUtil: OrderTableUtil
    params: ProcessParams[]

    constructor(args: ProcessChildrenCreate<PerformResult, ProcessParams>) {
        super({ ...args, name: ValidZipCodeContainedProcess.ProcessName, type: EnumProcess.ValidZipCodeContained, order: 3 })

        this.params = args.params || []

        this.plantController = new PlantController()
        this.headerController = new HeaderController()
        this.orderTableUtil = new OrderTableUtil(this.farmId)
    }

    // # Use Case
    perform() {
        const results = this.validZipCodeContainedInPlants()

        this.result = Result.success<PerformResult>({
            message: `${this.name} successfully`,
            details: results.map(result => result.getValue()),
        })
    }

    // # Logic
    private validZipCodeContainedInPlants() {
        const results = this.params.map(({ plantType }) => {
            const plant = this.getPlantByType(plantType)

            if (!plant) {
                return Result.failure<{ message: string; plant: string }>({
                    title: `${this.name} "${plantType}"`,
                    message: `Plant ${plantType} not defined`,
                })
            }

            try {
                this.orderPlant(plantType)
                const resultValid = this.validZipCodeContained(plant)

                return Result.inherit<{ message: string; plant: string }>(resultValid.getResponse())
            } catch (err) {
                if (err instanceof Result) {
                    return err as Result<{ message: string; plant: string }>
                }

                return Result.failure<{ message: string; plant: string }>({
                    title: `Process: ${this.name}`,
                    message: `Cannot validate zip code contained in plant "${plant.name}"`,
                })
            }
        })

        return results
    }

    private orderPlant(plantType: PlantType) {
        const plant = this.getPlantByType(plantType)

        const headerZipCodeInitial = this.headerController.filterHeadersByType(plant.headers, HeaderType.ZipCodeInitial)[0]

        if (!headerZipCodeInitial) {
            return Result.failure<{ message: string; plant: string }>({ title: `Order Table ${plantType}`, message: `Cannot order plant ${plantType}` })
        }

        return this.orderTableUtil.perform(headerZipCodeInitial.column, plantType)
    }

    private validZipCodeContained(plant: PlantWhithHeaders) {
        const { table, headers } = plant

        const { headerZipCodeInitial, headerZipCodeFinal } = this.getHeadersZipCode(headers)

        const getValuesZipCodeInLine = (i: number) => {
            const valueZipCodeInitial = Number(table[i][headerZipCodeInitial.column])
            const valueZipCodeFinal = Number(table[i][headerZipCodeFinal.column])

            return { valueZipCodeInitial, valueZipCodeFinal }
        }

        const results: Result[] = []

        for (let i = 1; i < table.length; i++) {
            const { valueZipCodeFinal, valueZipCodeInitial } = getValuesZipCodeInLine(i)

            if (valueZipCodeFinal - valueZipCodeInitial < 0) {
                results.push(
                    Result.failure({
                        title: `Process: ${this.name} in Plant "${plant.name}"`,
                        message: `Zip code final ${valueZipCodeInitial} is less than zip code initial ${valueZipCodeInitial}`,
                    })
                )
            }

            if (i == 1) {
                continue
            }

            const { valueZipCodeFinal: lastValueZipCodeFinal, valueZipCodeInitial: lastValueZipCodeInitial } = getValuesZipCodeInLine(i - 1)

            if (valueZipCodeInitial - lastValueZipCodeFinal <= 0) {
                results.push(
                    Result.failure({
                        title: `Process: ${this.name} in Plant "${plant.name}"`,
                        message: `Zip code initial ${valueZipCodeInitial} is cointained in rate zip code ${lastValueZipCodeInitial} - ${lastValueZipCodeFinal}`,
                    })
                )
            }
        }

        return Result.success<{ message: string; plant: string; warnings: Result[] }>({
            message: `Table ${plant.name} validated successfully`,
            plant: plant.name,
            warnings: results,
        })
    }

    private getHeadersZipCode(headers: HeaderModel[]) {
        const headerZipCodeInitial = this.headerController.filterHeadersByType(headers, HeaderType.ZipCodeInitial)[0]
        const headerZipCodeFinal = this.headerController.filterHeadersByType(headers, HeaderType.ZipCodeFinal)[0]

        if (!headerZipCodeInitial || !headerZipCodeFinal) {
            throw Result.failure({ title: `Process: ${this.name}`, message: 'Header "Zip Code Initial/Final" not defined' })
        }

        return { headerZipCodeInitial, headerZipCodeFinal }
    }

    // # Utils
    private getPlantByType(type: PlantType) {
        return this.plantController.findFirstIncludeHeaders({ where: { farmId: { equals: this.farmId }, type: { equals: type } } }) as PlantWhithHeaders
    }
}

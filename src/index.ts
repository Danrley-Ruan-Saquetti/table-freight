import { ModelSchema } from './common/repository.js'
import { FarmController } from './modules/farm/farm.controller.js'
import { EnumProcess } from './modules/farm/process/index.js'
import { HeaderType } from './modules/header/header.model.js'
import { PlantType } from './modules/plant/plant.model.js'
import { TableController } from './modules/table/table.controller.js'
import { TABLE_CONTENT_DEADLINE, TABLE_CONTENT_FREIGHT } from './test/table.js'

window.onload = () => {
    function App() {
        const tableController = new TableController()
        const farmController = new FarmController()

        const tableDeadline = tableController.converterStringInTable(TABLE_CONTENT_DEADLINE)
        const tableFreight = tableController.converterStringInTable(TABLE_CONTENT_FREIGHT)

        const { farmId } = farmController.createFarm({ name: 'Farm - Test' })

        const farmService = farmController.getFarm(farmId)

        if (!farmService) {
            return
        }

        farmService.insertProcess({ type: EnumProcess.OrderTable, params: [{ plantType: PlantType.Deadline, column: 0 }] })
        farmService.insertPlant(
            {
                table: tableDeadline,
                name: 'Plant Deadline',
                type: PlantType.Deadline,
                headers: [
                    { name: 'CEP INICIAL', column: 0, type: HeaderType.ZipCodeInitial },
                    { name: 'CEP FINAL', column: 1, type: HeaderType.ZipCodeFinal },
                    { name: 'PRAZO', column: 2, type: HeaderType.Deadline },
                    { name: 'CS', column: 3, type: HeaderType.CriteriaSelection },
                ],
            },
            {
                table: tableFreight,
                name: 'Plant Freight',
                type: PlantType.Price,
                headers: [
                    { name: 'CS', column: 0, type: HeaderType.CriteriaSelection },
                    { name: 'EXCESS', column: 1, type: HeaderType.Excess },
                ],
            }
        )

        farmService.perform()

        console.log(farmService.getState())
    }

    document.querySelector('button[data-button="get-data"]')?.addEventListener('click', getDataRepository)

    function getDataRepository() {
        console.log(Object.keys(ModelSchema.repository.models).map(key => ({ model: key, documents: ModelSchema.repository.models[key].documents })))
    }

    App()
}

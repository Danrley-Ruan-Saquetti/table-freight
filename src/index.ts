import { FarmController } from './modules/farm/farm.controller.js'
import { FarmRepository } from './modules/farm/farm.repository.js'
import { EnumProcess } from './modules/farm/process/index.js'
import { HeaderType } from './modules/header/header.model.js'
import { HeaderRepository } from './modules/header/header.repository.js'
import { PlantType } from './modules/plant/plant.model.js'
import { PlantRepository } from './modules/plant/plant.repository.js'
import { ProcessRepository } from './modules/process/process.repository.js'
import { TableController } from './modules/table/table.controller.js'
import { TABLE_CONTENT_DEADLINE, TABLE_CONTENT_FREIGHT } from './test/table.js'

window.onload = () => {
    const plantRepository = new PlantRepository()
    const farmRepository = new FarmRepository()
    const headerRepository = new HeaderRepository()
    const processRepository = new ProcessRepository()

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
        console.log(plantRepository.findMany())
        console.log(farmRepository.findMany())
        console.log(headerRepository.findMany())
        console.log(processRepository.findMany())
    }

    App()
}

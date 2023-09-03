import { FarmController } from './modules/farm/farm.controller.js'
import { FarmRepository } from './modules/farm/farm.repository.js'
import { HeaderController } from './modules/header/header.controller.js'
import { HeaderType } from './modules/header/header.model.js'
import { PlantType } from './modules/plant/plant.model.js'
import { PlantRepository } from './modules/plant/plant.repository.js'
import { TableController } from './modules/table/table.controller.js'
import { TABLE_CONTENT_DEADLINE, TABLE_CONTENT_FREIGHT } from './test/table.js'

window.onload = () => {
    const plantRepository = new PlantRepository()
    const farmRepository = new FarmRepository()
    const headerRepository = new HeaderController()

    function App() {
        const tableController = new TableController()
        const farmController = new FarmController()

        const tableDeadline = tableController.converterStringInTable(TABLE_CONTENT_DEADLINE)
        const tableFreight = tableController.converterStringInTable(TABLE_CONTENT_FREIGHT)

        const farmService = farmController.createFarm({
            name: 'Farm - Test',
            plants: [
                {
                    table: tableDeadline,
                    name: 'Plant Deadline',
                    type: PlantType.Deadline,
                    headers: [
                        { name: 'PRAZO', column: 2, type: HeaderType.Deadline },
                        { name: 'CEP FINAL', column: 1, type: HeaderType.CepFinal },
                        { name: 'CEP INICIAL', column: 0, type: HeaderType.CepInitial },
                        { name: 'CS', column: 3, type: HeaderType.CriteriaSelection },
                    ]
                },
                {
                    table: tableFreight,
                    name: 'Plant Freight',
                    type: PlantType.Price,
                    headers: [
                        { name: 'EXCESS', column: 1, type: HeaderType.Excess },
                        { name: 'CS', column: 0, type: HeaderType.CriteriaSelection },
                    ]
                }
            ]
        })

        farmService.perform()

        console.log(farmController.findFirstIncludeTables({ where: { id: { equals: farmService.farmId } } }))
    }

    document.querySelector('button[data-button="get-data"]')?.addEventListener('click', getDataRepository)

    function getDataRepository() {
        console.log(plantRepository.findMany())
        console.log(farmRepository.findMany())
        console.log(headerRepository.findMany())
    }

    App()
}

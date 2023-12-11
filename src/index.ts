import { Table } from './@types/index.js'
import { FarmController } from './modules/farm/farm.controller.js'
import { FarmService } from './modules/farm/farm.service.js'
import { EnumProcess } from './modules/farm/process/constants.js'
import { FileController } from './modules/file/file.controller.js'
import { HeaderType } from './modules/header/header.model.js'
import { PlantType } from './modules/plant/plant.model.js'
import { TableController } from './modules/table/table.controller.js'

window.onload = () => {
    const ENUM_PARAMETERS: { [x in keyof typeof EnumProcess]: any[] } = {
        CreatePlantTotal: [],
        IncrementDeadline: [{ plantType: PlantType.Total, valueIncrement: 1 }],
        ValidZipCodeContained: [{ plantType: PlantType.Total }],
        ProcvFreightToTotal: [{ joinSelectionCriteria: ' ' }],
        GenerateTemplateTable: [
            {
                zipCodeOriginInitialValue: '',
                zipCodeOriginFinalValue: '',
                zipCodeOriginInitial: 'CEP ORIGEM INICIAL',
                zipCodeOriginFinal: 'CEP ORIGEM FINAL',
                zipCodeInitial: 'CEP INICIAL',
                zipCodeFinal: 'CEP FINAL',
                deadline: 'PRAZO',
                excess: 'EXCEDENTE',
                generatePlants: [PlantType.Total, PlantType.TemplateDeadline, PlantType.TemplateFreight, PlantType.TemplateRate],
            },
        ],
    }

    const tableController = new TableController()
    const farmController = new FarmController()
    const fileController = new FileController()

    async function App() {
        initComponents()

        document.querySelector('[button-action="confirm"')?.addEventListener('click', ev => {
            submitForm()
        })

        document.querySelector('[button-action="cancel"')?.addEventListener('click', ev => {
            const listProcess = document.querySelector('[data-form="form-farm"] .list-plants')
            if (listProcess) {
                listProcess.innerHTML = ''
            }

            const listPlants = document.querySelector('[data-form="form-farm"] .list-process')
            if (listPlants) {
                listPlants.innerHTML = ''
            }
        })
    }

    function initComponents() {
        loadHelp()
        newGroupInputPlant()
        newGroupInputProcess()
    }

    function submitForm() {
        const { plants, process } = getValuesForm()
        const { farmId } = farmController.createFarm({ name: 'Farm' })

        const farmService = farmController.getFarm(farmId)

        if (!farmService) {
            return
        }

        process.map(process => {
            farmService.insertProcess({
                type: process.type,
                params: ENUM_PARAMETERS[process.type] ?? [],
            })
        })
        plants.map(({ table, headers, name, type }) => {
            farmService.insertPlant({
                table,
                headers: headers.map(({ index, name, type }) => ({ column: index, name, type })),
                name,
                type,
            })
        })

        farmService.perform()

        console.log({ plants, process })
        console.log(farmService.getState())
    }

    function getValuesForm() {
        const plants: {
            table: Table
            name: string
            type: PlantType
            headers: { name: string; type: HeaderType; index: number }[]
        }[] = []

        const process: { type: EnumProcess }[] = []

        document.querySelectorAll('.list-plants .group').forEach(async plant => {
            const fileInput = ((plant.querySelector('.plant [name="input-file"]') as HTMLInputElement)?.files || [])[0]

            if (!fileInput) {
                return
            }

            const type = (plant.querySelector('.type [name="input-plant-type"]') as HTMLInputElement)?.value as PlantType

            if (!type) {
                return
            }

            const headers = Array.from(plant.querySelectorAll('.header') || []).map(header => ({
                name: header.querySelector<HTMLInputElement>('[name="input-header-name"]')?.value || '',
                type: (header.querySelector<HTMLInputElement>('[name="input-header-type"]')?.value || '') as HeaderType,
                index: Number(header.querySelector<HTMLInputElement>('[name="input-header-index"]')?.value) - 1 || 0,
            }))

            const file = await fileController.getContentFile(fileController.createFile({ content: [fileInput], type: fileInput.type }))

            plants.push({
                table: tableController.converterStringInTable(file),
                name: fileInput.name,
                type,
                headers,
            })
        })

        document.querySelectorAll('.list-plants .process').forEach(pro => {
            const type = pro.querySelector('.name [name="input-process-type"]').value as EnumProcess

            process.push({ type })
        })

        return { plants, process }
    }

    async function generateDownloadFarm(farmService: FarmService) {
        const files = farmService.getPlants().map(({ table, name }) => {
            const tableInString = tableController.converterTableInString(table)
            const file = fileController.createFile({ content: [tableInString] })

            return { file, name: `${name}.csv` }
        })

        const url = await fileController.createURLDownloadZip(files)

        const tagDownload = document.createElement('a')

        tagDownload.setAttribute('href', url)
        tagDownload.setAttribute('download', `${farmService.getFarm().name}.zip`)

        tagDownload.innerHTML = 'Download'

        document.body.appendChild(tagDownload)
    }

    function newGroupInputPlant() {
        const div = document.createElement('div')

        div.classList.add('group-input-wrapper')
        div.setAttribute('style', 'margin-bottom: 20px;')

        div.innerHTML = TEMPLATE_GROUP_INPUT_PLANT

        const headerWrapper = document.createElement('div')
        div.querySelector('[data-input="new-plant"]')?.addEventListener('click', ev => {
            newGroupInputPlant()
        })

        div.querySelector('[data-input="remove-plant"]')?.addEventListener('click', ev => {
            div.remove()
        })

        document.querySelector('[data-form="form-farm"] .list-plants')?.appendChild(div)
        div.querySelector('.group').appendChild(headerWrapper)

        newGroupInputHeaders(headerWrapper)
    }

    function newGroupInputHeaders(parent: HTMLElement) {
        const div = document.createElement('div')

        div.classList.add('group-input')

        div.innerHTML = TEMPLATE_GROUP_INPUT_HEADERS

        div.querySelector('[name="input-header-index"]').value = parent.querySelectorAll('.group-input [name="input-header-index"]').length + 1

        div.querySelector('[data-input="new-header"]')?.addEventListener('click', ev => {
            newGroupInputHeaders(parent)
        })

        div.querySelector('[data-input="remove-header"]')?.addEventListener('click', ev => {
            div.remove()
        })

        parent.appendChild(div)
    }

    function newGroupInputProcess() {
        const div = document.createElement('div')

        div.classList.add('group-input-wrapper')
        div.setAttribute('style', 'margin-bottom: 20px;')

        div.innerHTML = TEMPLATE_GROUP_INPUT_PROCESS

        div.querySelector('[data-input="new-process"]')?.addEventListener('click', ev => {
            newGroupInputProcess()
        })

        div.querySelector('[data-input="remove-process"]')?.addEventListener('click', ev => {
            div.remove()
        })

        document.querySelector('[data-form="form-farm"] .list-process')?.appendChild(div)
    }

    const TEMPLATE_GROUP_INPUT_PLANT = `
<div class="group">
    <div class="group-input plant">
        <label for="input-name">Arquivo: </label>
        <input type="file" name="input-file">
        <button type="button" data-input="new-plant" style="margin-left: 10px;">ADD</button>
        <button type="button" data-input="remove-plant" style="margin-left: 10px;">REMOVE</button>
    </div>
    <div class="group-input type">
        <label for="input-plant-type">Tipo: </label>
        <select name="input-plant-type" id="input-plant-type">
            <option value="Deadline">Prazo</option>
            <option value="Freight">Frete</option>
            <option value="Total">Total</option>
        </select>
    </div>
</div>
`

    const TEMPLATE_GROUP_INPUT_HEADERS = `
<div class="group-input header">
    <label for="input-header-name">Cabeçalho: </label>
    <input type="text" name="input-header-name">
    <label for="input-header-index">Index: </label>
    <input type="number" min=1 name="input-header-index">
    <select name="input-header-type" id="input-header-type">
        <option value="ZipCodeInitial">CEP Inicial</option>
        <option value="ZipCodeFinal">CEP Final</option>
        <option value="CEP Origem Inicial">CEP Origem Inicial</option>
        <option value="CEP Origem Final">CEP Origem Final</option>
        <option value="Deadline">Prazo</option>
        <option value="DeadlineMoreD">Prazo + D</option>
        <option value="CriteriaSelection">Critério de Seleção</option>                               
        <option value="Rate">Taxa</option>
        <option value="Excess">Excedente</option>
        <option value="Freight">Frete</option>
    </select>
    <button type="button" data-input="new-header" style="margin-left: 10px;">ADD</button>
    <button type="button" data-input="remove-header" style="margin-left: 10px;">REMOVE</button>
</div>
`

    const TEMPLATE_GROUP_INPUT_PROCESS = `
<div class="group-input process">
    <label for="input-process-type">Processo: </label>
    <select name="input-process-type" id="input-process-type">
        <option value="ValidZipCodeContained">Validar CEP contido</option>
        <option value="IncrementDeadline">Acrescentar Prazo (D+1)</option>
        <option value="ProcvFreightToTotal">Fazer PROCV</option>
        <option value="GenerateTemplateTable">Gerar Templates</option>
    </select>
    <button type="button" data-input="new-process" style="margin-left: 10px;">ADD</button>
    <button type="button" data-input="remove-process" style="margin-left: 10px;">REMOVE</button>
</div>
`

    function loadHelp() {
        document.querySelector('.logo .help-icon')?.addEventListener('click', () => {
            toggleHelp(true)
        })
        document.querySelector('.logo .help-title .close')?.addEventListener('click', () => {
            toggleHelp(false)
        })
    }

    function toggleHelp(force?: boolean) {
        document.querySelector<HTMLElement>('.logo .help-info')?.classList.toggle('enable', force)
    }

    App()
}

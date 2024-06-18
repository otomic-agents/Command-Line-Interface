import {Args, Command, Flags} from '@oclif/core'
import existSafe, { ExistTask } from '../utils/ExistSafe'
import ReportForms from '../reportforms'
import { delay, Listr } from 'listr2';
import { prompt } from 'enquirer';
import { title } from 'process';

export default class Reportforms extends Command implements ExistTask {
  
  reportForms: ReportForms | undefined = undefined

  taskNow: any

  static override args = {
    file: Args.string({description: 'file to read'}),
  }

  static override description = 'describe the command here'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {

    // // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),
    // // flag with a value (-n, --name=VALUE)
    // name: Flags.string({char: 'n', description: 'name to print'}),
  }
  
  cleanup = async () => {
    if (this.reportForms != undefined) {
      await this.reportForms.onCloseDB()
    }
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Reportforms)

    existSafe(this)

    const mode: { value: string[]} = await prompt({
      type: 'multiselect',
      name: 'value',
      message: 'Pick modes your want',
      choices: [
        { name: 'Sync Data', value: 'Sync Data' },
        { name: 'Create Report Forms', value: 'Create Report Forms' },
      ]
    });
    console.log('mode', mode)

    const path: { value: string} = (await prompt({
      type: 'input',
      name: 'value',
      message: 'Enter db path',
    }))
    const p = (path.value == './' || path.value == '.' || path.value == '/' ) ? __dirname : path.value
    console.log('path', p)

    const wallets: { value: string[]} = (await prompt({
      type: 'list',
      name: 'value',
      message: 'Enter your wallets',
    }))
    console.log('wallets', wallets)

    const chains: { value: string[]} = await prompt({
      type: 'multiselect',
      name: 'value',
      message: 'Pick chains your want',
      choices: [
        { name: 'BSC', value: 'BSC' },
        { name: 'OPT', value: 'OPT' },
      ]
    });
    console.log('chains', chains)

    this.reportForms = new ReportForms(mode.value.includes('Sync Data'), mode.value.includes('Create Report Forms'), p, wallets.value, chains.value, this)
    this.reportForms.start()

    try {
      await new Listr(this.getListrData(this.reportForms)).run()
    } catch (error) {
      console.error(error)
      process.exit(1)
    }

  }

  getListrData = (reportForms: ReportForms) => {

    return this.getTaskList(reportForms.taskAndState)
  }

  getTaskList = (stateList: any[]) => {
    const taskList = []
    for (const state of stateList) {

      if (state.subTask == undefined || state.subTask.length == 0) {
        taskList.push({
          title: state.taskName,
          enabled: true,
          task: async(_: any, task: any): Promise<void> => {
            
            while (state.state != 'finished') {

              if (state.state == 'running') {
                this.taskNow = task
              }
              await delay(200)
            }
            

          }
        })
      } else {
        taskList.push({
          title: state.taskName,
          enabled: true,
          task: (_: any, task: any): Listr => task.newListr(this.getTaskList(state.subTask), { concurrent: true, rendererOptions: { collapseSubtasks: true } })
        })
      }
    }

    return taskList
  }

  log = (message: string) => {
    this.taskNow.output = message
  }
}

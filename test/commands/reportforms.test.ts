import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('reportforms', () => {
  it('runs reportforms cmd', async () => {
    const {stdout} = await runCommand('reportforms')
    expect(stdout).to.contain('hello world')
  })

  it('runs reportforms --name oclif', async () => {
    const {stdout} = await runCommand('reportforms --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})

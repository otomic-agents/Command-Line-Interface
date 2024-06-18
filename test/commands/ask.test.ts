import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('ask', () => {
  it('runs ask cmd', async () => {
    const {stdout} = await runCommand('ask')
    expect(stdout).to.contain('hello world')
  })

  it('runs ask --name oclif', async () => {
    const {stdout} = await runCommand('ask --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})

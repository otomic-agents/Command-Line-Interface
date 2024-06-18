import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('swap', () => {
  it('runs swap cmd', async () => {
    const {stdout} = await runCommand('swap')
    expect(stdout).to.contain('hello world')
  })

  it('runs swap --name oclif', async () => {
    const {stdout} = await runCommand('swap --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})

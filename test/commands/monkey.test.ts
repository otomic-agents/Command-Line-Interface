import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('monkey', () => {
  it('runs monkey cmd', async () => {
    const {stdout} = await runCommand('monkey')
    expect(stdout).to.contain('hello world')
  })

  it('runs monkey --name oclif', async () => {
    const {stdout} = await runCommand('monkey --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})

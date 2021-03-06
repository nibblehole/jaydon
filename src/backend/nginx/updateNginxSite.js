const defaults = require.main.require('./defaults')
const exec = require.main.require('./common/exec')
const nginxConfigurationGenerator = require('./nginxConfigurationGenerator')
const restartNginxServiceCommand = require('./restartNginxServiceCommand')

const updateNginxSite = async props => {
  const { oldDomain, newDomain } = props
  const oldWwwDirectoryPath = `${defaults.nginx.dir.www}/${oldDomain}`
  const newWwwDirectoryPath = `${defaults.nginx.dir.www}/${newDomain}`
  const oldNginxConfigurationFilePath = `${defaults.nginx.dir.core}/sites-available/${oldDomain}`
  const oldLinkedNginxConfigurationFilePath = `${defaults.nginx.dir.core}/sites-enabled/${oldDomain}`
  const nginxConfigurationFileContent = nginxConfigurationGenerator({ domain: newDomain })
  const nginxConfigurationFilePath = `${defaults.nginx.dir.core}/sites-available/${newDomain}`
  const nginxLinkedConfigurationFolderPath = `${defaults.nginx.dir.core}/sites-enabled/`

  const commands = [
    `mv ${oldWwwDirectoryPath} ${newWwwDirectoryPath}`,
    `rm ${oldNginxConfigurationFilePath}`,
    `rm ${oldLinkedNginxConfigurationFilePath}`,
    `echo "${nginxConfigurationFileContent}" > ${nginxConfigurationFilePath}`,
    `ln -s ${nginxConfigurationFilePath} ${nginxLinkedConfigurationFolderPath}`,
    restartNginxServiceCommand
  ]

  const joinCommands = commands.join(' && ')
  const result = await exec(joinCommands)
  return result
}

module.exports = updateNginxSite

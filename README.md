otmoiccli
=================

otmoic-cli has functions such as generating account reports, querying quotes, and making exchanges.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/otmoiccli.svg)](https://npmjs.org/package/otmoiccli)
[![Downloads/week](https://img.shields.io/npm/dw/otmoiccli.svg)](https://npmjs.org/package/otmoiccli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g otmoiccli
$ otmoiccli COMMAND
running command...
$ otmoiccli (--version)
otmoiccli/0.0.0 darwin-arm64 node-v20.11.1
$ otmoiccli --help [COMMAND]
USAGE
  $ otmoiccli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`otmoiccli hello PERSON`](#otmoiccli-hello-person)
* [`otmoiccli hello world`](#otmoiccli-hello-world)
* [`otmoiccli help [COMMAND]`](#otmoiccli-help-command)
* [`otmoiccli plugins`](#otmoiccli-plugins)
* [`otmoiccli plugins add PLUGIN`](#otmoiccli-plugins-add-plugin)
* [`otmoiccli plugins:inspect PLUGIN...`](#otmoiccli-pluginsinspect-plugin)
* [`otmoiccli plugins install PLUGIN`](#otmoiccli-plugins-install-plugin)
* [`otmoiccli plugins link PATH`](#otmoiccli-plugins-link-path)
* [`otmoiccli plugins remove [PLUGIN]`](#otmoiccli-plugins-remove-plugin)
* [`otmoiccli plugins reset`](#otmoiccli-plugins-reset)
* [`otmoiccli plugins uninstall [PLUGIN]`](#otmoiccli-plugins-uninstall-plugin)
* [`otmoiccli plugins unlink [PLUGIN]`](#otmoiccli-plugins-unlink-plugin)
* [`otmoiccli plugins update`](#otmoiccli-plugins-update)

## `otmoiccli hello PERSON`

Say hello

```
USAGE
  $ otmoiccli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ otmoiccli hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/otmoic/Command-Line-Interface/blob/v0.0.0/src/commands/hello/index.ts)_

## `otmoiccli hello world`

Say hello world

```
USAGE
  $ otmoiccli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ otmoiccli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/otmoic/Command-Line-Interface/blob/v0.0.0/src/commands/hello/world.ts)_

## `otmoiccli help [COMMAND]`

Display help for otmoiccli.

```
USAGE
  $ otmoiccli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for otmoiccli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.0/src/commands/help.ts)_

## `otmoiccli plugins`

List installed plugins.

```
USAGE
  $ otmoiccli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ otmoiccli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.3/src/commands/plugins/index.ts)_

## `otmoiccli plugins add PLUGIN`

Installs a plugin into otmoiccli.

```
USAGE
  $ otmoiccli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into otmoiccli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the OTMOICCLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the OTMOICCLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ otmoiccli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ otmoiccli plugins add myplugin

  Install a plugin from a github url.

    $ otmoiccli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ otmoiccli plugins add someuser/someplugin
```

## `otmoiccli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ otmoiccli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ otmoiccli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.3/src/commands/plugins/inspect.ts)_

## `otmoiccli plugins install PLUGIN`

Installs a plugin into otmoiccli.

```
USAGE
  $ otmoiccli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into otmoiccli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the OTMOICCLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the OTMOICCLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ otmoiccli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ otmoiccli plugins install myplugin

  Install a plugin from a github url.

    $ otmoiccli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ otmoiccli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.3/src/commands/plugins/install.ts)_

## `otmoiccli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ otmoiccli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ otmoiccli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.3/src/commands/plugins/link.ts)_

## `otmoiccli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ otmoiccli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ otmoiccli plugins unlink
  $ otmoiccli plugins remove

EXAMPLES
  $ otmoiccli plugins remove myplugin
```

## `otmoiccli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ otmoiccli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.3/src/commands/plugins/reset.ts)_

## `otmoiccli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ otmoiccli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ otmoiccli plugins unlink
  $ otmoiccli plugins remove

EXAMPLES
  $ otmoiccli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.3/src/commands/plugins/uninstall.ts)_

## `otmoiccli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ otmoiccli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ otmoiccli plugins unlink
  $ otmoiccli plugins remove

EXAMPLES
  $ otmoiccli plugins unlink myplugin
```

## `otmoiccli plugins update`

Update installed plugins.

```
USAGE
  $ otmoiccli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.3/src/commands/plugins/update.ts)_
<!-- commandsstop -->

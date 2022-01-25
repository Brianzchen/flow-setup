# flow-setup
Always confused with all the config settings you need to have flow setup for a new project?

`flow-setup` is a simple no-install tool that will generate a `.flowconfig` for you based on a config file anywhere on github. Great for when you're managing multiple projects you want to keep up to date.

## Usage

``` bash
npx flow-setup [configName] [...options]
# eg
npx flow-setup
npx flow-setup library
npx flow-setup foo --owner=bar --repo=blah
```

By default this tool pulls configs from this repo but if you want to have something custom and don't want to contribute, you can create your own public repo **without** forking this tool with the **Options** guide below.

## API

### `configName` (Optional)

This is the name of the json file inside your config dir path that will be pulled, by default it will be looking for the file `recommended.json` if you don't specify anything.

### Options

- `owner`: *(default: brianzchen)* The github owner for url pathing
- `repo`: *(default: flow-setup)* The github repo for url pathing
- `path`: *(default: configs)* The directory of the configs in the repo

### Creating configs

Configs are just json files with properties that represent the various sections in a `.flowconfig`. Each property holds an array of strings for each row in a section.

Although some sections support key-value pairs, using strings allow for more universal compatibility for row values.

The config also supports a special `extends` property that takes a string, this will match to another config that your current config will merge with. Multiple configs can be merged recursively as one extends another.

**Sample**
```sh
{
  "extends": "base",
  "ignore": [
    ".*node_modules/.*",
    "!.*node_modules/react-native/.*",
    ".*node_modules/react-native/Libraries/polyfills/.*",
    "!.*node_modules/@.*",
    "!.*node_modules/date-fns/.*",
    "!.*node_modules/tiny-invariant/.*",
    "!.*node_modules/key-commander/.*",
    "!.*node_modules/react-ld/.*"
  ],
  "lints": [
    "deprecated-type=error",
    "deprecated-utility=error",
    "unnecessary-optional-chain=error"
  ],
  "options": [
    "format.bracket_spacing=true",
    "format.single_quotes=true",
    "exact_by_default=true",
    "include_warnings=true"
  ]
}
```

## Contributions

### Enhancing the tool

This tool is pretty simple but if you'd like to add more features please submit an issue and we can chat about it.

### Adding configs

If you don't want to start a repo and would like to add your config here please feel free to create a pull request with a new config with a name of your choice.

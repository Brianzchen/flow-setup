#!/usr/bin/env node
// @flow
/*::
import { type Argv } from 'yargs';
*/

const fs = require('fs');
const { exec } = require('child_process');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const rootPath = require('app-root-path');
const deepmerge = require('deepmerge');
const { Octokit } = require('@octokit/rest');
const axios = require('axios');

const argv/*: Argv*/ = (yargs(hideBin(process.argv)).argv/*: any*/);
const configName = argv._[0] || 'recommended';
const { owner = 'brianzchen', repo = 'flow-setup', path = 'configs' } = argv;

/*::
type FlowSetupConfigsT = {
  extends?: 'string',
  // A key value pair of config type and their respective rules
  [key: string]: Array<string>,
};
*/

const installFlowBin = () => {
  const usingYarn = fs.existsSync('./yarn.lock');
  const usingPnpm = fs.existsSync('./pnpm-lock.yaml');
  const usingNpm = fs.existsSync('./package-lock.json');

  console.info('Installing `flow-bin`...')

  if (usingYarn) {
    exec('yarn add -D flow-bin');
  } else if (usingPnpm) {
    exec('pnpm add -D flow-bin');
  } else if (usingNpm) {
    exec('npm i --save-dev flow-bin');
  } else {
    console.error('No lock file found, cannot determine install method, skipping `flow-bin` install...\n');
    return;
  }

  console.log('`flow-bin` installed!');
};

(async () => {
  const config = await (async () => {
    const octokit = new Octokit();
    const configs/*: { [key: string]: string }*/ = (await octokit.repos.getContent({
      owner,
      repo,
      path,
    })).data.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.name.substring(0, cur.name.indexOf('.json'))]: cur.download_url,
      };
    }, { ...null });

    const getMergedJson = async (name/*: string*/)/*: Promise<FlowSetupConfigsT>*/ => {
      const mergeJson = (await axios.get(configs[name])/*: { data: FlowSetupConfigsT, ... }*/).data;
      if (mergeJson.extends) {
        const baseJson = await getMergedJson(mergeJson.extends);
        return deepmerge(baseJson, mergeJson);
      }
      return mergeJson;
    };

    return await getMergedJson(configName);
  })();

  if (!config) {
    console.log('You have used an invalid config name');
    process.exit(1);
  } else {
    installFlowBin();

    // Create .flowconfig
    const sections = ['ignore', 'include', 'untyped', 'libs', 'lints', 'options', 'strict', 'version', 'declarations'];
    let flowconfig = '';

    sections.forEach((section) => {
      flowconfig = `${flowconfig}[${section}]\n${([...(config[section] || []), '']).join('\n')}\n`;
    });
    flowconfig = flowconfig.substring(0, flowconfig.length - 1);

    fs.writeFile('./.flowconfig', flowconfig, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.info('Done!')
    });
  }
})();


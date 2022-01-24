#!/usr/bin/env node
// @flow

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const rootPath = require('app-root-path');
const deepmerge = require('deepmerge');
const { Octokit } = require('@octokit/rest');
const axios = require('axios');

const baseJson = require('../configs/base.json');
const libraryJson = require('../configs/library.json');
const recommendedJson = require('../configs/recommended.json');

const argv = yargs(hideBin(process.argv)).argv;

const configName = argv._[0] || 'recommended';

(async () => {
  const config = await (async () => {
    const octokit = new Octokit();
    const configs/*: { [key: string]: string }*/ = (await octokit.repos.getContent({
      owner: 'brianzchen',
      repo: 'flow-setup',
      path: 'configs',
    })).data.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.name.substring(0, cur.name.indexOf('.json'))]: cur.download_url,
      };
    }, { ...null });

    if (configs[configName]) {
      const baseJson = configName !== 'base' && (await axios.get(configs.base)).data;
      const mergeJson = (await axios.get(configs[configName])).data;
      if (baseJson) {
        return deepmerge(baseJson, mergeJson);
      }
      return mergeJson;
    }
  })();

  if (!config) {
    console.log('You have used an invalid config name');
    process.exit(1);
  } else {
    const sections = ['ignore', 'includes', 'libs', 'lints', 'options', 'strict'];
    let flowconfig = '';

    sections.forEach((section) => {
      flowconfig = `${flowconfig}[${section}]\n${([...(config[section] || []), '']).join('\n')}\n`;
    });

    console.log(flowconfig);
  }
})();


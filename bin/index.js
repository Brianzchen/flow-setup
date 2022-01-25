#!/usr/bin/env node
// @flow

const fs = require('fs');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const rootPath = require('app-root-path');
const deepmerge = require('deepmerge');
const { Octokit } = require('@octokit/rest');
const axios = require('axios');

const argv = yargs(hideBin(process.argv)).argv;
const configName = argv._[0] || 'recommended';
const { owner = 'brianzchen', repo = 'flow-setup', path = 'configs' } = argv;

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

    const getMergedJson = async (name) => {
      const mergeJson = (await axios.get(configs[name])).data;
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
    const sections = ['ignore', 'include', 'untyped', 'libs', 'lints', 'options', 'strict', 'version', 'declarations'];
    let flowconfig = '';

    sections.forEach((section) => {
      flowconfig = `${flowconfig}[${section}]\n${([...(config[section] || []), '']).join('\n')}\n`;
    });
    flowconfig = flowconfig.substring(0, flowconfig.length - 1);

    fs.writeFile(`${rootPath}/.flowconfig`, flowconfig, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  }
})();


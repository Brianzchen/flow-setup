#!/usr/bin/env node
// @flow

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const rootPath = require('app-root-path');
const deepmerge = require('deepmerge');

const baseJson = require('../configs/base.json');
const libraryJson = require('../configs/library.json');
const recommendedJson = require('../configs/recommended.json');

const argv = yargs(hideBin(process.argv)).argv;

const configName = argv._[0] || 'recommended';

const config = (() => {
  if (configName === 'recommended') {
    return deepmerge(baseJson, recommendedJson);
  } else if (configName === 'library') {
    return deepmerge(baseJson, libraryJson);
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


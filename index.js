#!/usr/bin/env node

const inquirer = require('inquirer')
const autocomplete = require('inquirer-autocomplete-prompt')
const fuzzy = require('fuzzy')
const pad = require('right-pad')
const path = require('path')
const exec = require('./exec')

const config = path.join(process.cwd(), './package-scripts.js')
const packageScripts = require(config).scripts

let flatScripts = []

const flattenScripts = (scripts, prefix, hidden = false) => {
	const keys = Object.keys(scripts);
	keys.forEach(key => {
		// format = name: command
		let script;
		let description;
		let name;
		if (prefix) name = prefix + "." + key;
		else name = key;
		if (scripts[key].hiddenFromHelp) {
			hidden = true;
		}
		// format = name: command
		if (typeof scripts[key] === "string") {
			script = scripts[key];
			description = "";
		}

		if (typeof scripts[key] === "object") {
			const shape = scripts[key];

			// format = name: { default: command }
			if (typeof shape.default === "string") {
				script = shape.default;
				description = shape.description;

				delete shape.default;
				delete shape.description;
			}

			// format = name: { script: command }
			if (typeof shape.script === "string") {
				script = shape.script;
				description = shape.description;

				delete shape.script;
				delete shape.description;
			}

			// recursively call for other shapes inside this object
			// format = parent: { child: { script: command } }
			flattenScripts(shape, name, hidden);
		}

		if (script && !hidden) flatScripts.push({ name, script, description });
	});
};

/* Flatten scripts */
flattenScripts(packageScripts)

/* Find longest key */
let longestKey = ''
flatScripts.forEach(element => {
  if (element.name.length > longestKey.length) longestKey = element.name
})

/* Width of key column */
const width = longestKey.length + 5

/* Add pretty string to each element */
flatScripts = flatScripts.map(element => {
  element.prettyString = `${pad(element.name, width)} ${element.description}`
  return element
})

const fuzzyOptions = {
  extract: element => element.prettyString
}

const filterScripts = (_, input) => {
  input = input || ''

  return new Promise(resolve => {
    const results = fuzzy.filter(input, flatScripts, fuzzyOptions)
    const prettyResults = results.map(result => {
      return result.original.prettyString
    })
    resolve(prettyResults)
  })
}

const autocompleteOptions = {
  type: 'autocomplete',
  name: 'string',
  message: 'Which script would you like to run?\n\n',
  source: filterScripts
}

inquirer.registerPrompt('autocomplete', autocomplete)
inquirer.prompt(autocompleteOptions).then(result => {
  const element = flatScripts.find(element => element.prettyString === result.string)
  exec(`nps ${element.name}`)
})

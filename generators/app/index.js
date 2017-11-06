'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
var mkdirp = require('mkdirp');
var path = "";

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(
      'Welcome to the ' + chalk.red('jean-application') + ' generator!'
    ));
    const prompts = [{
      type: 'input',
      name: 'name',
      message: "What is the npm name of this application: ",
      default: ""
    }, {
      type: 'input',
      name: 'title',
      message: 'What is the title of this application: ',
      default: ""
    },
    {
      type: 'input',
      name: 'description',
      message: 'Describe the functionality of this application: ',
      default: "Please provide additional information"
    }];
    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    var keywords = [];
    var args = {
      name: this.props.name,
      title: this.props.title,
      description: this.props.description,
    };
    path = args.title;
    console.log("writing: " + path);
    mkdirp.sync(path);
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath(path + '/package.json'),
      args
    );
    this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath(path + '/README.md'),
      args
    );
    this.fs.copyTpl(
      this.templatePath('_LICENSE.md'),
      this.destinationPath(path + '/LICENSE.md'),
      args
    );
    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath(path + '/.gitignore'),
      args
    );
    this.fs.copy(
      this.templatePath('_favicon.ico'),
      this.destinationPath(path + '/favicon.ico')
    );
    this.fs.copyTpl(
      this.templatePath('_index.html'),
      this.destinationPath(path + '/index.html'),
      args
    );
    this.fs.copyTpl(
      this.templatePath('_index.js'),
      this.destinationPath(path + '/index.js'),
      args
    );
    this.fs.copyTpl(
      this.templatePath('_require.config.js'),
      this.destinationPath(path + '/require.config.js'),
      args
    );
    var elementDir = process.cwd() + '/' + path;
    process.chdir(elementDir)
    this.installDependencies({
      bower: false,
      npm: true,
      callback: function () {
        console.log('Everything is ready!');
      }
    });
  }
};

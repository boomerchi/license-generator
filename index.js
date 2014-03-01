#!/usr/local/bin/node

var program = require('commander');
var fs = require('fs');

// Get version from package.json.
var version = require('./package.json').version;

// Get available licenses.
var licenses = [];
fs.readdirSync('./licenses').map(function(license) {
  licenses.push(license.replace(/\.[0-9a-z]+$/i, ''));
});

program
  .option("-y, --year <year>", 'The year to use. Example: 2014.')
  .option("-n, --fullname <fullname>", 'Your fullname.')

program
  .command('install [license]')
  .description('Installs a license')
  .version(version)
  .option("-y, --year <year>", 'The year to use. Example: 2014.')
  .option("-n, --fullname <fullname>", 'Your fullname.')
  .action(function(license, options){
    // Use provided year or default to current year.
    var year = options.year || new Date().getUTCFullYear();

    // Use provided name or default to blank.
    var fullname = options.fullname || '';

    // Create a LICENSE file.
    var license_file = './licenses/' + license + '.txt';
    fs.readFile(license_file, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }

      // Make replacements for year and fullname.
      var result = data
                    .replace(/\[year\]/g, year)
                    .replace(/\[fullname\]/g, fullname);

      fs.writeFile('./LICENSE', result, 'utf8', function (err) {
         if (err) return console.log(err);
      });
    });
  });

// Examples.
program.on('--help', function(){
  console.log('  Available Licenses:');
  console.log('');
  console.log('    ' + licenses.join(", "));
  console.log('');
});

// Examples.
program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ license-generator install bsd -y 2014 -n "John Doe"');
  console.log('');
});

program.parse(process.argv);

if (!program.args.length) program.help();

const fs = require('fs');
const path = require('path');
const utils = require('../lib/index');

var existsSync = (process.version.indexOf('v0.6') !== -1 ? require('path').existsSync : existsSync = fs.existsSync);

module.exports = {
	'Verifica que todos os submodulos estão disponíveis': function(test){
		fs.readdirSync(path.join(__dirname, '/../lib')).forEach(function(file){
			var match = file.match(/(.*)Utils.js/);

			if(match){
				//console.log(match[1] + " / " + typeof utils[match[1]]);
				test.ok(utils[match[1]]);
			}
		});

		test.done();
	},

	'Verifica que para cada submodulo existe um arquivo de teste': function(test){
		fs.readdirSync(path.join(__dirname, '/../lib')).forEach(function(file){
			var match = file.match(/(.*)Utils.js/);

			if(match){
				var exists = existsSync(__dirname + '/' + match[1] + '-test.js');
				//console.log(match[1] + " / " + exists);
				test.ok(exists);
			}
		});

		test.done();
	},

	'Verifica que para cada propriedade exposta por um submodulo existe um conjunto de testes': function(test){
		fs.readdirSync(path.join(__dirname, '/../lib')).forEach(function(file){
			var match = file.match(/(.*)Utils.js/);

			if(match){
				var testFilePath = __dirname + '/' + match[1] + '-test.js';
				var exists = existsSync(testFilePath);
				if(exists){
					var submoduleTest = require(testFilePath);
					var submodule = require(__dirname + '/../lib/' + file);

					//console.log(match[1] + " / " + file);

					for(var property in submodule){
						if(Object.prototype.isPrototypeOf.call(submodule,property)){
							var temTeste = property in submoduleTest;

							if(!temTeste) {
								console.error(' > Missing tests for: ' + match[1] + ':' + property);
							}

							test.ok(temTeste);
						}
					}

				}
			}
		});

		test.done();
	}
};

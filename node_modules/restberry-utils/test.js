var utils = require('./lib/index.js')


exports.testCamelCaseStr = function(test) {
    var m = utils.camelCaseStr
    test.equal(m('hej du'), 'hejDu')
    test.equal(m('model name'), 'modelName')
    test.equal(m('MODEL'), 'model')
    test.equal(m('MODEL NAME'), 'modelName')
    test.equal(m('hej pa dig din dumbom'), 'hejPaDigDinDumbom')
    test.equal(m('hej_DA'), 'hejDa')
    test.done()
}

exports.testIsValidURL = function(test) {
    test.ok(!utils.isValidURL(null))
    test.ok(utils.isValidURL('http://materik.com'))
    test.ok(utils.isValidURL('https://materik.com'))
    test.ok(utils.isValidURL('http://www.materik.com'))
    test.ok(utils.isValidURL('http://www.materik.com/hej'))
    test.ok(utils.isValidURL('http://www.materik.com/#/projects'))
    test.ok(utils.isValidURL('http://www.materik.com?a=b&c=d'))
    test.ok(!utils.isValidURL('materik.com'))
    test.ok(!utils.isValidURL('www.materik.com'))
    test.ok(!utils.isValidURL('httpx://materik.com'))
    test.ok(!utils.isValidURL('http:/materik.com'))
    test.ok(!utils.isValidURL('http://www'))
    test.ok(!utils.isValidURL('http://www.'))
    test.done()
}

exports.testIsValidEmail = function(test) {
    test.ok(!utils.isValidEmail(null))
    test.ok(utils.isValidEmail('materik@me.com'))
    test.ok(utils.isValidEmail('materik@student.chalmers.se'))
    test.ok(utils.isValidEmail('erixs_21@hotmail.com'))
    test.ok(utils.isValidEmail('a@b.c'))
    test.ok(!utils.isValidEmail('a@b'))
    test.ok(!utils.isValidEmail('@b'))
    test.ok(!utils.isValidEmail('ab'))
    test.done()
}

exports.testPrependZeros = function(test) {
    test.equal(utils.prependZeros(0, 1), '0')
    test.equal(utils.prependZeros(0, 2), '00')
    test.equal(utils.prependZeros(1+1, 2), '02')
    test.equal(utils.prependZeros('1', 1), '1')
    test.equal(utils.prependZeros('1', 2), '01')
    test.equal(utils.prependZeros('123', 2), '123')
    test.equal(utils.prependZeros('123', 3), '123')
    test.equal(utils.prependZeros('123', 4), '0123')
    test.equal(utils.prependZeros('123', 5), '00123')
    test.done()
}

exports.testBase64encode = function(test) {
    var m = utils.base64encode
    test.equal(m('jlpicard:Changeme1'), 'amxwaWNhcmQ6Q2hhbmdlbWUx')
    test.equal(m('materik:asdf'), 'bWF0ZXJpazphc2Rm')
    test.done()
}

exports.testIsValidMonth = function(test) {
    var m = utils.isValidMonth
    for (i = 1; i < 13; i++) {
        if (i < 10) {
            test.ok(m('2013-0' + i))
        } else {
            test.ok(m('2013-' + i))
        }
    }
    test.ok(m('2013-03'))
    test.ok(m('2013-11'))
    test.ok(m('2015-12'))
    test.ok(!m('0'))
    test.ok(!m('2-00'))
    test.ok(!m('2000-0'))
    test.ok(!m('2015-00'))
    test.ok(!m('2015-13'))
    test.ok(!m('2015-17'))
    test.ok(!m('2115-12'))
    test.ok(!m('2115-22'))
    test.ok(!m('3333-01'))
    test.done()
}

exports.testGetPaths = function(test) {
    var m = utils.getPaths
    var x = {'x': 1, 'y': 2}
    test.deepEqual(m(x), ['x', 'y'])
    var x = {'x': 1, 'y': 2, 'z': 3}
    test.deepEqual(m(x), ['x', 'y', 'z'])
    var x = {'x': 1, 'y': {'x': 2, 'z': 3}}
    test.deepEqual(m(x), ['x', 'y.x', 'y.z'])
    var x = {'x': 1, 'y': {'x': {'z': 3}}}
    test.deepEqual(m(x), ['x', 'y.x.z'])
    var x = {'x': 1, 'y': {}}
    test.deepEqual(m(x), ['x'])
    var x = {'x': 1, 'y': [{'z': 1}]}
    test.deepEqual(m(x), ['x', 'y.0.z'])
    var x = {'x': 1, 'y': [{'z': 1}, {'z': 2}]}
    test.deepEqual(m(x), ['x', 'y.0.z'])
    var x = {'x': 1, 'y': [{'z': 1}, {'o': 2}]}
    test.deepEqual(m(x), ['x', 'y.0.z', 'y.0.o'])
    var x = {'x': 1, 'y': []}
    test.deepEqual(m(x), ['x', 'y.0'])
    var x = {'x': 1, 'y': ['a', 'b', 'c']}
    test.deepEqual(m(x), ['x', 'y.0'])
    test.done()
}

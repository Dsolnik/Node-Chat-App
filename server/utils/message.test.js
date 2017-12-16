var expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage', () => {

    it('should generate the correct message Object', () => {
        var res = generateMessage('dan', 'is the best!');
        expect(typeof res.createdAt).toBe('number');
        expect(res).toMatchObject({
            from: 'dan',
            text: 'is the best!'
        });
    });


});
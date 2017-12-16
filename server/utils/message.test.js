var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', () => {

    it('should generate the correct location object', () => {
        var res = generateLocationMessage('dan', -10, 20);
        expect(typeof res.createdAt).toBe('number');
        expect(res).toMatchObject({
            from: 'dan',
            url: 'https://maps.google.com/maps/?q=-10,20'
        });
    });

});
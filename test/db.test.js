const _db = require('../db/index');

describe('test DB',() => {

    test('Connect to DB', async () => {
        await _db.sequelize.authenticate().then(() => {
            console.info('INFO - Database connected.')
        }).catch(err => {
            console.error('ERROR - Unable to connect to the database:', err);
            expect(err).toMatch('error');
        })
    });

});
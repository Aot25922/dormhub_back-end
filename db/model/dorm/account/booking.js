module.exports = (sequelize, DataTypes) => {
    const booking = sequelize.define(
        'booking', {
            bookingId: {
                type: DataTypes.INTEGER(6),
                primaryKey: true,
                autoIncrement: true,
                field: 'bookingId'
            },
            payDate: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'payDate'
            },
            startDate: {
                type: DataTypes.STRING(50),
                allowNull: false,
                field: 'startDate'
            },
            endDate: {
                type: DataTypes.STRING(50),
                allowNull: false,
                field: 'endDate'
            },
            status: {
                type: DataTypes.STRING(50),
                allowNull: false,
                field: 'status'
            },
            description: {
                type: DataTypes.STRING(120),
                allowNull: true,
                field: 'description'
            },
            moneySlip: {
                type: DataTypes.STRING(1000),
                allowNull: true,
                field: 'moneySlip'
            }
        }, {
            tableName: 'booking'
        }
    );

    return booking;
}
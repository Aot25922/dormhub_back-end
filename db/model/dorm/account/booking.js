module.exports = (sequelize, DataTypes) => {
    const booking = sequelize.define(
        'booking', {
            bookingId: {
                type: DataTypes.STRING(6),
                primaryKey: true,
                field: 'bookingId'
            },
            payDate: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'payDate'
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'startDate'
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'endDate'
            },
            status: {
                type: DataTypes.STRING(10),
                allowNull: false,
                field: 'status'
            },
            description: {
                type: DataTypes.STRING(120),
                allowNull: true,
                field: 'description'
            }
        }, {
            tableName: 'booking'
        }
    );

    return booking;
}
module.exports = (sequelize, DataTypes) => {
    const userAccount = sequelize.define(
        'userAccount', {
            userId: {
                type: DataTypes.INTEGER(5),
                primaryKey: true,
                field: 'userId'
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false,
                field: 'email',
                unique: true
            },
            password: {
                type: DataTypes.STRING(1000),
                allowNull: false,
                field: 'password'
            },
            fname: {
                type: DataTypes.STRING(50),
                allowNull: false,
                field: 'fname'
            },
            lname: {
                type: DataTypes.STRING(50),
                allowNull: false,
                field: 'lname'
            },
            sex: {
                type: DataTypes.STRING(20),
                allowNull: false,
                field: 'sex'
            },
            phone: {
                type: DataTypes.CHAR(10),
                allowNull: false,
                field: 'phone',
                unique: true
            },
            role: {
                type: DataTypes.STRING(20),
                allowNull: false,
                field: 'role'
            },
        }, {
            tableName: 'userAccount'
        }
    );

    return userAccount;
}
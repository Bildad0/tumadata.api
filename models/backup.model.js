
module.exports = (sequelize, Sequelize) => {
    const Backup = sequelize.define('backup', {
        filename: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        filepath: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        autoBackup: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });
    return Backup;
};



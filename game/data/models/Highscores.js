module.exports = (sequelize, DataTypes) => {
    return sequelize.define('highscores', {
        user_name: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        player_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0
        }
    }, {
        timestamps: false,
    });
}
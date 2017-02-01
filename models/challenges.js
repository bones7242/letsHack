//model for the challenges table 
module.exports = function(sequelize, DataTypes) {
    var Challenge = sequelize.define("Challenge", {
        difficulty: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        instructionsAll: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        instructionsA: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        instructionsB: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        startCodeA: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        startCodeB: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        test: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Challenge.hasMany(models.Session); 
            }
        }
    });
    return Challenge;
};
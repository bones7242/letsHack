//model for the challenges table 
module.exports = function(sequelize, DataTypes) {
    var Challenge = sequelize.define("Challenge", {
        difficulty: {
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING
        },
        instructionsAll: {
            type: DataTypes.TEXT
        },
        instructionsA: {
            type: DataTypes.TEXT
        },
        instructionsB: {
            type: DataTypes.TEXT
        },
        startCodeA: {
            type: DataTypes.TEXT
        },
        startCodeB: {
            type: DataTypes.TEXT
        },
        testAArgument: {
            type: DataTypes.TEXT
        },
        testBArgument: {
            type: DataTypes.TEXT
        },
        testAResult: {
            type: DataTypes.TEXT
        },
        testBResult: {
            type: DataTypes.TEXT
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
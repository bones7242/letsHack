// model for the users table
module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define("Session", {
        success: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false
        },
        matchId:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Session.belongsTo(models.User, { 
                    as: "playerA",
                    onDelete: "cascade",
                    foreignKey: {
                        allowNull: false
                    }
                });
                Session.belongsTo(models.User, { 
                    as: "playerB",
                    onDelete: "cascade",
                    foreignKey: {
                        allowNull: false
                    }
                });
                Session.belongsTo(models.Challenge, { 
                    onDelete: "cascade",
                    foreignKey: {
                        allowNull: false
                    }
                }); 
            }
        }
    });
    return Session;
};

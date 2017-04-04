// model for the users table
module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define("Session", {
        success: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false
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

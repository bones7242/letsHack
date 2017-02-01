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
                Session.belongsTo(models.User, {  //BelongsTo inserts an association key in the source model (UserId)
                    onDelete: "cascade",
                    foreignKey: {
                        allowNull: false
                    }
                }); 
            },
            associate: function(models) {
                Session.belongsTo(models.Teammate, {  
                    onDelete: "cascade",
                    foreignKey: {
                        allowNull: false
                    }
                }); 
            },
            associate: function(models) {
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

// model for the users table
module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define("Session", {
        dateStarted: {
            type: DataTypes.DATE
        },
        success: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false
        },
        teammateId: {
            type: DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function(models) {
                Session.belongsTo(models.User, {
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

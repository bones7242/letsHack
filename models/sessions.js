// model for the users table
module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define("Sessions", {
        userId: { //do we supply this or does sequelize do it automatically?
            type: DataTypes.INTEGER,
            allowNull: false
        },
        challengeId: {  //do we supply this or does sequelize do it automatically?
            type: DataTypes.INTEGER,
            allowNull: false
        },
        time: {
            type: DataTypes.DATETIME
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
                Session.belongsTo(models.Author, {
                    onDelete: "cascade",
                    foreignKey: {
                        allowNull: false
                    }
                }); 
            },
            // CAN WE ASSOCIATE WITH CHALLENGES TOO?
            associate: function(models) {
                Session.belongsTo(models.Session, {
                    onDelete: "cascade",
                    foreignKey: {
                        allowNull: false
                    }
                }); 
            }
        }
    });
    return User;
};

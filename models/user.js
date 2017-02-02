
// model for the users table
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        displayName: {
            type: DataTypes.STRING
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        }

    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Session);  // adds key to Sessions for UserID
                User.hasMany(models.Session, {
                    as: "Teammate"
                });  // adds key to Sessions as 
            },
        }
    });
    return User;
};

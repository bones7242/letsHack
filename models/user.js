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
                User.hasMany(models.Session);  // Associating users with sessions
            }
        }
    });
    return User;
};

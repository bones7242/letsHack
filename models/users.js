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
        // pass a second "classMethods" object into the define method
        // We're saying that we want our Users to have many Sessions
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Session);  // Associating User with Sessions
            }
        }
    });
    return User;
};

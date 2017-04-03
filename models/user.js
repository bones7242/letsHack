var bcrypt = require('bcrypt-nodejs');

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
        }, 
        present: {
            type: DataTypes.BOOLEAN,
            default: false
        }, 
        inqueue: {
            type: DataTypes.BOOLEAN,
            default: false
        }

    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Session, {
                    as: "playerA"
                });
                User.hasMany(models.Session, {
                    as: "playerB"
                });
            },
            generateHash: function(password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            },
            validatePassword: function(password, dbCheck) {
                return bcrypt.compareSync(password, dbCheck);
            }

        }
    });


    return User;
};

//model for the challenges table 
module.exports = function(sequelize, DataTypes) {
    var Chat = sequelize.define("Chat", {
        text: {
            type: DataTypes.TEXT,
        },
        userName: {
            type: DataTypes.TEXT,
        }
    });
    return Chat;
};
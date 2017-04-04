//model for the challenges table 
module.exports = function(sequelize, DataTypes) {
    var Chat = sequelize.define("Chat", {
        text: DataTypes.TEXT,
        userName: DataTypes.TEXT,
        chatRoom: DataTypes.TEXT
    });
    return Chat;
};
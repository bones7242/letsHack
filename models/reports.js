//model for the challenges table 
module.exports = function(sequelize, DataTypes) {
    var Report = sequelize.define("Report", {
        reportedBy: DataTypes.TEXT,
        userName: DataTypes.TEXT,
        reason: DataTypes.TEXT
    });
    return Report;
};
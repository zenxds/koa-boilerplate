// http://docs.sequelizejs.com/manual/tutorial/models-definition.html
// STRING TEXT INTEGER DATE DATEONLY BOOLEAN
// type, allowNull, defaultValue, unique, autoIncrement, primaryKey

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // firstName: {
      //   type: DataTypes.STRING,
      //   allowNull: false
      // },
    },
    {
      freezeTableName: true,
    },
  )
}

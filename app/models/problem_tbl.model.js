module.exports = (sequelize, Sequelize) => {
  const problem_tbl = sequelize.define("problem_tbl", {
    patient_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    clinic_id: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    doctor_id: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    problem: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    module_type: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    appointment_id: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    clinic_id: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    appointment_status: {
      allowNull: true,
      defaultValue: "0",
      type: Sequelize.TINYINT(1),
    },
  });
  return problem_tbl;
};

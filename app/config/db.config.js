module.exports = {
    // HOST: "sa-prod-gen-rds.cdgiaeifcygk.af-south-1.rds.amazonaws.com",
    // USER: "sagenmaster",
    // PASSWORD: "SAgen_123#$%",
    // DB: "generic_app",
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "generic_app_sa",
    dialect: "mysql",
    SECRET: "CL0UD#9II",
    timezone: 'Asia/Kolkata',
    timeOffset: 330,
    pool: {
      max: 15,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    encryptionKey:
      "NT9N9OuItINx6v8HTgBcuICZxoIpQQCUCHsjdrOAZerRLwrkDDAC1sGne6DBezv",
  };
  

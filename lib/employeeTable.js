const libFuncs = require("./libfuncs");

class EmployeeTable {
  constructor() {}

  static promptListWithID(message, choices) {
    return [
      {
        type: "list",
        message: message,
        choices: choices,
        filter: libFuncs.trimID,
        name: "id",
      },
    ];
  }
}

module.exports = EmployeeTable;
const EmployeeTable = require("./employeeTable");
const libFuncs = require("./libfuncs");

class Department extends EmployeeTable {
  constructor() {
    super();
  }

  static table = "departments";

  static promptAdd() {
    return [
      {
        type: "input",
        message: "Enter department name:",
        validate: libFuncs.validateStringContent,
        filter: libFuncs.capitalize,
        name: "department",
      },
    ];
  }

  static promptRemove(departments) {
    return super.promptListWithID("Select department to remove:", departments);
  }
}

module.exports = Department;
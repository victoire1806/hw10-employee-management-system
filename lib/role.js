const EmployeeTable = require("./employeeTable");
const libFuncs = require("./libFuncs");

class Role extends EmployeeTable {
  constructor() {}

  static table = "roles";

  static promptsAdd(departments) {
    return [
      {
        type: "input",
        message: "Enter role title:",
        validate: libFuncs.validateStringContent,
        filter: libFuncs.capitalize,
        name: "title",
      },
      {
        type: "input",
        message: "Enter role salary:",
        validate: libFuncs.validateSalary,
        filter: libFuncs.stringTrim,
        name: "salary",
      },
      {
        type: "list",
        message: "Select role department:",
        choices: departments,
        filter: libFuncs.trimID,
        name: "department_id",
      },
    ];
  }

  static promptsRemove(roles) {
    return super.promptListWithID("Select role to remove:", roles);
  }
}

module.exports = Role;
const EmployeeTable = require("./employeeTable");
const libFuncs = require("./libFuncs");

class Employee extends EmployeeTable {
  constructor() {}

  static table = "employees";

  static promptAdd(roles, managers) {
    return [
      {
        type: "input",
        message: "Enter employee's first name:",
        validate: libFuncs.validateStringContent,
        filter: libFuncs.capitalize,
        name: "first_name",
      },
      {
        type: "input",
        message: "Enter employee's last name:",
        validate: libFuncs.validateStringContent,
        filter: libFuncs.capitalize,
        name: "last_name",
      },
      {
        type: "list",
        message: "Select employee's title:",
        choices: roles,
        filter: libFuncs.trimID,
        name: "role_id",
      },
      {
        type: "list",
        message: "Select employee's manager:",
        choices: managers,
        filter: libFuncs.trimID,
        name: "manager_id",
      },
    ];
  }

  static promptAction(action, employees) {
    return super.promptListWithID(action, employees);
  }

  static promptUpdate(update, attrValues) {
    return super.promptListWithID(update, attrValues);
  }
}

module.exports = Employee;
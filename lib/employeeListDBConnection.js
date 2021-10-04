const mysql = require("mysql12");
const inquirer = require("inquirer");
const eTable = require("console.table");
const figlet = require("figlet");
require("dotenv").config();

const Department = require("./department");
const Role = require("./role");
const Employee = require("./employee");

// Variables
const dbConnection = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'mysqlbt21',
  database: "employee_DB",

};

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  connection.end();
});


const promptMenu = () => {
  inquirer
  .prompt({
  type: "rawlist",
  message: "What would you like to do",
  choices: [
    "View all departments",
    "View all employee roles",
    "View all employees",
    "Add new department",
    "Add new employee role",
    "Add new employee",
    "Update employee role",
    "Update employee manager",
    "Remove department",
    "Remove employee role",
    "Remove employee",
    "Exit",
  ],
  name: "action",
});

};




class EmployeeList {
  constructor() {
    this.dbConn;
  }

  start() {
    figlet("Employee List", (err, data) => console.log(err || data));

    this.dbConnStart()
      .then(() => {
        console.log(
          `connected to ${dbConnection.database} as id ${this.dbConn.threadId}\n`
        );

        this.menu();
      })
      .catch((error) => console.log(error));
  }

  async dbConnStart() {
    this.dbConn = await mysql.createConnection(dbConnection);
  }

  async dbConnEnd() {
    this.dbConn.end();
  }

  async menu() {
    const selection = await inquirer.prompt(promptMenu);
    switch (selection.action) {
      case "View all departments":
        this.viewData("departments");
        break;

      case "View all employee roles":
        this.viewData("roles");
        break;

      case "View all employees":
        this.viewData("employees");
        break;

      case "Add new department":
        this.promptDataEntry("department");
        break;

      case "Add new employee role":
        this.promptDataEntry("role");
        break;

      case "Add new employee":
        this.promptDataEntry("employee");
        break;

      case "Update employee manager":
        this.promptEmployeeUpdate("manager");
        break;

      case "Update employee role":
        this.promptEmployeeUpdate("role");
        break;

      case "Remove department":
        this.promptDataRemoval("department");
        break;

      case "Remove employee role":
        this.promptDataRemoval("role");
        break;

      case "Remove employee":
        this.promptDataRemoval("employee");
        break;

      case "Exit":
        console.log("Thanks for using Employee CMS, goodbye.");
        this.dbConnEnd();
        break;

      default:
        console.log("Invalid selection");
        this.menu();
        break;
    }
  }

  viewData(table) {
    let query = "";
    
    switch (table) {
      case "departments":
        query = "SELECT * FROM departments;";
        break;

      case "roles":
        query = `
        SELECT roles.id, title, lpad(salary,12," ") AS "salary", department
        FROM roles
        LEFT JOIN departments ON roles.department_id = departments.id;`;
        break;

      case "employees":
        query = `
          SELECT employeeTbl.id, employeeTbl.first_name, employeeTbl.last_name, title, department, lpad(salary,12," ") AS "salary", if(employeeTbl.manager_id IS NULL, "", concat(managerTBL.first_name, " ", managerTBL.last_name)) AS "Manager"
          FROM employees as employeeTbl
          LEFT JOIN roles ON employeeTbl.role_id = roles.id
          LEFT JOIN departments ON roles.department_id = departments.id
          LEFT JOIN employees as managerTBL ON employeeTbl.manager_id = managerTbl.id;`;
        break;

      default:
        console.log("Invalid selection");
        this.menu();
        return;
    }

    this.dbConn
      .query(query)
      .then(([rows]) => console.table(rows))
      .catch((error) => console.log(error))
      .then(() => this.menu());
  }

  addDBTableRow(table, rowData) {
    const query = `INSERT INTO ${table} SET ?`;
    this.dbConn
      .query(query, [rowData])
      .then(() => console.log(`Successfully added data to ${table} table\n`))
      .catch((error) => console.log(error))
      .then(() => this.menu());
  }

  updateDBTableRow(table, setData) {
    const query = `UPDATE ${table} SET ? WHERE ?`;
    this.dbConn
      .query(query, setData)
      .then(() => console.log(`Successfully updated data in ${table} table\n`))
      .catch((error) => console.log(error))
      .then(() => this.menu());
  }

  removeDBTableRow(table, rowID) {
    const query = `DELETE FROM ${table} WHERE ?`;
    this.dbConn
      .query(query, [rowID])
      .then(() =>
        console.log(`Successfully removed data from ${table} table\n`)
      )
      .catch((error) => console.log(error))
      .then(() => this.menu());
  }

  async promptDataEntry(data) {
    let dataInput;
    
    switch (data) {
      case "department":
        dataInput = await inquirer.prompt(Department.promptAdd());
        this.addDBTableRow("departments", dataInput);
        break;

      case "role":
        const departmentsWithID = await this.getDataWithID("departments");
        dataInput = await inquirer.prompt(Role.promptsAdd(departmentsWithID));
        this.addDBTableRow("roles", dataInput);
        break;

      case "employee":
        const rolesWithID = await this.getDataWithID("roles");
        const employeesWithID = await this.getDataWithID("employees");
        dataInput = await inquirer.prompt(
          Employee.promptAdd(rolesWithID, employeesWithID)
        );
        this.addDBTableRow("employees", dataInput);
        break;

      default:
        console.log("Invalid selection");
        this.menu();
        return;
    }
  }

  async promptEmployeeUpdate(data) {
    // Get employee list and select employee to update
    const employeesWithID = await this.getDataWithID("employees");
    const employeeID = await inquirer.prompt(
      Employee.promptAction("Select employee to update:", employeesWithID)
    );

    let setData;
    // switch on employee attribute to update for new data collection
    switch (data) {
      case "manager":
        const managersWithID = await this.getDataWithID(
          "employees",
          employeeID
        );
        const newManager = await inquirer.prompt(
          Employee.promptUpdate(
            "Select employee's new manager:",
            managersWithID
          )
        );
        setData = { manager_id: newManager.id };
        break;

      case "role":
        const rolesWithID = await this.getDataWithID("roles");
        const newRole = await inquirer.prompt(
          Employee.promptUpdate("Select employee's new role:", rolesWithID)
        );
        setData = { role_id: newRole.id };
        break;

      default:
        console.log("Invalid selection");
        this.menu();
        return;
    }

    // Update employee attribute in table
    this.updateDBTableRow("employees", [setData, employeeID]);
  }

  async promptDataRemoval(data) {
    let dataInput;
    // switch on data for table from which to select entry to remove
    switch (data) {
      case "department":
        const departmentsWithID = await this.getDataWithID("departments");
        dataInput = await inquirer.prompt(
          Department.promptRemove(departmentsWithID)
        );
        this.removeDBTableRow("departments", dataInput);
        break;

      case "role":
        const rolesWithID = await this.getDataWithID("roles");
        dataInput = await inquirer.prompt(Role.promptsRemove(rolesWithID));
        this.removeDBTableRow("roles", dataInput);
        break;

      case "employee":
        const employeesWithID = await this.getDataWithID("employees");
        dataInput = await inquirer.prompt(
          Employee.promptAction("remove", employeesWithID)
        );
        this.removeDBTableRow("employees", dataInput);
        break;

      default:
        console.log("Invalid selection");
        this.menu();
        return;
    }
  }

  async getDataWithID(data, exclude = `""`) {
    let query = "";
    // switch on data to select query that returns row id and row identifier text
    switch (data) {
      case "departments":
        query = `SELECT CONCAT(id, ": ", department) AS "dataWithID" FROM departments ORDER BY department;`;
        break;

      case "roles":
        query = `SELECT CONCAT(id, ": ", title) AS "dataWithID" FROM roles ORDER BY title;`;
        break;

      case "employees":
        query = `
          SELECT CONCAT(id, ": ", first_name, " ", last_name) AS "dataWithID" 
          FROM employees WHERE NOT ? ORDER BY first_name;`;
        break;

      default:
        console.log("Invalid selection");
        this.menu();
        return;
    }

    const [rows] = await this.dbConn.query(query, exclude);
    return rows.map(({ dataWithID }) => dataWithID); // convert list of objects to list of strings (id and data value)
  }
}


module.exports = EmployeeList;add 
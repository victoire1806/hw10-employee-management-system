function validateStringContent(input) {
    if (input.trim() === "") return console.log("\nEntry can not be blank");
    return true;
  }
  
  function validateSalary(salary) {
    if (!salary.trim()) return console.log("Salary can not be left blank");
    if (!/^\d+\.?\d{0,2}$/.test(salary))
      return console.log(
        "Invalid salary format, enter numbers only in format 'dollars.cents'"
      );
    return true;
  }
  
  function stringTrim(string) {
    return string.trim();
  }
  
  function trimID(string) {
    return string.split(":", 1)[0];
  }
  
  function capitalize(string) {
    let str = stringTrim(string);
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }
  
  module.exports = {
    validateStringContent,
    validateSalary,
    stringTrim,
    trimID,
    capitalize,
  };
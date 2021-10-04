USE employee_DB;

INSERT INTO departments (department)
VALUES
("Human Resources"),
("Design"),
("Engineering"),
("Finance"),
("IT"),
("Legal"),
("Marketing");

INSERT INTO roles (title, salary, department_id)
VALUES
("Manager", 125000, 1),
("Assistant", 80000, 1),
("Lead Designer", 120000, 2),
("Designer", 100000, 2),
("Software Engineer", 120000, 3),
("Engineer", 100000, 3),
("Accountant", 110000, 4),
("Network Admin", 115000, 5),
("Lawyer", 150000, 6),
("Market Analyst", 90000, 7);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Anne", "Joseph", 1, NULL),
("Nafis", "Luca", 2, 1),
("Ken", "Edge", 3, NULL),
("Bob", "Highland", 5, NULL),
("Gabby", "Sadesh", 6, 4),
("Kimmy", "Johnson", 6, 4),
("Vicky", "Thomas", 7, 2),
("Mimmy, "Givens", 8, NULL),
("Albert", "Einstien", 10, NULL);
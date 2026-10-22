
const express = require("express");

const app = express();
app.use(express.json());

let students = [
  { id: 101, name: "Sphoorthy", age: 20, department: "CSE" },
  { id: 102, name: "Deepthi", age: 21, department: "CSE" },
  { id: 103, name: "Richadvi", age: 20, department: "IT" }
];

app.get("/students", (req, res) => {
  res.status(200).json(students);
});

app.get("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(student);
});

app.post("/students", (req, res) => {
  const { name, age, department } = req.body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof department !== "string" || !department.trim() ||
    !Number.isInteger(Number(age)) || Number(age) <= 0 ||
    age === null || age === undefined
  ) {
    return res.status(400).json({
      message: "Provide a valid name, positive age and department"
    });
  }

  const newId = students.length
    ? Math.max(...students.map(s => s.id)) + 1
    : 101;

  const student = {
    id: newId,
    name,
    age: Number(age),
    department
  };

  students.push(student);
  res.status(201).json(student);
});

app.patch("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { name, age, department } = req.body;

  if (
    (name !== undefined &&
      (typeof name !== "string" || !name.trim())) ||
    (department !== undefined &&
      (typeof department !== "string" || !department.trim())) ||
    (age !== undefined &&
      (age === null || !Number.isInteger(Number(age)) ||
       Number(age) <= 0))
  ) {
    return res.status(400).json({ message: "Invalid update data" });
  }

  if (name !== undefined) student.name = name;
  if (age !== undefined) student.age = Number(age);
  if (department !== undefined) student.department = department;

  res.status(200).json(student);
});

app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  students.splice(index, 1);
  res.status(200).json({
    message: "Student deleted successfully"
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Student API running at http://localhost:${PORT}`);
});

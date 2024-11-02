const express = require("express");
const app = express();
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const { error } = require("console");
const PORT = 8000;

// console.log(users);

app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/users", (req, res) => {
  const html = `
      <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
      </ul>
      `;
  return res.send(html);
});
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// Post api
app.post("/api/users", (req, res) => {
  const body = req.body;
  // console.log("Body", body);
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "pending" });
  });
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    console.log("apiID", id);

    const user = users.find((user) => user.id === id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  })
  .patch((req, res) => {
    const id = parseInt(req.params.id);
    console.log("apiID", id);

    // edit user with id
    const body = req.body;
    console.log("body", body);
    // const userIndex = users.findIndex((user) => user.id === id);
    const userIndex = users.find((user) => user.id === id);
    console.log("userIndex", userIndex);
    if (!userIndex) {
      return res.status(404).json({ error: "User not found" });
    }
    Object.assign(userIndex, body);

    fs.writeFile(
      "./MOCK_DATA.json",
      JSON.stringify(users, null, 2),
      (err, data) => {
        if (err) {
          return res.status(500).json({ error: "Failed to UPdate User" });
        }
        return res.json({ status: "Success", data: userIndex });
      }
    );

    // return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    console.log(id);
    const userExists = users.find((user) => user.id === id);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }
    const updateUsers = users.filter((user) => user.id !== id);
    console.log("updateUser", updateUsers);

    fs.writeFile(
      "./MOCK_DATA.json",
      JSON.stringify(updateUsers, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to delete user" });
        }
        users.length = 0;
        users.push(...updateUsers);
        return res
          .status(200)
          .json({ status: "Success", message: "User deleted successfully" });
      }
    );

    // Delete user with id

    // return res.json({ status: "pending" });
  });

app.listen(PORT, () => console.log(`Server Started on port : ${PORT}`));

const express = require("express");
const app = express();
const users = require("./MOCK_DATA.json");
const fs = require("fs");
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
    return res.json(user);
  })
  .patch((req, res) => {
    const id = req.params.id;
    console.log("apiID", id);

    // edit user with id

    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    // Delete user with id

    return res.json({ status: "pending" });
  });

app.listen(PORT, () => console.log(`Server Started on port : ${PORT}`));

const express = require("express");

const router = express.Router();



// Routes
router.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});

  const html = `
      <ul>
      ${allDbUsers
        .map((user) => `<li>${user.firstName} - ${user.lastName}</li>`)
        .join("")}
      </ul>
      `;
  return res.send(html);
});
router.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
});
// Hello
// Post api
router.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(404).json({ message: "Field is required" });
  }

  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  return res.status(201).json({ result, msg: "Success" });
  // console.log("Body", body);
  // users.push({ ...body, id: users.length + 1 });
  // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
  //   return res.json({ status: "pending" });
  // });
});

router
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

module.exports = router
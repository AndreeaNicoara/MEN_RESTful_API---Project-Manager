const router = require("express").Router();
const project = require("../models/project.js");

//CRUD

//CREATE - post
router.post("/", (req, res) => {
  data = req.body;
  project
    .insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// /api/projects/
//READ all - get
router.get("/", (req, res) => {
  project
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//READ specific by inProgress - get
router.get("/inProgress", (req, res) => {
  project
    .find({ inProgress: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//READ specific by id - get
router.get("/:id", (req, res) => {
  project
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//UPDATE - put
router.put("/:id", (req, res) => {
  const id = req.params.id;
  project
    .findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message:
            "Cannot update project by id= " +
            id +
            ".Maybe project was not found!",
        });
      } else {
        res.send({ message: "project was successfully updated." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating project with id= " + id });
    });
});

//DELETE - delete
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  project
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          messahe:
            "Cannot delete project by id= " +
            id +
            ".Maybe project was not found!",
        });
      } else {
        res.send({ message: "project was successfully deleted." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error deleting project with id= " + id });
    });
});

module.exports = router;

const { Op } = require("sequelize");
const Flight = require("../models/flight");
const Plane = require("../models/plane");
const Seat = require("../models/seat");
const sequelize = require("../../config/sequelize");

exports.getPlanes = async (req, res) => {
  try {
    const planes = await Plane.findAll();
    res.json(planes);
  } catch (error) {
    console.error("Error fetching planes:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAvailablePlaneCodes = async (req, res) => {
  try {
    const [planes, metadata] = await sequelize.query(`
      SELECT p.id, p.plane_code as planeCode
      FROM Planes p
      LEFT JOIN Flights f ON p.id = f.plane_id
      WHERE f.plane_id IS NULL
         OR f.status IN ('cancelled', 'completed');
    `);

    res.json(planes);
  } catch (error) {
    console.error("Error fetching available plane codes:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPlaneById = async (req, res) => {
  const { id } = req.params; // Extract the ID from the URL parameters

  try {
    const plane = await Plane.findOne({
      where: {
        id, // Search for the plane by postId
      },
    });

    // Check if the plane was found
    if (!plane) {
      return res.status(404).json({ error: "Plane not found" });
    }

    res.json(plane); // Return the plane details in the response
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Quản trị viên - Đăng thông tin máy bay
exports.createPlane = async (req, res) => {
  try {
    const { planeCode, model, manufacturer } = req.body;
    const plane = await Plane.create({
      planeCode,
      model,
      manufacturer,
    });
    // createSeatForPlane

    // Gọi hàm tạo ghế với `plane.id`
    await createSeatsForPlane(plane.id);

    res.status(201).json(plane);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePlane = async (req, res) => {
  try {
    const { id } = req.params;
    const { model, manufacturer, planeCode } = req.body;
    const [update] = await Plane.update(
      {
        model,
        manufacturer,

        planeCode,
      },
      { where: { id } }
    );
    if (update) {
      const updatedPlane = await Plane.findByPk(id);
      res.json({ message: "Plane updated", updatedPlane });
    } else {
      res.status(404).json({ error: "Plane not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePlane = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Plane.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: "Plane deleted" });
    } else {
      res.status(404).json({ error: "Plane not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Hàm tạo ghế
const createSeatsForPlane = async (planeId) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const columns = Array.from({ length: 10 }, (_, i) => i + 1); // [1-10]
  const seatData = [];

  // Danh sách hạng ghế mặc định
  const classes = ["first", "business", "economy"];

  // Lặp qua từng hạng ghế và tạo dữ liệu ghế
  classes.forEach((seatClass) => {
    rows.forEach((row) => {
      columns.forEach((col) => {
        seatData.push({
          planeId, // Liên kết ghế với máy bay qua planeId
          seatNumber: `${row}${col}`, // Định dạng ghế
          class: seatClass, // Hạng ghế
        });
      });
    });
  });

  // Chèn dữ liệu vào bảng Seats
  await Seat.bulkCreate(seatData);
};

const db = require("../../helper/connection");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const authModel = {
  login: ({ username, password }) => {
    console.log(username, password);
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM auth WHERE username=$1`,
        [username],
        (err, result) => {
          if (err) return reject(err.message);
          if (result.rows.length == 0)
            return reject("username/password salah.");

          bcrypt.compare(
            password,
            result.rows[0].password,
            function (err, hashingResult) {
              if (err) return reject(err.message);
              if (!hashingResult) return reject("username/password salah.");
              return resolve(result.rows[0]);
            }
          );
        }
      );
    });
  },
  register: ({ username, password }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO auth (id, username, password) VALUES($1, $2, $3)`,
        [uuidv4(), username, password],
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve("ADD_SUCCESS");
          }
        }
      );
    });
  },
  get: function (queryParams) {
    console.log(queryParams);
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM auth`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result.rows);
        }
      });
    });
  },

  getDetail: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * from auth WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result.rows[0]);
        }
      });
    });
  },

  update: function (req, id) {
    return new Promise((success, failed) => {
      const { username, email, phone, profile_image, role, address } = req.body;
      db.query(`SELECT * FROM auth WHERE id='${id}'`, (error, result) => {
        if (error) {
          return failed(error.message);
        } else {
          // console.log(result);
          if (result.rows.length < 1) {
            return failed("Id not found!");
          } else {
            db.query(
              `
                        UPDATE auth SET
                        username='${username || result.rows[0].username}',
                        email='${email || result.rows[0].email}',
                        phone='${phone || result.rows[0].phone}',
                        address='${address || result.rows[0].address}',
                        profile_image='${
                          req.file != undefined
                            ? req.file.filename
                            : result.rows[0].profile_image
                        }',
                        role='${role || result.rows[0].role}'
                        WHERE id='${id}'`,
              (error) => {
                if (error) {
                  return failed(error.message);
                } else {
                  return success(result.rows);
                }
              }
            );
          }
        }
      });
    });
  },

  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE from auth WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve("success delete");
        }
      });
    });
  },
};

module.exports = authModel;

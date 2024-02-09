import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dbConnection from '../database/dbConnection.js';
const db = dbConnection();

export const registerUser = (req, res) => {
    const { name, email, password, collegeCode, userType, userId, department,date_added } = req.body;
  
    const checkUserQuery = `SELECT * FROM college_${collegeCode} WHERE email = ?`;
    const insertUserQuery = `INSERT INTO college_${collegeCode} (name, email, password, college_code, user_type, student_id, department,date_added) VALUES (?, ?, ?, ?, ?, ?, ?,?)`;
    
    db.query(checkUserQuery, [email], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        if (results.length > 0) {
          res.send({ message: "User already registered" });
        } else {
          db.query(
            insertUserQuery,
            [name, email, password, collegeCode, userType, userId, department,date_added],
            (err) => {
              if (err) {
                console.log(err);
                res.status(500).send({ message: "Internal Server Error" });
              } else {
                res.send({ message: "Successfully Registered, Please login now." });
              }
            }
          );
        }
      }
    });
  };
  
  // Helper function to get the college table name
  
  

export const getUserData = (req, res) => {
    const { collegeCode } = req.query;
    const query = `SELECT id, name, email, password, user_type, student_id, department,date_added, status FROM college_${collegeCode} WHERE college_code = ?`;
  
    db.query(query, [collegeCode], (err, results) => {
      if (err) {
        console.error("Error fetching data from users table:", err);
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        console.log(results);
        res.send(results);
      }
    });
};

export const getUserDataforernet = (req, res) => {
    const { collegeCode } = req.query;
    
    const query = `SELECT id, name, email, password, user_type, student_id, department,date_added, status FROM college_${collegeCode} WHERE college_code = ?`;
  
    db.query(query, [collegeCode], (err, results) => {
      if (err) {
        console.error("Error fetching data from users table:", err);
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        res.send(results);
      }
    });
};

export const updateUserStatus = (req, res) => {
    const { userId } = req.params;
    const { status, email, password,collegeCode } = req.body;
    console.log(req.body);
    // Update user status in the users table
    const updateQuery = `UPDATE college_${collegeCode} SET status = ? WHERE id = ?`;
    db.query(updateQuery, [status, userId], async (err) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        if (status === 1) {
          try {
            // Send email to the user with the generated password
            const transporter = nodemailer.createTransport({
              service: 'gmail', // e.g., 'gmail'
              auth: {
                user: 'adaharnag@gmail.com',
                pass: 'adarsh123',
              },
            });
  
            const mailOptions = {
              from: 'adaharnag@gmail.com',
              to: email,
              subject: 'Account Activation',
              text: `Your account has been activated. Your password is: ${password}`,
            };
  
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
          } catch (emailError) {
            console.error('Error sending email:', emailError);
            res.status(500).send({ message: 'Error sending email' });
            return;
          }
  
          // Insert user into Radcheck table if activating
          const radcheckQuery = "INSERT INTO radcheck (username, attribute, op, value, email) VALUES (?, ?, ?, ?, ?)";
          db.query(radcheckQuery, [email, "Cleartext-Password", ":=", password, email], (radcheckErr) => {
            if (radcheckErr) {
              res.status(500).send({ message: "Internal Server Error" });
            } else {
              res.send({ message: "User status updated and added to radcheck table" });
            }
          });
        } else if (status === 0) {
          // Delete user from Radcheck table if deactivating
          const deleteQuery = "DELETE FROM radcheck WHERE username = ?";
          db.query(deleteQuery, [email], (deleteErr) => {
            if (deleteErr) {
              res.status(500).send({ message: "Internal Server Error" });
            } else {
              res.send({ message: "User status updated and removed from radcheck table" });
            }
          });
        } else {
          res.send({ message: "User status updated" });
        }
      }
    });
  };

// ... (other controller functions)

export const updateRadcheck = (req, res) => {
    const { userId } = req.params;
    const { email} = req.body;
    console.log(req.body)
    // Update user details in the radcheck table
    const updateQuery = "UPDATE radcheck SET username = ?, email = ? WHERE username = ?";
    const updateValues = [email, email, email];
    console.log(updateQuery)
    console.log(updateValues)
    db.query(updateQuery, updateValues, (err, results) => {
      if (err) {
        console.error("Error updating radcheck details:", err);
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        console.log("Radcheck details updated successfully:", results);
        res.send({ message: "Radcheck details updated successfully" });
      }
    });
};

export const deleteUser = (req,res)=>{

    const { userId } = req.params;
  const deleteQuery = `DELETE FROM college_${collegeCode} WHERE id = ?`;

  db.query(deleteQuery, [userId], (deleteErr) => {
    if (deleteErr) {
      res.status(500).send({ message: "Internal Server Error" });
    } else {
      res.send({ message: "User deleted from users table" });
    }
  });


};

export const editUser = (req,res)=>{

    const { userId } = req.params;
  const updatedDetails = req.body;

  // Update user details in the users table
  const updateQuery = `UPDATE college_${collegeCode} SET name = ?, email = ?, user_type = ?, student_id = ? WHERE id = ?`;
  const updateValues = [updatedDetails.name, updatedDetails.email, updatedDetails.user_type, updatedDetails.student_id, userId];

  db.query(updateQuery, updateValues, (err) => {
    if (err) {
      res.status(500).send({ message: "Internal Server Error" });
    } else {
      res.send({ message: "User details updated successfully" });
    }
  });



};

export const deleteRadcheck = (req,res)=>{

    const { userEmail } = req.params;
  const deleteQuery = "DELETE FROM radcheck WHERE username = ?";
  console.log(userEmail);
  db.query(deleteQuery, [userEmail], (deleteErr) => {
    if (deleteErr) {
      res.status(500).send({ message: "Internal Server Error" });
    } else {
      res.send({ message: "User deleted from radcheck table" });
    }
  });
};

export const getColleges = (req,res)=>{

    const query = "SELECT code, name FROM eduromcollege";

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching colleges:", err);
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        res.send(results);
      }
    });
};


export const addCollege = (req, res) => {
    const { name, state, adminEmail } = req.body;
  
    // Validate if the admin email is unique
    const checkUniqueAdminEmailQuery = 'SELECT * FROM eduromcollege WHERE admin_email = ?';
    db.query(checkUniqueAdminEmailQuery, [adminEmail], (uniqueAdminEmailErr, uniqueAdminEmailResults) => {
      if (uniqueAdminEmailErr) {
        console.error('Error checking unique admin email:', uniqueAdminEmailErr);
        res.status(500).send({ message: 'Internal Server Error' });
        return;
      }
  
      if (uniqueAdminEmailResults.length > 0) {
        res.status(400).send({ message: 'Admin email is already in use' });
        return;
      }
  
      // Insert into eduromcollege table
      const insertCollegeQuery = 'INSERT INTO eduromcollege (name, state, admin_email) VALUES (?, ?, ?)';
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS college_(
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          college_code varchar(254) NOT NULL,
          user_type VARCHAR(255) NOT NULL,
          student_id VARCHAR(255) NOT NULL,
          department VARCHAR(255) NOT NULL,
          date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          status INT DEFAULT 0,
          UNIQUE KEY unique_college_code (college_code)
        )
      `;
  
      db.query(insertCollegeQuery, [name, state, adminEmail], (err, results) => {
        if (err) {
          console.error('Error adding college to eduromcollege:', err);
          res.status(500).send({ message: 'Internal Server Error' });
          return;
        }
  
        const collegeId = results.insertId; // Get the ID of the newly added college
  
        // Update the college_code field with the generated code
        const updateCollegeCodeQuery = `UPDATE eduromcollege SET college_code = ? WHERE id = ?`;
        const collegeCode = `${collegeId}`;
        
        db.query(updateCollegeCodeQuery, [collegeCode, collegeId], (updateErr) => {
          if (updateErr) {
            console.error('Error updating college code:', updateErr);
            res.status(500).send({ message: 'Internal Server Error' });
          } else {
            // Create the corresponding table for the college
            db.query(createTableQuery.replace('college_', `college_${collegeCode}`), (tableErr) => {
              if (tableErr) {
                console.error('Error creating college table:', tableErr);
                res.status(500).send({ message: 'Internal Server Error' });
              } else {
                res.send({ message: 'College added successfully', collegeCode });
              }
            });
          }
        });
      });
    });
  };
  
  


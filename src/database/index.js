const mysql = require("mysql2/promise");
const crypto = require('crypto');

let pool;


async function createConnection() {
  pool = mysql.createPool({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

function generateReferralLink(name) {
    const uniqueCode = crypto.createHash('md5').update(name.toString()).digest('hex').slice(0, 6);
    return uniqueCode;
}

async function insertRef(ref) {
  try {
    const existingPromo = await getRef(ref);

    if (existingPromo) {
      console.log("Рефералка уже существует.");
      return null;
    }

    const link = generateReferralLink(ref)

    const [rows, fields] = await pool.query(
      "INSERT INTO referrals (name, link) VALUES (?, ?)",
      [ref, link]
    );

    return link;
  } catch (error) {
    console.error("Ошибка при вставке данных:", error);
    return false;
  }
}

async function getRef(ref) {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM referrals WHERE name = ?`,
      [ref]
    );
    if (rows && rows.length > 0) {
      return rows[0];
    } else {
      return false;
    }
  } catch (error) {
    console.error("Ошибка при получении данных рефералки:", error);
    return null;
  }
}

async function getUsersByReferral(ref, page = 1, pageSize = 25) {
  try {
    const offset = (page - 1) * pageSize;
    const [rows, fields] = await pool.query(
      `SELECT * FROM user_statistics WHERE referal = ? LIMIT ? OFFSET ?`,
      [ref, pageSize, offset]
    );

    return rows;
  } catch (error) {
    console.error("Ошибка при получении пользователей по рефералке:", error);
    return null;
  }
}


async function removeRef(ref) {
  try {
    const [rows, fields] = await pool.query(
      "DELETE FROM referrals WHERE name = ?",
      [ref]
    );

    return true;
  } catch (error) {
    console.error("Ошибка при удалении промокода:", error);
    return null;
  }
}

async function getAllRefs(page, pageSize = 15) {
  try {
    const offset = (page - 1) * pageSize;
    const [rows, fields] = await pool.query(
      `SELECT name, users FROM referrals LIMIT ${pageSize} OFFSET ${offset}`
    );

    return rows;
  } catch (error) {
    console.error("Ошибка при получении всех промокодов:", error);
    return null;
  }
}

async function searchUser(usertxt) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE tg_id LIKE ? OR nickname LIKE ?",
      [usertxt, usertxt]
    );

    if (rows.length > 0) {
      const user = rows[0];
      return user;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Ошибка при получении поиске пользователя:", error);
    return null;
  }
}

async function updateRolls(tgId, rolls) {
  try {
    const [rows, fields] = await pool.query(
      'SELECT rolls FROM users WHERE tg_id LIKE ?',
      [tgId]
    );

    if (rows.length === 0) {
      console.error('Пользователь не найден');
      return false;
    }

    const currentRolls = rows[0].rolls;

    await pool.query(
      'UPDATE users SET rolls = ? WHERE tg_id LIKE ?',
      [currentRolls + rolls, tgId]
    );

    return currentRolls + rolls;
  } catch (error) {
    console.error('Ошибка при обновлении rolls:', error);
    return null;
  }
}

async function setRolls(tgId, rolls) {
  try {
    const [rows, fields] = await pool.query(
      'SELECT rolls FROM users WHERE tg_id LIKE ?',
      [tgId]
    );

    if (rows.length === 0) {
      console.error('Пользователь не найден');
      return false;
    }

    await pool.query(
      'UPDATE users SET rolls = ? WHERE tg_id LIKE ?',
      [rolls, tgId]
    );

    return rolls;
  } catch (error) {
    console.error('Ошибка при обновлении rolls:', error);
    return null;
  }
}

async function updateBal(tgId, coins) {
  try {
    const [rows, fields] = await pool.query(
      'SELECT coins FROM users WHERE tg_id LIKE ?',
      [tgId]
    );

    if (rows.length === 0) {
      console.error('Пользователь не найден');
      return false;
    }

    const currentCoins = rows[0].coins;

    await pool.query(
      'UPDATE users SET coins = ? WHERE tg_id LIKE ?',
      [currentCoins + coins, tgId]
    );

    return currentCoins + coins;
  } catch (error) {
    console.error('Ошибка при обновлении coins:', error);
    return null;
  }
}

async function setBal(tgId, coins) {
  try {
    const [rows, fields] = await pool.query(
      'SELECT coins FROM users WHERE tg_id LIKE ?',
      [tgId]
    );

    if (rows.length === 0) {
      console.error('Пользователь не найден');
      return false;
    }

    await pool.query(
      'UPDATE users SET coins = ? WHERE tg_id LIKE ?',
      [coins, tgId]
    );

    return coins;
  } catch (error) {
    console.error('Ошибка при обновлении coins:', error);
    return null;
  }
}

async function setStatus(tgId, status) {
  try {
    const [rows, fields] = await pool.query(
      'SELECT status FROM user_statistics WHERE tg_id LIKE ?',
      [tgId]
    );

    if (rows.length === 0) {
      console.error('Пользователь не найден');
      return false;
    }

    await pool.query(
      'UPDATE user_statistics SET status = ? WHERE tg_id LIKE ?',
      [status, tgId]
    );

    return status;
  } catch (error) {
    console.error('Ошибка при обновлении coins:', error);
    return null;
  }
}

module.exports = {
  createConnection,
  insertRef,
  getRef,
  removeRef,
  getAllRefs,
  getUsersByReferral,
  searchUser,
  updateRolls,
  setRolls,
  updateBal,
  setBal,
  setStatus
};

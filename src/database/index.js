const mysql = require("mysql2/promise");
const crypto = require('crypto');

let pool;


async function createConnection() {
  pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "qwerty",
    database: "nothing_cube",
    port: "3306",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

async function insertRef(ref) {
  try {
    const existingPromo = await getRef(ref);

    if (existingPromo) {
      console.log("Промокод уже существует.");
      return null;
    }

    const [rows, fields] = await pool.query(
      "INSERT INTO referrals (name, link) VALUES (?, ?)",
      [ref, link]
    );

    return true;
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
    console.error("Ошибка при получении данных промокода:", error);
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
      `SELECT name, users, rolls FROM referrals LIMIT ${pageSize} OFFSET ${offset}`
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
      "SELECT * FROM users WHERE tg_id = ? OR nickname = ?",
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
      'SELECT rolls FROM users WHERE tg_id = ?',
      [tgId]
    );

    if (rows.length === 0) {
      console.error('Пользователь не найден');
      return false;
    }

    const currentRolls = rows[0].rolls;

    await pool.query(
      'UPDATE users SET rolls = ? WHERE tg_id = ?',
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
      'SELECT rolls FROM users WHERE tg_id = ?',
      [tgId]
    );

    if (rows.length === 0) {
      console.error('Пользователь не найден');
      return false;
    }

    await pool.query(
      'UPDATE users SET rolls = ? WHERE tg_id = ?',
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
      'SELECT coins FROM users WHERE tg_id = ?',
      [tgId]
    );

    if (rows.length === 0) {
      console.error('Пользователь не найден');
      return false;
    }

    const currentCoins = rows[0].coins;

    await pool.query(
      'UPDATE users SET coins = ? WHERE tg_id = ?',
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
      'SELECT coins FROM users WHERE tg_id = ?',
      [tgId]
    );

    if (rows.length === 0) {
      console.error('Пользователь не найден');
      return false;
    }

    await pool.query(
      'UPDATE users SET coins = ? WHERE tg_id = ?',
      [coins, tgId]
    );

    return coins;
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
  insertMultiplePromoCodes,
  deletePromoCodesByPrefix,
  countPromoCodesByPrefix,
  searchUser,
  updateVipStatus,
  setVipStatus,
  updateRolls,
  setRolls,
  updateBal,
  setBal
};

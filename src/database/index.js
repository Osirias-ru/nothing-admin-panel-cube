const mysql = require("mysql2/promise");
const crypto = require('crypto');

let pool;

function generatePromoCode(prefix) {
  const randomPart = generateRandomString(8);
  return `${prefix}_${randomPart}`;
}

function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

async function createConnection() {
  pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "qwerty",
    database: "cubictest",
    port: "3306",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

async function insertPromoCode(promoCode, activations, coins) {
  try {
    const existingPromo = await getPromoCode(pool, promoCode);

    if (existingPromo) {
      console.log("Промокод уже существует.");
      return null;
    }

    const [rows, fields] = await pool.query(
      "INSERT INTO promo_codes (code, activations, coins) VALUES (?, ?, ?)",
      [promoCode, activations, coins]
    );

    return rows.insertId;
  } catch (error) {
    console.error("Ошибка при вставке данных:", error);
    return false;
  }
}

async function getPromoCode(promoCode) {
  try {
    const [rows, fields] = await pool.query(
      "SELECT activations, coins FROM promo_codes WHERE code = ?",
      [promoCode]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Ошибка при получении данных промокода:", error);
    return null;
  }
}

async function removePromoCode(promoCode) {
  try {
    const [rows, fields] = await pool.query(
      "DELETE FROM promo_codes WHERE code = ?",
      [promoCode]
    );

    return true;
  } catch (error) {
    console.error("Ошибка при удалении промокода:", error);
    return null;
  }
}

async function getAllPromoCodes(page, pageSize = 15) {
  try {
    const offset = (page - 1) * pageSize;
    const [rows, fields] = await pool.query(
      `SELECT code, activations, coins FROM promo_codes LIMIT ${pageSize} OFFSET ${offset}`
    );

    return rows;
  } catch (error) {
    console.error("Ошибка при получении всех промокодов:", error);
    return null;
  }
}

async function insertMultiplePromoCodes(prefix, count, coins) {
  try {
    const codes = [];
    const existingCodes = new Set();

    for (let i = 0; i < count; i++) {
      let code;
      do {
        code = generatePromoCode(prefix);
      } while (existingCodes.has(code));

      existingCodes.add(code);
      codes.push(code);
    }

    const values = codes.map((code) => `('${code}', 1, ${coins})`).join(", ");
    const query = `INSERT INTO promo_codes (code, activations, coins) VALUES ${values}`;

    const [rows, fields] = await pool.query(query);

    return rows.insertId;
  } catch (error) {
    console.error("Ошибка при вставке данных:", error);
    return false;
  }
}

async function deletePromoCodesByPrefix(prefix) {
  try {
    const query = "DELETE FROM promo_codes WHERE code LIKE ?";
    const prefixPattern = `${prefix}_%`;

    const [rows, fields] = await pool.query(query, [prefixPattern]);

    return rows.affectedRows;
  } catch (error) {
    console.error("Ошибка при удалении данных:", error);
    return false;
  }
}

async function countPromoCodesByPrefix(prefix) {
  try {
    const query = "SELECT COUNT(*) AS count FROM promo_codes WHERE code LIKE ?";
    const prefixPattern = `${prefix}_%`;

    const [rows, fields] = await pool.query(query, [prefixPattern]);

    return rows[0].count;
  } catch (error) {
    console.error("Ошибка при подсчете данных:", error);
    return false;
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

async function updateVipStatus(tgId, days) {
  try {
    const [rows, fields] = await pool.query(
      'SELECT vip_status FROM users WHERE tg_id = ?',
      [tgId]
    );

    if (rows.length === 0) {
      console.error('Пользователь не найден');
      return false;
    }

    const currentVipStatus = rows[0].vip_status;

    await pool.query(
      'UPDATE users SET vip_status = ? WHERE tg_id = ?',
      [currentVipStatus + days, tgId]
    );

    return currentVipStatus + days;
  } catch (error) {
    console.error('Ошибка при обновлении vip_status:', error);
    return null;
  }
}

async function setVipStatus(tgId, days) {
  try {
    const [rows, fields] = await pool.query(
      'SELECT vip_status FROM users WHERE tg_id = ?',
      [tgId]
    );

    if (rows.length === 0) {
      console.error('Пользователь не найден');
      return false;
    }

    await pool.query(
      'UPDATE users SET vip_status = ? WHERE tg_id = ?',
      [days, tgId]
    );

    return days;
  } catch (error) {
    console.error('Ошибка при обновлении vip_status:', error);
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
  insertPromoCode,
  getPromoCode,
  removePromoCode,
  getAllPromoCodes,
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

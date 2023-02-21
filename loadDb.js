const { Client } = require("pg");

async function loadDb(secrets, data) {
  try {
    let insertCount = 0;
    const client = new Client({
      host: secrets.db_host,
      user: secrets.db_user,
      port: secrets.db_port,
      password: secrets.db_password,
      database: secrets.db_database,
      max: 10,
      idleTimeoutMillis: 10000,
    });
    await client.connect();
    for (const counter of data) {
      let sql = `
      INSERT INTO bike_counter.counters
      (counter_id, counter_name, latitude, longitude, photos)
      VALUES($1, $2, $3, $4, $5)
      ON CONFLICT (counter_id) DO UPDATE SET
      counter_name = EXCLUDED.counter_name,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      photos = EXCLUDED.photos;
      `;
      await client.query(sql,
        [counter.id, counter.name.replace(/'/g, "''"),
        counter.latitude, counter.longitude,
        JSON.stringify(counter.photos).replace(/'/g, "''")]);
        insertCount += 1;
      for (const channel of counter.channels) {
        let sql = `
        INSERT INTO bike_counter.counter_channels
        (counter_id, channel_id, channel_name)
        VALUES($1, $2, $3)
        ON CONFLICT (counter_id, channel_id) DO UPDATE SET
        channel_name = EXCLUDED.channel_name;
        `;
        await client.query(sql,
          [counter.id, channel.id, channel.name.replace(/'/g, "''")]);
          insertCount += 1;
        for (const results of channel.results) {
          let sql = `
          INSERT INTO bike_counter.counter_counts
          (channel_id, iso_date, counts)
          VALUES($1, $2, $3)
          ON CONFLICT (channel_id, iso_date) DO UPDATE SET
          counts = EXCLUDED.counts;
          `;
          await client.query(sql,
            [channel.id, results.isoDate, results.counts]);
          insertCount += 1;
        }
      }
    }
    await client.end();
    console.log(`${insertCount} Rows Loaded`);
    return insertCount;
  }
  catch (err) {
    throw err
  }
}

module.exports = loadDb;
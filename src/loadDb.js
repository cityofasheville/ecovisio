/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import pgpkg from 'pg';
const { Client } = pgpkg;

async function loadDb(secrets, data) {
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
    const sql1 = `
      INSERT INTO bike_counter.counters
      (counter_id, counter_name, latitude, longitude, photos)
      VALUES($1, $2, $3, $4, $5)
      ON CONFLICT (counter_id) DO UPDATE SET
      counter_name = EXCLUDED.counter_name,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      photos = EXCLUDED.photos;
      `;
    await client.query(
      sql1,
      [counter.id, counter.name,
        counter.latitude, counter.longitude,
        JSON.stringify(counter.photos)],
    );
    insertCount += 1;
    for (const channel of counter.channels) {
      const sql2 = `
        INSERT INTO bike_counter.counter_channels
        (counter_id, channel_id, channel_name)
        VALUES($1, $2, $3)
        ON CONFLICT (counter_id, channel_id) DO UPDATE SET
        channel_name = EXCLUDED.channel_name;
        `;
      await client.query(
        sql2,
        [counter.id, channel.id, channel.name],
      );
      insertCount += 1;
      for (const results of channel.results) {
        const sql3 = `
          INSERT INTO bike_counter.counter_counts
          (channel_id, iso_date, counts)
          VALUES($1, $2, $3)
          ON CONFLICT (channel_id, iso_date) DO UPDATE SET
          counts = EXCLUDED.counts;
          `;
        await client.query(
          sql3,
          [channel.id, results.isoDate, results.counts],
        );
        insertCount += 1;
      }
    }
  }
  await client.end();
  console.log(`${insertCount} Rows Loaded`);
  return insertCount;
}

export default loadDb;

const express = require('express');
const router = express.Router();
const ping = require('ping');

router.get('/', async (req, res) => {
  const host = req.query.host;
  if (!host) {
    return res.status(400).json({ error: 'Missing host query parameter' });
  }

  try {
    const result = await ping.promise.probe(host);
    res.json({
      host: result.host,
      time: result.time, // in ms
      alive: result.alive
    });
  } catch (error) {
    res.status(500).json({ error: 'Ping failed', details: error.message });
  }
});

module.exports = router;

const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
const PORT = 5040;

app.use(cors())

// For parsing CSV to JSON
function parseCSVToJSON(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const entry = {};
    headers.forEach((header, idx) => {
      entry[header.trim()] = values[idx].trim();
    });
    return entry;
  });
}

app.use(bodyParser.json());

app.post('/run-hey', (req, res) => {
  const {
    requestNumbers,  // -n
    duration,        // -z
    concurrency,     // -c
    qps,             // -q
    proxy,           // -x
    targetUrl,       // positional
    outputCsv        // boolean flag to include -o csv
  } = req.body;

  const args = [];

  if (requestNumbers) args.push(`-n ${requestNumbers}`);
  if (duration) args.push(`-z ${duration}`);
  if (concurrency) args.push(`-c ${concurrency}`);
  if (qps) args.push(`-q ${qps}`);
  if (proxy) args.push(`-x ${proxy}`);
  if (outputCsv) args.push(`-o csv`);
  if (targetUrl) args.push(targetUrl);

  if (args.length === 0) {
    return res.status(400).json({ error: 'No parameters provided. Please include at least one valid parameter.' });
  }

  const command = `./hey_linux_amd64 ${args.join(' ')}`;
  console.log(`Running: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  
    if (outputCsv) {
      try {
        const jsonOutput = parseCSVToJSON(stdout);
        return res.json({ results: jsonOutput });
      } catch (parseError) {
        console.error('CSV parse error:', parseError);
        return res.status(500).json({ error: 'Failed to parse CSV output.' });
      }
    }
  
    // Parse default summary text output
    const parsed = {};
  
    const summaryMatch = stdout.match(/Summary:[\s\S]+?Requests\/sec:\t(.+?)\n/);
    if (summaryMatch) {
      const totalMatch = stdout.match(/Total:\s+(.+?)\s/);
      const slowestMatch = stdout.match(/Slowest:\s+(.+?)\s/);
      const fastestMatch = stdout.match(/Fastest:\s+(.+?)\s/);
      const averageMatch = stdout.match(/Average:\s+(.+?)\s/);
      const reqPerSec = summaryMatch[1];
  
      parsed.summary = {
        total: totalMatch?.[1],
        slowest: slowestMatch?.[1],
        fastest: fastestMatch?.[1],
        average: averageMatch?.[1],
        requestsPerSec: reqPerSec
      };
    }
  
    const latencyMatch = stdout.match(/Latency distribution:[\s\S]+?0% in (.+?) secs/m);
    if (latencyMatch) {
      const latencies = [...stdout.matchAll(/(\d+%) in ([\d.]+) secs/g)];
      parsed.latencyDistribution = latencies.map(([_, percentile, time]) => ({
        percentile,
        time
      }));
    }
  
    const statusCodes = [...stdout.matchAll(/\[(\d+)]\s+(\d+) responses/g)];
    if (statusCodes.length > 0) {
      parsed.statusCodes = statusCodes.map(([_, code, count]) => ({
        statusCode: code,
        count: Number(count)
      }));
    }
  
    res.json({ results: parsed });
  });
  
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

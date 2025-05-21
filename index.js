const express = require('express');
const cors = require('cors');
const imaps = require('imap-simple');

const app = express();
app.use(cors());
app.use(express.json());

// app.post('/get-email-count', async (req, res) => {
//   const { email, appPassword } = req.body;

//   const config = {
//     imap: {
//       user: email,
//       password: appPassword,
//       host: 'imap.gmail.com',
//       port: 993,
//       tls: true,
//       authTimeout: 10000,
//       tlsOptions: { rejectUnauthorized: false }  // Add this line
//     },
//   };

//   try {
//     const connection = await imaps.connect(config);
//     await connection.openBox('INBOX');
//     const searchCriteria = ['ALL'];
//     const fetchOptions = { bodies: ['HEADER'], struct: true };

//     const messages = await connection.search(searchCriteria, fetchOptions);
//     connection.end();

//     res.json({ totalEmails: messages.length });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch emails.' });
//   }
// });



app.post('/get-email-count', async (req, res) => {
  const { email, appPassword } = req.body;

  const config = {
    imap: {
      user: email,
      password: appPassword,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      autotls: 'always',
      authTimeout: 5000,
      tlsOptions: { rejectUnauthorized: false }
    },
  };

  try {
    const connection = await imaps.connect({ ...config, keepAlive: false });
    await connection.openBox('INBOX');

    // Just count UIDs, avoid fetching headers
    const messages = await connection.search(['ALL'], { bodies: [], markSeen: false });

    connection.end();
    console.log("Send")
    res.json({ totalEmails: messages.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch emails.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`IMAP Server running on http://localhost:${PORT}`);
});

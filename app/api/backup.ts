// pages/api/backup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  exec('pg_dump -U your_username your_database_name > backup.sql', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return res.status(500).end();
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=backup.sql');
    res.status(200).end(stdout);
  });
};

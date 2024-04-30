// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { exec } from 'child_process';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).end();
    }

    const file = files.backup as any; // `as any` to bypass type errors

    // Move the uploaded file to a desired location
    fs.renameSync(file.path, `uploads/${file.name}`);

    // Restore database from uploaded file
    exec(`pg_restore -U your_username -d your_database_name uploads/${file.name}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return res.status(500).end();
      }

      res.status(200).end();
    });
  });
};

import fs from 'fs';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import fse from 'fs-extra';

export async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const headers = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (h) => { headers.push(...h); })
      .on('data', (data) => { 
        if (rows.length < 5) rows.push(data); 
      })
      .on('end', () => resolve({ columns: headers, sampleRows: rows }))
      .on('error', reject);
  });
}

export async function parseXLSX(filePath) {
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  const columns = json.length ? Object.keys(json[0]) : [];

  return { columns, sampleRows: json.slice(0, 5) };
}

export async function parseUploadedFile(filePath, originalName) {
  const name = originalName.toLowerCase();

  if (name.endsWith('.csv')) return await parseCSV(filePath);
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return await parseXLSX(filePath);

  throw new Error('Only CSV or Excel supported');
}

export default {
  parseUploadedFile,
  parseCSV,
  parseXLSX
};

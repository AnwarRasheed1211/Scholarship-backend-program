// pages/api/semester-dates.js

export default function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { year } = req.query;
    if (!year || isNaN(year)) {
      return res.status(400).json({ error: 'Invalid year' });
    }
  
    const semesterDates = generateSemesterDates(parseInt(year));
    res.status(200).json(semesterDates);
  }
  
  function generateSemesterDates(year) {
    const semester1Start = new Date(year, 5, 1); // June is represented by 5 (0-indexed)
    const semester1End = new Date(year, 9, 31);
    const semester2Start = new Date(year, 10, 1); // November is represented by 10 (0-indexed)
    const semester2End = new Date(year + 1, 2, 31); // March is represented by 2 (0-indexed)
  
    return {
      semester1: { start: semester1Start, end: semester1End },
      semester2: { start: semester2Start, end: semester2End }
    };
  }
  
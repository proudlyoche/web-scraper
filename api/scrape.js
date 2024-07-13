const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { url, selector } = req.query;

  if (!url || !selector) {
    return res.status(400).json({ error: 'URL and selector are required' });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const result = {};

    $(selector).each((i, element) => {
      const name = $(element).find('.name').text().trim();
      const value = $(element).find('.value').text().trim();
      result[name] = value;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape the webpage' });
  }
};
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

// CSV writer setup
const csvFilePath = path.join(__dirname, '../data/scraped_data.csv');
const csv = csvWriter({
  path: csvFilePath,
  header: [
    { id: 'title', title: 'Title' },
    { id: 'price', title: 'Price' }
    
  ]
});

async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.konga.com');

  // Scrape the data
  const data = await page.evaluate(() => {
    

    const items = document.querySelectorAll('.item');
    return Array.from(items).map(item => ({
      title: item.querySelector('.title').innerText,
      price: item.querySelector('.price').innerText
    }));
  });

  await csv.writeRecords(data); // Write data to CSV

  await browser.close();
}

scrape();

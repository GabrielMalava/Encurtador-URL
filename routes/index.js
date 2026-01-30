const express = require('express');
const router = express.Router();

const Url = require('../models/url');

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

router.get('/', (req, res, next) => {
  res.render('index', { title: 'URL Shortener' });
});

router.post('/', async (req, res, next) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL é obrigatória' });
    }

    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: 'URL inválida' });
    }

    let shortCode;
    let existingUrl;
    
    do {
      shortCode = generateShortCode();
      existingUrl = await Url.findOne({ where: { shortCode } });
    } while (existingUrl);

    const newUrl = await Url.create({
      originalUrl: url,
      shortCode
    });

    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    
    res.json({
      originalUrl: url,
      shortUrl,
      shortCode
    });
  } catch (error) {
    console.error('Erro ao encurtar URL:', error);
    res.status(500).json({ error: 'Erro interno ao encurtar URL' });
  }
});

router.get('/urls', async (req, res, next) => {
  try {
    const urls = await Url.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    
    res.render('urls', { 
      title: 'URLs Encurtadas',
      urls 
    });
  } catch (error) {
    console.error('Erro ao buscar URLs:', error);
    res.status(500).render('error', { 
      message: 'Erro ao buscar URLs',
      error: { status: 500 }
    });
  }
});

router.get('/:shortCode', async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    
    const url = await Url.findOne({ where: { shortCode } });
    
    if (!url) {
      return res.status(404).render('error', { 
        message: 'URL não encontrada',
        error: { status: 404 }
      });
    }

    await url.increment('clicks');
    
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Erro ao redirecionar:', error);
    res.status(500).render('error', { 
      message: 'Erro ao redirecionar',
      error: { status: 500 }
    });
  }
});

module.exports = router;

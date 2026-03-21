const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Url = require('../models/Url');
const { nanoid } = require('nanoid'); // Need to use 3.x for commonjs
// nanoid 3.x is available via install nanoid@3.3.6

// Basic URL validation regex
const validateUrl = (value) => {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
};

// @route   POST /api/url/shorten
// @desc    Create short URL
// @access  Private
router.post('/shorten', auth, async (req, res) => {
  const { originalUrl, alias } = req.body;

  if (!validateUrl(originalUrl)) {
    return res.status(400).json({ msg: 'Invalid URL format' });
  }

  try {
    let shortCode = nanoid(8);
    
    // Bonus Feature: Custom Alias
    if (alias) {
      const existingAlias = await Url.findOne({ shortCode: alias });
      if (existingAlias) {
        return res.status(400).json({ msg: 'Alias already in use' });
      }
      shortCode = alias;
    }

    const newUrl = new Url({
      originalUrl,
      shortCode,
      userId: req.user.id
    });

    const url = await newUrl.save();
    res.json(url);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/url/user
// @desc    Get all URLs for a user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/url/:code
// @desc    Redirect to original URL
// @access  Public
router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (url) {
      // Track analytics
      url.clicks++;
      url.visitHistory.push({ timestamp: new Date() });
      await url.save();

      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ msg: 'No URL found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/url/:id
// @desc    Delete URL
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ msg: 'URL not found' });
    }

    // Make sure user owns the URL
    if (url.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Url.findByIdAndDelete(req.params.id);
    res.json({ msg: 'URL removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/url/:id/analytics
// @desc    Get analytics for a URL
// @access  Private
router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ msg: 'URL not found' });
    }

    if (url.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Prepare analytics response limit to recent 10 if needed or return all
    res.json({
      totalClicks: url.clicks,
      lastVisited: url.visitHistory.length > 0 ? url.visitHistory[url.visitHistory.length - 1].timestamp : null,
      recentVisits: url.visitHistory.slice(-10).reverse()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

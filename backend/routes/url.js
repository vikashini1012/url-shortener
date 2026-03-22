const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Url = require('../models/Url');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid'); 

// Basic URL validation regex
const validateUrl = (value) => {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
};

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// @route   POST /api/url/shorten
// @desc    Create short URL
// @access  Private
router.post('/shorten', auth, async (req, res) => {
  const { originalUrl, alias, password, expiresAt } = req.body;

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

    const newUrlParams = {
      originalUrl,
      shortCode,
      userId: req.user.id
    };

    // Advanced: Expiry
    if (expiresAt) {
      newUrlParams.expiresAt = new Date(expiresAt);
    }

    // Advanced: Password Protection
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      newUrlParams.password = await bcrypt.hash(password, salt);
      newUrlParams.isProtected = true;
    }

    const newUrl = new Url(newUrlParams);
    const url = await newUrl.save();
    
    // Don't send the hashed password back
    const urlResponse = url.toObject();
    delete urlResponse.password;
    res.json(urlResponse);
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
    const urls = await Url.find({ userId: req.user.id }).select('-password').sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/url/:code
// @desc    Redirect or handle advanced restrictions
// @access  Public
router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (!url) {
      return res.status(404).json({ msg: 'No URL found' });
    }

    // Check expiration
    if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
      return res.redirect(`${FRONTEND_URL}/expired`);
    }

    // Check password protection
    if (url.isProtected) {
      // Cannot redirect directly, frontend must prompt for password
      return res.redirect(`${FRONTEND_URL}/unlock/${url.shortCode}`);
    }

    // Standard Redirect & Tracking
    url.clicks++;
    url.visitHistory.push({ timestamp: new Date() });
    await url.save();

    let destination = url.originalUrl;
    if (!/^https?:\/\//i.test(destination)) {
      destination = 'http://' + destination;
    }

    return res.redirect(destination);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/url/unlock/:code
// @desc    Unlock a password-protected URL
// @access  Public
router.post('/unlock/:code', async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ msg: 'Password is required' });
  }

  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) {
      return res.status(404).json({ msg: 'No URL found' });
    }
    
    if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
      return res.status(400).json({ msg: 'This link has expired' });
    }

    const isMatch = await bcrypt.compare(password, url.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Incorrect password' });
    }

    // Track analytics for unlock
    url.clicks++;
    url.visitHistory.push({ timestamp: new Date() });
    await url.save();

    let destination = url.originalUrl;
    if (!/^https?:\/\//i.test(destination)) {
      destination = 'http://' + destination;
    }

    // Give frontend the original url to redirect manually
    res.json({ originalUrl: destination });

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

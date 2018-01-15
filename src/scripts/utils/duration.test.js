var assert = require('assert');
var duration = require('./duration');

describe('duration', function() {
  describe('duration without round param - default', function() {
    it('should return "0 sec"', function() {
      assert.equal('0 sec', duration(0));
    });
    it('should return "1 sec"', function() {
      assert.equal('1 sec', duration(1));
    });
    it('should return "59 sec"', function() {
      assert.equal('59 sec', duration(59));
    });
    it('should return "1 min 0 sec"', function() {
      assert.equal('1 min 0 sec', duration(60));
    });
    it('should return "1 min 1 sec"', function() {
      assert.equal('1 min 1 sec', duration(61));
    });
    it('should return "59 min 59 sec"', function() {
      assert.equal('59 min 59 sec', duration(3599));
    });
    it('should return "1 hr 0 sec"', function() {
      assert.equal('1 hr 0 sec', duration(3600));
    });
    it('should return "1 hr 1 sec"', function() {
      assert.equal('1 hr 1 sec', duration(3601));
    });
    it('should return "1 hr 1 min 0 sec"', function() {
      assert.equal('1 hr 1 min 0 sec', duration(3660));
    });
    it('should return "1 hr 1 min 1 sec"', function() {
      assert.equal('1 hr 1 min 1 sec', duration(3661));
    });
    it('should return "23 hr 59 min 59 sec"', function() {
      assert.equal('23 hrs 59 min 59 sec', duration(86399));
    });
    it('should return "more than 24 hrs"', function() {
      assert.equal('more than 24 hrs', duration(86400));
    });
  });

  describe('duration with round param (should trim seconds part)', function() {
    it('should return "0 sec"', function() {
      assert.equal('0 sec', duration(0, true));
    });
    it('should return "1 sec"', function() {
      assert.equal('1 sec', duration(1, true));
    });
    it('should return "59 sec"', function() {
      assert.equal('59 sec', duration(59, true));
    });
    it('should return "1 min 0 sec"', function() {
      assert.equal('1 min 0 sec', duration(60, true));
    });
    it('should return "1 min 1 sec"', function() {
      assert.equal('1 min 1 sec', duration(61, true));
    });
    it('should return "59 min 59 sec"', function() {
      assert.equal('59 min 59 sec', duration(3599, true));
    });
    it('should return "1 hr"', function() {
      assert.equal('1 hr', duration(3600, true));
    });
    it('should return "1 hr"', function() {
      assert.equal('1 hr', duration(3601, true));
    });
    it('should return "1 hr 1 min"', function() {
      assert.equal('1 hr 1 min', duration(3660, true));
    });
    it('should return "1 hr 1 min"', function() {
      assert.equal('1 hr 1 min', duration(3661, true));
    });
    it('should return "23 hr 59 min"', function() {
      assert.equal('23 hrs 59 min', duration(86399, true));
    });
    it('should return "more than 24 hrs"', function() {
      assert.equal('more than 24 hrs', duration(86400, true));
    });
  });
});

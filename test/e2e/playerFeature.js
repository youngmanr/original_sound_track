describe('OST Player', function() {

  beforeEach(function() {
      browser.get('http://localhost:8080');
  });

  describe('home page', function() {
    it('has a title', function() {
      expect(browser.getTitle()).toEqual('Original Sound Track');
    });
  });


  describe('is not playing a track', function() {
    it('should have a play button', function() {
      expect(element(by.css('.jp-play')).isDisplayed()).toBe(true);
    });

    it('should not have a pause button', function() {
      expect(element(by.css('.jp-pause')).isDisplayed()).toBe(false);
    });
  });

  describe('is playing a track', function() {
    beforeEach(function() {
      element(by.css('.jp-play')).click();
    });

    it('should not have a play button', function() {
      expect(element(by.css('.jp-play')).isDisplayed()).toBe(false);
    });

    it('should have a pause button', function() {
      expect(element(by.css('.jp-pause')).isDisplayed()).toBe(true);
    });
  });

  describe('is pausing a track', function() {
    beforeEach(function() {
      element(by.css('.jp-play')).click();
      element(by.css('.jp-pause')).click();
    });

    it('should have a play button', function() {
      expect(element(by.css('.jp-play')).isDisplayed()).toBe(true);
    });

    it('should not have a pause button', function() {
      expect(element(by.css('.jp-pause')).isDisplayed()).toBe(false);
    });
  });

  describe('track is not muted', function() {
    it('should have a mute button', function() {
      expect(element(by.css('.jp-mute')).isDisplayed()).toBe(true);
    });

    it('should not have an unmute button', function() {
      expect(element(by.css('.jp-unmute')).isDisplayed()).toBe(false);
    });
  });

  describe('track is muted', function() {
    beforeEach(function() {
      element(by.css('.jp-mute')).click();
    });

    it('should not have a mute button', function() {
      expect(element(by.css('.jp-mute')).isDisplayed()).toBe(false);
    });

    it('should have an unmute button', function() {
      expect(element(by.css('.jp-unmute')).isDisplayed()).toBe(true);
    });
  });   
});

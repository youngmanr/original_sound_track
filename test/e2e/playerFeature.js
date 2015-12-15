describe('OST Player', function() {
  it('has a title', function() {
    browser.get('http://localhost:8080');
    expect(browser.getTitle()).toEqual('Original Sound Track');
  });

  it('has a play button', function() {
    browser.get('http://localhost:8080');
    expect(element(by.css('.jp-play')).isPresent()).toBe(true);
  });
});
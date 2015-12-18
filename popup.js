function popup(mylink, title)
{
  var href;
  var width = 1000;
  var height = 500;
  var left = 200;
  var top = 100;

  if (! window.focus) return true;

  if (typeof(mylink) == 'string')
   href=mylink;
  else
    href=mylink.href;
  window.open(href, title,
    'width=' + width + ',' +
    'height=' + height + ',' +
    'left=' + left + ',' +
    'top=' + top + ',' +
    'scrollbars=' + 'yes'+ ',');
  return false;
};

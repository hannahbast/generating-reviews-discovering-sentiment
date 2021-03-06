function build(boundary, text) {
  var dashdash = '--';
  var crlf = '\r\n';
  var res = '';

  res += dashdash;
  res += boundary;
  res += crlf;
  res += 'Content-Disposition: form-data; name="text"; filename="dummy"';
  res += crlf;
  res += 'Content-Type: text/plain';
  res += crlf;
  res += crlf;
  res += text;
  res += crlf;
  res += dashdash;
  res += boundary;
  res += dashdash;
  res += crlf;
  return res;
}

// http://stackoverflow.com/a/11850486
function Interpolate(start, end, steps, count) {
  var s = start,
      e = end,
      final = s + (((e - s) / steps) * count);
  return Math.floor(final);
}

function Color(_r, _g, _b) {
    var r, g, b;
    var setColors = function(_r, _g, _b) {
        r = _r;
        g = _g;
        b = _b;
    };

    setColors(_r, _g, _b);
    this.getColors = function() {
        var colors = {
            r: r,
            g: g,
            b: b
        };
        return colors;
    };
}

function color(value) {
  value = parseFloat(value);
  var start = new Color(255, 255, 255);
  var end = new Color(6, 170, 60);
  if (value < 0) {
    end = new Color(232, 9, 26);
    value = -1.0 * value;
  }
  var startColors = start.getColors();
  var endColors = end.getColors();
  var r = Interpolate(startColors.r, endColors.r, 100, value * 50);
  var g = Interpolate(startColors.g, endColors.g, 100, value * 50);
  var b = Interpolate(startColors.b, endColors.b, 100, value * 50);
  return "rgb(" + r + "," + g + "," + b + ")";
}

function load() {
  $('#result').html("<img src='./loading.gif' />");
}

function displayResult(data) {
  console.log(data);
  var res = "";
  for (var i = 0; i < data.values.length; i++) {
    res += "<span style='background-color: "+color(data.values[i])+"'>"+data.chars[i]+"</span>";
  }
  $('#result').html(res);
}

$(document).ready(function() {
  $("#form").on("submit", function() {
    load();
    var text = JSON.stringify({"text": $("#input").val(), "method": "text"});
    var boundary = '------multipartformboundary' + (new Date).getTime();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", predict_url, true);
    xhr.setRequestHeader('content-type', 'multipart/form-data; boundary='+boundary);
    xhr.setRequestHeader('Authorization', predict_authkey);
    xhr.send(build(boundary, text));
    xhr.onload = function() {
      displayResult(JSON.parse(xhr.response));
    }
    return false;
  });
});

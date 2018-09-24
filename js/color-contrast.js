(function () {
  var colorPicker = document.querySelector('#color-picker');
  var colorCode = document.querySelector('#color-code');
  var colorCodeHex = document.querySelector('#color-display > span');
  var body = document.querySelector('body');

  colorCode.value = colorPicker.value.substr(1);

  var toRGB = function (hex) {
    const r = parseInt(hex.substr(1, 2), 16),
          g = parseInt(hex.substr(3, 2), 16),
          b = parseInt(hex.substr(5, 2), 16);
    return [r, g, b];
  }
 
  var linearise = function (value) {
    var value8bit = (value / 255);
    if (value8bit <= 0.03928) {
      return value8bit / 12.92;
    }
    return Math.pow((value8bit + 0.055) / 1.055, 2.4)
  }

  var calculateLuminosity = function (hex) {
    var rgb = toRGB(hex);

    rgb = rgb.map(linearise);
    var R = rgb[0],
        G = rgb[1],
        B = rgb[2];
    var luminosity = (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    return luminosity;
  }

  var calculateLuminosityRatio = function (L1, L2) {
    return (L1 > L2) ? (L1 + 0.05) / (L2 + 0.05) : (L2 + 0.05) / (L1 + 0.05);
  }

  var getContrastWCAG = function (hex) {
    var luminosity = calculateLuminosity(hex)

    var whiteContrastRatio = calculateLuminosityRatio(luminosity, 1); 
    var blackContrastRatio = calculateLuminosityRatio(luminosity, 0); 

    return (whiteContrastRatio > blackContrastRatio) ? 'white' : 'black';
  }

  var updateScreen = function updateScreen(hex) {
    var contrastColor = getContrastWCAG(hex);
    body.style.backgroundColor = hex;
    colorCode.style.color = contrastColor;
    colorCode.style.borderColor = contrastColor;
    colorCode.value = hex.substr(1);
    colorCodeHex.style.color = hex;
    colorCodeHex.style.backgroundColor = contrastColor;
    colorPicker.value = hex;
  }

  colorPicker.addEventListener('change', function (event) {
    var hex = event.target.value;
    updateScreen(hex);
  });

  colorCode.addEventListener('keyup', function (event) {
    var regex = /[0-9a-f]{6}|#[0-9a-f]{3}/gi;
    if (event.keyCode === 13 && 
        event.target.value.match(regex)) {
      updateScreen('#' + event.target.value);
    }
  });
})()
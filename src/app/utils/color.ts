function cie2RGB(px, py, bri) {
   
   let x = px;
   let y = py;
   let z = 1.0 - x - y;  
   let Y = bri / 255.0; // Brightness of lamp
   let X = (Y / y) * x;
   let Z = (Y / y) * z;

   let r =  X * 1.656492 - Y * 0.354851 - Z * 0.255038;
   let g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
   let b =  X * 0.051713 - Y * 0.121364 + Z * 1.011530;

   r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
   g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
   b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;

   // Convert to [0, 255] range and clamp
   r = Math.min(Math.round(r * 255), 255);
   g = Math.min(Math.round(g * 255), 255);
   b = Math.min(Math.round(b * 255), 255);

   console.log(r + ', ' + g + ", " + b)
   return {
      'r' : r,
      'g' : g,
      'b' : b
   }

}

export {cie2RGB};
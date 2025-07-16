const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'Fotos');
const output = [];

fs.readdirSync(rootDir).forEach(albumFolder => {
  const albumPath = path.join(rootDir, albumFolder);
  if (fs.lstatSync(albumPath).isDirectory()) {
    const imagenes = fs.readdirSync(albumPath)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `Fotos/${albumFolder}/${file}`);
    
    output.push({
      nombre: albumFolder.replace(/[-_]/g, ' '),
      imagenes
    });
  }
});

fs.writeFileSync('albums.json', JSON.stringify(output, null, 2));
console.log('✅ Archivo albums.json generado.');

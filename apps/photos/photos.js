function initPhotos() {
  const photosGrid = document.getElementById('photos-grid');
  if (!photosGrid) return;

  const photoFolder = 'apps/photos/images/';
  const photoList = [
    'anime-girl.jpg',
    'flower-guy.jpg',
    'glasses-nft.png',
    'kaws.jpg',
    'mortal-kombat.jpg',
    'offwhite.png',
    'pink-skull.png',
    'starwars.jpg',
    'vaporwave.jpg'
  ];

  photosGrid.innerHTML = ''; // clear previous

  photoList.forEach(file => {
    const img = document.createElement('img');
    img.src = `${photoFolder}${file}`;
    img.alt = file;
    img.className = 'photo-item';
    photosGrid.appendChild(img);
  });
}

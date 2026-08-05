window.PROJECTS = {
  "ventilo": {
    title: "Ventilo: 2300",
    images: [
      { src: "ventilo.png", alt: "Projet ventilateurs", cropTop: true },
      { src: "bbbg.jpg", alt: "Projet ventilateurs, gros plan" },
      { src: "bbjb.jpg", alt: "Projet ventilateurs, vue d'ensemble" },
      { src: "bbexpo.jpg", alt: "Projet ventilateurs, exposition" }
    ],
    text: "Dans un futur spéculatif imaginé à l'occasion d'un workshop au Domaine de Boisbuchet avec Jean-Baptiste Durand, les combustibles fossiles ne sont plus disponibles. Alors que deviennent nos objets ? À quoi ressemblent-ils ? Comment fonctionnent-ils ? Quels matériaux définissent les objets d'un futur post-fossile ? J'ai alors décidé d'hybrider matériaux naturels et tech en récupérants des cailloux de la rivière du domaine et en y fixant des ventilateurs de vieux ordinateurs ainsi qu'un panneau LED. L'entiereté du système éléctrique est visible et rudimentaire, le tout conférant à la pièce un style cyberpunk propre à ce futur."
  },
  "stase": {
    title: "Stase",
    images: [
      { src: "derniere .jpg", alt: "Projet applique murale cuir" },
      { src: "cuirtout.png", alt: "Applique murale cuir, vue éclairée" },
      { src: "misesituation.jpg", alt: "Applique murale cuir, mise en situation" },
      { src: "ouiouioui.jpg", alt: "Applique murale cuir, détail contre-jour" },
      { src: "rn_image_picker_lib_temp_6c54f1bf-0878-4f04-a4b6-0c9bcea35704.jpg", alt: "Cuir trempé dans la baignoire" },
      { src: "1779031098017.png", alt: "Séchage du cuir au sèche-cheveux" },
      { src: "IMG_20260501_210738541.jpg", alt: "Découpe du cuir aux ciseaux" },
      { src: "IMG_20260511_173139340.jpg", alt: "Structure en bois de l'applique" }
    ],
    text: "Les cuirs tannés végétaux sont dotés d’une mémoire de forme temporaire après avoir été plongés dans une eau brulante. Historiquement cette technique à permis de fabriquer des chapeaux ou des plastrons. Mais mon objectif était de souligner la beauté du mouvement du cuir. En le figeant en plein mouvement j’ai alors pu lui donner une dimension sculpturale à laquelle la forme du drapé se prêtait parfaitement. Le halo lumineux vient alors renforcer cet aspect en lui conférant une fonction d'applique murale."
  },
  "totem": {
    title: "Totem",
    images: [
      { src: "compovert.jpg", alt: "Projet bougeoir bois, composition avec bougies" },
      { src: "compoblanc.jpg", alt: "Projet bougeoir bois, composition avec bougies" },
      { src: "photo_large_objet_gauche.jpg", alt: "Bougeoirs bois, configuration assemblée" },
      { src: "photo_large_objet_droite.jpg", alt: "Bougeoirs bois, configuration déployée" },
      { src: "_MG_0615.jpg", alt: "Bougeoir bois, détail des assemblages" },
      { src: "IMG_20251223_150222902.jpg", alt: "Perçage des blocs de bois" },
      { src: "IMG_20251223_152603660.jpg", alt: "Façonnage du bougeoir à l'atelier" },
      { src: "model3Dbois.png", alt: "Modélisation 3D du bougeoir" }
    ],
    text: "La démarche était ici de maximiser la modularité sur un objet simple. Grâce à une composition sur une grille de 3 colonnes en 3D, j'ai réussi à obtenir un équilibre de poids permettant de nombreuses possibilités d'assemblage. Sa forme simple et enfantine faite de blocs invitent à un jeu de création presque sans fin."
  },
  "error404": {
    title: "Error 404",
    images: [
      { src: "piuy-4.jpg", alt: "Pcb moulé alluminium", objectPosition: "32% center" },
      { src: "piuy.jpg", alt: "Pcb moulé alluminium, contre le bois" },
      { src: "piuy-2.jpg", alt: "Pcb moulé alluminium, dans la végétation" },
      { src: "piuy-3.jpg", alt: "Pcb moulé alluminium, posé sur socle de lave" }
    ],
    text: "Lors de mon passage au Domaine de Boisbuchet, j'ai eu accès à la fonderie. Suite à un premier échec ayant trop compacté le sable de mon moule, j'ai trouvé que cette « erreur » redonnait à la nature ses droits. Alors j'ai moulé un PCB : matériau d'origine technologique, et ai tout fait pour créer un objet qui semblerait nécrosé par le temps et la nature."
  }
};

(function () {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('p');
  var project = (window.PROJECTS || {})[slug];

  var titleEl = document.getElementById('projectTitle');
  var textEl = document.getElementById('projectText');
  var track = document.getElementById('carouselTrack');
  var dotsEl = document.getElementById('carouselDots');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');

  if (!project) {
    titleEl.textContent = 'Projet introuvable';
    document.getElementById('carousel').style.display = 'none';
    document.title = 'Projet — Louis Laumonier';
    return;
  }

  document.title = project.title + ' — Louis Laumonier';
  titleEl.textContent = project.title;
  textEl.textContent = project.text || '';

  var images = project.images || [];
  var current = 0;

  images.forEach(function (img) {
    var slide = document.createElement('div');
    slide.className = 'carousel-slide';
    var imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt || project.title;
    if (img.objectPosition) imgEl.style.objectPosition = img.objectPosition;
    if (img.cropTop) imgEl.style.objectPosition = 'top';
    slide.appendChild(imgEl);
    track.appendChild(slide);

    var dot = document.createElement('span');
    dot.className = 'dot';
    dotsEl.appendChild(dot);
  });

  var dots = dotsEl.querySelectorAll('.dot');

  function render() {
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });

    if (images.length <= 1) {
      prevBtn.classList.add('carousel-arrow--single');
      nextBtn.classList.add('carousel-arrow--single');
    } else {
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === images.length - 1;
    }
  }

  prevBtn.addEventListener('click', function () {
    if (current > 0) { current -= 1; render(); }
  });

  nextBtn.addEventListener('click', function () {
    if (current < images.length - 1) { current += 1; render(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  if (dotsEl && images.length <= 1) dotsEl.style.display = 'none';

  render();
})();
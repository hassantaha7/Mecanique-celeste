//Projet web Hassan TAHA
const canvas = document.querySelector("#affichage");
const ctx = canvas.getContext("2d");
const main = document.querySelector("#main");
const parameteres = document.querySelector("#parameteres");
const ctrls = document.querySelectorAll("#ctrls > *");
const color_choose = document.querySelector("#color_choose");
const mass_Entre = document.querySelectorAll("#mass_slider, #mass_nombre");
const msg = document.querySelectorAll("#msg");
//les variables ultisés pour ce projet


var paremetres_display = true;
var mass = 200;
var color = color_choose.value;
var demarre= false;

document.querySelector("#run").addEventListener("click", () => {
    demarre = true;
});
document.querySelector("#stop").addEventListener("click", () => {
    demarre = false;
});

color_choose.addEventListener("change", () => {
    color = color_choose.value;
});

//rotation de l'image


const ctrlsRetour = () => {
    if (paremetres_display) {
        ctrls[0].style.transform = "rotate(180deg)";
        parameteres.style.display = "none";
        msg.values.toString = "Show Controls";
    } else {
        ctrls[0].style.transform = "";
        parameteres.style.display = "";
    }
    paremetres_display = !paremetres_display;
};
ctrls[0].addEventListener("click", ctrlsRetour);
ctrls[1].addEventListener("click", ctrlsRetour);

const massEntreRetour = (value) => {
    mass = parseInt(value);
    mass_Entre[0].value = mass;
    mass_Entre[1].value = mass;
};


const random = (min, max) => {
    return Math.floor(Math.random()*(max-min)+min);
};


// Génère une couleur hexa aléatoirement.
const randomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++)
        color += letters[Math.floor(Math.random() * 16)];
    return color;   
};

function Particle(mass, x, y) {
    this.mass = mass;
    this.x = x;
    this.y = y;
    this.vx = this.vy = 0;
    this.fx = this.fy = 0;
    this.color = randomColor();
    this.fixed = false;
    
    this.draw = () => {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, Math.sqrt(this.mass/Math.PI), 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    };
};


//initialisation d'un ensemble de particules
//on stocke les particules dans un tableau
const particles = [];
//nombre des Paritcules
const N = 10;

const G = 1;
var dt = 0.2;

//on parcours les particules
for (let i=0; i<N; i++) {
    let mass = random(10, 100);
    let ang = 2*Math.PI*i/N;
    let rad = (mass < 50) ? random(50, 100) : random(100, 200);
    let x = canvas.width/2 + rad*Math.sin(ang);
    let y = canvas.height/2 + rad*Math.cos(ang);

    let p = new Particle(mass, x, y);
    p.vx = -0.01*rad*Math.cos(ang);
    p.vy =  0.01*rad*Math.sin(ang);

    p.draw();
    particles.push(p);
}

particles.push(new Particle(
    3000,
    canvas.width/2,
    canvas.height/2
));
particles[N].fixed = true;
particles[N].draw();


//creation d'une nouvelle particule par double clic
main.addEventListener("dblclick", (evt) => {
    let p = new Particle(mass, evt.offsetX, evt.offsetY);
    p.color = color;
    p.draw();
    particles.push(p);
});
// pour animer les particules,cette fonction calcule le deplacelement apres effectuer la force appliqué par un corps B  sur un corps A
const calculDeplacements = () => {
    for (let i=0; i<particles.length; i++) {
        if (!particles[i].fixed) {

            particles[i].fx = particles[i].fy = 0;

            for (let j=0; j<particles.length; j++) {
                if (i != j) {

                    let dx = particles[j].x - particles[i].x;
                    let dy = particles[j].y - particles[i].y;
                    let r = Math.sqrt(dx**2+dy**2);

                    let f = G*particles[j].mass/r**2;

                    particles[i].fx += f*dx/r;
                    particles[i].fy += f*dy/r;
                }
            }

            let ax = particles[i].fx / particles[i].mass;
            let ay = particles[i].fy / particles[i].mass;

            particles[i].vx += ax * dt;
            particles[i].vy += ay * dt;

            particles[i].x += particles[i].vx * dt;
            particles[i].y += particles[i].vy * dt;
        }
    }

    for (let i=particles.length-1; i>=0; i--) {
        if (particles[i].x < 0 || particles[i].x > canvas.width || particles[i].y < 0 || particles[i].y > canvas.height) {
            particles.splice(i, 1);
        }
    }
};

const refresh = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let particle of particles) {
        particle.draw();
    }
};
//demarrage de la fontion CalculDeplacements
setInterval(() => {
    if (demarre) {
        calculDeplacements();
        refresh();
    }
}, 10);
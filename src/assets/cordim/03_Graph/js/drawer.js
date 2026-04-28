/**
 * DRAWER : Objet qui dessine dans un canvas
 */
function Drawer() {
    this.drawArea = null;
    this.context = null;
    this.validateButton = null;
    
    this.isDrawing = false;
    this.touchX = 0;
    this.touchY = 0;
    
    this.solution = null;
    this.explanation = null;
    this.instruction = null;
    this.tutorial = null;
}

/**
 * Initialise l'objet
 */
Drawer.prototype.initialize = function() {
    this.solution = document.getElementById("solution");
    this.explanation = document.getElementById("explanation");
    this.tutorial = document.getElementById("content2");
    this.instruction = document.getElementById("content3");
    this.initializeDrawArea();
    this.initializeContext();
    this.bindTouchListeners(true);
}

/**
 * Initialise composant "bouton valider"
 */
Drawer.prototype.initializeValidateButton = function() {
    this.validateButton = document.getElementById("validate_button");
    this.validateButton.classList.remove("off");
    this.bindValidateButtonListener(true);
}

/**
 * Initialise composant "zone de dessin"
 */
Drawer.prototype.initializeDrawArea = function() {
    this.drawArea = document.getElementById("draw_area");
}

/**
 * Initialise composant "contexte"
 */
Drawer.prototype.initializeContext = function() {
    this.context = this.drawArea.getContext("2d");
    this.context.lineWidth = 5.0;
    this.context.lineCap = "round";
    this.context.strokeStyle = "#00BFB3";     
}

/**
 * Pose les écouteur si vrai, les enlève sinon
 * @param _boolean
 */
Drawer.prototype.bindTouchListeners = function(_boolean) {    
    if(_boolean){
        var self = this;
        //evenements touch
        this.drawArea.ontouchstart = function(_event) {self.touchStartHandler(_event)};
        this.drawArea.ontouchmove = function(_event) {self.touchMoveHandler(_event)};
        document.ontouchend = function(_event) {self.touchEndHandler(_event)};
        //evenements souris
        this.drawArea.onmousedown = function(_event) {self.touchStartHandler(_event)};
        this.drawArea.onmousemove = function(_event) {self.touchMoveHandler(_event)};
        document.onmouseup = function(_event) {self.touchEndHandler(_event)};
    } else {
        //evenements touch
        this.drawArea.ontouchstart = null;
        this.drawArea.ontouchmove = null;
        document.ontouchend = null;
        this.validateButton.ontouchstart = null;
        //evenements souris
        this.drawArea.onmousedown = null;
        this.drawArea.onmousemove = null;
        document.onmouseup = null;
        this.validateButton.onmousedown = null;
    }
}

Drawer.prototype.bindValidateButtonListener = function(_boolean) {
    if(_boolean){
        var self = this;
        //evenements touch
        this.validateButton.ontouchstart = function(_event) {self.validateHandler(_event)};
        //evenements souris
        this.validateButton.onmousedown = function(_event) {self.validateHandler(_event)};
    } else {
        //evenements touch
        this.validateButton.ontouchstart = null;
        //evenements souris
        this.validateButton.onmousedown = null;
    }
}

/**
 * Handler : début du toucher
 * @param _event
 */
Drawer.prototype.touchStartHandler = function(_event) {
    // On cache le tuto
    document.getElementById("content2").classList.add("off");
    // On fait apparaitre le bouton de validation
    this.initializeValidateButton();
    
    if(!_event.clientX && 3==_event.touches.length){
        this.context.clearRect(0, 0, this.drawArea.width, this.drawArea.height);
    } else{
        this.isDrawing = true;
        this.context.beginPath();
        var touchPoint = this.getTouchPoints(_event);
        this.context.moveTo(touchPoint.x, touchPoint.y);
    }
    return false;
}

/**
 * Handler : déplacement du toucher
 * @param _event
 */
Drawer.prototype.touchMoveHandler = function(_event) {
    // On met à jour la zone de dessin
    if(this.isDrawing){
        this.updateDrawArea(_event);	
    }
    return false;
}

/**
 * Handler : fin du toucher
 * @param _event
 */
Drawer.prototype.touchEndHandler = function(_event) { 
    this.isDrawing = false;
    return false;
}

/**
 * Handler : bouton de validation
 * @param _event
 */
Drawer.prototype.validateHandler = function(_event) { 
    // On arrête le dessin
    this.bindTouchListeners(false);
    // On cache le bouton valider
    this.validateButton.classList.add("off");
    this.bindValidateButtonListener(false);    
    // On cache les instructions
    this.instruction.style.display = "none";
    // On affiche la solution et les explications
    this.displaySolution();
    this.explanation.classList.remove("off");
    // On réactive les swipe
    var screenContainer = document.getElementById("screen-container");
    screenContainer.dataset.preventRightSwipe = false;
    screenContainer.dataset.preventLeftSwipe = false;
    return false;
}

/**
 * Mise à jour de la zone de dessin
 * @param _event
 */
Drawer.prototype.updateDrawArea = function(_event) { 
    var touchPoint = this.getTouchPoints(_event);
    this.context.lineTo(touchPoint.x, touchPoint.y);
    this.context.moveTo(touchPoint.x, touchPoint.y);
    this.context.stroke();
    this.context.closePath();
}

/**
 * Récupère les coordonnées du toucher
 * @param _event
 */
Drawer.prototype.getTouchPoints = function(_event) { 
    var x = (_event.clientX || _event.touches[0].clientX) - this.drawArea.offsetLeft;
    var y = (_event.clientY || _event.touches[0].clientY) - this.drawArea.offsetTop;
    return({
        x: x, 
        y: y
    });
}

/**
 * Affiche la solution
 */
Drawer.prototype.displaySolution = function() { 
	this.tutorial.classList.add("off");
    this.solution.classList.remove("hide_solution");
    this.solution.classList.add("show_solution");
    let newdiv1 = document.getElementById('test-btn')
    newdiv1.setAttribute('onClick','stoppage()');
	$(".btn1").hide();
	$(".btn1_active").show();
	$(".btn2_active").show();
	$(".bottom_txt1").show();
	$(".bottom_txt2").show();
	$(".bottom_txt3").show();
}

/**
 * Cache la solution
 */
Drawer.prototype.hideSolution = function() { 
    this.solution.classList.remove("show_solution");
    this.solution.classList.add("hide_solution");
	$(".btn1_active").hide();
	$(".btn1").show();
	$(".btn2_active").hide();
	$(".bottom_txt1").hide();
	$(".bottom_txt2").hide();
	$(".bottom_txt3").hide();
}

/**
 * Remet l'objet a 0
 */
Drawer.prototype.stop = function() {    
    this.instruction.style.display = "block";
    this.instruction.classList.add("off");
    // On cache la solution et les explications
    this.hideSolution();
    this.explanation.classList.add("off");
    // On vide le canvas
    this.context.clearRect(0, 0, this.drawArea.width, this.drawArea.height);
}
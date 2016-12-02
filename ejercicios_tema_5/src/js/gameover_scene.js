var GameOver = {
    create: function () {
        console.log("Game Over");
        var button = this.game.add.button(400, 300, 
                                          'button', 
                                          this.actionOnClick, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        var goText = this.game.add.text(400, 100, "GameOver");
        var text = this.game.add.text(0, 0, "Reset Game");
        text.anchor.set(0.5);
        goText.anchor.set(0.5);
        button.addChild(text);
        
        //TODO 8 crear un boton con el texto 'Return Main Menu' que nos devuelva al menu del juego.
        var reseT = this.game.add.button(400,400,'button',this.reset,this,2,1,0);
        reseT.anchor.set(0.5);
        var texto = this.game.add.text(0,0 ,"Main Menu");
        texto.anchor.set(0.5);
        reseT.addChild(texto);
    },
    
    //TODO 7 declarar el callback del boton.
actionOnClick: function(){
    this.game.state.start('play');
},
reset: function(){
  this.game.state.start('menu');
}
};

module.exports = GameOver;
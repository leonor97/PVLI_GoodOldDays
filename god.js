
var enemy = {
  _currentDirection: 'right',
  _position: { x: 10, y: 10 },
  _score: 40,

  moveLeft: function () { console.log('Going left!'); },
  moveRight: function () { console.log('Going right!'); },
  advance: function () { console.log('Marching forward!'); },
  shoot: function () { console.log('PICHIUM!'); } // (es un láser)
};



var nave= {
  _currentDirection: 'left',
  _position: { x: 10, y: 0 },
  

  moveLeft: function () { console.log('Going left!'); },
  moveRight: function () { console.log('Going right!'); },
  advance: function () { console.log('Marching forward!'); },
  shoot:function () { console.log('DESTROY!'); }
}; 
function disparo(nave,pos){
var bala = { };
bala._pos=pos;

if(nave==='enemy'){
obj._direccion = 'abajo';
}
else{
obj._direccion = 'arriba';
};

}


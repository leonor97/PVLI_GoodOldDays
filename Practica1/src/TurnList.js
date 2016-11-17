'use strict';

function TurnList() {}

TurnList.prototype.reset = function (charactersById) {
  this._charactersById = charactersById;

  this._turnIndex = -1;
  this.turnNumber = 0;
  this.activeCharacterId = null;
  this.list = this._sortByInitiative();
};

TurnList.prototype.next = function () {
  // Haz que calcule el siguiente turno y devuelva el resultado
  // según la especificación. Recuerda que debe saltar los personajes
  // muertos.
  var n = this.turnNumber;
  var escogido = false;
  while(!escogido){
    n %= this.list.length;
    if(!this._charactersById[this.list[n]].isDead()){
     this.activeCharacterId = this.list[n];
      escogido = true;
}
n++;
  }
this.turnNumber++;
 
  var turno = {

  number : this.turnNumber,
  party : this._charactersById[this.activeCharacterId].party,
  activeCharacterId : this.activeCharacterId
};

  

  return turno;
};

TurnList.prototype._sortByInitiative = function () {
  // Utiliza la función Array.sort(). ¡No te implementes tu propia
  // función de ordenación!
  var Iarray = [];
  var Narray = [];

  for ( var name in this._charactersById){
    var esp = {};
    esp.name = name;
    esp.initiative = this._charactersById[name].initiative;
    Iarray.push(esp);
  }

  Iarray.sort(function (a , b){
    if(a.initiative > b.initiative){
      return -1;
    }
    if(a.initiative < b.initiative){
      return 1;
    }
    return 0;
  });

  for (var character in Iarray){
   Narray.push(Iarray[character].name);
  }
 
  return Narray;
};

module.exports = TurnList;

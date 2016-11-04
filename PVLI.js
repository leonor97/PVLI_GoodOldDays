



// By Carlos León, 2016
// Licensed under Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

'use strict';

//////////////////////////////////////////////////////////////////////////////

// Entity type to differentiate entities and have them attack those not
// belonging to the same kind
var EntityType = {
    GOOD: 0,
    EVIL: 1
};

// Entity constructor
// 
// Entities have a name (it doesn't have to be unique, but it helps) and a type
//
// Additionally, entities accept a list of instantiated components
function Entity(entityName, entityType, components){
    var self = this;
    this.entityName = entityName;
    this.durmiendo = false; //creamos una booleana para saber si esta durmiendo
    // Instead of assigning the parameter, we call `addComponent`, which is a
    // bit smarter than default assignment
    this.components = [];
    components.forEach(function(component) {
        self.addComponent(component);
    });
    this.type = entityType;
}

Entity.prototype.addComponent = function(component) {
    this.components.push(component);
    component.entity = this;
};

// This function delegates the tick on the components, gathering their messages
// and aggregating them into a single list of messages to be delivered by the
// message manager (the game itself in this case
Entity.prototype.tick = function() {
    var outcoming = [];
    if(this.durmiendo === false)
        outcoming.push(new Presence(this));

    this.components.forEach(function(component) {
        var messages = component.tick();
        messages.forEach(function (message) {
            outcoming.push(message);
        });
    });
    return outcoming;
};

// All received messages are forwarded to the components
Entity.prototype.receive = function(message) {
    // If the receiver is `null`, this is a broadcast message that must be
    // accepted by all entities
    if(!message.receiver || message.receiver === this) {
        this.components.forEach(function(component) {
            component.receive(message);
        });
    }
};
//////////////////////////////////////////////////////////////////////////////
// if the receiver is null, it is a broadcast message
function Message(receiver) {
    this.receiver = receiver;
}


//////////////////////////////////////////////////////////////////////////////
function Component(entity) {
    this.entity = entity;
    this.messageQueue = [];
}

Component.prototype.tick = function() {
    // We return a copy of the `messageQueue`, and we empty it
    var aux =[];
 if(this.entity.durmiendo === false){
    aux= this.messageQueue;
}
    this.messageQueue = [];
    return aux;
};
Component.prototype.receive = function(message) {
};


//////////////////////////////////////////////////////////////////////////////

function Game(entities) {
    this.entities = entities;
    this.messageQueue = [];
}

Game.prototype.mainLoop = function (ticks) {
    var i = 0;
    function line() {
        console.log("-----------------------------------------");
    }
    while(!ticks || i < ticks) {
        line();
        console.log("Tick number " + i);
        line();
        this.tick();
        i++;
    }
};

// Each tick, all entities are notified by calling their `tick` function
Game.prototype.tick = function () {
    var self = this;

 

    // All messages coming from the entities are put in the queue
    this.entities.forEach(function(entity) {
        var tickMessages = entity.tick();

        tickMessages.forEach(function(tickMessage) {
            self.messageQueue.push(tickMessage);
        });
    });

    this.deliver();
};


// All messages in the queue are delivered to all the entities
Game.prototype.deliver = function() {
    var self = this;

    this.messageQueue.forEach(function(message) {
        if(!message.receiver) {         
            self.entities.forEach(function(entity) {
                entity.receive(message);
            });
        }
        else {
            message.receiver.receive(message);
        }
    });

    this.messageQueue = [];
};

//////////////////////////////////////////////////////////////////////////////
// Components
//////////////////////////////////////////////////////////////////////////////
function Attacker(entity) {
    Component.call(this, entity);
}
Attacker.prototype = Object.create(Component.prototype);
Attacker.prototype.constructor = Attacker;

Attacker.prototype.receive = function(message) {
    if(message instanceof Presence) {
        if(message.who.type != this.entity.type) {
            this.messageQueue.push(new Attack(this.entity, message.who));
        }
    }
};

//////////////////////////////////////////////////////////////////////////////
function Defender(entity) {
    Component.call(this, entity);
}
Defender.prototype = Object.create(Component.prototype);
Defender.prototype.constructor = Defender;

Defender.prototype.receive = function(message) {
    if(message instanceof Attack) {
        console.log(this.entity.entityName + " was attacked by " + message.who.entityName);
    }
};

//////////////////////////////////////////////////////////////////////////////
function Healer(entity) {
    Component.call(this, entity);
}
Healer.prototype = Object.create(Component.prototype);
Healer.prototype.constructor = Healer;

Healer.prototype.receive = function(message) {
    if(message instanceof Presence && message.who.type === this.entity.type) {
        this.messageQueue.push(new heal(this.entity, message.who))
    }
};
//////////////////////////////////////////////////////////////////////////////
function Hp(entity) {
    Component.call(this, entity);
    this.hp = 100;
}
Hp.prototype = Object.create(Component.prototype);
Hp.prototype.constructor = Hp;

Hp.prototype.receive = function(message) {
    if(message instanceof heal) {
        this.hp += 10;
        console.log(this.entity.entityName + " was cured by " + message.who.entityName);
    }
};

//////////////////////////////////////////////////////////////////////////////
function Move(entity) {
    Component.call(this, entity);
}
Move.prototype = Object.create(Component.prototype);
Move.prototype.constructor = Move;

Move.prototype.receive = function(message) {
    if(message instanceof Presence && message.who === this.entity) {
        console.log(this.entity.entityName + " is moving " );
    }
};
//////////////////////////////////////////////////////////////////////////////
function Volume(entity) {
    Component.call(this, entity);
}
Volume.prototype = Object.create(Component.prototype);
Volume.prototype.constructor = Volume;

Volume.prototype.receive = function(message) {
    if(message instanceof Presence && message.who === this.entity) {
        console.log(this.entity.entityName + " has volume " );
    }
};
//////////////////////////////////////////////////////////////////////////////
// Messages
//////////////////////////////////////////////////////////////////////////////
function Presence(who, receiver) {
    Message.call(this, receiver);
    this.who = who;
}
Presence.prototype = Object.create(Message.prototype);
Presence.prototype.constructor = Presence;
//////////////////////////////////////////////////////////////////////////////
function Attack(who, receiver) {
    Message.call(this, receiver);
    this.who = who;
}
Attack.prototype = Object.create(Message.prototype);
Attack.prototype.constructor = Attack;
//////////////////////////////////////////////////////////////////////////////
function Sleep (receiver){
    Message.call(this, receiver);
    receiver.durmiendo = true;
}
Sleep.prototype = Object.create(Message.prototype);
Sleep.prototype.constructor = Sleep;
//////////////////////////////////////////////////////////////////////////////
function WakeUp (receiver){
    Message.call(this, receiver);
    receiver.durmiendo = false;
}
WakeUp.prototype = Object.create(Message.prototype);
WakeUp.prototype.constructor = WakeUp;
//////////////////////////////////////////////////////////////////////////////
function heal (receiver,who){
    Message.call(this, receiver);
    this.who = who;
    
}
heal.prototype = Object.create(Message.prototype);
heal.prototype.constructor = heal;
/////////////////////////////////////////////////////////////////////////////

// helper functions creating new components
var attacker = function() { return new Attacker(); };
var defender = function() { return new Defender(); };
var healer = function() { return new Healer(); };
var hper = function() { return new Hp(); };
var mover = function(){return new Move();};
var volume = function(){return new Volume();};

// entities in the game
var link = new Entity("link", EntityType.GOOD, [attacker(), defender(),]);
var ganon = new Entity("ganon", EntityType.EVIL, [attacker(), defender(),healer(), hper()]);
var octorok = new Entity("octorok", EntityType.EVIL, [defender(),attacker()]);
var armos = new Entity("armos", EntityType.EVIL, [attacker()]);
var jackson = new Entity("jackson", EntityType.GOOD, [mover()]);
var ramoon = new Entity("ramoon", EntityType.GOOD, [mover(), volume()]);
var pipos = new Entity("pipos", EntityType.GOOD, [volume()]);


// we create the game with the entities
var game = new Game([link, ganon, armos, octorok, jackson, ramoon, pipos]);

game.mainLoop(10);
/* HERENCIA

                 Entidad
                    |
                Volumen
            /              \
        fisico             no-fisico

  mover   no mover           mover   no mover

  * Suponemos que Visible es como una caja que se divide en dos : la parte fisica (volumen fisico) y una parte que no afectaria
*/

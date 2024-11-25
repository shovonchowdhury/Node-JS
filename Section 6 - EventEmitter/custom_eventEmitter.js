class EventEmitter{

    constructor(){
        this.events={};
    }

    on(eventName,eventHandler){
        if(this.events[eventName])
        {
            this.events[eventName].push(eventHandler);
        }
        else
        {
            this.events[eventName]=[eventHandler];
        }
    }


    emit(eventName,...args){
        if(this.events[eventName])
        {
            this.events[eventName].forEach(event => {
                event(...args);
            });
        }
    }


    once(eventName,eventHandler){
        
        

        this.on(eventName,eventHandler);
    }

}


const emitter=new EventEmitter();

emitter.on('abc',()=>{
    console.log('yo bro');
})
emitter.on('xy',()=>{
    console.log('yo sis');
})
emitter.once('y',()=>{
    console.log('yo dad');
})

emitter.emit('abc');
emitter.emit('xy');
emitter.emit('y');

console.log(emitter.events);
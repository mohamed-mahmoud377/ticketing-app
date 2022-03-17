import {Subjects} from "./subject";
import {Stan} from "node-nats-streaming";

interface Event{
    subject: Subjects;
    data:any;
}
export abstract class Publisher <T extends Event>{
    abstract subject :T['subject']
    private client:Stan
     constructor(client:Stan){
        this.client= client
    }

    // note that the whole function  returns a promise but void because the resolve does not return anything
    publish(data:T['data']):Promise<void>{ // this one of the best thing I have ever done in javascript
        // now you are turning the old bad callback function of nats to a promise you can actually await
        return new Promise(((resolve, reject) =>{
            this.client.publish(this.subject,JSON.stringify(data),(err)=>{
                if (err){
                    return reject(err);
                }
                console.log("Event published to subject",this.subject)
                resolve()
            })
        }))


    }

}